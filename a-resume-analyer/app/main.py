from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from pathlib import Path

from app.api.routes import router as api_router
from app.core.config import settings
from app.core.dependencies import set_vectorizer
from app.services.vectorizer import TextVectorizer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup and shutdown events for the application.
    Loads the vectorizer model on startup.
    """
    # Startup
    logger.info("🚀 Starting AI Resume Analyzer...")
    
    # Try to load the pre-trained vectorizer
    if settings.VECTOR_PATH.exists():
        try:
            logger.info(f"📦 Loading vectorizer from {settings.VECTOR_PATH}")
            vectorizer = TextVectorizer()
            vectorizer.load(str(settings.VECTOR_PATH))
            set_vectorizer(vectorizer)
            logger.info("✅ Vectorizer loaded successfully")
            
            # Log metadata if available
            if settings.META_PATH.exists():
                import json
                meta = json.loads(settings.META_PATH.read_text())
                logger.info(f"📊 Model version: {meta.get('version')}")
                logger.info(f"📊 Trained on {meta.get('num_docs')} documents")
        except Exception as e:
            logger.error(f"❌ Failed to load vectorizer: {e}")
            logger.warning("⚠️  API will return 503 until model is trained via /api/admin/retrain")
    else:
        logger.warning(f"⚠️  No pre-trained model found at {settings.VECTOR_PATH}")
        logger.warning("⚠️  Please train the model first:")
        logger.warning("   1. Run: python -m ml.train_vectorizer")
        logger.warning("   2. Or call: POST /api/admin/retrain")
    
    logger.info("✅ Application startup complete")
    
    yield
    
    # Shutdown
    logger.info("👋 Shutting down AI Resume Analyzer...")


def create_app() -> FastAPI:
    app = FastAPI(
        title="AI Resume Analyzer",
        version="0.1.0",
        description="Production-grade AI Resume Analyzer using TF-IDF and cosine similarity",
        lifespan=lifespan
    )
    
    # Configure CORS for frontend
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    app.include_router(api_router, prefix="/api")
    return app


app = create_app()


