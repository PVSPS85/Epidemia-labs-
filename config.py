from pydantic_settings import BaseSettings
from functools import lru_cache
 
 
class Settings(BaseSettings):
    # Supabase
    supabase_url: str
    supabase_anon_key: str
    supabase_service_key: str
 
    # Gemini AI
    gemini_api_key: str
 
    # App
    app_env: str = "development"
    cors_origins: str = "http://localhost:3000"
 
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
 
 
@lru_cache()
def get_settings() -> Settings:
    """Cache settings so they're only loaded once."""
    return Settings()

