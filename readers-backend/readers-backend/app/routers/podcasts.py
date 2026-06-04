from fastapi import APIRouter, Query, HTTPException
from typing import List
from app.models.schemas import PodcastChannel, Episode
from app.services.podcast_index import podcast_index_service

router = APIRouter(prefix="/podcasts", tags=["Podcasts"])

@router.get("/search", response_model=List[PodcastChannel])
async def search_podcasts(q: str = Query(..., description="Query term for podcast search")):
    try:
        return await podcast_index_service.search_podcasts(q)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Podcast search failed: {str(e)}")

@router.get("/{feedId}/episodes", response_model=List[Episode])
async def get_podcast_episodes(feedId: str):
    try:
        episodes = await podcast_index_service.get_episodes(feedId)
        return episodes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch podcast episodes: {str(e)}")
