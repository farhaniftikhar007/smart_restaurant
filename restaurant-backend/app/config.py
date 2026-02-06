# app/config.py
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/restaurant_db"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS - Allow all origins for development
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3004",
        "http://192.168.100.61:3000",
        "http://192.168.100.61:3004",
        "*"  # Allow all for development
    ]
    
    # App
    APP_NAME: str = "Smart Restaurant API"
    DEBUG: bool = True
    BASE_URL: str = "http://localhost:3000"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"

settings = Settings()
