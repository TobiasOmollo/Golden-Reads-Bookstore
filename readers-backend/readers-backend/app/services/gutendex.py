import httpx
import asyncio
import time
from typing import Dict, List, Optional, Tuple
from app.constants.genre_map import GENRE_MAP
from app.models.schemas import Book

def _cover(book_data: dict) -> str:
    gid = book_data.get('id', 0)

    # TIER 1: Gutendex sometimes provides subjects with OLID hints
    # Look for an Open Library link in book_links or formats
    for fmt_key in book_data.get('formats', {}):
        if 'openlibrary' in fmt_key:
            olid = fmt_key.split('/')[-1].split('.')[0]
            if olid:
                return f'https://covers.openlibrary.org/b/olid/{olid}-L.jpg?default=false'

    # TIER 2: Try Open Library's /works endpoint via Gutendex ID
    # Gutendex IDs map to Open Library Work IDs with OL prefix + W suffix
    # e.g. Gutendex ID 1342 -> try OL1342W
    if gid:
        return f'https://covers.openlibrary.org/b/olid/OL{gid}W-L.jpg?default=false'

    # TIER 3: picsum fallback (always works, seeded = consistent per book)
    return f'https://picsum.photos/seed/book{gid}/200/300'

async def _get_google_books_cover(client: httpx.AsyncClient, title: str, author: str) -> Optional[str]:
    try:
        q = f"intitle:{title}"
        if author and author != "Unknown Author":
            q += f" inauthor:{author}"
        
        resp = await client.get(
            "https://www.googleapis.com/books/v1/volumes",
            params={"q": q, "maxResults": 1},
            timeout=3.0
        )
        if resp.status_code == 200:
            data = resp.json()
            items = data.get("items", [])
            if items:
                volume_info = items[0].get("volumeInfo", {})
                image_links = volume_info.get("imageLinks", {})
                cover_url = image_links.get("thumbnail") or image_links.get("smallThumbnail")
                if cover_url:
                    if cover_url.startswith("http://"):
                        cover_url = cover_url.replace("http://", "https://")
                    return cover_url
    except Exception as e:
        print(f"Error fetching Google Books cover: {e}")
    return None


async def resolve_cover(isbn: str, gutenberg_id: int) -> str:
    isbn_clean = (isbn or "").strip().replace("-", "")
    if isbn_clean:
        # 1. Google Books API (primary)
        google_url = "https://www.googleapis.com/books/v1/volumes"
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(google_url, params={"q": f"isbn:{isbn_clean}", "maxResults": 1}, timeout=10.0)
                if resp.status_code == 200:
                    data = resp.json()
                    items = data.get("items", [])
                    if items:
                        volume_info = items[0].get("volumeInfo", {})
                        image_links = volume_info.get("imageLinks", {})
                        cover_url = image_links.get("thumbnail") or image_links.get("smallThumbnail")
                        if cover_url:
                            if cover_url.startswith("http://"):
                                cover_url = cover_url.replace("http://", "https://")
                            return cover_url
        except Exception as e:
            print(f"Error querying Google Books API for ISBN {isbn_clean}: {e}")

        # 2. Open Library (secondary fallback)
        return f"https://covers.openlibrary.org/b/isbn/{isbn_clean}-L.jpg"

    # 3. Internet Archive (final fallback)
    return f"https://archive.org/services/img/{gutenberg_id}"


class GutendexService:
    def __init__(self):
        # Cache for search & trending queries: { cache_key: (data, expiry_timestamp) }
        self._cache: Dict[str, Tuple[any, float]] = {}
        self.ttl = 3600  # 1 hour in seconds
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

    def _map_genres(self, subjects: List[str]) -> List[str]:
        if not subjects or not isinstance(subjects, list):
            return ["Fiction"]
        mapped = set()
        for subject in subjects:
            if not subject or not isinstance(subject, str):
                continue
            for genre, keywords in GENRE_MAP.items():
                for keyword in keywords:
                    if keyword.lower() in subject.lower():
                        mapped.add(genre)
        # Default fallback
        if not mapped:
            mapped.add("Fiction")
        return list(mapped)

    async def _resolve_cover_url(self, client: httpx.AsyncClient, item: dict) -> str:
        isbn = item.get("isbn") or ""
        isbn = isbn.strip() if isinstance(isbn, str) else ""
        gutenberg_id = item.get("id", 0) or 0
        
        # If no explicit ISBN is in the Gutendex item, attempt Google Books title/author enrichment
        if not isbn:
            title = item.get("title") or ""
            authors = item.get("authors") or []
            author = ""
            if authors and isinstance(authors, list) and isinstance(authors[0], dict):
                author = authors[0].get("name") or ""
            if "," in author:
                parts = author.split(",")
                author = f"{parts[1].strip()} {parts[0].strip()}"
            if title:
                google_cover = await _get_google_books_cover(client, title, author)
                if google_cover:
                    return google_cover
                    
        return await resolve_cover(isbn, gutenberg_id)


    def _convert_to_book(self, item: dict, cover_url: str) -> Book:
        authors = item.get("authors") or []
        author_name = "Unknown Author"
        if authors and isinstance(authors, list) and isinstance(authors[0], dict):
            name = authors[0].get("name") or "Unknown Author"
            
            # Reformating 'LastName, FirstName' to 'FirstName LastName' for aesthetics
            if "," in name:
                parts = name.split(",")
                author_name = f"{parts[1].strip()} {parts[0].strip()}"
            else:
                author_name = name

        gid = item.get("id") or 0
        formats_dict = item.get("formats") or {}
        epub_url = formats_dict.get("application/epub+zip") or "" if isinstance(formats_dict, dict) else ""
        html_url = formats_dict.get("text/html") or "" if isinstance(formats_dict, dict) else ""
        text_url = ""
        if isinstance(formats_dict, dict):
            text_url = formats_dict.get("text/plain; charset=us-ascii") or formats_dict.get("text/plain") or ""

        # Aggregate available readable formats
        formats = []
        if epub_url:
            formats.append("epub")
        if html_url:
            formats.append("html")
        if text_url:
            formats.append("text")

        subjects = item.get("subjects") or []
        genres = self._map_genres(subjects)

        # Estimate pages based on Gutenberg download counts and arbitrary text length
        pages = max(100, int((gid % 400) + 120)) if gid else 150
        reading_time = max(90, int(pages * 1.5))

        # Generate a semi-realistic rating and price based on Gutenberg ID
        rating_seed = (gid % 15) / 10.0 if gid else 0.5
        rating = round(3.5 + rating_seed, 1) if rating_seed <= 1.5 else 4.5
        price_seed = (gid % 30) if gid else 15
        price = 0.0 if price_seed < 10 else round(2.99 + (price_seed * 0.4), 2)

        description = ", ".join(subjects) if subjects and isinstance(subjects, list) else f"A classic book of the genre {', '.join(genres)}."

        # Extract read, epub and download URLs from Gutenberg formats dict
        read_url_extracted = ""
        epub_url_extracted = ""
        download_url_extracted = ""
        if isinstance(formats_dict, dict):
            read_url_extracted = formats_dict.get("text/html") or formats_dict.get("text/plain; charset=us-ascii") or formats_dict.get("text/plain") or ""
            epub_url_extracted = formats_dict.get("application/epub+zip") or ""
            download_url_extracted = formats_dict.get("text/plain; charset=utf-8") or formats_dict.get("text/plain") or ""

        return Book(
            id=f"g{gid}",
            title=item.get("title") or "Untitled Book",
            author=author_name,
            cover=cover_url,
            rating=rating,
            price=price,
            genre=genres,
            description=description,
            pages=pages,
            readingTime=reading_time,
            formats=formats,
            gutendexId=gid,
            read_url=read_url_extracted,
            epub_url=epub_url_extracted,
            download_url=download_url_extracted
        )

    async def search_books(self, query: Optional[str] = None, genre: Optional[str] = None, page: int = 1) -> List[Book]:
        cache_key = f"search_{query}_{genre}_{page}"
        cached = self._get_from_cache(cache_key)
        if cached is not None:
            return cached

        params = {"page": page}
        if query:
            params["search"] = query
        if genre:
            # Query gutendex for subjects containing keywords from GENRE_MAP
            matching_keywords = GENRE_MAP.get(genre, [genre])
            # Use topic search
            params["topic"] = matching_keywords[0]

        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(self.base_url, params=params, timeout=10.0)
                if resp.status_code != 200:
                    return []
                results_json = resp.json().get("results", [])
                
                async def resolve_item_cover(item):
                    return await self._resolve_cover_url(client, item)
                
                covers = await asyncio.gather(*(resolve_item_cover(item) for item in results_json))
                
                books = []
                for item, cover_url in zip(results_json, covers):
                    books.append(self._convert_to_book(item, cover_url))


                self._set_in_cache(cache_key, books)
                return books
            except Exception:
                return []

    async def get_trending_books(self) -> List[Book]:
        cache_key = "trending_books"
        cached = self._get_from_cache(cache_key)
        if cached is not None:
            return cached

        # Gutendex default sorting list is already sorted by download counts (popularity)
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(self.base_url, params={"sort": "-popular"}, timeout=10.0)
                if resp.status_code != 200:
                    return []
                results_json = resp.json().get("results", [])[:20]

                async def resolve_item_cover(item):
                    return await self._resolve_cover_url(client, item)
                
                covers = await asyncio.gather(*(resolve_item_cover(item) for item in results_json))
                
                books = []
                for item, cover_url in zip(results_json, covers):
                    books.append(self._convert_to_book(item, cover_url))


                self._set_in_cache(cache_key, books)
                return books
            except Exception:
                return []

    async def get_book_by_id(self, gutendex_id: int) -> Optional[Book]:
        cache_key = f"book_{gutendex_id}"
        cached = self._get_from_cache(cache_key)
        if cached is not None:
            return cached

        async with httpx.AsyncClient() as client:
            try:
                url = f"{self.base_url}/{gutendex_id}"
                resp = await client.get(url, timeout=10.0)
                if resp.status_code != 200:
                    return None
                item = resp.json()
                cover_url = await self._resolve_cover_url(client, item)
                book = self._convert_to_book(item, cover_url)

                self._set_in_cache(cache_key, book)
                return book
            except Exception:
                return None

gutendex_service = GutendexService()
