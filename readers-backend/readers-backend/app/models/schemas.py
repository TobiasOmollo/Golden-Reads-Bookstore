from pydantic import BaseModel, Field
from typing import List, Optional

class Book(BaseModel):
    id: str
    title: str
    author: str
    cover: str
    rating: float
    price: float
    genre: List[str]
    description: str
    pages: int
    readingTime: int  # in minutes
    formats: List[str]
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
    author: str
    description: str
    cover: str
    chapters: List[AudiobookChapter]

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
