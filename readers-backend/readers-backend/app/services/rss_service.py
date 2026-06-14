import asyncio, hashlib, re, time
import socket
socket.setdefaulttimeout(5.0)
import feedparser
import httpx
from app.constants.rss_sources import RSS_SOURCES
from app.models.schemas import Article

# ── cache: avoid re-fetching same feed within 10 minutes ─────────────────────
_cache: dict[str, tuple[list[Article], float]] = {}
CACHE_TTL = 600  # seconds

def _strip_html(text: str) -> str:
    return re.sub(r'<[^>]+>', '', text or '').strip()

def _extract_image(entry) -> str:
    """Try multiple feed fields to find a usable image URL."""
    # Check media_thumbnail
    media_thumbnail = getattr(entry, 'media_thumbnail', None)
    if media_thumbnail:
        if isinstance(media_thumbnail, list) and len(media_thumbnail) > 0:
            url = media_thumbnail[0].get('url') or media_thumbnail[0].get('href')
            if url:
                return url
        elif isinstance(media_thumbnail, dict):
            url = media_thumbnail.get('url') or media_thumbnail.get('href')
            if url:
                return url
        elif isinstance(media_thumbnail, str):
            return media_thumbnail

    # Check media_content
    media_content = getattr(entry, 'media_content', None)
    if media_content:
        if isinstance(media_content, list) and len(media_content) > 0:
            url = media_content[0].get('url') or media_content[0].get('href')
            if url:
                return url
        elif isinstance(media_content, dict):
            url = media_content.get('url') or media_content.get('href')
            if url:
                return url

    # Check enclosures
    enclosures = getattr(entry, 'enclosures', [])
    for enc in enclosures:
        if enc.get('type', '').startswith('image') or enc.get('href', '').endswith(('.jpg', '.jpeg', '.png', '.webp', '.gif')):
            return enc.get('href', '')

    # Check content values
    content = getattr(entry, 'content', [])
    for c in content:
        match = re.search(r'<img[^>]+src=["\'](https?://[^"\']+)["\'\]', c.get('value',''))
        if match:
            return match.group(1)

    # Check summary/description values for standard img tags
    for attr in ['summary', 'description']:
        val = entry.get(attr, '')
        if val:
            match = re.search(r'<img[^>]+src=["\'](https?://[^"\']+)["\'\]', val)
            if match:
                return match.group(1)

    return ''

def _make_id(url: str) -> str:
    return hashlib.sha256(url.encode()).hexdigest()[:12]

def _parse_feed_content(content: bytes, source: dict) -> list[Article]:
    """Parse raw feed content with feedparser."""
    try:
        feed = feedparser.parse(content)
    except Exception as exc:
        print(f"[rss_service] parser error for {source['name']}: {exc}")
        return []
    articles = []
    for entry in feed.entries[:30]:   # fetch up to 30 as required
        url = entry.get('link', '')
        if not url:
            continue
        published = ''
        if hasattr(entry, 'published_parsed') and entry.published_parsed:
            import calendar
            try:
                published = time.strftime('%Y-%m-%dT%H:%M:%SZ',
                                          time.gmtime(calendar.timegm(entry.published_parsed)))
            except Exception:
                pass
        summary_raw = entry.get('summary', '') or entry.get('description', '')
        summary = _strip_html(summary_raw)[:280]
        articles.append(Article(
            id=_make_id(url),
            title=_strip_html(entry.get('title', '')),
            publication=source['name'],
            country=source['country'],
            category=source['category'],
            heroImage=_extract_image(entry),
            summary=summary,
            sourceUrl=url,
            publishedAt=published,
        ))
    return articles

async def fetch_feed(source: dict) -> list[Article]:
    """Async wrapper with per-source in-memory cache and httpx fetch with SSL bypass + User-Agent."""
    key = source['url']
    if key in _cache:
        cached_articles, ts = _cache[key]
        if time.time() - ts < CACHE_TTL:
            return cached_articles
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        # bypass SSL verification and set timeout
        async with httpx.AsyncClient(verify=False, timeout=10.0) as client:
            resp = await client.get(source['url'], headers=headers)
            resp.raise_for_status()
            content = resp.content
            
        articles = await asyncio.to_thread(_parse_feed_content, content, source)
        _cache[key] = (articles, time.time())
        return articles
    except Exception as exc:
        print(f"[rss_service] WARN: failed to fetch {source['name']}: {exc}")
        return []

async def fetch_feeds(
    countries: list[str] | None = None,
    categories: list[str] | None = None,
    sources: list[str] | None = None,
    limit: int = 60,
) -> list[Article]:
    """
    Fetch and merge feeds. Filters:
      countries  — ISO codes e.g. ["KE","UG"] — None = all
      categories — e.g. ["business","sports"] — None = all
      sources    — explicit source name substrings — None = all
      limit      — max articles to return after merge+sort
    """
    from app.services.db import execute_query

    db_articles = []
    try:
        rows = execute_query("SELECT * FROM magazines")
        for r in rows:
            if countries and r["country"] not in countries:
                continue
            if categories and r["category"] not in categories:
                continue
            if sources and not any(q.lower() in r["publication"].lower() for q in sources):
                continue
            db_articles.append(Article(
                id=r["id"],
                title=r["title"],
                publication=r["publication"],
                country=r["country"] or "KE",
                category=r["category"] or "general",
                heroImage=r["hero_image"] or "",
                summary=r["summary"] or "",
                sourceUrl=r["source_url"] or "",
                publishedAt=r["published_at"] or ""
            ))
    except Exception as e:
        print(f"[rss_service] Error fetching database magazines: {e}")

    filtered = RSS_SOURCES
    if countries:
        filtered = [s for s in filtered if s['country'] in countries]
    if categories:
        filtered = [
            s for s in filtered
            if (
                s['category'] in categories
                if not isinstance(s['category'], list)
                else any(c in categories for c in s['category'])
            )
        ]
    if sources:
        filtered = [s for s in filtered
                    if any(q.lower() in s['name'].lower() for q in sources)]

    results = await asyncio.gather(*[fetch_feed(s) for s in filtered])
    merged: list[Article] = []
    seen_urls: set[str] = set()
    for batch in results:
        for a in batch:
            if a.sourceUrl not in seen_urls:
                seen_urls.add(a.sourceUrl)
                merged.append(a)

    # sort newest first (empty publishedAt goes to end)
    merged.sort(key=lambda a: a.publishedAt or '0000', reverse=True)
    return (db_articles + merged)[:limit]

