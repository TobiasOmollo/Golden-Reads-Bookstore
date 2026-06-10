import httpx
import asyncio
from typing import List, Optional, Dict
from app.models.schemas import Audiobook, AudiobookChapter

def map_librivox_book(item: dict) -> Audiobook:
    librivox_id = item.get("id", "")
    authors_raw = item.get("authors", [])
    authors = [
        f"{a.get('first_name', '')} {a.get('last_name', '')}".strip()
        for a in authors_raw
    ]
    author = ", ".join(authors) if authors else "Unknown Author"
    cover_url = f"https://archive.org/services/img/{librivox_id}"
    
    sections = item.get("sections") or []
    if not isinstance(sections, list):
        sections = []
    chapters = []
    for s in sections:
        if not isinstance(s, dict):
            continue
        sec_id = str(s.get("id") or s.get("section_number") or "")
        sec_title = s.get("title") or f"Chapter {s.get('section_number')}"
        duration_str = s.get("playtime") or "0"
        
        duration = 0
        try:
            parts = list(map(int, duration_str.split(":")))
            if len(parts) == 3:
                duration = parts[0] * 3600 + parts[1] * 60 + parts[2]
            elif len(parts) == 2:
                duration = parts[0] * 60 + parts[1]
            elif len(parts) == 1:
                duration = parts[0]
        except Exception:
            pass

        chapters.append(AudiobookChapter(
            id=sec_id,
            title=sec_title,
            duration=duration or 300,
            listen_url=s.get("listen_url", "").replace("http://", "https://")
        ))

    if not chapters:
        chapters.append(AudiobookChapter(
            id="full_zip",
            title="Play full Audiobook",
            duration=3600,
            listen_url=item.get("url_zip_file", "").replace("http://", "https://")
        ))

    return Audiobook(
        id=str(librivox_id),
        title=item.get("title", "Untitled Audiobook"),
        description=item.get("description", ""),
        authors=authors,
        author=author,
        genres=[g.get("name", "") for g in item.get("genres", [])],
        language=item.get("language", ""),
        duration=item.get("totaltime", ""),
        cover_url=cover_url,
        cover=cover_url,
        listen_url=item.get("url_zip_file", "").replace("http://", "https://"),
        stream_url=item.get("url_rss", "").replace("http://", "https://"),
        librivox_url=item.get("url_librivox", "").replace("http://", "https://"),
        num_sections=str(item.get("num_sections", "0")),
        chapters=chapters
    )

async def fetch_audiobooks(query: str = "", limit: int = 20) -> list[Audiobook]:
    url = f"https://librivox.org/api/feed/audiobooks?format=json&limit={limit}"
    if query:
        url += f"&title={query}"
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.get(url)
            if response.status_code != 200:
                return []
            data = response.json()
            books = data.get("books", [])
            return [map_librivox_book(item) for item in books if item]
    except Exception as e:
        print(f"Error in fetch_audiobooks: {e}")
        return []

class LibriVoxService:
    def __init__(self):
        self.base_url = "https://librivox.org/api/feed/audiobooks/"
        self._cache: Dict[str, Audiobook] = {}

    async def search_audiobooks(self, query: str) -> List[Audiobook]:
        results = await fetch_audiobooks(query, limit=20)
        for r in results:
            self._cache[r.id] = r
        return results

    async def get_audiobook_by_id(self, book_id: str) -> Optional[Audiobook]:
        if book_id in self._cache:
            return self._cache[book_id]

        url = f"https://librivox.org/api/feed/audiobooks?id={book_id}&format=json&extended=1"
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.get(url)
                if resp.status_code == 200:
                    books_list = resp.json().get("books", [])
                    if books_list:
                        book = map_librivox_book(books_list[0])
                        self._cache[book_id] = book
                        return book
        except Exception as e:
            print(f"Error fetching LibriVox by ID: {e}")
        return None

librivox_service = LibriVoxService()
