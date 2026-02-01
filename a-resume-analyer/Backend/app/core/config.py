from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path
from typing import Optional

class Settings(BaseSettings):
    # App Info
    APP_NAME: str = "AI Resume Analyzer"
    VERSION: str = "0.2.0"
    
    # Database
    DATABASE_URL: Optional[str] = "sqlite:///./resume_analyzer.db"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ADMIN_TOKEN: str = "dev-admin-token-change-in-production"
    
    # App Settings
    LOG_LEVEL: str = "INFO"
    SQL_ECHO: str = "False"
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    
    # JWT
    ACCESS_TOKEN_EXPIRE_MINUTES: str = "30"
    REFRESH_TOKEN_EXPIRE_DAYS: str = "7"
    
    # Model paths
    VECTOR_PATH: Path = Path("app/ml/artifacts/vectorizer.joblib")
    META_PATH: Path = Path("app/ml/artifacts/vectorizer_meta.json")
    
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="allow"  # Allow extra fields from .env
    )

settings = Settings()
