from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

# Required for Render PostgreSQL compatibility
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,        # detects stale connections
    pool_recycle=300,          # recycles connections every 5 minutes
    connect_args={
        "sslmode": "require"   # Render requires SSL
    } if ("localhost" not in settings.DATABASE_URL and settings.DATABASE_URL.startswith("postgres")) else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
