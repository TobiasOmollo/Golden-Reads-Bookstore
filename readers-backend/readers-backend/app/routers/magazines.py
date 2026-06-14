from fastapi import APIRouter, Query, HTTPException
import httpx
from app.services.rss_service import fetch_feeds
from app.models.schemas import Article

router = APIRouter(prefix="/magazines", tags=["magazines"])

@router.get("/feeds", response_model=list[Article])
async def get_feeds(
    countries: str = Query(None, description="Comma-separated ISO codes: KE,UG,TZ,RW,ET,EA,PAN"),
    categories: str = Query(None, description="Comma-separated categories: general,business,sports,..."),
    limit: int = Query(60, ge=1, le=200),
):
    country_list  = countries.split(',')  if countries  else None
    category_list = categories.split(',') if categories else None
    return await fetch_feeds(
        countries=country_list,
        categories=category_list,
        limit=limit,
    )

@router.get("/bulletin", response_model=list[Article])
async def get_bulletin(limit: int = Query(30, ge=1, le=100)):
    """Breaking news bulletin — Kenya + Regional, general category only, newest first."""
    return await fetch_feeds(countries=["KE","EA"], categories=["general"], limit=limit)

@router.get("/eastafrica", response_model=list[Article])
async def get_east_africa(limit: int = Query(60, ge=1, le=200)):
    """All East African countries, all categories."""
    return await fetch_feeds(countries=["KE","UG","TZ","RW","ET","EA"], limit=limit)

@router.get("/business", response_model=list[Article])
async def get_business(limit: int = Query(30, ge=1, le=100)):
    """Business & finance from across East Africa."""
    return await fetch_feeds(categories=["business"], limit=limit)

@router.get("/lifestyle", response_model=list[Article])
async def get_lifestyle(limit: int = Query(20, ge=1, le=60)):
    """Lifestyle and magazine content."""
    return await fetch_feeds(categories=["lifestyle"], limit=limit)

@router.get("/technology", response_model=list[Article])
async def get_technology(limit: int = Query(20, ge=1, le=60)):
    """Tech + science, includes international magazine feeds."""
    return await fetch_feeds(categories=["technology","science"], limit=limit)

@router.get("/archive", response_model=list[Article])
async def search_archive(q: str = Query(..., min_length=2, description="Query to search inside Internet Archive Texts")):
    # Query archive.org for digitised magazines/texts
    search_url = "https://archive.org/advancedsearch.php"
    # Filter mediatype=texts and format as JSON
    params = {
        "q": f"{q} AND mediatype:texts",
        "fl[]": ["identifier", "title", "description", "subject", "date"],
        "rows": 15,
        "output": "json"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(search_url, params=params, timeout=10.0)
            if resp.status_code != 200:
                raise HTTPException(status_code=502, detail="Failed to connect to the Internet Archive search service.")
            
            data = resp.json()
            docs = data.get("response", {}).get("docs", [])
            
            articles = []
            for doc in docs:
                identifier = doc.get("identifier")
                if not identifier:
                    continue
                
                title = doc.get("title", "Untitled Archive Document")
                description = doc.get("description", "")
                if isinstance(description, list):
                    description = " ".join(description)
                if len(description) > 250:
                    description = description[:247] + "..."
 
                # Extract publish date
                published_at = doc.get("date", "Archived Periodical")
                if isinstance(published_at, list) and len(published_at) > 0:
                    published_at = published_at[0]
                if published_at and len(published_at) > 10:
                    published_at = published_at[:10]
 
                # Internet Archive cover graphic service and reader embeds
                cover_image = f"https://archive.org/services/img/{identifier}"
                embed_reader_url = f"https://archive.org/embed/{identifier}"
 
                articles.append(Article(
                    id=identifier,
                    title=title,
                    publication="Internet Archive",
                    country="PAN",
                    category="general",
                    heroImage=cover_image,
                    summary=description or "Historical texts and digitised magazines preserved in the archive. Click to read embed.",
                    sourceUrl=embed_reader_url,
                    publishedAt=published_at or "Archived"
                ))
            
            return articles
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(status_code=500, detail=f"Internet Archive lookup failed: {str(e)}")

@router.get("/local-briefing", response_model=list[Article])
async def get_local_briefing(limit: int = Query(30, ge=1, le=100)):
    return await fetch_feeds(categories=["local-briefing"], limit=limit)

@router.get("/flossy-gossip", response_model=list[Article])
async def get_flossy_gossip(limit: int = Query(30, ge=1, le=100)):
    return await fetch_feeds(categories=["flossy-gossip"], limit=limit)

@router.get("/africa-today", response_model=list[Article])
async def get_africa_today(limit: int = Query(30, ge=1, le=100)):
    return await fetch_feeds(categories=["africa-today"], limit=limit)

@router.get("/global-feed", response_model=list[Article])
async def get_global_feed(limit: int = Query(30, ge=1, le=100)):
    return await fetch_feeds(categories=["global-feed"], limit=limit)

@router.get("/trends", response_model=list[Article])
async def get_trends(limit: int = Query(30, ge=1, le=100)):
    raw_articles = await fetch_feeds(categories=["flossy-gossip"], limit=100)
    trending_keywords = [
        "gossip", "scandal", "drama", "romance", "wedding", "relationship", "love",
        "celeb", "celebrity", "celebrities", "star", "socialite", "music", "artist",
        "singer", "trending", "trends", "rumor", "rumour", "vibe"
    ]
    filtered = []
    for a in raw_articles:
        text = f"{a.title} {a.summary}".lower()
        if any(kw in text for kw in trending_keywords):
            filtered.append(a)
    filtered.sort(key=lambda a: a.publishedAt or "0000", reverse=True)
    return filtered[:limit]

