import httpx
from fastapi import APIRouter, Query, HTTPException, Response
from typing import List, Optional
from app.models.schemas import Book, UnifiedBook
from app.services.gutendex import gutendex_service
from app.services.book_aggregator import book_aggregator_service
from app.services.db import execute_query

router = APIRouter(prefix="/books", tags=["Books"])

FALLBACK_CLASSICS = [
    Book(
        id="g1342",
        title="Pride and Prejudice",
        author="Jane Austen",
        cover="https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg",
        rating=4.8,
        price=0.0,
        genre=["Fiction", "Romance"],
        description="Pride and Prejudice is a romantic novel of manners written by Jane Austen in 1813.",
        pages=352,
        readingTime=528,
        formats=["epub", "html", "text"],
        gutendexId=1342,
        read_url="https://www.gutenberg.org/files/1342/1342-h/1342-h.htm",
        epub_url="https://www.gutenberg.org/ebooks/1342.epub3.images",
        download_url="https://www.gutenberg.org/files/1342/1342-0.txt"
    ),
    Book(
        id="g1497",
        title="The Republic",
        author="Plato",
        cover="https://www.gutenberg.org/cache/epub/1497/pg1497.cover.medium.jpg",
        rating=4.7,
        price=0.0,
        genre=["Philosophy", "Fiction"],
        description="The Republic is a Socratic dialogue, authored by Plato around 375 BC, concerning justice.",
        pages=416,
        readingTime=624,
        formats=["epub", "html", "text"],
        gutendexId=1497,
        read_url="https://www.gutenberg.org/files/1497/1497-h/1497-h.htm",
        epub_url="https://www.gutenberg.org/ebooks/1497.epub3.images",
        download_url="https://www.gutenberg.org/files/1497/1497-0.txt"
    ),
    Book(
        id="g84",
        title="Frankenstein; Or, The Modern Prometheus",
        author="Mary Wollstonecraft Shelley",
        cover="https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg",
        rating=4.6,
        price=0.0,
        genre=["Fiction", "Horror", "Mystery"],
        description="Frankenstein; or, The Modern Prometheus is an 1818 novel written by English author Mary Shelley.",
        pages=280,
        readingTime=420,
        formats=["epub", "html", "text"],
        gutendexId=84,
        read_url="https://www.gutenberg.org/files/84/84-h/84-h.htm",
        epub_url="https://www.gutenberg.org/ebooks/84.epub3.images",
        download_url="https://www.gutenberg.org/files/84/84-0.txt"
    )
]

FALLBACK_UNIFIED_CLASSICS = [
    UnifiedBook(
        id="g1342",
        title="Pride and Prejudice",
        author="Jane Austen",
        cover_url="https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg",
        epub_url="https://www.gutenberg.org/ebooks/1342.epub3.images",
        description="Pride and Prejudice is a romantic novel of manners written by Jane Austen in 1813.",
        genre="Fiction"
    ),
    UnifiedBook(
        id="g1497",
        title="The Republic",
        author="Plato",
        cover_url="https://www.gutenberg.org/cache/epub/1497/pg1497.cover.medium.jpg",
        epub_url="https://www.gutenberg.org/ebooks/1497.epub3.images",
        description="The Republic is a Socratic dialogue, authored by Plato around 375 BC, concerning justice.",
        genre="Philosophy"
    ),
    UnifiedBook(
        id="g84",
        title="Frankenstein; Or, The Modern Prometheus",
        author="Mary Wollstonecraft Shelley",
        cover_url="https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg",
        epub_url="https://www.gutenberg.org/ebooks/84.epub3.images",
        description="Frankenstein; or, The Modern Prometheus is an 1818 novel written by English author Mary Shelley.",
        genre="Fiction"
    )
]

def get_db_books() -> List[UnifiedBook]:
    rows = execute_query("SELECT id, title, author, cover_url, description, genre FROM books")
    db_books = []
    for r in rows:
        db_books.append(UnifiedBook(
            id=r["id"],
            title=r["title"],
            author=r["author"] or "Unknown Author",
            cover_url=r["cover_url"] or "",
            epub_url="",
            description=r["description"] or "",
            genre=r["genre"] or "Fiction"
        ))
    return db_books

@router.get("/search", response_model=List[UnifiedBook])
async def search_books(
    q: Optional[str] = Query(None, description="Search term for title or author"),
    genre: Optional[str] = Query(None, description="Genre tag matching the GENRE_MAP"),
    page: int = Query(1, ge=1, description="Page number")
):
    db_books = get_db_books()
    if q or genre:
        filtered_db = []
        q_lower = q.lower().strip() if q else ""
        genre_lower = genre.lower().strip() if genre else ""
        for b in db_books:
            match = False
            if q_lower:
                if q_lower in b.title.lower() or q_lower in b.author.lower() or q_lower in b.description.lower():
                    match = True
            if genre_lower:
                if genre_lower in b.genre.lower():
                    match = True
            if match:
                filtered_db.append(b)
        db_books = filtered_db
        
    live_books = []
    try:
        search_query = q or genre
        results = await book_aggregator_service.aggregate_books(query=search_query)
        if results:
            for r in results:
                live_books.append(UnifiedBook(
                    id=r.get("id", ""),
                    title=r.get("title", ""),
                    author=r.get("author", "Unknown Author"),
                    cover_url=r.get("cover_url", ""),
                    epub_url=r.get("epub_url", ""),
                    description=r.get("description", ""),
                    genre=r.get("genre", "Fiction")
                ))
    except Exception as e:
        print(f"Error fetching live books: {e}")
        
    return db_books + live_books

@router.get("/trending", response_model=List[UnifiedBook])
async def get_trending():
    db_books = get_db_books()
    live_books = []
    try:
        results = await book_aggregator_service.aggregate_books(query=None)
        if results:
            for r in results:
                live_books.append(UnifiedBook(
                    id=r.get("id", ""),
                    title=r.get("title", ""),
                    author=r.get("author", "Unknown Author"),
                    cover_url=r.get("cover_url", ""),
                    epub_url=r.get("epub_url", ""),
                    description=r.get("description", ""),
                    genre=r.get("genre", "Fiction")
                ))
    except Exception as e:
        print(f"Error fetching live trending books: {e}")
        
    return db_books + live_books

@router.get("/{id}", response_model=Book)
async def get_book_by_id(id: str):
    db_id = id if id.startswith("g") else f"g{id}"
    rows = execute_query("SELECT * FROM books WHERE id = %s", (db_id,))
    if rows:
        r = rows[0]
        return Book(
            id=r["id"],
            title=r["title"],
            author=r["author"] or "Unknown Author",
            cover=r["cover_url"] or "",
            cover_url=r["cover_url"] or "",
            description=r["description"] or "",
            genre=[r["genre"]] if r["genre"] else [],
            genres=[r["genre"]] if r["genre"] else [],
            read_url=r["read_url"] or "",
            epub_url=r["epub_url"] or "",
            download_url=r["download_url"] or "",
            gutendexId=r["gutendex_id"]
        )
        
    numeric_id = id[1:] if id.startswith("g") else id
    try:
        gutenberg_id = int(numeric_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid book ID format.")
    
    book = await gutendex_service.get_book_by_id(gutenberg_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found in Gutenberg Repository.")
    return book

@router.get("/{id}/cover")
async def proxy_cover(id: str):
    db_id = id if id.startswith("g") else f"g{id}"
    rows = execute_query("SELECT cover_url FROM books WHERE id = %s", (db_id,))
    cover_url = ""
    if rows:
        cover_url = rows[0]["cover_url"]
        
    if not cover_url:
        numeric_id = id[1:] if id.startswith("g") else id
        try:
            gutenberg_id = int(numeric_id)
            book = await gutendex_service.get_book_by_id(gutenberg_id)
            if book:
                cover_url = book.cover
        except ValueError:
            pass
            
    if not cover_url:
        cover_url = f"https://picsum.photos/seed/book_{id}/200/300"
        
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(cover_url, timeout=5.0)
            if resp.status_code == 200:
                headers = {
                    "Cache-Control": "public, max-age=86400",
                    "Access-Control-Allow-Origin": "*"
                }
                return Response(content=resp.content, media_type=resp.headers.get("content-type", "image/jpeg"), headers=headers)
        except Exception:
            pass

    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(f"https://picsum.photos/seed/book_{id}/200/300")
            return Response(content=resp.content, media_type="image/jpeg")
        except Exception:
            raise HTTPException(status_code=502, detail="Failed to fetch book cover image assets.")

from fastapi import Depends
from app.routers.auth import get_current_user
from app.database import get_db
from sqlalchemy.orm import Session
from app.models.models import User
import json

@router.post("/{id}/access")
async def access_book(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.subscription_tier == "premium":
        return {"status": "granted", "tier": "premium", "count": 0, "limit": 6}

    accessed_books = []
    if current_user.accessed_books:
        try:
            accessed_books = json.loads(current_user.accessed_books)
        except Exception:
            pass

    if id in accessed_books:
        return {"status": "granted", "tier": "free", "count": len(accessed_books), "limit": 6}

    if len(accessed_books) >= 6:
        raise HTTPException(
            status_code=403,
            detail="Free ebook tier limit reached. Please upgrade to Premium."
        )

    # Allow access and track
    accessed_books.append(id)
    current_user.accessed_books = json.dumps(accessed_books)
    db.commit()
    return {"status": "granted", "tier": "free", "count": len(accessed_books), "limit": 6}


