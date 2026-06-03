from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, FastAPI, Request
from pydantic import BaseModel, Field
from pathlib import Path
from datetime import datetime
from typing import List, Optional
import json
import hashlib
from app.services.preprocessing import process_text
from app.services.vectorizer import TextVectorizer
from app.services.matcher import compute_similarity
from app.services.pdf_parser import parse_resume_pdf
from app.services.batch_processor import BatchProcessor, MultiJobMatcher
from app.services.llm_matcher import llm_match_resume
from app.core.dependencies import get_vectorizer, verify_admin_token
from app.core.config import settings
from app.core.limiter import limiter
from app.core.cache import get_cache, set_cache

router = APIRouter()


class MatchRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, description="Resume text content")
    job_description: str = Field(..., min_length=10, description="Job description text")


class MatchResponse(BaseModel):
    match_score: float = Field(..., ge=0.0, le=1.0, description="Similarity score between 0 and 1")
    processed_resume_tokens: int = Field(..., description="Number of tokens after preprocessing")
    processed_job_tokens: int = Field(..., description="Number of tokens after preprocessing")
    matched_keywords: Optional[List[str]] = None
    missing_keywords: Optional[List[str]] = None
    suggestions: Optional[List[str]] = None
    is_cached: bool = False
    used_llm: bool = False


class RetrainResponse(BaseModel):
    status: str
    message: str
    version: str
    num_docs: int
    trained_at: str


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_version: str | None = None


class FileUploadResponse(BaseModel):
    filename: str
    size_bytes: int
    extracted_text_length: int
    metadata: dict


class BatchMatchRequest(BaseModel):
    resumes: List[str] = Field(..., min_length=1, description="List of resume texts")
    job_descriptions: List[str] = Field(..., min_length=1, description="List of job descriptions")


class BatchMatchResponse(BaseModel):
    total_processed: int
    successful: int
    failed: int
    results: List[dict]
    processing_time_seconds: float


class MultiJobMatchRequest(BaseModel):
    resume_text: str = Field(..., min_length=10)
    job_descriptions: List[str] = Field(..., min_length=1)
    top_k: Optional[int] = Field(None, ge=1, description="Return top K matches")


class MultiJobMatchResponse(BaseModel):
    total_jobs: int
    matches: List[dict]


@router.get("/health", response_model=HealthResponse)
def health_check():
    """Health check endpoint"""
    try:
        vectorizer = get_vectorizer()
        model_loaded = True
        # Try to read metadata
        version = None
        if settings.META_PATH.exists():
            meta = json.loads(settings.META_PATH.read_text())
            version = meta.get("version")
    except HTTPException:
        model_loaded = False
        version = None
    
    return HealthResponse(
        status="healthy",
        model_loaded=model_loaded,
        model_version=version
    )


@router.post("/match", response_model=MatchResponse)
@limiter.limit("20/minute")
async def match_resume(request: Request, payload: MatchRequest, vectorizer: TextVectorizer = Depends(get_vectorizer)):
    """
    Match a resume against a job description.
    Uses LLM if available, falls back to pre-trained ML model.
    Results are cached via Redis.
    """
    if not payload.resume_text.strip() or not payload.job_description.strip():
        raise HTTPException(status_code=400, detail="resume_text and job_description cannot be empty")

    # Generate cache key
    combined_text = payload.resume_text + payload.job_description
    cache_key = f"match:{hashlib.sha256(combined_text.encode()).hexdigest()}"
    
    # Check cache
    cached_result = await get_cache(cache_key)
    if cached_result:
        cached_result['is_cached'] = True
        return MatchResponse(**cached_result)

    try:
        # Preprocessing for token counts (and fallback ML)
        resume_clean = process_text(payload.resume_text)
        job_clean = process_text(payload.job_description)
        
        if not resume_clean or not job_clean:
            raise HTTPException(status_code=400, detail="Texts have no meaningful content after preprocessing")
            
        resume_tokens = len(resume_clean.split())
        job_tokens = len(job_clean.split())

        # Try LLM Matching
        llm_result = await llm_match_resume(payload.resume_text, payload.job_description)
        
        if llm_result:
            result_dict = {
                "match_score": llm_result["match_score"],
                "processed_resume_tokens": resume_tokens,
                "processed_job_tokens": job_tokens,
                "matched_keywords": llm_result["matched_keywords"],
                "missing_keywords": llm_result["missing_keywords"],
                "suggestions": llm_result["suggestions"],
                "used_llm": True
            }
        else:
            # Fallback to ML Model
            resume_vec = vectorizer.transform([resume_clean])
            job_vec = vectorizer.transform([job_clean])
            score = compute_similarity(resume_vec, job_vec)
            result_dict = {
                "match_score": score,
                "processed_resume_tokens": resume_tokens,
                "processed_job_tokens": job_tokens,
                "used_llm": False
            }
            
        # Save to cache
        await set_cache(cache_key, result_dict, expire_secs=86400) # 24 hours
        
        result_dict["is_cached"] = False
        return MatchResponse(**result_dict)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing match: {str(e)}")


@router.post("/admin/retrain", response_model=RetrainResponse)
def retrain_model(admin_token: str = Depends(verify_admin_token)):
    """
    Admin endpoint to retrain the vectorizer model.
    Requires X-Admin-Token header for authentication.
    """
    try:
        import sys
        from pathlib import Path as PathLib
        # Add project root to path if not already there
        project_root = PathLib(__file__).resolve().parents[3]
        if str(project_root) not in sys.path:
            sys.path.insert(0, str(project_root))
        
        from ml.train_vectorizer import (
            load_corpus_from_data_folder,
            DEFAULT_CORPUS,
            ARTIFACT_DIR,
            VECTOR_PATH,
            META_PATH
        )
        from app.core.dependencies import set_vectorizer
        
        # Ensure artifact directory exists
        ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
        
        # 1) Load corpus
        corpus = load_corpus_from_data_folder()
        if not corpus:
            corpus = DEFAULT_CORPUS
        
        if len(corpus) < 2:
            raise HTTPException(
                status_code=400, 
                detail="Need at least 2 documents to train. Add more data to data/processed/"
            )

        # 2) Train new vectorizer
        tv = TextVectorizer()
        tv.fit_transform(corpus)

        # 3) Save artifact and metadata
        tv.save(str(VECTOR_PATH))
        
        version = f"v{datetime.now().strftime('%Y%m%d%H%M%S')}"
        trained_at = datetime.now().isoformat() + "Z"
        meta = {
            "version": version,
            "created_at": trained_at,
            "num_docs": len(corpus)
        }
        META_PATH.write_text(json.dumps(meta, indent=2), encoding="utf-8")
        
        # 4) Load new model into memory (hot reload)
        tv_new = TextVectorizer()
        tv_new.load(str(VECTOR_PATH))
        set_vectorizer(tv_new)
        
        return RetrainResponse(
            status="success",
            message="Model retrained and reloaded successfully",
            version=version,
            num_docs=len(corpus),
            trained_at=trained_at
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retraining model: {str(e)}")


@router.post("/upload/resume", response_model=FileUploadResponse)
async def upload_resume(file: UploadFile = File(...)):
    """
    Upload a PDF resume and extract text.
    Supports PDF files up to 10MB.
    """
    # Validate file type
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    # Read file
    contents = await file.read()
    
    # Validate size (10MB max)
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max size is 10MB")
    
    try:
        # Extract text and metadata
        text, metadata = parse_resume_pdf(contents)
        
        return FileUploadResponse(
            filename=file.filename,
            size_bytes=len(contents),
            extracted_text_length=len(text),
            metadata=metadata
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


@router.post("/upload/match", response_model=MatchResponse)
@limiter.limit("20/minute")
async def upload_and_match(
    request: Request,
    resume_file: UploadFile = File(...),
    job_description: str = None,
    vectorizer: TextVectorizer = Depends(get_vectorizer)
):
    """
    Upload a PDF resume and match against a job description.
    """
    if not resume_file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    if not job_description or len(job_description.strip()) < 10:
        raise HTTPException(status_code=400, detail="job_description is required (min 10 chars)")
    
    # Read and parse PDF
    contents = await resume_file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max size is 10MB")
    
    try:
        resume_text, _ = parse_resume_pdf(contents)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {str(e)}")
    
    # Generate cache key
    combined_text = resume_text + job_description
    cache_key = f"match_upload:{hashlib.sha256(combined_text.encode()).hexdigest()}"
    
    # Check cache
    cached_result = await get_cache(cache_key)
    if cached_result:
        cached_result['is_cached'] = True
        return MatchResponse(**cached_result)
    
    # Process matching
    try:
        resume_clean = process_text(resume_text)
        job_clean = process_text(job_description)
        
        if not resume_clean or not job_clean:
            raise HTTPException(status_code=400, detail="Texts have no meaningful content after preprocessing")
            
        resume_tokens = len(resume_clean.split())
        job_tokens = len(job_clean.split())

        # Try LLM Matching
        llm_result = await llm_match_resume(resume_text, job_description)
        
        if llm_result:
            result_dict = {
                "match_score": llm_result["match_score"],
                "processed_resume_tokens": resume_tokens,
                "processed_job_tokens": job_tokens,
                "matched_keywords": llm_result["matched_keywords"],
                "missing_keywords": llm_result["missing_keywords"],
                "suggestions": llm_result["suggestions"],
                "used_llm": True
            }
        else:
            resume_vec = vectorizer.transform([resume_clean])
            job_vec = vectorizer.transform([job_clean])
            score = compute_similarity(resume_vec, job_vec)
            result_dict = {
                "match_score": score,
                "processed_resume_tokens": resume_tokens,
                "processed_job_tokens": job_tokens,
                "used_llm": False
            }
            
        await set_cache(cache_key, result_dict, expire_secs=86400)
        
        result_dict["is_cached"] = False
        return MatchResponse(**result_dict)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing match: {str(e)}")


@router.post("/batch/match", response_model=BatchMatchResponse)
def batch_match(
    payload: BatchMatchRequest,
    vectorizer: TextVectorizer = Depends(get_vectorizer)
):
    """
    Process multiple resume-job pairs in parallel.
    Efficient for bulk processing.
    """
    if len(payload.resumes) != len(payload.job_descriptions):
        raise HTTPException(
            status_code=400,
            detail=f"Mismatch: {len(payload.resumes)} resumes vs {len(payload.job_descriptions)} jobs"
        )
    
    try:
        processor = BatchProcessor(max_workers=4)
        start_time = datetime.now()
        
        results = processor.process_batch(
            payload.resumes,
            payload.job_descriptions,
            vectorizer
        )
        
        elapsed = (datetime.now() - start_time).total_seconds()
        
        successful = sum(1 for r in results if r.get("success", False))
        failed = len(results) - successful
        
        return BatchMatchResponse(
            total_processed=len(results),
            successful=successful,
            failed=failed,
            results=results,
            processing_time_seconds=round(elapsed, 3)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch processing error: {str(e)}")


@router.post("/match/multi-job", response_model=MultiJobMatchResponse)
def match_to_multiple_jobs(
    payload: MultiJobMatchRequest,
    vectorizer: TextVectorizer = Depends(get_vectorizer)
):
    """
    Match a single resume against multiple job descriptions.
    Returns ranked matches (highest score first).
    """
    try:
        matcher = MultiJobMatcher()
        matches = matcher.match_resume_to_jobs(
            payload.resume_text,
            payload.job_descriptions,
            vectorizer,
            top_k=payload.top_k
        )
        
        return MultiJobMatchResponse(
            total_jobs=len(payload.job_descriptions),
            matches=matches
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing matches: {str(e)}")

app = FastAPI()

@app.get("/health", tags=["health"])
async def health_check():
    return {
        "status": "ok",
        "service": "ai-resume-analyzer",
        "version": "0.1.0"
    }
