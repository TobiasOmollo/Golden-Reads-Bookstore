import httpx
import asyncio
from typing import List, Optional

# 1. Google Books API Fetcher
async def fetch_google_books(client: httpx.AsyncClient, query: Optional[str] = None) -> List[dict]:
    q = query if query else "subject:fiction"
    url = "https://www.googleapis.com/books/v1/volumes"
    params = {"q": q, "maxResults": 20}
    try:
        resp = await client.get(url, params=params, timeout=5.0)
        if resp.status_code == 200:
            items = resp.json().get("items", [])
            books = []
            for item in items:
                volume_info = item.get("volumeInfo", {})
                access_info = item.get("accessInfo", {})
                epub_info = access_info.get("epub", {})
                
                title = volume_info.get("title", "Untitled Book")
                authors = volume_info.get("authors", [])
                author = ", ".join(authors) if authors else "Unknown Author"
                
                image_links = volume_info.get("imageLinks", {})
                cover_url = image_links.get("thumbnail") or image_links.get("smallThumbnail") or ""
                if cover_url.startswith("http://"):
                    cover_url = cover_url.replace("http://", "https://")
                
                epub_url = epub_info.get("downloadLink", "") if epub_info.get("isAvailable") else ""
                description = volume_info.get("description", "")
                genres = volume_info.get("categories", [])
                genre = genres[0] if genres else "Fiction"
                
                books.append({
                    "id": item.get("id", ""),
                    "title": title,
                    "author": author,
                    "cover_url": cover_url,
                    "epub_url": epub_url,
                    "description": description,
                    "genre": genre
                })
            return books
    except Exception as e:
        print(f"Google Books API fetch failed: {e}")
    return []

# 2. Gutendex API Fetcher
async def fetch_gutendex(client: httpx.AsyncClient, query: Optional[str] = None) -> List[dict]:
    url = "https://gutendex.com/books"
    params = {}
    if query:
        params["search"] = query
    else:
        params["sort"] = "-popular"
        
    try:
        resp = await client.get(url, params=params, timeout=5.0)
        if resp.status_code == 200:
            results = resp.json().get("results", [])
            books = []
            for item in results:
                gid = item.get("id")
                title = item.get("title", "Untitled Book")
                
                authors = item.get("authors", [])
                author = "Unknown Author"
                if authors:
                    author_name = authors[0].get("name", "Unknown Author")
                    if "," in author_name:
                        parts = author_name.split(",")
                        author = f"{parts[1].strip()} {parts[0].strip()}"
                    else:
                        author = author_name
                
                formats = item.get("formats", {})
                cover_url = formats.get("image/jpeg", "")
                if cover_url.startswith("http://"):
                    cover_url = cover_url.replace("http://", "https://")
                
                epub_url = formats.get("application/epub+zip", "")
                if epub_url.startswith("http://"):
                    epub_url = epub_url.replace("http://", "https://")
                    
                subjects = item.get("subjects", [])
                description = ", ".join(subjects) if subjects else "A classic Gutenberg public domain book."
                genre = subjects[0] if subjects else "Fiction"
                
                books.append({
                    "id": f"g{gid}",
                    "title": title,
                    "author": author,
                    "cover_url": cover_url,
                    "epub_url": epub_url,
                    "description": description,
                    "genre": genre
                })
            return books
    except Exception as e:
        print(f"Gutendex fetch failed: {e}")
        
    return []

# Concurrent Aggregator Service
class BookAggregatorService:
    async def aggregate_books(self, query: Optional[str] = None) -> List[dict]:
        async with httpx.AsyncClient() as client:
            tasks = [
                fetch_google_books(client, query),
                fetch_gutendex(client, query)
            ]
            
            # Run concurrently
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            all_books = []
            for res in results:
                if isinstance(res, list):
                    all_books.extend(res)
                    
            return all_books

book_aggregator_service = BookAggregatorService()
