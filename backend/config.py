from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_SERVICE_KEY: str
    GEMINI_API_KEY: str
    CORS_ORIGINS: str = "*"

    # Reads directly from the .env file in the backend root
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

@lru_cache
def get_settings() -> Settings:
    """
    Caches the settings to prevent multiple disk reads.
    Returns a validated Settings object.
    """
    return Settings()