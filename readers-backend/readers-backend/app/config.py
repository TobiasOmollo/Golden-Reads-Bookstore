import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PODCAST_INDEX_KEY: str = ""
    PODCAST_INDEX_SECRET: str = ""
    GEMINI_API_KEY: str = ""
    FIREBASE_SERVICE_ACCOUNT: str = ""
    CORS_ORIGINS: str = "http://localhost:3000,https://your-app.vercel.app"
    PORT: int = 8000

    @property
    def cors_origins_list(self) -> List[str]:
        import json
        raw = self.CORS_ORIGINS.strip()
        if raw.startswith("[") and raw.endswith("]"):
            try:
                return json.loads(raw)
            except Exception:
                pass
        return [origin.strip() for origin in raw.split(",") if origin.strip()]

    # Pydantic v2 configuration for loading env file
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
