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
async def search_audiobooks(q: Optional[str] = Query(None, description="Audiobook search query")):
    db_audiobooks = []
    q_lower = q.lower().strip() if q else ""
    try:
        rows = execute_query("SELECT * FROM audiobooks")
        for r in rows:
            if not q_lower or q_lower in r["title"].lower() or q_lower in (r["author"] or "").lower():
                db_audiobooks.append(map_db_audiobook(r))
    except Exception as e:
        print(f"Error querying DB audiobooks: {e}")
        
    live_audiobooks = []
    if q_lower:
        try:
            results = await librivox_service.search_audiobooks(q_lower)
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

from fastapi import Depends
from app.routers.auth import get_current_user
from app.database import get_db
from sqlalchemy.orm import Session
from app.models.models import User
import json

@router.post("/{id}/access")
async def access_audio(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.subscription_tier == "premium":
        return {"status": "granted", "tier": "premium", "count": 0, "limit": 4}

    accessed_audiobooks = []
    if current_user.accessed_audiobooks:
        try:
            accessed_audiobooks = json.loads(current_user.accessed_audiobooks)
        except Exception:
            pass

    if id in accessed_audiobooks:
        return {"status": "granted", "tier": "free", "count": len(accessed_audiobooks), "limit": 4}

    if len(accessed_audiobooks) >= 4:
        raise HTTPException(
            status_code=403,
            detail="Free audiobook tier limit reached. Please upgrade to Premium."
        )

    # Allow access and track
    accessed_audiobooks.append(id)
    current_user.accessed_audiobooks = json.dumps(accessed_audiobooks)
    db.commit()
    return {"status": "granted", "tier": "free", "count": len(accessed_audiobooks), "limit": 4}

