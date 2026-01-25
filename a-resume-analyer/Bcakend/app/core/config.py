from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

class Settings(BaseSettings):
    APP_NAME: str = "AI Resume Analyzer"
    VERSION: str = "0.1"
    ADMIN_TOKEN: str = "dev-admin-token-change-in-production"
    
    # Model paths
    VECTOR_PATH: Path = Path("app/ml/artifacts/vectorizer.joblib")
    META_PATH: Path = Path("app/ml/artifacts/vectorizer_meta.json")
    
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
