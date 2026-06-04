import httpx
import asyncio
import time
from typing import Dict, List, Optional, Tuple
from app.constants.genre_map import GENRE_MAP
from app.models.schemas import Book

class GutendexService:
    def __init__(self):
        # Cache for search & trending queries: { cache_key: (data, expiry_timestamp) }
        self._cache: Dict[str, Tuple[any, float]] = {}
        # Cache for cover lookups: { gutenberg_id: cover_url }
        self._cover_cache: Dict[int, str] = {}
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
        mapped = set()
        for subject in subjects:
            for genre, keywords in GENRE_MAP.items():
                for keyword in keywords:
                    if keyword.lower() in subject.lower():
                        mapped.add(genre)
        # Default fallback
        if not mapped:
            mapped.add("Fiction")
        return list(mapped)

    async def _resolve_cover_url(self, client: httpx.AsyncClient, gutendex_id: int, title: str, author: str) -> str:
        if gutendex_id in self._cover_cache:
            return self._cover_cache[gutendex_id]

        try:
            # 1. Search Open Library by Gutenberg ID
            ol_search_url = f"https://openlibrary.org/search.json?q=id:{gutendex_id}"
            resp = await client.get(ol_search_url, timeout=3.0)
            cover_url = None
            if resp.status_code == 200:
                results = resp.json()
                docs = results.get("docs", [])
                if docs:
                    doc = docs[0]
                    # Check for cover_i
                    cover_i = doc.get("cover_i")
                    if cover_i:
                        cover_url = f"https://covers.openlibrary.org/b/id/{cover_i}-L.jpg"
                    else:
                        # Check cover_edition_key (OLID)
                        olid = doc.get("cover_edition_key")
                        if olid:
                            cover_url = f"https://covers.openlibrary.org/b/olid/{olid}-L.jpg"
                        else:
                            # Check ISBN
                            isbns = doc.get("isbn", [])
                            if isbns:
                                cover_url = f"https://covers.openlibrary.org/b/isbn/{isbns[0]}-L.jpg"

            # 2. Fallback to searching by Title + Author if Gutenberg ID lookup yielded nothing
            if not cover_url:
                author_query = author.split(",")[0] if "," in author else author
                search_query = f"{title} {author_query}".strip()
                ol_text_url = f"https://openlibrary.org/search.json?q={search_query}&limit=1"
                resp = await client.get(ol_text_url, timeout=3.0)
                if resp.status_code == 200:
                    results = resp.json()
                    docs = results.get("docs", [])
                    if docs:
                        doc = docs[0]
                        cover_i = doc.get("cover_i")
                        if cover_i:
                            cover_url = f"https://covers.openlibrary.org/b/id/{cover_i}-L.jpg"
                        else:
                            olid = doc.get("cover_edition_key")
                            if olid:
                                cover_url = f"https://covers.openlibrary.org/b/olid/{olid}-L.jpg"
                            else:
                                isbns = doc.get("isbn", [])
                                if isbns:
                                    cover_url = f"https://covers.openlibrary.org/b/isbn/{isbns[0]}-L.jpg"

            if cover_url:
                self._cover_cache[gutendex_id] = cover_url
                return cover_url

        except Exception:
            pass  # Suppress and hit fallback

        # 3. Last fallback: Picsum with seeded Gutenberg ID
        fallback_url = f"https://picsum.photos/seed/{gutendex_id}/200/300"
        self._cover_cache[gutendex_id] = fallback_url
        return fallback_url

    def _convert_to_book(self, item: dict, cover_url: str) -> Book:
        authors = item.get("authors", [])
        author_name = authors[0].get("name", "Unknown Author") if authors else "Unknown Author"
        
        # Reformating 'LastName, FirstName' to 'FirstName LastName' for aesthetics
        if "," in author_name:
            parts = author_name.split(",")
            author_name = f"{parts[1].strip()} {parts[0].strip()}"

        gid = item.get("id")
        formats_dict = item.get("formats", {})
        epub_url = formats_dict.get("application/epub+zip") or ""
        html_url = formats_dict.get("text/html") or ""
        text_url = formats_dict.get("text/plain; charset=us-ascii") or formats_dict.get("text/plain") or ""

        # Aggregate available readable formats
        formats = []
        if epub_url:
            formats.append("epub")
        if html_url:
            formats.append("html")
        if text_url:
            formats.append("text")

        subjects = item.get("subjects", [])
        genres = self._map_genres(subjects)
        download_count = item.get("download_count", 0)

        # Estimate pages based on Gutenberg download counts and arbitrary text length
        pages = max(100, int((gid % 400) + 120))
        reading_time = max(90, int(pages * 1.5))

        # Generate a semi-realistic rating and price based on Gutenberg ID
        rating_seed = (gid % 15) / 10.0
        rating = round(3.5 + rating_seed, 1) if rating_seed <= 1.5 else 4.5
        price_seed = (gid % 30)
        price = 0.0 if price_seed < 10 else round(2.99 + (price_seed * 0.4), 2)

        description = ", ".join(subjects) if subjects else f"A classic book of the genre {', '.join(genres)}."

        return Book(
            id=str(gid),
            title=item.get("title", "Untitled Book"),
            author=author_name,
            cover=cover_url,
            rating=rating,
            price=price,
            genre=genres,
            description=description,
            pages=pages,
            readingTime=reading_time,
            formats=formats,
            gutendexId=gid
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
                
                # Resolve cover art simultaneously for performance
                books = []
                tasks = []
                for item in results_json:
                    author_list = item.get("authors", [])
                    author_name = author_list[0].get("name", "") if author_list else ""
                    tasks.append(self._resolve_cover_url(client, item.get("id"), item.get("title", ""), author_name))
                
                covers = await asyncio.gather(*tasks)
                for item, cover_url in zip(results_json, covers):
                    books.append(self._convert_to_book(item, cover_url))

                self._set_in_cache(cache_key, books)
                return books
            except Exception as e:
                # Fallback to an empty list on error
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

                books = []
                tasks = []
                for item in results_json:
                    author_list = item.get("authors", [])
                    author_name = author_list[0].get("name", "") if author_list else ""
                    tasks.append(self._resolve_cover_url(client, item.get("id"), item.get("title", ""), author_name))
                
                covers = await asyncio.gather(*tasks)
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
                author_list = item.get("authors", [])
                author_name = author_list[0].get("name", "") if author_list else ""
                cover_url = await self._resolve_cover_url(client, gutendex_id, item.get("title", ""), author_name)
                book = self._convert_to_book(item, cover_url)
                self._set_in_cache(cache_key, book)
                return book
            except Exception:
                return None

gutendex_service = GutendexService()
