from pydantic import BaseModel, Field
from typing import List, Optional

class Book(BaseModel):
    id: str
    title: str
    author: str = "Unknown Author"
    cover: str = ""
    rating: float = 4.5
    price: float = 0.0
    genre: List[str] = []
    description: str = ""
    pages: int = 150
    readingTime: int = 120  # in minutes
    formats: List[str] = []
    
    # New fields returned by single-pass mapping:
    cover_url: Optional[str] = ""
    authors: Optional[List[str]] = []
    genres: Optional[List[str]] = []
    language: Optional[str] = ""
    pdf_url: Optional[str] = ""
    preview_link: Optional[str] = ""
    download_count: Optional[int] = 0
    
    gutendexId: Optional[int] = None
    librivoxId: Optional[int] = None
    read_url: Optional[str] = ""
    epub_url: Optional[str] = ""
    download_url: Optional[str] = ""

class Episode(BaseModel):
    id: str
    title: str
    show: str
    artwork: str
    duration: int  # in seconds
    enclosureUrl: str
    publishedAt: str

class Article(BaseModel):
    id: str                  # sha256 hash of sourceUrl, first 12 chars
    title: str
    publication: str         # human-readable outlet name e.g. "Daily Nation"
    country: str             # ISO code: "KE", "UG", "TZ", "RW", "ET", "EA", "PAN"
    category: str            # see category list in Section 3
    heroImage: str           # first valid image found, else ""
    summary: str             # plain text, HTML stripped, max 280 chars
    sourceUrl: str
    publishedAt: str         # ISO 8601 e.g. "2025-06-01T08:30:00Z"

class AudiobookChapter(BaseModel):
    id: str
    title: str
    duration: int
    listen_url: str

class AudiobookDetail(BaseModel):
    id: str
    title: str
    description: str
    author: str = "Unknown Author"
    cover: str = ""
    chapters: List[AudiobookChapter] = []
    
    # New fields returned by single-pass mapping:
    authors: List[str] = []
    genres: List[str] = []
    language: str = ""
    duration: str = ""
    cover_url: str = ""
    listen_url: str = ""
    stream_url: str = ""
    librivox_url: str = ""
    num_sections: str = "0"

Audiobook = AudiobookDetail

# Podcast Search Result
class PodcastChannel(BaseModel):
    id: str
    title: str
    author: str
    description: str
    artwork: str
    feedUrl: str

# AI request/response models
class SummarizeRequest(BaseModel):
    bookId: str
    chapter: str

class SummarizeResponse(BaseModel):
    summary: str

class Flashcard(BaseModel):
    front: str
    back: str

class FlashcardRequest(BaseModel):
    text: str

class FlashcardResponse(BaseModel):
    flashcards: List[Flashcard]

class RecommendRequest(BaseModel):
    genres: List[str]
    history: List[str]

class RecommendResponse(BaseModel):
    recommendations: List[Book]
    reasoning: str

class ExplainRequest(BaseModel):
    passage: str
    context: str

class ExplainResponse(BaseModel):
    explanation: str

class UnifiedBook(BaseModel):
    id: str
    title: str
    author: str = "Unknown Author"
    cover_url: str = ""
    epub_url: str = ""
    description: str = ""
    genre: str = "Fiction"

