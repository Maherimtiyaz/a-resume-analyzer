from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
from datetime import datetime
import re


# ===== Authentication Schemas =====
class UserSignup(BaseModel):
    email: str  # Changed from EmailStr to str for flexibility
    password: str = Field(..., min_length=8, description="At least 8 characters")
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        """Basic email validation - allows any format with @"""
        if not v or '@' not in v:
            raise ValueError('Please provide a valid email address')
        # Basic regex for email validation
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, v):
            raise ValueError('Please provide a valid email address')
        return v.lower().strip()


class UserLogin(BaseModel):
    email: str  # Changed from EmailStr to str
    password: str
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        """Basic email validation"""
        if not v or '@' not in v:
            raise ValueError('Please provide a valid email address')
        return v.lower().strip()


class UserResponse(BaseModel):
    id: int
    email: str
    is_verified: bool
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class EmailVerificationRequest(BaseModel):
    email: str  # Changed from EmailStr
    token: str


# ===== Subscription Schemas =====
class SubscriptionResponse(BaseModel):
    plan: str
    trial_used: bool
    remaining_credits: int
    expires_at: Optional[datetime] = None


# ===== Resume Building Schemas =====
class ResumeSectionEducation(BaseModel):
    school: str
    degree: str
    field: str
    start_date: str
    end_date: str
    description: Optional[str] = None


class ResumeSectionExperience(BaseModel):
    company: str
    job_title: str
    start_date: str
    end_date: str
    description: str


class ResumeSectionSkills(BaseModel):
    skills: List[str]


class ResumeBuilderRequest(BaseModel):
    full_name: str
    email: str
    phone: str
    location: str
    
    summary: Optional[str] = None
    education: List[ResumeSectionEducation] = []
    experience: List[ResumeSectionExperience] = []
    skills: List[str] = []
    
    template: str = "ats-friendly-1"  # Template name


class ResumeGenerationResponse(BaseModel):
    resume_id: int
    template_used: str
    ats_score: float
    download_url: str
    preview_html: str


class ResumeTemplate(BaseModel):
    name: str
    display_name: str
    description: str
    ats_optimized: bool
    preview_image_url: Optional[str] = None


# ===== Matching Schemas =====
class JobMatchRequest(BaseModel):
    job_description: str
    resume_id: Optional[int] = None
    resume_text: Optional[str] = None


class JobMatchResponse(BaseModel):
    match_score: float
    missing_skills: List[str]
    matched_skills: List[str]
    suggestions: List[str]
