from fastapi import APIRouter, HTTPException, status
from typing import List
from app.models.schemas import (
    SummarizeRequest, SummarizeResponse,
    FlashcardRequest, Flashcard,
    RecommendRequest, RecommendResponse,
    ExplainRequest, ExplainResponse
)
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/ai", tags=["AI Features"])

@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_chapter(body: SummarizeRequest):
    try:
        summary_text = await gemini_service.get_summary(body.bookId, body.chapter)
        if summary_text == "error_quota_exceeded":
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="quota_exceeded"
            )
        return SummarizeResponse(summary=summary_text)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI Summarization failed: {str(e)}"
        )

@router.post("/flashcards", response_model=List[Flashcard])
async def make_flashcards(body: FlashcardRequest):
    try:
        cards = await gemini_service.generate_flashcards(body.text)
        return cards
    except Exception as e:
        if "quota_exceeded" in str(e).lower() or "429" in str(e):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="quota_exceeded"
            )
        raise HTTPException(
            status_code=500,
            detail=f"AI Flashcards generation failed: {str(e)}"
        )

@router.post("/recommend", response_model=RecommendResponse)
async def get_book_recommendations(body: RecommendRequest):
    try:
        rec_data = await gemini_service.get_recommendations(body.genres, body.history)
        return RecommendResponse(
            recommendations=rec_data["recommendations"],
            reasoning=rec_data["reasoning"]
        )
    except Exception as e:
        if "quota_exceeded" in str(e).lower() or "429" in str(e):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="quota_exceeded"
            )
        raise HTTPException(
            status_code=500,
            detail=f"AI Recommendation failed: {str(e)}"
        )

@router.post("/explain", response_model=ExplainResponse)
async def explain_expression(body: ExplainRequest):
    try:
        explanation_text = await gemini_service.get_explanation(body.passage, body.context)
        if explanation_text == "error_quota_exceeded":
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="quota_exceeded"
            )
        return ExplainResponse(explanation=explanation_text)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI Translation or explanation failed: {str(e)}"
        )
