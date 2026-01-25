# 🏗️ System Architecture - AI Resume Analyzer

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Data Flow](#data-flow)
6. [Technology Stack](#technology-stack)
7. [Design Patterns](#design-patterns)
8. [Security Architecture](#security-architecture)

---

## Overview

AI Resume Analyzer follows a **clean, modular, production-grade architecture** with clear separation between:
- **Presentation Layer** (React Frontend)
- **API Layer** (FastAPI Backend)
- **Business Logic** (Services)
- **Data Layer** (Model Persistence)

### Architecture Principles

✅ **Separation of Concerns** - Each module has a single responsibility
✅ **Dependency Injection** - Loose coupling between components
✅ **Testability** - All layers independently testable
✅ **Scalability** - Horizontal scaling ready
✅ **Security** - Authentication, validation, error handling
✅ **Performance** - Async operations, batch processing, caching ready

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Browser    │  │  Mobile App  │  │   Desktop    │    │
│  │  (React UI)  │  │   (Future)   │  │   (Future)   │    │
│  └──────┬───────┘  └──────────────┘  └──────────────┘    │
│         │                                                  │
└─────────┼──────────────────────────────────────────────────┘
          │
          │ HTTP/HTTPS
          │
┌─────────▼──────────────────────────────────────────────────┐
│                     API GATEWAY LAYER                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │              FastAPI Application                    │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │           CORS Middleware                     │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │         Authentication Middleware             │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │              API Routes                       │  │   │
│  │  │  /api/health                                  │  │   │
│  │  │  /api/match                                   │  │   │
│  │  │  /api/upload/resume                           │  │   │
│  │  │  /api/upload/match                            │  │   │
│  │  │  /api/batch/match                             │  │   │
│  │  │  /api/match/multi-job                         │  │   │
│  │  │  /api/admin/retrain                           │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  └─────────────────┬──────────────────────────────────┘   │
│                    │                                        │
└────────────────────┼────────────────────────────────────────┘
                     │
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   SERVICE LAYER                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │Preprocessing │  │  Vectorizer  │  │   Matcher    │    │
│  │   Service    │  │   Service    │  │   Service    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ PDF Parser   │  │    Batch     │  │  Multi-Job   │    │
│  │   Service    │  │  Processor   │  │   Matcher    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   DATA LAYER                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         ML Model Artifacts (Joblib)                   │  │
│  │  - vectorizer.joblib                                  │  │
│  │  - vectorizer_meta.json                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Training Corpus                             │  │
│  │  - data/processed/*.txt                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           NLTK Data                                   │  │
│  │  - punkt, stopwords, wordnet                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend Architecture

### Directory Structure

```
app/
├── api/
│   └── routes.py              # API endpoints (REST)
├── core/
│   ├── config.py              # Configuration management
│   └── dependencies.py        # Dependency injection
├── services/
│   ├── preprocessing.py       # Text preprocessing (NLTK)
│   ├── vectorizer.py          # TF-IDF vectorization
│   ├── matcher.py             # Cosine similarity
│   ├── pdf_parser.py          # PDF text extraction
│   └── batch_processor.py     # Parallel processing
├── models/
│   └── resume.py              # Data models
├── schemas/
│   └── resume_schema.py       # Pydantic schemas
├── ml/
│   └── artifacts/             # Trained models
└── main.py                    # Application entry point
```

### Layer Responsibilities

#### 1. **API Layer** (`app/api/`)
- **Responsibility**: HTTP request/response handling
- **Components**:
  - Route definitions
  - Request validation (Pydantic)
  - Response serialization
  - Error handling
- **Dependencies**: Services, Schemas

#### 2. **Service Layer** (`app/services/`)
- **Responsibility**: Business logic implementation
- **Components**:
  - Text preprocessing (NLTK)
  - TF-IDF vectorization
  - Similarity computation
  - PDF parsing
  - Batch processing
- **Dependencies**: Models, Core utilities

#### 3. **Core Layer** (`app/core/`)
- **Responsibility**: Application configuration and utilities
- **Components**:
  - Settings management
  - Dependency injection
  - Authentication
- **Dependencies**: None (base layer)

#### 4. **Data Layer** (`app/ml/`)
- **Responsibility**: Model persistence and training
- **Components**:
  - Model artifacts (Joblib)
  - Training scripts
  - Metadata storage
- **Dependencies**: Services

### Key Design Patterns

#### 1. **Dependency Injection**
```python
# Global vectorizer loaded on startup
def get_vectorizer():
    if _vectorizer is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return _vectorizer

# Used in routes
@router.post("/match")
def match_resume(vectorizer: TextVectorizer = Depends(get_vectorizer)):
    # Use injected vectorizer
    pass
```

#### 2. **Service Layer Pattern**
```python
# Services encapsulate business logic
class PDFParser:
    @staticmethod
    def extract_text_from_bytes(pdf_bytes: bytes) -> str:
        # Multiple strategies (pdfplumber, PyPDF2)
        pass

# Used by API
text = PDFParser.extract_text_from_bytes(file_bytes)
```

#### 3. **Repository Pattern** (Model Persistence)
```python
# Vectorizer handles its own persistence
class TextVectorizer:
    def save(self, path: str):
        joblib.dump(self.tfidf, path)
    
    def load(self, path: str):
        self.tfidf = joblib.load(path)
```

---

## Frontend Architecture

### Directory Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Navigation
│   │   ├── Hero.jsx             # Landing hero
│   │   ├── MatchingInterface.jsx # Main interface
│   │   ├── FileUpload.jsx       # PDF upload
│   │   ├── TextInput.jsx        # Text input
│   │   ├── ResultsDisplay.jsx   # Results visualization
│   │   ├── Features.jsx         # Features showcase
│   │   └── Footer.jsx           # Site footer
│   ├── api/
│   │   └── client.js            # API client (Axios)
│   ├── App.jsx                  # Main application
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── public/
├── index.html
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
└── package.json
```

### Component Architecture

```
App
├── Header (Always visible)
├── AnimatePresence (Route switching)
│   ├── Hero + Features (Landing page)
│   └── MatchingInterface (Analysis page)
│       ├── Mode Selector (Text vs Upload)
│       ├── Input Section
│       │   ├── TextInput (Text mode)
│       │   └── FileUpload (Upload mode)
│       └── ResultsDisplay (Right panel)
└── Footer (Always visible)
```

### State Management

**Local State** (useState):
- Component UI state
- Form inputs
- Loading states

**Props Drilling**:
- Simple parent-child communication
- Event handlers

**Future**: Consider Zustand or Redux for global state

### API Communication

```javascript
// Centralized API client
import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' }
})

export const api = {
  matchText: (resume, job) => apiClient.post('/api/match', { ... }),
  uploadResume: (file) => apiClient.post('/api/upload/resume', formData),
  // ... more methods
}
```

---

## Data Flow

### 1. Text Matching Flow

```
User Input (Resume + Job)
    ↓
Frontend (React)
    ↓ HTTP POST /api/match
FastAPI Route Handler
    ↓ Dependency Injection
Get Vectorizer (Pre-loaded)
    ↓
Preprocessing Service
    ↓ Clean, tokenize, lemmatize
Vectorizer Service
    ↓ Transform to TF-IDF vectors
Matcher Service
    ↓ Compute cosine similarity
Response (Score + Metadata)
    ↓
Frontend Display (Animated)
    ↓
User sees results
```

### 2. PDF Upload Flow

```
User Uploads PDF
    ↓
Frontend (Dropzone)
    ↓ FormData POST /api/upload/match
FastAPI Route Handler
    ↓
PDF Parser Service
    ↓ Extract text (pdfplumber/PyPDF2)
[Same as Text Matching Flow]
```

### 3. Batch Processing Flow

```
User Submits Multiple Pairs
    ↓
Frontend API Call
    ↓ POST /api/batch/match
FastAPI Route Handler
    ↓
Batch Processor Service
    ↓ ThreadPoolExecutor (4 workers)
    ├─ Worker 1: Process pair 1
    ├─ Worker 2: Process pair 2
    ├─ Worker 3: Process pair 3
    └─ Worker 4: Process pair 4
    ↓ Collect results
Response (All scores + metrics)
    ↓
Frontend Display
```

### 4. Model Training Flow

```
Admin Triggers Retrain
    ↓ POST /api/admin/retrain + Token
Verify Admin Token
    ↓
Load Training Corpus
    ↓
Train New Vectorizer (TF-IDF)
    ↓
Save Model (Joblib)
    ↓
Save Metadata (JSON)
    ↓
Hot Reload (Update Global Instance)
    ↓
Response (New version info)
```

---

## Technology Stack

### Backend

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Web Framework** | FastAPI | High-performance async API |
| **Validation** | Pydantic v2 | Data validation & serialization |
| **ML/NLP** | scikit-learn | TF-IDF vectorization |
| **NLP** | NLTK | Text preprocessing |
| **PDF** | PyPDF2 + pdfplumber | PDF text extraction |
| **Persistence** | Joblib | Model serialization |
| **Server** | Uvicorn | ASGI server |
| **Testing** | Pytest | Unit & integration tests |

### Frontend

| Layer | Technology | Purpose |
|-------|------------|---------|
| **UI Library** | React 18 | Component-based UI |
| **Build Tool** | Vite | Fast development & build |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Animations** | Framer Motion | Smooth animations |
| **HTTP Client** | Axios | API communication |
| **File Upload** | React Dropzone | Drag & drop files |
| **Icons** | Lucide React | Modern icon set |
| **Notifications** | React Hot Toast | Toast messages |

### DevOps

| Tool | Purpose |
|------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **GitHub Actions** | CI/CD pipeline |
| **Nginx** | Frontend web server |
| **Redis** | Caching (ready for use) |

---

## Design Patterns

### 1. **Singleton Pattern** (Model Loading)
```python
# Global vectorizer instance (loaded once)
_vectorizer = None

def set_vectorizer(vectorizer):
    global _vectorizer
    _vectorizer = vectorizer
```

### 2. **Strategy Pattern** (PDF Parsing)
```python
# Try multiple strategies
try:
    text = extract_with_pdfplumber(pdf_bytes)
except:
    text = extract_with_pypdf2(pdf_bytes)
```

### 3. **Facade Pattern** (API Client)
```javascript
// Simple interface hiding complexity
export const api = {
  matchText: (resume, job) => /* complex axios logic */,
  uploadResume: (file) => /* complex multipart logic */
}
```

### 4. **Dependency Injection** (FastAPI)
```python
@router.post("/match")
def match_resume(
    payload: MatchRequest,
    vectorizer: TextVectorizer = Depends(get_vectorizer)
):
    # Vectorizer injected automatically
    pass
```

### 5. **Factory Pattern** (Service Creation)
```python
# Services instantiated as needed
processor = BatchProcessor(max_workers=4)
matcher = MultiJobMatcher()
```

---

## Security Architecture

### 1. **Authentication**
- **Admin Endpoints**: Token-based (`X-Admin-Token` header)
- **Future**: OAuth2, JWT for user authentication

### 2. **Input Validation**
- **Pydantic Schemas**: Automatic validation
- **File Size Limits**: 10MB max
- **File Type Checks**: PDF only

### 3. **CORS Configuration**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 4. **Error Handling**
- **HTTP Exceptions**: Proper status codes
- **Sanitized Errors**: No stack traces in production
- **Logging**: All errors logged

### 5. **Rate Limiting** (Future)
```python
from slowapi import Limiter

@router.post("/match")
@limiter.limit("10/minute")
async def match_resume():
    pass
```

---

## Scalability Strategy

### Horizontal Scaling

```
Load Balancer (Nginx)
    ├── Backend Instance 1
    ├── Backend Instance 2
    └── Backend Instance 3
```

### Caching Layer (Redis)

```python
# Cache vectorizer results
cache_key = hashlib.md5(resume_text.encode()).hexdigest()
cached_result = redis.get(cache_key)
if cached_result:
    return cached_result
```

### Database (Future)

```
PostgreSQL
    ├── User accounts
    ├── Match history
    ├── Analytics data
    └── Audit logs
```

### Async Processing (Celery + Redis)

```python
# Background job for heavy processing
@celery.task
def process_large_batch(resumes, jobs):
    # Process asynchronously
    pass
```

---

## Performance Optimization

### Backend

1. **Startup Optimization**: Pre-load model on startup
2. **Async Endpoints**: Use `async def` for I/O operations
3. **Batch Processing**: Parallel execution with ThreadPoolExecutor
4. **Model Caching**: Keep vectorizer in memory

### Frontend

1. **Code Splitting**: Lazy load components
2. **Asset Optimization**: Vite optimization
3. **Image Optimization**: WebP format, lazy loading
4. **CDN**: CloudFlare for static assets

### Database (Future)

1. **Indexing**: Index frequently queried columns
2. **Connection Pooling**: Reuse database connections
3. **Query Optimization**: Use EXPLAIN ANALYZE

---

## Monitoring & Observability

### Logging Strategy

```python
import logging

logger = logging.getLogger(__name__)
logger.info("Model loaded successfully")
logger.error(f"Failed to parse PDF: {error}")
```

### Metrics (Future - Prometheus)

- Request rate
- Response time (p50, p95, p99)
- Error rate
- Model inference time
- Queue depth (batch processing)

### Health Checks

```python
@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": True,
        "model_version": "v20260119173000"
    }
```

---

## Deployment Architecture

### Development
```
localhost:8000 (Backend)
localhost:3000 (Frontend)
```

### Docker Compose
```
docker-compose.yml
    ├── backend (port 8000)
    ├── frontend (port 80)
    └── redis (port 6379)
```

### Production (Kubernetes)
```
Ingress (HTTPS)
    ├── Frontend (3 replicas)
    └── Backend (5 replicas)
        ├── Redis (1 replica)
        └── PostgreSQL (1 replica)
```

---

## Future Enhancements

### Short Term
- [ ] Add Redis caching
- [ ] Implement rate limiting
- [ ] Add user authentication
- [ ] Database for history

### Medium Term
- [ ] WebSocket for real-time updates
- [ ] GraphQL API
- [ ] Advanced analytics dashboard
- [ ] Email notifications

### Long Term
- [ ] Mobile app (React Native)
- [ ] Advanced NLP (BERT, GPT)
- [ ] Skills extraction
- [ ] Multi-language support

---

## Conclusion

This architecture provides:
- ✅ **Clean separation of concerns**
- ✅ **Scalability** (horizontal & vertical)
- ✅ **Maintainability** (modular design)
- ✅ **Testability** (dependency injection)
- ✅ **Security** (authentication, validation)
- ✅ **Performance** (async, caching, batch)
- ✅ **Production-ready** (monitoring, logging, health checks)

**Built for scale, designed for developers.** 🚀
