# app/core/dependencies.py
from pathlib import Path
from fastapi import HTTPException, Header
from typing import Optional
from app.core.config import settings

# Global vectorizer instance - loaded on startup
_vectorizer = None

def set_vectorizer(vectorizer):
    """Set the global vectorizer instance (called on startup)"""
    global _vectorizer
    _vectorizer = vectorizer

def get_vectorizer():
    """Dependency to get the loaded vectorizer"""
    if _vectorizer is None:
        raise HTTPException(
            status_code=503, 
            detail="Model not loaded. Please train the model first using /api/admin/retrain"
        )
    return _vectorizer

async def verify_admin_token(x_admin_token: str = Header(...)):
    """Simple admin authentication via header token"""
    if x_admin_token != settings.ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid admin token")
    return x_admin_token
