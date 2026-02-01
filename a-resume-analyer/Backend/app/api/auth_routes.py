"""Authentication and Authorization Routes"""

from fastapi import APIRouter, HTTPException, Depends, status, Header
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db, User, Subscription
from app.core.auth import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_token,
    create_email_verification_token
)
from app.schemas.auth import UserSignup, UserLogin, TokenResponse, UserResponse, SubscriptionResponse
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["Authentication"])


def get_current_user(token: str, db: Session = Depends(get_db)) -> User:
    """Dependency to get current user from token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not token.startswith("Bearer "):
        raise credentials_exception
    
    token = token.split(" ")[1]
    token_data = verify_token(token)
    
    if token_data is None:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    
    return user


@router.post("/signup", response_model=TokenResponse)
def signup(payload: UserSignup, db: Session = Depends(get_db)):
    """User signup endpoint"""
    
    # Validate email format
    if not payload.email or "@" not in payload.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid email address"
        )
    
    # Validate password length
    if len(payload.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long"
        )
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Email '{payload.email}' is already registered. Please sign in or use a different email."
        )
    
    try:
        # Create new user
        user = User(
            email=payload.email.lower(),  # Store email in lowercase for consistency
            hashed_password=hash_password(payload.password),
            is_verified=False
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        # Create free subscription with 1 trial credit
        subscription = Subscription(
            user_id=user.id,
            plan="free",
            trial_used=False,
            remaining_credits=1
        )
        db.add(subscription)
        db.commit()
        
        logger.info(f"✅ New user registered: {user.email} (ID: {user.id})")
        
        # Generate tokens
        access_token = create_access_token(user.email)
        refresh_token = create_refresh_token(user.email)
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token
        )
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"❌ Error during signup: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating account. Please try again later."
        )


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    """User login endpoint"""
    
    # Validate inputs
    if not payload.email or not payload.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required"
        )
    
    # Find user by email (case-insensitive)
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials or create a new account."
        )
    
    # Verify password
    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials or create a new account."
        )
    
    # Generate tokens
    access_token = create_access_token(user.email)
    refresh_token = create_refresh_token(user.email)
    
    logger.info(f"✅ User logged in: {user.email} (ID: {user.id})")
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token
    )


@router.get("/me", response_model=UserResponse)
def get_current_user_info(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    """Get current user information"""
    
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    user = get_current_user(authorization, db)
    
    return UserResponse(
        id=user.id,
        email=user.email,
        is_verified=user.is_verified,
        created_at=user.created_at
    )


@router.get("/subscription", response_model=SubscriptionResponse)
def get_user_subscription(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    """Get user subscription details"""
    
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    user = get_current_user(authorization, db)
    subscription = db.query(Subscription).filter(Subscription.user_id == user.id).first()
    
    if not subscription:
        # Create default subscription if doesn't exist
        subscription = Subscription(
            user_id=user.id,
            plan="free",
            remaining_credits=1
        )
        db.add(subscription)
        db.commit()
    
    return SubscriptionResponse(
        plan=subscription.plan,
        trial_used=subscription.trial_used,
        remaining_credits=subscription.remaining_credits,
        expires_at=subscription.expires_at
    )


@router.post("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    """Verify user email"""
    
    token_data = verify_token(token)
    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    user = db.query(User).filter(User.email == token_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.is_verified = True
    db.commit()
    
    logger.info(f"✅ Email verified for user: {user.email}")
    
    return {"message": "Email verified successfully"}


@router.post("/request-email-verification")
def request_email_verification(email: str, db: Session = Depends(get_db)):
    """Request email verification token"""
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.is_verified:
        return {"message": "Email already verified"}
    
    verification_token = create_email_verification_token(email)
    
    # In a real application, send this token via email
    logger.info(f"📧 Email verification token generated for {email}")
    
    return {
        "message": "Verification token sent to email",
        "token": verification_token  # Return token for testing (remove in production)
    }
