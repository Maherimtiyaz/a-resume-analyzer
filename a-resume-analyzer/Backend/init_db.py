#!/usr/bin/env python3
"""
Database initialization script for Resume Analyzer
Supports both SQLite (dev) and PostgreSQL (prod)
"""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.Backend.app.core.database import engine, Base, User, Subscription


def init_database():
    """Initialize database with tables"""
    print("🗄️  Initializing database...")
    
    # Check DATABASE_URL
    database_url = os.getenv("DATABASE_URL", "sqlite:///./resume_analyzer.db")
    
    if database_url.startswith("postgresql"):
        print(f"📊 Using PostgreSQL: {database_url.split('@')[1] if '@' in database_url else 'checking...'}")
    else:
        print(f"📦 Using SQLite: {database_url}")
    
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        
        # Print table info
        print("\n📋 Created tables:")
        print("  - user (id, email, hashed_password, is_verified, created_at, updated_at)")
        print("  - subscription (id, user_id, plan, trial_used, remaining_credits, created_at, expires_at)")
        print("  - resume_build (id, user_id, template_name, resume_content, score, created_at, updated_at)")
        
        # Add unique constraint info
        print("\n🔐 Database constraints:")
        print("  - user.email: UNIQUE")
        print("  - user.email: NOT NULL")
        print("  - subscription.user_id: UNIQUE")
        
        print("\n✨ Database initialization complete!")
        print("\nNext steps:")
        print("1. Set environment variables (if using PostgreSQL):")
        print("   DATABASE_URL=postgresql://user:password@localhost:5432/resume_analyzer")
        print("2. Start the backend server:")
        print("   python run_server.py")
        print("3. Test authentication endpoints")
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        if "Connection refused" in str(e):
            print("\n⚠️  PostgreSQL connection failed!")
            print("Make sure PostgreSQL is running and DATABASE_URL is correct.")
        sys.exit(1)


if __name__ == "__main__":
    init_database()
