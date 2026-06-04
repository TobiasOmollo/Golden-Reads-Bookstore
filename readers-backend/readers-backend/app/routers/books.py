import httpx
from fastapi import APIRouter, Query, HTTPException, Response
from typing import List, Optional
from app.models.schemas import Book
from app.services.gutendex import gutendex_service

router = APIRouter(prefix="/books", tags=["Books"])

@router.get("/search", response_model=List[Book])
async def search_books(
    q: Optional[str] = Query(None, description="Search term for title or author"),
    genre: Optional[str] = Query(None, description="Genre tag matching the GENRE_MAP"),
    page: int = Query(1, ge=1, description="Page number")
):
    try:
        return await gutendex_service.search_books(query=q, genre=genre, page=page)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to query Gutenberg: {str(e)}")

@router.get("/trending", response_model=List[Book])
async def get_trending():
    try:
        return await gutendex_service.get_trending_books()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get trending: {str(e)}")

@router.get("/{id}", response_model=Book)
async def get_book_by_id(id: int):
    book = await gutendex_service.get_book_by_id(id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found in Gutenberg Repository.")
    return book

@router.get("/{id}/cover")
async def proxy_cover(id: int):
    book = await gutendex_service.get_book_by_id(id)
    cover_url = book.cover if book else f"https://picsum.photos/seed/book_{id}/200/300"
    
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
            resp = await client.get(f"https://picsum.photos/seed/book_{id}/200/300")
            return Response(content=resp.content, media_type="image/jpeg")
        except Exception:
            raise HTTPException(status_code=502, detail="Failed to fetch book cover image assets.")
