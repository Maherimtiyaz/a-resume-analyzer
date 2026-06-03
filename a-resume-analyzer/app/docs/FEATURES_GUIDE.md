# 🎯 Complete Features Guide - AI Resume Analyzer

## 📚 Table of Contents

1. [PDF Parsing](#pdf-parsing)
2. [Batch Processing](#batch-processing)
3. [File Upload API](#file-upload-api)
4. [Multi-Job Matching](#multi-job-matching)
5. [Frontend Features](#frontend-features)
6. [API Endpoints Reference](#api-endpoints-reference)

---

## 📄 PDF Parsing

### Feature Overview

Upload PDF resumes and automatically extract text using multiple parsing strategies.

### Supported Features

- **Multiple Parsers**: Tries pdfplumber first, falls back to PyPDF2
- **Metadata Extraction**: Gets page count, author, title, etc.
- **Large File Support**: Up to 10MB files
- **Error Handling**: Clear error messages for corrupted PDFs

### Usage Examples

**Python:**
```python
from app.services.pdf_parser import parse_resume_pdf

# Parse PDF
with open('resume.pdf', 'rb') as f:
    pdf_bytes = f.read()
    text, metadata = parse_resume_pdf(pdf_bytes)

print(f"Extracted {len(text)} characters")
print(f"Pages: {metadata['num_pages']}")
```

**API:**
```bash
curl -X POST http://localhost:8000/api/upload/resume \
  -F "file=@resume.pdf"
```

**Response:**
```json
{
  "filename": "resume.pdf",
  "size_bytes": 45632,
  "extracted_text_length": 1250,
  "metadata": {
    "num_pages": 2,
    "title": "John Doe Resume",
    "author": "John Doe"
  }
}
```

---

## 🚀 Batch Processing

### Feature Overview

Process multiple resume-job pairs in parallel for efficient bulk screening.

### Performance

- **Parallel Processing**: Uses ThreadPoolExecutor
- **Configurable Workers**: Default 4 workers
- **Fast**: Process 100 pairs in ~5 seconds

### Usage Examples

**API:**
```bash
curl -X POST http://localhost:8000/api/batch/match \
  -H "Content-Type: application/json" \
  -d '{
    "resumes": [
      "Python developer with 5 years experience...",
      "Java engineer with Spring Boot expertise...",
      "Frontend developer skilled in React..."
    ],
    "job_descriptions": [
      "Looking for Python backend developer...",
      "Need Java developer for microservices...",
      "React developer wanted for SPA..."
    ]
  }'
```

**Response:**
```json
{
  "total_processed": 3,
  "successful": 3,
  "failed": 0,
  "processing_time_seconds": 1.234,
  "results": [
    {
      "index": 0,
      "success": true,
      "match_score": 0.875,
      "resume_tokens": 42,
      "job_tokens": 38
    },
    {
      "index": 1,
      "success": true,
      "match_score": 0.791,
      "resume_tokens": 38,
      "job_tokens": 35
    },
    {
      "index": 2,
      "success": true,
      "match_score": 0.823,
      "resume_tokens": 45,
      "job_tokens": 40
    }
  ]
}
```

**Python:**
```python
from app.services.batch_processor import BatchProcessor
from app.services.vectorizer import TextVectorizer

# Initialize
processor = BatchProcessor(max_workers=4)
vectorizer = TextVectorizer()
vectorizer.load("path/to/model.joblib")

# Process batch
resumes = ["resume1...", "resume2...", "resume3..."]
jobs = ["job1...", "job2...", "job3..."]

results = processor.process_batch(resumes, jobs, vectorizer)
```

---

## 📤 File Upload API

### Feature Overview

Upload PDF resumes and get instant matching results.

### Endpoints

#### 1. Upload Resume Only

```bash
POST /api/upload/resume
```

Extracts text and returns metadata.

#### 2. Upload and Match

```bash
POST /api/upload/match
```

Uploads PDF and matches against job description in one call.

### Usage Examples

**Upload and Match:**
```bash
curl -X POST http://localhost:8000/api/upload/match \
  -F "resume_file=@resume.pdf" \
  -F "job_description=Looking for Python developer with FastAPI experience..."
```

**Response:**
```json
{
  "match_score": 0.847,
  "processed_resume_tokens": 42,
  "processed_job_tokens": 38
}
```

### File Requirements

- **Format**: PDF only
- **Max Size**: 10MB
- **Content**: Must contain extractable text (not scanned images)

---

## 🎯 Multi-Job Matching

### Feature Overview

Match a single resume against multiple job descriptions and get ranked results.

### Use Cases

- Job seekers finding best matches
- Recruiters screening candidates
- Career counseling platforms

### Usage Examples

**API:**
```bash
curl -X POST http://localhost:8000/api/match/multi-job \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "Senior Python developer with 8 years experience in FastAPI, Django, machine learning...",
    "job_descriptions": [
      "Python backend developer needed for fintech startup...",
      "Senior ML engineer for AI research team...",
      "Full-stack developer with Python and React...",
      "DevOps engineer with Python automation skills..."
    ],
    "top_k": 3
  }'
```

**Response:**
```json
{
  "total_jobs": 4,
  "matches": [
    {
      "job_index": 1,
      "match_score": 0.891,
      "job_preview": "Senior ML engineer for AI research team..."
    },
    {
      "job_index": 0,
      "match_score": 0.845,
      "job_preview": "Python backend developer needed for fintech..."
    },
    {
      "job_index": 2,
      "match_score": 0.723,
      "job_preview": "Full-stack developer with Python and React..."
    }
  ]
}
```

**Python:**
```python
from app.services.batch_processor import MultiJobMatcher

matcher = MultiJobMatcher()

resume = "Python developer with ML experience..."
jobs = ["job1...", "job2...", "job3..."]

matches = matcher.match_resume_to_jobs(
    resume, 
    jobs, 
    vectorizer,
    top_k=5  # Return top 5 matches
)

for match in matches:
    print(f"Job {match['job_index']}: {match['match_score']}")
```

---

## 🎨 Frontend Features

### Modern React UI

Built with React 18, Vite, Tailwind CSS, and Framer Motion.

### Key Features

#### 1. **Glassmorphism Design**
- Modern glass effect with backdrop blur
- Dark theme optimized
- Smooth gradients and animations

#### 2. **Drag & Drop Upload**
- Drop PDF files anywhere
- Visual feedback on drag
- File validation and error messages

#### 3. **Real-time Results**
- Circular progress indicator
- Animated score reveal
- Color-coded results (green/yellow/red)

#### 4. **Smooth Animations**
- Page transitions with Framer Motion
- Hover effects on cards
- Loading states with spinners
- Success/error toasts

#### 5. **Responsive Design**
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly controls

#### 6. **Input Modes**
- **Text Mode**: Copy-paste resume and job description
- **Upload Mode**: Drag-drop PDF files

### UI Components

```jsx
// Usage example
import { MatchingInterface } from './components'

function App() {
  return <MatchingInterface onBack={() => {}} />
}
```

### Color Scheme

```css
/* Primary Colors */
--primary-500: #6366f1  /* Indigo */
--accent-500: #ec4899   /* Pink */

/* Dark Theme */
--dark-900: #0a0a0f     /* Background */
--dark-800: #13131a     /* Elevated */
--dark-700: #1a1a24     /* Cards */
```

### Animations

- **Gradient Animation**: Moving gradient backgrounds
- **Float Animation**: Subtle floating effect
- **Slide Up**: Content reveal animation
- **Shimmer**: Loading state animation

---

## 📡 API Endpoints Reference

### Health & Status

```
GET /api/health
```

Check API health and model status.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_version": "v20260119173000"
}
```

### Text Matching

```
POST /api/match
```

Match resume text against job description.

**Request:**
```json
{
  "resume_text": "string (min 10 chars)",
  "job_description": "string (min 10 chars)"
}
```

**Response:**
```json
{
  "match_score": 0.847,
  "processed_resume_tokens": 42,
  "processed_job_tokens": 38
}
```

### PDF Upload

```
POST /api/upload/resume
```

Upload and parse PDF resume.

**Request:**
- `file`: PDF file (multipart/form-data)

**Response:**
```json
{
  "filename": "resume.pdf",
  "size_bytes": 45632,
  "extracted_text_length": 1250,
  "metadata": {
    "num_pages": 2,
    "title": "Resume",
    "author": "John Doe"
  }
}
```

### Upload and Match

```
POST /api/upload/match
```

Upload PDF and match in one call.

**Request:**
- `resume_file`: PDF file (multipart/form-data)
- `job_description`: string (form field)

**Response:**
```json
{
  "match_score": 0.847,
  "processed_resume_tokens": 42,
  "processed_job_tokens": 38
}
```

### Batch Processing

```
POST /api/batch/match
```

Process multiple resume-job pairs.

**Request:**
```json
{
  "resumes": ["string", "string", ...],
  "job_descriptions": ["string", "string", ...]
}
```

**Response:**
```json
{
  "total_processed": 3,
  "successful": 3,
  "failed": 0,
  "processing_time_seconds": 1.234,
  "results": [...]
}
```

### Multi-Job Matching

```
POST /api/match/multi-job
```

Match one resume against multiple jobs.

**Request:**
```json
{
  "resume_text": "string",
  "job_descriptions": ["string", "string", ...],
  "top_k": 5
}
```

**Response:**
```json
{
  "total_jobs": 10,
  "matches": [
    {
      "job_index": 0,
      "match_score": 0.891,
      "job_preview": "..."
    }
  ]
}
```

### Admin - Retrain Model

```
POST /api/admin/retrain
```

Retrain the vectorizer model (requires admin token).

**Headers:**
```
X-Admin-Token: your-admin-token
```

**Response:**
```json
{
  "status": "success",
  "message": "Model retrained and reloaded successfully",
  "version": "v20260119173000",
  "num_docs": 5,
  "trained_at": "2026-01-19T17:30:00.000000Z"
}
```

---

## 🧪 Testing Features

### Run All Tests

```bash
pytest -v
```

### Test PDF Parsing

```bash
pytest tests/test_pdf_parser.py -v
```

### Test Batch Processing

```bash
pytest tests/test_batch_processor.py -v
```

### Test API Endpoints

```bash
pytest tests/test_api_endpoints.py -v
```

---

## 🎯 Feature Comparison

| Feature | Basic | Pro | Enterprise |
|---------|-------|-----|------------|
| Text Matching | ✅ | ✅ | ✅ |
| PDF Upload | ✅ | ✅ | ✅ |
| Batch Processing | ❌ | ✅ | ✅ |
| Multi-Job Match | ❌ | ✅ | ✅ |
| API Rate Limit | 10/min | 100/min | Unlimited |
| Concurrent Requests | 5 | 50 | Unlimited |
| Admin Access | ❌ | ❌ | ✅ |
| Priority Support | ❌ | ✅ | ✅ |

---

## 🚀 Coming Soon

- [ ] Resume skills extraction
- [ ] Job requirements parsing
- [ ] Candidate ranking dashboard
- [ ] Email notifications
- [ ] Webhook integrations
- [ ] REST API rate limiting
- [ ] GraphQL API
- [ ] Mobile app (React Native)

---

## 📞 Support

For feature requests or bug reports:
- GitHub Issues: [Link]
- Email: support@example.com
- Documentation: [Link]

---

**Enjoy using AI Resume Analyzer!** 🎉
