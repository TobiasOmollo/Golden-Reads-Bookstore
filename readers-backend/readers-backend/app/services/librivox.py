import httpx
import asyncio
from typing import List, Optional, Dict
from app.models.schemas import AudiobookDetail, AudiobookChapter

class LibriVoxService:
    def __init__(self):
        self.base_url = "https://librivox.org/api/feed/audiobooks/"
        # Cache of resolved audiobooks to speed up immediate detailed retrieval
        self._cache: Dict[str, AudiobookDetail] = {}

    def _get_author_name(self, book_data: dict) -> str:
        authors = book_data.get("authors") or []
        if not authors or not isinstance(authors, list):
            return "Unknown Author"
        auth = authors[0]
        if not isinstance(auth, dict):
            return "Unknown Author"
        first_name = auth.get("first_name", "").strip() if auth.get("first_name") else ""
        last_name = auth.get("last_name", "").strip() if auth.get("last_name") else ""
        if first_name and last_name:
            return f"{first_name} {last_name}"
        return last_name or first_name or "Unknown Author"

    def _resolve_cover(self, book_data: dict) -> str:
        isbn = book_data.get("isbn") or ""
        isbn = isbn.strip().replace("-", "") if isinstance(isbn, str) else ""
        book_id = book_data.get("id", "audiobook")
        if isbn:
            return f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg"
        # Generous fallback using Picsum seeded with Book ID to keep it colorful and interesting
        return f"https://picsum.photos/seed/audio_{book_id}/200/300"

    async def search_audiobooks(self, query: str) -> List[AudiobookDetail]:
        params = {
            "title": f"^{query}", # Match start or general title
            "format": "json"
        }

        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(self.base_url, params=params, timeout=10.0)
                if resp.status_code != 200:
                    # Retry with simple query if exact regex start yields nothing
                    params["title"] = query
                    resp = await client.get(self.base_url, params=params, timeout=10.0)
                    if resp.status_code != 200:
                        return []

                data = resp.json()
                books_list = data.get("books", [])
                if not books_list and isinstance(data, dict) and "books" not in data:
                    # Sometime librivox returns lists inside lists
                    books_list = []

                results = []
                for item in books_list:
                    book_id = str(item.get("id"))
                    author = self._get_author_name(item)
                    cover = self._resolve_cover(item)
                    
                    # Parse sections (chapters)
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
                        
                        # convert mm:ss or hh:mm:ss to seconds
                        duration = 0
                        try:
                            parts = list(map(int, duration_str.split(":")))
                            if len(parts) == 3:
                                duration = parts[0] * 3600 + parts[1] * 60 + parts[2]
                            elif len(parts) == 2:
                                duration = parts[0] * 60 + parts[1]
                            elif len(parts) == 1:
                                duration = parts[0]
                        except ValueError:
                            pass

                        # Extract listen_url or fallback
                        listen_url = s.get("listen_url", "")
                        item_zip = item.get("url_zip_file") or ""
                        if not listen_url and item_zip:
                            listen_url = item_zip

                        chapters.append(AudiobookChapter(
                            id=sec_id,
                            title=sec_title,
                            duration=duration or 300, # default 5m fallback
                            listen_url=listen_url
                        ))

                    # If chapters list is empty, put a placeholder chapter so it's playable
                    if not chapters:
                        chapters.append(AudiobookChapter(
                            id="full_zip",
                            title="Play full Audiobook",
                            duration=3600,
                            listen_url=item.get("url_zip_file") or ""
                        ))

                    detail = AudiobookDetail(
                        id=book_id,
                        title=item.get("title", "Untitled Audiobook"),
                        author=author,
                        description=item.get("description", "No description available before download."),
                        cover=cover,
                        chapters=chapters
                    )
                    
                    # Cache details for retrieval by ID
                    self._cache[book_id] = detail
                    results.append(detail)
                
                return results
            except Exception as e:
                return []

    async def get_audiobook_by_id(self, book_id: str) -> Optional[AudiobookDetail]:
        if book_id in self._cache:
            return self._cache[book_id]

        params = {
            "id": book_id,
            "format": "json",
            "extended": "1"
        }
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(self.base_url, params=params, timeout=10.0)
                if resp.status_code == 200:
                    data = resp.json()
                    books_list = data.get("books", [])
                    if books_list:
                        item = books_list[0]
                        author = self._get_author_name(item)
                        cover = self._resolve_cover(item)
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
                            except Exception:
                                pass

                            chapters.append(AudiobookChapter(
                                id=sec_id,
                                title=sec_title,
                                duration=duration or 300,
                                listen_url=s.get("listen_url", "")
                            ))

                        if not chapters:
                            chapters.append(AudiobookChapter(
                                id="full_zip",
                                title="Play full Audiobook",
                                duration=3600,
                                listen_url=item.get("url_zip_file") or ""
                            ))

                        detail = AudiobookDetail(
                            id=book_id,
                            title=item.get("title", "Untitled Audiobook"),
                            author=author,
                            description=item.get("description", "No description available."),
                            cover=cover,
                            chapters=chapters
                        )
                        self._cache[book_id] = detail
                        return detail
            except Exception:
                pass
        return None

librivox_service = LibriVoxService()
