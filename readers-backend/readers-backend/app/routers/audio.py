from fastapi import APIRouter, Query, HTTPException
from typing import List
from app.models.schemas import AudiobookDetail
from app.services.librivox import librivox_service

router = APIRouter(prefix="/audiobooks", tags=["Audiobooks"])

@router.get("/search", response_model=List[AudiobookDetail])
async def search_audiobooks(q: str = Query(..., min_length=2, description="Audiobook search query")):
    try:
        return await librivox_service.search_audiobooks(q)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LibriVox search failed: {str(e)}")

@router.get("/{id}", response_model=AudiobookDetail)
async def get_audio_detail(id: str):
    detail = await librivox_service.get_audiobook_by_id(id)
    if not detail:
        raise HTTPException(status_code=404, detail="Audiobook detail or sections could not be found.")
    return detail
