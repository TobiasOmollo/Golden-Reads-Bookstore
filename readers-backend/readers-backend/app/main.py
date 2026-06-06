# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import books, audio, podcasts, magazines, ai
import os

app = FastAPI(
    title="Readers PWA Backend",
    description="Asynchronous, production-ready FastAPI backend for the Readers App. Connecting Gutenberg books, LibriVox audiobooks, Podcast Index, and RSS publications, amplified by Gemini 1.5 Flash.",
    version="1.0.0"
)

# Allow localhost origins + configured origins
origins = [
    'http://localhost:3000',
    'http://localhost:4000',
    'http://localhost:5173',
    'http://localhost:8080',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:4000',
    'http://127.0.0.1:5173',
]

# Add custom CORS origins configured in settings/environment
for origin in settings.cors_origins_list:
    if origin not in origins:
        origins.append(origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
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
