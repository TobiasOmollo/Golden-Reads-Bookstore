import json
from fastapi import APIRouter, Query, HTTPException
from typing import List
from app.models.schemas import AudiobookDetail, AudiobookChapter
from app.services.librivox import librivox_service
from app.services.db import execute_query

router = APIRouter(prefix="/audio", tags=["Audiobooks"])

def map_db_audiobook(r: dict) -> AudiobookDetail:
    chapters_raw = []
    if r.get("chapters"):
        try:
            chapters_raw = json.loads(r["chapters"])
        except Exception:
            pass
            
    chapters = []
    for c in chapters_raw:
        chapters.append(AudiobookChapter(
            id=c.get("id", "all"),
            title=c.get("title", "Play full Audiobook"),
            duration=c.get("duration", 3600),
            listen_url=c.get("listen_url", "")
        ))
        
    return AudiobookDetail(
        id=r["id"],
        title=r["title"],
        author=r["author"] or "Unknown Author",
        description=r["description"] or "",
        cover=r["cover_url"] or "",
        cover_url=r["cover_url"] or "",
        listen_url=r["listen_url"] or "",
        stream_url=r["stream_url"] or "",
        chapters=chapters
    )

@router.get("/search", response_model=List[AudiobookDetail])
async def search_audiobooks(q: str = Query(..., min_length=2, description="Audiobook search query")):
    db_audiobooks = []
    try:
        rows = execute_query("SELECT * FROM audiobooks")
        q_lower = q.lower().strip()
        for r in rows:
            if q_lower in r["title"].lower() or q_lower in (r["author"] or "").lower():
                db_audiobooks.append(map_db_audiobook(r))
    except Exception as e:
        print(f"Error querying DB audiobooks: {e}")
        
    live_audiobooks = []
    try:
        results = await librivox_service.search_audiobooks(q)
        if results:
            live_audiobooks = results
    except Exception as e:
        print(f"LibriVox search failed: {e}")
        
    return db_audiobooks + live_audiobooks

@router.get("/{id}", response_model=AudiobookDetail)
async def get_audio_detail(id: str):
    rows = execute_query("SELECT * FROM audiobooks WHERE id = %s", (id,))
    if rows:
        return map_db_audiobook(rows[0])
        
    clean_id = id[1:] if id.startswith("a") else id
    detail = await librivox_service.get_audiobook_by_id(clean_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Audiobook detail or sections could not be found.")
    return detail

