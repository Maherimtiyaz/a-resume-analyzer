# PostgreSQL Database Setup Guide

## Database Name: `resume_analyzer_db`

---

## 1. Create PostgreSQL Database

### Using psql (Command Line):
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE resume_analyzer_db;

-- Create user (optional, recommended for security)
CREATE USER resume_admin WITH PASSWORD 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE resume_analyzer_db TO resume_admin;

-- Connect to the database
\c resume_analyzer_db

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO resume_admin;
```

### Using pgAdmin (GUI):
1. Open pgAdmin
2. Right-click on "Databases" → "Create" → "Database"
3. Database name: `resume_analyzer_db`
4. Owner: `postgres` (or create new user)
5. Click "Save"

---

## 2. Database Schema (Industry-Level)

The application will automatically create these tables when you start the backend:

### `users` Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### `subscriptions` Table
```sql
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'free',
    trial_used BOOLEAN DEFAULT FALSE,
    remaining_credits INTEGER DEFAULT 1,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT plan_check CHECK (plan IN ('free', 'pro', 'enterprise'))
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_plan ON subscriptions(plan);
```

### `resume_builds` Table
```sql
CREATE TABLE resume_builds (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    template_name VARCHAR(100) NOT NULL,
    resume_content TEXT NOT NULL,
    score FLOAT,
    file_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resume_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_resume_builds_user_id ON resume_builds(user_id);
CREATE INDEX idx_resume_builds_created_at ON resume_builds(created_at);
```

### `match_history` Table (New - for tracking matches)
```sql
CREATE TABLE match_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    resume_id INTEGER,
    job_description_hash VARCHAR(64) NOT NULL,
    match_score FLOAT NOT NULL,
    matched_keywords TEXT[],
    missing_keywords TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_match_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_match_resume FOREIGN KEY (resume_id) REFERENCES resume_builds(id) ON DELETE SET NULL
);

CREATE INDEX idx_match_history_user_id ON match_history(user_id);
CREATE INDEX idx_match_history_created_at ON match_history(created_at);
```

### `email_verification_tokens` Table (New - for email verification)
```sql
CREATE TABLE email_verification_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_token_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_verification_tokens_token ON email_verification_tokens(token);
CREATE INDEX idx_verification_tokens_user_id ON email_verification_tokens(user_id);
```

---

## 3. Configure Backend Environment

### Create `.env` file in Backend directory:
```env
# Database Configuration
DATABASE_URL=postgresql://resume_admin:your_secure_password_here@localhost:5432/resume_analyzer_db

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production-min-32-chars
ADMIN_TOKEN=your-admin-token-for-model-retraining

# Application Settings
LOG_LEVEL=INFO
SQL_ECHO=False

# CORS Settings (Frontend URLs)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,https://yourdomain.com

# JWT Settings
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Email Settings (Optional - for production)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# Stripe Settings (Optional - for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Replace with your actual values:
```env
DATABASE_URL=postgresql://resume_admin:MySecurePass123!@localhost:5432/resume_analyzer_db
SECRET_KEY=09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7
ADMIN_TOKEN=admin_token_2026_secure
```

---

## 4. Initialize Database

### Option 1: Automatic (Recommended)
```bash
cd Backend
python init_db.py
```

### Option 2: Manual SQL
```sql
-- Run the SQL schema above manually
-- Then verify tables were created:
\dt
```

---

## 5. Verify Database Connection

```bash
cd Backend
python -c "from app.core.database import engine, SessionLocal; db = SessionLocal(); print('✅ Database connected!'); db.close()"
```

---

## 6. Connection String Format

### General Format:
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

### Examples:

**Local Development:**
```
postgresql://postgres:password@localhost:5432/resume_analyzer_db
```

**Production (with SSL):**
```
postgresql://user:pass@db.example.com:5432/resume_analyzer_db?sslmode=require
```

**Heroku Postgres:**
```
postgres://user:pass@ec2-xxx.compute-1.amazonaws.com:5432/dbname
```

**AWS RDS:**
```
postgresql://admin:pass@resume-db.xxxxx.us-east-1.rds.amazonaws.com:5432/resume_analyzer_db
```

---

## 7. Database Migrations (Future)

For production, use Alembic for database migrations:

```bash
# Install Alembic
pip install alembic

# Initialize migrations
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Initial schema"

# Apply migration
alembic upgrade head
```

---

## 8. Backup & Restore

### Backup:
```bash
pg_dump -U postgres -d resume_analyzer_db > backup_$(date +%Y%m%d).sql
```

### Restore:
```bash
psql -U postgres -d resume_analyzer_db < backup_20260201.sql
```

---

## 9. Production Checklist

- [ ] Create database with strong credentials
- [ ] Set up database user with limited privileges
- [ ] Configure SSL/TLS for database connections
- [ ] Set up automated backups
- [ ] Configure connection pooling
- [ ] Set up monitoring and alerts
- [ ] Enable query logging for debugging
- [ ] Configure firewall rules
- [ ] Set up replication (if needed)
- [ ] Document connection strings securely

---

## 10. Quick Start Summary

```bash
# 1. Create database
psql -U postgres -c "CREATE DATABASE resume_analyzer_db;"

# 2. Set environment variable
export DATABASE_URL="postgresql://postgres:password@localhost:5432/resume_analyzer_db"

# 3. Initialize tables
cd Backend
python init_db.py

# 4. Start backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000

# ✅ Done! Backend will use PostgreSQL
```

---

**Database Name:** `resume_analyzer_db`  
**Recommended User:** `resume_admin`  
**Tables:** 5 (users, subscriptions, resume_builds, match_history, email_verification_tokens)  
**Indexes:** 10+ for optimal performance
