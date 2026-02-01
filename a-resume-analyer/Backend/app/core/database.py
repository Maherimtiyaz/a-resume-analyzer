from sqlalchemy import create_engine, Column, String, Integer, Boolean, DateTime, Float, Text, ForeignKey, Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database URL - Support both SQLite and PostgreSQL
# SQLite for development: sqlite:///./resume_analyzer.db
# PostgreSQL for production: postgresql://user:password@localhost:5432/resume_analyzer_db

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./resume_analyzer.db"
)

print(f"📊 Using database: {DATABASE_URL.split('://')[0].upper()}")

# Create engine with appropriate settings
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=os.getenv("SQL_ECHO", "False").lower() == "true"
    )
else:  # PostgreSQL
    engine = create_engine(
        DATABASE_URL,
        echo=os.getenv("SQL_ECHO", "False").lower() == "true",
        pool_pre_ping=True,
        pool_recycle=3600,
        pool_size=10,
        max_overflow=20
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class User(Base):
    """User account table with email and authentication"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    subscription = relationship("Subscription", back_populates="user", uselist=False, cascade="all, delete-orphan")
    resumes = relationship("ResumeBuild", back_populates="user", cascade="all, delete-orphan")
    match_history = relationship("MatchHistory", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}')>"


class Subscription(Base):
    """User subscription and credits management"""
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False, index=True)
    plan = Column(String(50), default="free", nullable=False)  # free, pro, enterprise
    trial_used = Column(Boolean, default=False, nullable=False)
    remaining_credits = Column(Integer, default=1, nullable=False)  # Free trial = 1 credit
    stripe_customer_id = Column(String(255), nullable=True)
    stripe_subscription_id = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="subscription")
    
    def __repr__(self):
        return f"<Subscription(user_id={self.user_id}, plan='{self.plan}', credits={self.remaining_credits})>"


class ResumeBuild(Base):
    """User-generated resumes with templates and ATS scores"""
    __tablename__ = "resume_builds"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    template_name = Column(String(100), nullable=False)
    resume_content = Column(Text, nullable=False)  # JSON content of resume
    score = Column(Float, nullable=True)  # ATS score (0.0 to 1.0)
    file_path = Column(String(500), nullable=True)  # Path to generated PDF
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="resumes")
    
    # Indexes
    __table_args__ = (
        Index('idx_resume_user_created', 'user_id', 'created_at'),
    )
    
    def __repr__(self):
        return f"<ResumeBuild(id={self.id}, user_id={self.user_id}, template='{self.template_name}')>"


class MatchHistory(Base):
    """History of resume-job matching operations"""
    __tablename__ = "match_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    resume_id = Column(Integer, ForeignKey('resume_builds.id', ondelete='SET NULL'), nullable=True)
    job_description_hash = Column(String(64), nullable=False)  # SHA256 hash of job description
    match_score = Column(Float, nullable=False)  # Match score (0.0 to 1.0)
    matched_keywords = Column(Text, nullable=True)  # JSON array of matched keywords
    missing_keywords = Column(Text, nullable=True)  # JSON array of missing keywords
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="match_history")
    
    # Indexes
    __table_args__ = (
        Index('idx_match_user_created', 'user_id', 'created_at'),
    )
    
    def __repr__(self):
        return f"<MatchHistory(id={self.id}, user_id={self.user_id}, score={self.match_score})>"


# Database initialization function
def init_database():
    """Initialize database tables"""
    print("🔧 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
    
    # Print table names
    print(f"📊 Tables: {', '.join(Base.metadata.tables.keys())}")


# Create tables on import (for backward compatibility)
Base.metadata.create_all(bind=engine)


def get_db():
    """Database session dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
