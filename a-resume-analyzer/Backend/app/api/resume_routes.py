"""Resume Building and Generation Routes"""

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.core.database import get_db, User, Subscription, ResumeBuild
from app.api.auth_routes import get_current_user
from app.schemas.auth import ResumeBuilderRequest, ResumeGenerationResponse, ResumeTemplate
from app.services.resume_generator import (
    generate_ats_score,
    generate_resume_html,
    generate_resume_pdf,
    get_available_templates,
    TEMPLATES
)
import json
import logging
from datetime import datetime

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/resume", tags=["Resume Builder"])


@router.get("/templates", response_model=list[ResumeTemplate])
def list_resume_templates():
    """Get available resume templates"""
    templates = get_available_templates()
    return [ResumeTemplate(**t) for t in templates]


@router.post("/generate", response_model=ResumeGenerationResponse)
def generate_resume(
    payload: ResumeBuilderRequest,
    authorization: str = None,
    db: Session = Depends(get_db)
):
    """Generate a new resume"""
    
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    try:
        user = get_current_user(authorization, db)
    except HTTPException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    # Check subscription credits
    subscription = db.query(Subscription).filter(Subscription.user_id == user.id).first()
    if not subscription or subscription.remaining_credits <= 0:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="No credits available. Please upgrade your subscription."
        )
    
    # Validate template
    if payload.template not in TEMPLATES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid template. Available: {list(TEMPLATES.keys())}"
        )
    
    try:
        # Prepare resume data
        resume_data = {
            "full_name": payload.full_name,
            "email": payload.email,
            "phone": payload.phone,
            "location": payload.location,
            "summary": payload.summary,
            "experience": [e.dict() for e in payload.experience],
            "education": [e.dict() for e in payload.education],
            "skills": payload.skills
        }
        
        # Calculate ATS score
        ats_score = generate_ats_score(resume_data)
        
        # Generate HTML and PDF
        html_content = generate_resume_html(resume_data, payload.template)
        pdf_bytes = generate_resume_pdf(resume_data, payload.template)
        
        # Save resume build to database
        resume_build = ResumeBuild(
            user_id=user.id,
            template_name=payload.template,
            resume_content=json.dumps(resume_data),
            score=ats_score
        )
        db.add(resume_build)
        db.commit()
        db.refresh(resume_build)
        
        # Deduct credit from subscription
        subscription.remaining_credits -= 1
        if not subscription.trial_used:
            subscription.trial_used = True
        db.commit()
        
        logger.info(f"✅ Resume generated for user {user.email} with ATS score {ats_score}")
        
        # Save PDF to file system (in real app, use cloud storage)
        filename = f"resume_{resume_build.id}_{user.id}.pdf"
        with open(f"data/resumes/{filename}", "wb") as f:
            f.write(pdf_bytes)
        
        return ResumeGenerationResponse(
            resume_id=resume_build.id,
            template_used=payload.template,
            ats_score=ats_score,
            download_url=f"/api/resume/download/{resume_build.id}",
            preview_html=html_content
        )
    
    except Exception as e:
        logger.error(f"❌ Error generating resume: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error generating resume"
        )


@router.get("/download/{resume_id}")
def download_resume(
    resume_id: int,
    authorization: str = None,
    db: Session = Depends(get_db)
):
    """Download generated resume as PDF"""
    
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    try:
        user = get_current_user(authorization, db)
    except HTTPException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    # Get resume and verify ownership
    resume = db.query(ResumeBuild).filter(
        ResumeBuild.id == resume_id,
        ResumeBuild.user_id == user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    try:
        # Regenerate PDF from stored content
        resume_data = json.loads(resume.resume_content)
        pdf_bytes = generate_resume_pdf(resume_data, resume.template_name)
        
        filename = f"resume_{user.email.split('@')[0]}_{datetime.now().strftime('%Y%m%d')}.pdf"
        
        return FileResponse(
            filename=filename,
            media_type="application/pdf",
            content=pdf_bytes
        )
    except Exception as e:
        logger.error(f"❌ Error downloading resume: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error downloading resume"
        )


@router.get("/my-resumes")
def get_user_resumes(authorization: str = None, db: Session = Depends(get_db)):
    """Get all resumes for current user"""
    
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    try:
        user = get_current_user(authorization, db)
    except HTTPException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    resumes = db.query(ResumeBuild).filter(ResumeBuild.user_id == user.id).all()
    
    return [
        {
            "id": r.id,
            "template": r.template_name,
            "ats_score": r.score,
            "created_at": r.created_at,
            "updated_at": r.updated_at
        }
        for r in resumes
    ]


@router.get("/preview/{resume_id}")
def preview_resume(
    resume_id: int,
    authorization: str = None,
    db: Session = Depends(get_db)
):
    """Get HTML preview of resume"""
    
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    try:
        user = get_current_user(authorization, db)
    except HTTPException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    resume = db.query(ResumeBuild).filter(
        ResumeBuild.id == resume_id,
        ResumeBuild.user_id == user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    resume_data = json.loads(resume.resume_content)
    html_content = generate_resume_html(resume_data, resume.template_name)
    
    return {
        "resume_id": resume.id,
        "html": html_content,
        "ats_score": resume.score
    }
