import httpx
from fastapi import APIRouter, Query, HTTPException, Response
from typing import List, Optional
from app.models.schemas import Book, UnifiedBook
from app.services.gutendex import gutendex_service
from app.services.book_aggregator import book_aggregator_service

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

@router.get("/search", response_model=List[UnifiedBook])
async def search_books(
    q: Optional[str] = Query(None, description="Search term for title or author"),
    genre: Optional[str] = Query(None, description="Genre tag matching the GENRE_MAP"),
    page: int = Query(1, ge=1, description="Page number")
):
    try:
        search_query = q or genre
        results = await book_aggregator_service.aggregate_books(query=search_query)
        if not results:
            return FALLBACK_UNIFIED_CLASSICS
        return results
    except Exception as e:
        print(f"Error in search_books: {e}")
        return FALLBACK_UNIFIED_CLASSICS

@router.get("/trending", response_model=List[UnifiedBook])
async def get_trending():
    try:
        results = await book_aggregator_service.aggregate_books(query=None)
        if not results:
            return FALLBACK_UNIFIED_CLASSICS
        return results
    except Exception as e:
        print(f"Error in get_trending: {e}")
        return FALLBACK_UNIFIED_CLASSICS


@router.get("/{id}", response_model=Book)
async def get_book_by_id(id: str):
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
    numeric_id = id[1:] if id.startswith("g") else id
    try:
        gutenberg_id = int(numeric_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid book ID format.")
    
    book = await gutendex_service.get_book_by_id(gutenberg_id)
    cover_url = book.cover if book else f"https://picsum.photos/seed/book_{gutenberg_id}/200/300"
    
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(cover_url, timeout=5.0)
            if resp.status_code == 200:
                # Return the image with correct content type
                headers = {
                    "Cache-Control": "public, max-age=86400",
                    "Access-Control-Allow-Origin": "*"
                }
                return Response(content=resp.content, media_type=resp.headers.get("content-type", "image/jpeg"), headers=headers)
        except Exception:
            pass

    # Redirect or stream absolute fallback picsum
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(f"https://picsum.photos/seed/book_{gutenberg_id}/200/300")
            return Response(content=resp.content, media_type="image/jpeg")
        except Exception:
            raise HTTPException(status_code=502, detail="Failed to fetch book cover image assets.")
