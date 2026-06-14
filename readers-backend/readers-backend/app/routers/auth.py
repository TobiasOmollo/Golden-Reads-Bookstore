import bcrypt
# Defensive monkeypatch for passlib bcrypt compatibility with modern bcrypt package versions
original_hashpw = bcrypt.hashpw
def patched_hashpw(password, salt):
    if isinstance(password, str):
        password_bytes = password.encode('utf-8')
    else:
        password_bytes = password
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    return original_hashpw(password_bytes, salt)
bcrypt.hashpw = patched_hashpw

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from passlib.context import CryptContext
import jwt
import datetime
import json
import os

# Initialize router
router = APIRouter(prefix="/auth", tags=["Authentication"])

# Password Encryption Protocol
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False

# JWT Access Token Config
SECRET_KEY = "golden_reads_super_secret_key_change_in_production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 Hours

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Database persistence helper functions using SQLAlchemy Session
from sqlalchemy.orm import Session
from fastapi import Depends
from app.database import get_db
from app.models.models import User

def db_get_user(db: Session, email: str) -> Optional[dict]:
    user = db.query(User).filter(User.email == email.lower().strip()).first()
    if not user:
        return None
    
    # Construct profile dictionary matching expected format
    genres = []
    if user.genres:
        try:
            genres = json.loads(user.genres)
        except Exception:
            genres = [g.strip() for g in user.genres.split(",") if g.strip()]
            
    pref_formats = []
    if user.preferred_formats:
        try:
            pref_formats = json.loads(user.preferred_formats)
        except Exception:
            pref_formats = [f.strip() for f in user.preferred_formats.split(",") if f.strip()]
            
    acc_books = []
    if user.accessed_books:
        try:
            acc_books = json.loads(user.accessed_books)
        except Exception:
            pass

    acc_audios = []
    if user.accessed_audiobooks:
        try:
            acc_audios = json.loads(user.accessed_audiobooks)
        except Exception:
            pass

    profile = {
        "id": f"u_{user.email}",
        "name": user.name,
        "email": user.email,
        "avatar": user.avatar or f"https://i.pravatar.cc/200?img=1",
        "genres": genres,
        "readingGoal": user.reading_goal or 12,
        "preferredFormats": pref_formats,
        "subscription_tier": user.subscription_tier or "free",
        "accessed_books": acc_books,
        "accessed_audiobooks": acc_audios
    }
    
    return {
        "email": user.email,
        "hashed_password": user.hashed_password,
        "profile": profile
    }

def db_create_user(db: Session, email: str, hashed_pw: str, name: str, reading_goal: int = 12, genres: list = [], preferred_formats: list = [], avatar: str = ""):
    db_user = User(
        email=email.lower().strip(),
        hashed_password=hashed_pw,
        name=name,
        reading_goal=reading_goal,
        genres=json.dumps(genres),
        preferred_formats=json.dumps(preferred_formats),
        avatar=avatar
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

# Data Schemas
class ProfileDetails(BaseModel):
    name: str
    readingGoal: Optional[int] = 12
    genres: Optional[List[str]] = []
    preferredFormats: Optional[List[str]] = []
    avatar: Optional[str] = ""

class UserSignupPayload(BaseModel):
    email: str
    password: str
    name: Optional[str] = None
    profileDetails: Optional[ProfileDetails] = None

class UserLoginPayload(BaseModel):
    email: str
    password: str

class GoogleLoginPayload(BaseModel):
    token: str

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(payload: UserSignupPayload, db: Session = Depends(get_db)):
    email = payload.email.lower().strip()
    password = payload.password
    
    if not email or "@" not in email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A valid email address is required."
        )
    
    if len(password) < 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 4 characters long."
        )
    
    existing_user = db_get_user(db, email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )
    
    name = email.split("@")[0].title()
    reading_goal = 12
    genres = []
    preferred_formats = ["epub"]
    avatar = ""
    
    if payload.profileDetails:
        name = payload.profileDetails.name or name
        reading_goal = payload.profileDetails.readingGoal or 12
        genres = payload.profileDetails.genres or []
        preferred_formats = payload.profileDetails.preferredFormats or []
        avatar = payload.profileDetails.avatar or ""
    elif payload.name:
        name = payload.name
        
    if not avatar:
        avatar = f"https://i.pravatar.cc/200?img={(abs(hash(email)) % 70) + 1}"
        
    hashed_pw = hash_password(password)
    db_create_user(db, email, hashed_pw, name, reading_goal, genres, preferred_formats, avatar)
    
    user_data = db_get_user(db, email)
    access_token = create_access_token({"sub": email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_data["profile"]
    }

@router.post("/login")
async def login(payload: UserLoginPayload, db: Session = Depends(get_db)):
    email = payload.email.lower().strip()
    password = payload.password
    
    user_data = db_get_user(db, email)
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
    
    if not verify_password(password, user_data["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
        
    access_token = create_access_token({"sub": email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_data["profile"]
    }

@router.post("/google")
async def google_auth(payload: GoogleLoginPayload, db: Session = Depends(get_db)):
    token = payload.token
    if not token or not token.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google OAuth token is missing or empty."
        )
    
    email = "google_user@gmail.com"
    name = "Google Reader"
    
    if "@" in token:
        email = token.lower().strip()
        name = token.split("@")[0].title()
        
    user_data = db_get_user(db, email)
    if not user_data:
        avatar = "https://i.pravatar.cc/200?img=12"
        hashed_pw = hash_password("google_bypass_key")
        db_create_user(db, email, hashed_pw, name, 12, ["Fiction", "Technology"], ["epub"], avatar)
        user_data = db_get_user(db, email)
        
    access_token = create_access_token({"sub": email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_data["profile"]
    }

from fastapi import Header

def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is missing or invalid."
        )
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload."
            )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials."
        )
    
    user = db.query(User).filter(User.email == email.lower().strip()).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found."
        )
    return user

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_data = db_get_user(db, current_user.email)
    return user_data["profile"]

@router.post("/upgrade")
async def upgrade_user(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user.subscription_tier = "premium"
    db.commit()
    db.refresh(current_user)
    user_data = db_get_user(db, current_user.email)
    return {
        "status": "success",
        "user": user_data["profile"]
    }

