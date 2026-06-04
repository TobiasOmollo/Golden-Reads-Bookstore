from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import books, audio, podcasts, magazines, ai

app = FastAPI(
    title="Readers PWA Backend",
    description="Asynchronous, production-ready FastAPI backend for the Readers App. Connecting Gutenberg books, LibriVox audiobooks, Podcast Index, and RSS publications, amplified by Gemini 1.5 Flash.",
    version="1.0.0"
)

# Rigorous CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# Mount all component routers
app.include_router(books.router)
app.include_router(audio.router)
app.include_router(podcasts.router)
app.include_router(magazines.router)
app.include_router(ai.router)

@app.get("/api/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "api_version": "1.0.0",
        "gemini_active": settings.GEMINI_API_KEY != ""
    }

# Entrypoint handler for running programmatically
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
