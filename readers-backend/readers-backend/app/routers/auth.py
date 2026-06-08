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

# JSON database persistence for local development mockup
DB_FILE = os.path.join(os.path.dirname(__file__), "users_db.json")

def load_users() -> dict:
    if not os.path.exists(DB_FILE):
        # Setup initial mockup user (Amara Okonkwo)
        default_user = {
            "amara@goldenreads.app": {
                "email": "amara@goldenreads.app",
                "hashed_password": hash_password("password"),
                "profile": {
                    "id": "u_001",
                    "name": "Amara Okonkwo",
                    "email": "amara@goldenreads.app",
                    "avatar": "https://i.pravatar.cc/200?img=47",
                    "genres": ["Fiction", "Thriller", "Biography"],
                    "readingGoal": 24,
                    "preferredFormats": ["epub", "audio"]
                }
            }
        }
        try:
            with open(DB_FILE, "w") as f:
                json.dump(default_user, f, indent=2)
            return default_user
        except Exception:
            return default_user
    try:
        with open(DB_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return {}

def save_users(users: dict):
    try:
        with open(DB_FILE, "w") as f:
            json.dump(users, f, indent=2)
    except Exception as e:
        print(f"Failed to save users database: {e}")

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
    profileDetails: ProfileDetails

class UserLoginPayload(BaseModel):
    email: str
    password: str

class GoogleLoginPayload(BaseModel):
    token: str

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(payload: UserSignupPayload):
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
    
    users = load_users()
    if email in users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )
    
    # Construct profile structure
    profile = {
        "id": f"u_{int(datetime.datetime.now().timestamp() * 1000) % 100000}",
        "name": payload.profileDetails.name or email.split("@")[0].title(),
        "email": email,
        "avatar": payload.profileDetails.avatar or f"https://i.pravatar.cc/200?img={(abs(hash(email)) % 70) + 1}",
        "genres": payload.profileDetails.genres or [],
        "readingGoal": payload.profileDetails.readingGoal or 12,
        "preferredFormats": payload.profileDetails.preferredFormats or []
    }
    
    users[email] = {
        "email": email,
        "hashed_password": hash_password(password),
        "profile": profile
    }
    save_users(users)
    
    access_token = create_access_token({"sub": email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": profile
    }

@router.post("/login")
async def login(payload: UserLoginPayload):
    email = payload.email.lower().strip()
    password = payload.password
    
    users = load_users()
    if email not in users:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
    
    user_data = users[email]
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
async def google_auth(payload: GoogleLoginPayload):
    token = payload.token
    if not token or not token.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google OAuth token is missing or empty."
        )
    
    # Mock-verify profile structure from token
    # If token contains '@', extract email and name from it, otherwise use a fallback mock profile
    email = "google_user@gmail.com"
    name = "Google Reader"
    
    if "@" in token:
        email = token.lower().strip()
        name = token.split("@")[0].title()
        
    users = load_users()
    if email not in users:
        profile = {
            "id": f"u_google_{int(datetime.datetime.now().timestamp()) % 100000}",
            "name": name,
            "email": email,
            "avatar": "https://i.pravatar.cc/200?img=12",
            "genres": ["Fiction", "Technology"],
            "readingGoal": 12,
            "preferredFormats": ["epub"]
        }
        users[email] = {
            "email": email,
            "hashed_password": hash_password("google_bypass_key"),
            "profile": profile
        }
        save_users(users)
    else:
        profile = users[email]["profile"]
        
    access_token = create_access_token({"sub": email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": profile
    }
