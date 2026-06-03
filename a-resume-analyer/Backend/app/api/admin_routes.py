from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.core.database import get_db, User, ResumeBuild, MatchHistory
from app.api.auth_routes import get_current_user
from app.core.limiter import limiter
from datetime import datetime, timedelta

router = APIRouter(prefix="/admin", tags=["Admin"])

def verify_admin(user: User = Depends(get_current_user)):
    """Dependency to check if user is admin"""
    if not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return user

@router.get("/stats")
@limiter.limit("30/minute")
def get_system_stats(request: Request, db: Session = Depends(get_db), current_admin: User = Depends(verify_admin)):
    """Get system usage statistics (Admin only)"""
    
    total_users = db.query(User).count()
    total_resumes = db.query(ResumeBuild).count()
    total_matches = db.query(MatchHistory).count()
    
    # Active users in last 24h (proxy by recent resumes or matches)
    yesterday = datetime.utcnow() - timedelta(days=1)
    recent_users = db.query(ResumeBuild.user_id).filter(ResumeBuild.created_at >= yesterday).distinct().count()
    
    return {
        "total_users": total_users,
        "total_resumes": total_resumes,
        "total_matches": total_matches,
        "active_users_24h": recent_users,
        "timestamp": datetime.utcnow().isoformat()
    }

@router.put("/users/{user_id}/role")
def update_user_role(user_id: int, is_admin: bool, db: Session = Depends(get_db), current_admin: User = Depends(verify_admin)):
    """Update user role (Admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.is_admin = is_admin
    db.commit()
    
    return {"message": f"User {user.email} admin status updated to {is_admin}"}
