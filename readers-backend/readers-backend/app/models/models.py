from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # User Profile Columns (fully backward-compatible)
    reading_goal = Column(Integer, default=12)
    genres = Column(Text)  # JSON serialized list
    preferred_formats = Column(Text)  # JSON serialized list
    avatar = Column(String(255))

class SeededBook(Base):
    __tablename__ = "books"

    id = Column(String(255), primary_key=True)
    title = Column(String(255), unique=True, nullable=False)
    author = Column(String(255))
    cover_url = Column(Text)
    description = Column(Text)
    genre = Column(String(255))
    gutendex_id = Column(Integer, unique=True)
    read_url = Column(Text)
    epub_url = Column(Text)
    download_url = Column(Text)
    price = Column(String(50))

class SeededAudiobook(Base):
    __tablename__ = "audiobooks"

    id = Column(String(255), primary_key=True)
    title = Column(String(255), nullable=False)
    author = Column(String(255))
    cover_url = Column(Text)
    description = Column(Text)
    listen_url = Column(Text)
    stream_url = Column(Text)
    chapters = Column(Text)  # JSON serialized list of dicts

class SeededMagazine(Base):
    __tablename__ = "magazines"

    id = Column(String(255), primary_key=True)
    title = Column(String(255), nullable=False)
    publication = Column(String(255))
    country = Column(String(50))
    category = Column(String(255))
    hero_image = Column(Text)
    summary = Column(Text)
    source_url = Column(Text)
    published_at = Column(String(100))
