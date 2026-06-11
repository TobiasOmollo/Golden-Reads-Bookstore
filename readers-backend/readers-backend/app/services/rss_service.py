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
    for attr in ['media_content', 'media_thumbnail']:
        val = getattr(entry, attr, None)
        if val and isinstance(val, list) and val[0].get('url'):
            return val[0]['url']
    enclosures = getattr(entry, 'enclosures', [])
    for enc in enclosures:
        if enc.get('type', '').startswith('image'):
            return enc.get('href', '')
    content = getattr(entry, 'content', [])
    for c in content:
        match = re.search(r'<img[^>]+src=["\'](https?://[^"\']+)["\'\]', c.get('value',''))
        if match:
            return match.group(1)
    return ''

def _make_id(url: str) -> str:
    return hashlib.sha256(url.encode()).hexdigest()[:12]

def _parse_feed(source: dict) -> list[Article]:
    """Synchronous feedparser call — must be run in a thread."""
    try:
        feed = feedparser.parse(source['url'])
    except Exception:
        return []
    articles = []
    for entry in feed.entries[:20]:   # max 20 per feed
        url = entry.get('link', '')
        if not url:
            continue
        published = ''
        if hasattr(entry, 'published_parsed') and entry.published_parsed:
            import calendar
            published = time.strftime('%Y-%m-%dT%H:%M:%SZ',
                                      time.gmtime(calendar.timegm(entry.published_parsed)))
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
    """Async wrapper with per-source in-memory cache."""
    key = source['url']
    if key in _cache:
        cached_articles, ts = _cache[key]
        if time.time() - ts < CACHE_TTL:
            return cached_articles
    try:
        articles = await asyncio.to_thread(_parse_feed, source)
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
        filtered = [s for s in filtered if s['category'] in categories]
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

