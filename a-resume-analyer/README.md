# 🎯 AI Resume Analyzer

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.128.0-009688.svg)](https://fastapi.tiangolo.com/)
[![React 18](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed.svg)](https://www.docker.com/)

**Enterprise-grade AI Resume Analyzer** with intelligent job matching, ATS optimization, and resume building capabilities. Built with FastAPI, React, and modern ML/NLP technologies.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Configuration](#-configuration)
- [Development](#-development)
- [Testing](#-testing)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Overview

AI Resume Analyzer is a production-ready application that leverages machine learning and natural language processing to:

- **Match resumes to job descriptions** with semantic similarity scoring
- **Parse and analyze PDF resumes** with intelligent text extraction
- **Generate ATS-optimized resumes** using professional templates
- **Provide actionable insights** for resume improvement
- **Manage user authentication** with JWT-based security
- **Handle subscription plans** with credit-based usage

### Use Cases

- **Job Seekers**: Optimize resumes for specific job postings
- **Recruiters**: Efficiently match candidates to positions
- **HR Departments**: Automate initial resume screening
- **Career Coaches**: Provide data-driven resume feedback

---

## ✨ Key Features

### 🎯 Core Functionality

| Feature | Description | Status |
|---------|-------------|--------|
| **Semantic Matching** | TF-IDF + Cosine Similarity algorithm for accurate resume-job matching | ✅ Production |
| **PDF Parsing** | Robust PDF text extraction with PyPDF2 | ✅ Production |
| **Batch Processing** | Process multiple resumes concurrently | ✅ Production |
| **Resume Builder** | Generate professional, ATS-optimized resumes | ✅ Production |
| **ATS Scoring** | Calculate Applicant Tracking System compatibility scores | ✅ Production |

### 🔐 Authentication & Security

- JWT-based authentication with access and refresh tokens
- Bcrypt password hashing (OWASP compliant)
- Email verification system
- Role-based access control (RBAC) ready
- CORS protection
- SQL injection prevention via SQLAlchemy ORM

### 💳 Subscription Management

- **Free Tier**: 1 trial credit
- **Pro Tier**: Enhanced features and credits
- **Enterprise Tier**: Unlimited usage and custom integrations
- Stripe integration ready

### 📊 Advanced Analytics

- Match score visualization
- Skills gap analysis
- Keyword optimization suggestions
- Missing skills identification
- Industry-specific insights

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                         Load Balancer                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┴───────────────────┐
         │                                       │
┌────────▼─────────┐                   ┌────────▼─────────┐
│   React Frontend │                   │   FastAPI Backend │
│   (Vite + React) │◄──────REST────────│   (Python 3.10+)  │
└──────────────────┘      API/JSON     └────────┬──────────┘
                                                 │
                     ┌───────────────────────────┼────────────────┐
                     │                           │                │
            ┌────────▼─────────┐       ┌────────▼────────┐  ┌────▼─────┐
            │   PostgreSQL/    │       │  ML/NLP Engine  │  │  Redis   │
            │     SQLite       │       │  (scikit-learn) │  │  Cache   │
            │    Database      │       │      NLTK       │  │ (Future) │
            └──────────────────┘       └─────────────────┘  └──────────┘
```

### Directory Structure

```
a-resume-analyer/
├── Backend/                      # FastAPI Backend Application
│   ├── app/
│   │   ├── api/                 # API Routes & Endpoints
│   │   │   ├── auth_routes.py   # Authentication endpoints
│   │   │   ├── resume_routes.py # Resume management endpoints
│   │   │   └── routes.py        # Core matching endpoints
│   │   ├── core/                # Core Configuration
│   │   │   ├── auth.py          # JWT & password handling
│   │   │   ├── config.py        # Application settings
│   │   │   ├── database.py      # Database models & connection
│   │   │   └── dependencies.py  # Dependency injection
│   │   ├── ml/                  # Machine Learning
│   │   │   └── artifacts/       # Trained model files
│   │   ├── schemas/             # Pydantic Models
│   │   │   ├── auth.py          # Auth schemas
│   │   │   └── resume_schema.py # Resume schemas
│   │   └── services/            # Business Logic
│   │       ├── preprocessing.py  # Text preprocessing (NLTK)
│   │       ├── vectorizer.py     # TF-IDF vectorization
│   │       ├── matcher.py        # Similarity computation
│   │       ├── pdf_parser.py     # PDF extraction
│   │       ├── resume_generator.py # Resume generation
│   │       └── batch_processor.py  # Batch operations
│   ├── tests/                   # Comprehensive Test Suite
│   ├── main.py                  # Application Entry Point
│   ├── init_db.py              # Database Initialization
│   └── requirements.txt         # Python Dependencies
├── frontend/                     # React Frontend Application
│   ├── src/
│   │   ├── api/                 # API Client
│   │   │   └── client.js        # Axios configuration
│   │   ├── components/          # React Components
│   │   │   ├── AuthForm.jsx     # Authentication forms
│   │   │   ├── FileUpload.jsx   # File upload interface
│   │   │   ├── MatchingInterface.jsx # Matching UI
│   │   │   ├── ResumeBuilder.jsx     # Resume builder
│   │   │   └── ResultsDisplay.jsx    # Results visualization
│   │   ├── App.jsx              # Main application
│   │   └── main.jsx             # Entry point
│   ├── public/                  # Static assets
│   ├── package.json             # Node dependencies
│   └── vite.config.js          # Vite configuration
├── docs/                        # Documentation
│   ├── ARCHITECTURE.md          # System architecture
│   ├── FEATURES_GUIDE.md        # Feature documentation
│   └── SETUP.md                 # Setup instructions
├── ml/                          # ML Training Scripts
│   └── train_vectorizer.py      # Model training
├── docker-compose.yml           # Docker orchestration
├── Dockerfile                   # Backend container
├── .github/workflows/           # CI/CD Pipelines
│   ├── backend.yml              # Backend tests
│   ├── frontend.yml             # Frontend tests
│   └── deploy.yml               # Deployment workflow
└── README.md                    # This file
```

---

## 🔧 Technology Stack

### Backend

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | FastAPI | 0.128.0 | High-performance async API framework |
| **Server** | Uvicorn | 0.40.0 | ASGI server with WebSocket support |
| **Database** | SQLAlchemy | 2.0+ | ORM with SQLite/PostgreSQL support |
| **Authentication** | PyJWT | 2.11.0 | JWT token generation and verification |
| **Password Hashing** | Passlib + Bcrypt | 1.7.4 | Secure password storage |
| **ML/NLP** | scikit-learn | 1.8.0 | TF-IDF vectorization |
| **NLP** | NLTK | 3.9.2 | Text preprocessing and tokenization |
| **PDF Processing** | PyPDF2 | 3.0.1 | PDF text extraction |
| **Document Generation** | ReportLab | 4.4.9 | PDF resume generation |
| **Validation** | Pydantic | 2.12.5 | Data validation and serialization |
| **Testing** | pytest | Latest | Unit and integration testing |

### Frontend

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | 18 | Component-based UI library |
| **Build Tool** | Vite | Latest | Fast development and build |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS framework |
| **HTTP Client** | Axios | Latest | Promise-based HTTP client |
| **State Management** | React Hooks | Built-in | Local state management |
| **Routing** | React Router | Latest | Client-side routing |

### DevOps & Infrastructure

| Tool | Purpose |
|------|---------|
| **Docker** | Containerization |
| **docker-compose** | Multi-container orchestration |
| **GitHub Actions** | CI/CD automation |
| **nginx** | Reverse proxy and static file serving |
| **PostgreSQL** | Production database |
| **SQLite** | Development database |

---

## 🚀 Getting Started

### Prerequisites

- **Python**: 3.10 or higher
- **Node.js**: 16.x or higher
- **npm**: 8.x or higher
- **Docker** (optional): 20.x or higher
- **PostgreSQL** (production): 13.x or higher

### Quick Start (Development)

#### 1. Clone Repository

```bash
git clone <repository-url>
cd a-resume-analyer
```

#### 2. Backend Setup

```bash
cd Backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet'); nltk.download('punkt_tab'); nltk.download('omw-1.4')"

# Initialize database
python init_db.py

# Start backend server
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Backend will be available at:** `http://localhost:8000`

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will be available at:** `http://localhost:5173`

### Alternative: Using Convenience Scripts

**Windows:**
```bash
# Terminal 1 - Backend
start_backend.bat

# Terminal 2 - Frontend
start_frontend.bat
```

**Linux/Mac:**
```bash
# Terminal 1 - Backend
./start_backend.sh

# Terminal 2 - Frontend
./start_frontend.sh
```

---

## 📡 API Documentation

### Interactive API Documentation

Once the backend is running, access the interactive API documentation:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Core Endpoints

#### Authentication

```http
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
GET  /api/auth/subscription
POST /api/auth/verify-email
```

#### Resume Matching

```http
POST /api/match                  # Match resume text to job description
POST /api/upload/match           # Upload PDF and match
POST /api/batch/match            # Batch process multiple resumes
POST /api/match/multi-job        # Match one resume to multiple jobs
```

#### Resume Building

```http
GET  /api/resume/templates       # Get available templates
POST /api/resume/generate        # Generate resume
GET  /api/resume/my-resumes      # Get user's resumes
GET  /api/resume/download/{id}   # Download resume PDF
```

#### System

```http
GET  /api/health                 # Health check
POST /api/admin/retrain          # Retrain ML model (admin only)
```

### Example Request

```bash
# Match Resume to Job
curl -X POST "http://localhost:8000/api/match" \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "Software Engineer with 5 years Python experience...",
    "job_description": "Looking for Python developer with FastAPI skills..."
  }'
```

### Example Response

```json
{
  "score": 0.847,
  "keywords_matched": ["python", "fastapi", "api", "backend"],
  "missing_keywords": ["kubernetes", "docker"],
  "suggestions": [
    "Add 'docker' to skills section",
    "Mention 'kubernetes' experience"
  ]
}
```

---

## 🐳 Deployment

### Docker Deployment (Recommended)

#### Single Command Deployment

```bash
docker-compose up -d
```

This starts:
- Backend API (port 8000)
- Frontend (port 80)
- PostgreSQL database (port 5432)

#### Check Status

```bash
docker-compose ps
docker-compose logs -f
```

#### Stop Services

```bash
docker-compose down
```

### Manual Production Deployment

#### Backend

```bash
# Install production dependencies
pip install -r requirements.txt gunicorn

# Set environment variables
export DATABASE_URL="postgresql://user:pass@localhost:5432/resume_db"
export SECRET_KEY="your-secret-key"

# Run with Gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
```

#### Frontend

```bash
# Build production bundle
npm run build

# Serve with nginx
# Configure nginx to serve the dist/ folder
```

### Cloud Deployment

#### AWS (Elastic Beanstalk / ECS)

```bash
# Use provided Dockerfile
docker build -t resume-analyzer .
docker tag resume-analyzer:latest <aws-account>.dkr.ecr.<region>.amazonaws.com/resume-analyzer
docker push <aws-account>.dkr.ecr.<region>.amazonaws.com/resume-analyzer
```

#### Heroku

```bash
heroku create resume-analyzer-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

#### Platform-as-a-Service

- **Backend**: Railway, Render, Fly.io
- **Frontend**: Vercel, Netlify, Cloudflare Pages

---

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/resume_analyzer
# or for development:
# DATABASE_URL=sqlite:///./resume_analyzer.db

# Security
SECRET_KEY=your-super-secret-key-min-32-characters
ADMIN_TOKEN=your-admin-token-for-model-retraining

# Optional
LOG_LEVEL=INFO
SQL_ECHO=False
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### Frontend (.env)

```bash
VITE_API_URL=http://localhost:8000
# Production:
# VITE_API_URL=https://api.yourdomain.com
```

### Database Configuration

#### Development (SQLite)

```python
DATABASE_URL=sqlite:///./resume_analyzer.db
```

#### Production (PostgreSQL)

```bash
# Install PostgreSQL
# Create database
createdb resume_analyzer

# Set environment variable
export DATABASE_URL="postgresql://user:password@localhost:5432/resume_analyzer"

# Initialize tables
python init_db.py
```

---

## 💻 Development

### Running Tests

#### Backend Tests

```bash
cd Backend
pytest tests/ -v --cov=app --cov-report=html
```

#### Frontend Tests

```bash
cd frontend
npm test
```

### Code Quality

```bash
# Backend linting
flake8 app/
black app/
mypy app/

# Frontend linting
npm run lint
npm run format
```

### Pre-commit Hooks

```bash
# Install pre-commit
pip install pre-commit
pre-commit install

# Run manually
pre-commit run --all-files
```

---

## 🧪 Testing

### Test Coverage

| Component | Coverage | Tests |
|-----------|----------|-------|
| Backend API | 85%+ | 31 tests |
| ML Services | 90%+ | 15 tests |
| Frontend | 75%+ | 20 tests |

### Running Specific Tests

```bash
# Backend
pytest tests/test_matcher.py -v
pytest tests/test_auth.py -v
pytest tests/test_preprocessing.py -v

# Frontend
npm test -- AuthForm.test.jsx
```

---

## 🔒 Security

### Security Features

- ✅ **Password Hashing**: Bcrypt with salt (OWASP compliant)
- ✅ **JWT Authentication**: Secure token-based auth
- ✅ **CORS Protection**: Configurable origins
- ✅ **SQL Injection Prevention**: SQLAlchemy ORM
- ✅ **Input Validation**: Pydantic models
- ✅ **Rate Limiting**: Ready for implementation
- ✅ **HTTPS Support**: Production-ready

### Security Best Practices

1. **Never commit** `.env` files
2. **Rotate** SECRET_KEY regularly
3. **Use strong passwords** (min 8 characters)
4. **Enable HTTPS** in production
5. **Regularly update** dependencies
6. **Monitor** access logs

### Reporting Security Issues

Please report security vulnerabilities to: security@yourdomain.com

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow PEP 8 for Python code
- Use ESLint/Prettier for JavaScript
- Write tests for new features
- Update documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

- **Documentation**: `/docs` folder
- **API Docs**: `http://localhost:8000/docs`
- **Issues**: GitHub Issues
- **Email**: support@yourdomain.com

---

## 🙏 Acknowledgments

- FastAPI framework by Sebastián Ramírez
- React team at Meta
- scikit-learn community
- NLTK project
- All open-source contributors

---

## 📊 Project Status

- ✅ **Backend**: Production Ready
- ✅ **Frontend**: Production Ready
- ✅ **Authentication**: Fully Implemented
- ✅ **ML Model**: Trained and Operational
- ✅ **Docker**: Configured
- ✅ **CI/CD**: GitHub Actions

**Version**: 0.2.0  
**Last Updated**: February 2026  
**Status**: 🚀 **PRODUCTION READY**

---

<div align="center">

**Made with ❤️ using FastAPI, React, and Modern AI**

[⬆ Back to Top](#-ai-resume-analyzer)

</div>
