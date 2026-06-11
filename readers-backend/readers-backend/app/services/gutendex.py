import httpx
import asyncio
import time
from typing import Dict, List, Optional, Tuple
from app.constants.genre_map import GENRE_MAP
from app.models.schemas import Book
from app.config import settings

def map_google_book(item: dict) -> Book:
    info = item.get("volumeInfo", {})
    access = item.get("accessInfo", {})
    image_links = info.get("imageLinks", {})
    epub = access.get("epub", {})
    pdf = access.get("pdf", {})

    raw_cover = (
        image_links.get("thumbnail")
        or image_links.get("smallThumbnail")
        or ""
    )
    cover_url = raw_cover.replace("http://", "https://")
    authors = info.get("authors", [])
    author = ", ".join(authors) if authors else "Unknown Author"
    genres = info.get("categories", [])
    genre = genres[0] if genres else "Fiction"
    
    if not cover_url:
        cover_url = f"https://picsum.photos/seed/book_{item.get('id', 'book')}/200/300"

    return Book(
        id=item.get("id", ""),
        title=info.get("title", "Unknown Title"),
        author=author,
        authors=authors,
        description=info.get("description", ""),
        cover=cover_url,
        cover_url=cover_url,
        genre=[genre] if genre else [],
        genres=genres,
        language=info.get("language", ""),
        read_url=access.get("webReaderLink", "") or "",
        epub_url=epub.get("downloadLink", "") if epub.get("isAvailable") else "",
        pdf_url=pdf.get("downloadLink", "") if pdf.get("isAvailable") else "",
        preview_link=info.get("previewLink", "") or "",
        download_count=0,
    )

def map_gutendex_book(item: dict) -> Book:
    gid = item.get("id", 0) or 0
    formats = item.get("formats", {})
    raw_cover = formats.get("image/jpeg", "")
    cover_url = raw_cover.replace("http://", "https://") if raw_cover else ""
    if not cover_url:
        cover_url = f"https://picsum.photos/seed/book_{gid}/200/300"

    authors_raw = item.get("authors", [])
    authors = []
    for a in authors_raw:
        name = a.get("name", "")
        if "," in name:
            parts = name.split(",")
            authors.append(f"{parts[1].strip()} {parts[0].strip()}")
        else:
            authors.append(name)
    author = ", ".join(authors) if authors else "Unknown Author"

    genres = item.get("bookshelves", [])
    genre = genres[0] if genres else "Fiction"
    
    pages = max(100, int((gid % 400) + 120)) if gid else 150
    reading_time = max(90, int(pages * 1.5))
    rating_seed = (gid % 15) / 10.0 if gid else 0.5
    rating = round(3.5 + rating_seed, 1) if rating_seed <= 1.5 else 4.5
    price_seed = (gid % 30) if gid else 15
    price = 0.0 if price_seed < 10 else round(2.99 + (price_seed * 0.4), 2)

    subjects = item.get("subjects", [])
    description = ", ".join(subjects) if subjects else "A classic public domain book."

    read_url = formats.get("text/html", "") or formats.get("text/plain", "")
    read_url = read_url.replace("http://", "https://") if read_url else ""
    
    epub_url = formats.get("application/epub+zip", "")
    epub_url = epub_url.replace("http://", "https://") if epub_url else ""

    download_url = formats.get("text/plain; charset=utf-8") or formats.get("text/plain") or ""
    download_url = download_url.replace("http://", "https://") if download_url else ""

    return Book(
        id=f"g{gid}",
        title=item.get("title", "Unknown Title"),
        author=author,
        authors=authors,
        description=description,
        cover=cover_url,
        cover_url=cover_url,
        genre=[genre] if genre else [],
        genres=genres,
        pages=pages,
        readingTime=reading_time,
        rating=rating,
        price=price,
        language=item.get("languages", [""])[0] if item.get("languages") else "",
        read_url=read_url,
        epub_url=epub_url,
        download_url=download_url,
        pdf_url="",
        preview_link="",
        download_count=item.get("download_count", 0),
        gutendexId=gid
    )

async def fetch_books(query: str, limit: int = 20) -> list[Book]:
    if not query:
        return []
    url = "https://www.googleapis.com/books/v1/volumes"
    params = {"q": query, "maxResults": limit}
    if settings.GEMINI_API_KEY:
        params["key"] = settings.GEMINI_API_KEY
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(url, params=params)
            if response.status_code != 200:
                return []
            data = response.json()
            return [map_google_book(item) for item in data.get("items", []) if item]
    except Exception as e:
        print(f"Error fetching from Google Books: {e}")
        return []

class GutendexService:
    def __init__(self):
        self._cache: Dict[str, Tuple[any, float]] = {}
        self.ttl = 3600
        self.base_url = "https://gutendex.com/books"

    def _get_from_cache(self, key: str) -> Optional[any]:
        if key in self._cache:
            data, expiry = self._cache[key]
            if time.time() < expiry:
                return data
            else:
                del self._cache[key]
        return None

    def _set_in_cache(self, key: str, data: any):
        self._cache[key] = (data, time.time() + self.ttl)

    async def search_books(self, query: Optional[str] = None, genre: Optional[str] = None, page: int = 1) -> List[Book]:
        cache_key = f"search_{query}_{genre}_{page}"
        cached = self._get_from_cache(cache_key)
        if cached is not None:
            return cached

        books = []
        if query:
            books = await fetch_books(query, limit=20)
            
        if not books and (query or genre):
            # Fallback to Gutendex supplementary source
            search_query = query or genre
            params = {"page": page}
            if search_query:
                params["search"] = search_query
            try:
                async with httpx.AsyncClient(timeout=10) as client:
                    resp = await client.get(self.base_url, params=params)
                    if resp.status_code == 200:
                        results_json = resp.json().get("results", [])
                        books = [map_gutendex_book(item) for item in results_json]
            except Exception as e:
                print(f"Gutendex search fallback failed: {e}")

        self._set_in_cache(cache_key, books)
        return books

    async def get_trending_books(self) -> List[Book]:
        cache_key = "trending_books"
        cached = self._get_from_cache(cache_key)
        if cached is not None:
            return cached

        # Search Google Books for subjects
        books = await fetch_books("subject:fiction", limit=20)
        
        if not books:
            # Fallback to popular items in Gutendex
            try:
                async with httpx.AsyncClient(timeout=10) as client:
                    resp = await client.get(self.base_url, params={"sort": "-popular"})
                    if resp.status_code == 200:
                        results_json = resp.json().get("results", [])[:20]
                        books = [map_gutendex_book(item) for item in results_json]
            except Exception as e:
                print(f"Gutendex trending fallback failed: {e}")

        self._set_in_cache(cache_key, books)
        return books

    async def get_book_by_id(self, gutendex_id: int) -> Optional[Book]:
        cache_key = f"book_{gutendex_id}"
        cached = self._get_from_cache(cache_key)
        if cached is not None:
            return cached

        # 1. First check if it's a numeric Gutenberg book ID
        url = f"{self.base_url}/{gutendex_id}"
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                resp = await client.get(url)
                if resp.status_code == 200:
                    book = map_gutendex_book(resp.json())
                    self._set_in_cache(cache_key, book)
                    return book
        except Exception as e:
            print(f"Error resolving Gutenberg book by ID: {e}")

        # 2. Supplementary: try to look up from Google Books by ID if not numeric Gutenberg format
        try:
            url_google = f"https://www.googleapis.com/books/v1/volumes/{gutendex_id}"
            async with httpx.AsyncClient(timeout=10) as client:
                resp = await client.get(url_google)
                if resp.status_code == 200:
                    book = map_google_book(resp.json())
                    self._set_in_cache(cache_key, book)
                    return book
        except Exception as e:
            print(f"Google Books ID lookup fallback failed: {e}")

        return None

gutendex_service = GutendexService()
