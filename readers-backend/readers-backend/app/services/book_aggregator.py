import httpx
import asyncio
from typing import List, Dict, Optional

# Fidelity Scoring Function:
# Ranks data completeness (non-placeholder cover + valid reading source/epub)
def get_fidelity_score(book: dict) -> int:
    score = 0
    cover = book.get("cover_url", "")
    epub = book.get("epub_url", "")
    desc = book.get("description", "")
    author = book.get("author", "")

    # Cover fidelity
    if cover and cover.startswith("http") and "picsum" not in cover:
        score += 3
    elif cover and cover.startswith("http"):
        score += 1

    # EPUB availability
    if epub and epub.startswith("http"):
        score += 3

    # Description/Author fidelity
    if desc and len(desc) > 20:
        score += 1
    if author and author != "Unknown Author":
        score += 1

    return score

# Normalize title to comparison key
def get_clean_title(title: str) -> str:
    return "".join(e for e in title.lower() if e.isalnum())

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
                
                # Title
                title = volume_info.get("title", "Untitled Book")
                
                # Author
                authors = volume_info.get("authors", [])
                author = ", ".join(authors) if authors else "Unknown Author"
                
                # Cover URL
                image_links = volume_info.get("imageLinks", {})
                cover_url = image_links.get("thumbnail") or image_links.get("smallThumbnail") or ""
                if cover_url.startswith("http://"):
                    cover_url = cover_url.replace("http://", "https://")
                
                # EPUB URL
                epub_url = item.get("accessInfo", {}).get("epub", {}).get("downloadLink") or ""
                if not epub_url:
                    epub_url = item.get("accessInfo", {}).get("epub", {}).get("acsTokenLink") or ""
                
                # Description
                description = volume_info.get("description", "")
                
                # Genre
                genres = volume_info.get("categories", [])
                genre = genres[0] if genres else "Fiction"
                
                books.append({
                    "id": f"google_{item.get('id', '')}",
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

# 2. Open Library API Fetcher
async def fetch_open_library(client: httpx.AsyncClient, query: Optional[str] = None) -> List[dict]:
    q = query if query else "classic"
    url = "https://openlibrary.org/search.json"
    params = {"q": q, "limit": 20}
    try:
        resp = await client.get(url, params=params, timeout=5.0)
        if resp.status_code == 200:
            docs = resp.json().get("docs", [])
            books = []
            for doc in docs:
                title = doc.get("title", "Untitled Book")
                
                # Author
                authors = doc.get("author_name", [])
                author = ", ".join(authors) if authors else "Unknown Author"
                
                # Cover URL
                cover_i = doc.get("cover_i")
                cover_url = f"https://covers.openlibrary.org/b/id/{cover_i}-L.jpg" if cover_i else ""
                
                # EPUB URL
                ia_list = doc.get("ia", [])
                ia_id = ia_list[0] if ia_list else None
                epub_url = f"https://archive.org/download/{ia_id}/{ia_id}.epub" if ia_id else ""
                
                # Description
                subjects = doc.get("subject", [])
                description = f"Subjects: {', '.join(subjects[:5])}" if subjects else "An Open Library classic."
                
                # Genre
                genre = subjects[0] if subjects else "Fiction"
                
                # Work ID
                work_id = doc.get("key", "").split("/")[-1]
                
                books.append({
                    "id": f"ol_{work_id}",
                    "title": title,
                    "author": author,
                    "cover_url": cover_url,
                    "epub_url": epub_url,
                    "description": description,
                    "genre": genre
                })
            return books
    except Exception as e:
        print(f"Open Library API fetch failed: {e}")
    return []

# 3. Internet Archive API Fetcher
async def fetch_internet_archive(client: httpx.AsyncClient, query: Optional[str] = None) -> List[dict]:
    q = f"{query} AND mediatype:texts" if query else "mediatype:texts AND subject:fiction"
    
    # Try advancedsearch.onrender.com first, fallback to archive.org
    endpoints = ["https://advancedsearch.onrender.com", "https://archive.org/advancedsearch.php"]
    
    params = {
        "q": q,
        "fl[]": ["identifier", "title", "description", "subject", "creator"],
        "rows": 20,
        "output": "json"
    }
    
    for url in endpoints:
        try:
            resp = await client.get(url, params=params, timeout=5.0)
            if resp.status_code == 200:
                docs = resp.json().get("response", {}).get("docs", [])
                books = []
                for doc in docs:
                    identifier = doc.get("identifier")
                    if not identifier:
                        continue
                    
                    title = doc.get("title", "Untitled Book")
                    
                    # Author
                    creator = doc.get("creator", "Unknown Author")
                    author = ", ".join(creator) if isinstance(creator, list) else str(creator)
                    
                    # Cover URL
                    cover_url = f"https://archive.org/services/img/{identifier}"
                    
                    # EPUB URL
                    epub_url = f"https://archive.org/download/{identifier}/{identifier}.epub"
                    
                    # Description
                    desc = doc.get("description", "")
                    description = " ".join(desc) if isinstance(desc, list) else str(desc)
                    if not description:
                        description = "Digitized text preserved in the Internet Archive."
                    
                    # Genre
                    subjects = doc.get("subject", [])
                    genre = subjects[0] if isinstance(subjects, list) and subjects else str(subjects) if subjects else "Fiction"
                    
                    books.append({
                        "id": f"ia_{identifier}",
                        "title": title,
                        "author": author,
                        "cover_url": cover_url,
                        "epub_url": epub_url,
                        "description": description,
                        "genre": genre
                    })
                return books
        except Exception as e:
            print(f"Internet Archive fetch failed for {url}: {e}")
            
    return []

# 4. Gutendex API Fetcher
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
                
                # Author
                authors = item.get("authors", [])
                author = "Unknown Author"
                if authors:
                    author_name = authors[0].get("name", "Unknown Author")
                    if "," in author_name:
                        parts = author_name.split(",")
                        author = f"{parts[1].strip()} {parts[0].strip()}"
                    else:
                        author = author_name
                
                # Cover URL
                # In Gutendex, cover resolves via Open Library cover service or archive.org
                cover_url = f"https://covers.openlibrary.org/b/olid/OL{gid}W-L.jpg?default=false"
                
                # EPUB URL
                formats = item.get("formats", {})
                epub_url = formats.get("application/epub+zip") or ""
                
                # Description
                subjects = item.get("subjects", [])
                description = ", ".join(subjects) if subjects else "A classic Gutenberg public domain book."
                
                # Genre
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
                fetch_open_library(client, query),
                fetch_internet_archive(client, query),
                fetch_gutendex(client, query)
            ]
            
            # Run concurrently
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            all_books = []
            for res in results:
                if isinstance(res, list):
                    all_books.extend(res)
                    
            # Deduplicate by Title
            seen: Dict[str, dict] = {}
            for book in all_books:
                title_str = book.get("title", "")
                clean_title = get_clean_title(title_str)
                if not clean_title:
                    continue
                
                score = get_fidelity_score(book)
                
                if clean_title not in seen:
                    seen[clean_title] = (book, score)
                else:
                    prev_book, prev_score = seen[clean_title]
                    if score > prev_score:
                        seen[clean_title] = (book, score)
                        
            return [item[0] for item in seen.values()]

book_aggregator_service = BookAggregatorService()
