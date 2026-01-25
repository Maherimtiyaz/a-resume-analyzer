# Setup Guide - AI Resume Analyzer

Complete setup instructions for development and production environments.

## Prerequisites

- Python 3.10 or higher
- pip (Python package manager)
- Git

## Development Setup

### Step 1: Clone and Setup Environment

```bash
# Clone repository
git clone <repository-url>
cd a-resume-analyer

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Windows CMD:
venv\Scripts\activate.bat

# Linux/Mac:
source venv/bin/activate
```

### Step 2: Install Dependencies

```bash
# Upgrade pip
python -m pip install --upgrade pip

# Install project dependencies
pip install -r requirements.txt
```

### Step 3: Download NLTK Data

NLTK requires additional data files for tokenization, stopwords, and lemmatization:

```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet'); nltk.download('omw-1.4')"
```

Or use the interactive downloader:

```python
python
>>> import nltk
>>> nltk.download()
# Download: punkt, stopwords, wordnet, omw-1.4
```

### Step 4: Create Data Directories

```bash
# Create necessary directories
mkdir -p data/processed
mkdir -p app/ml/artifacts
```

### Step 5: Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env and set your admin token
# ADMIN_TOKEN="your-secure-token-here"
```

### Step 6: Train Initial Model

```bash
# Train vectorizer with default corpus
python -m ml.train_vectorizer
```

**Expected output:**
```
Saved vectorizer to: app/ml/artifacts/vectorizer.joblib
Saved metadata to: app/ml/artifacts/vectorizer_meta.json
Meta: {'version': 'v20260119173000', 'created_at': '2026-01-19T17:30:00.000000Z', 'num_docs': 5}
```

### Step 7: Run the Application

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload --port 8000

# Or use the FastAPI CLI
fastapi dev app/main.py
```

### Step 8: Verify Installation

Open your browser and navigate to:
- API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/api/health

## Testing

```bash
# Run all tests
pytest

# Run with verbose output
pytest -v

# Run with coverage report
pytest --cov=app --cov-report=term-missing

# Run specific test file
pytest tests/test_match.py -v

# Run only integration tests
pytest tests/test_integration.py
```

## Production Setup

### Environment Configuration

1. **Set secure admin token:**
```bash
export ADMIN_TOKEN="your-very-secure-random-token"
```

2. **Configure logging:**
```python
# In app/main.py, adjust logging level
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### Running in Production

```bash
# With Uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

# With Gunicorn + Uvicorn workers
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Docker Deployment (Optional)

Create `Dockerfile`:

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"

COPY . .

# Train initial model
RUN python -m ml.train_vectorizer

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t ai-resume-analyzer .
docker run -p 8000:8000 -e ADMIN_TOKEN="your-token" ai-resume-analyzer
```

## Custom Training Data

### Option 1: Add Files to data/processed/

1. Create `.txt` files in `data/processed/` directory
2. Each file should contain resume or job description text
3. Run training: `python -m ml.train_vectorizer`

### Option 2: Use the API

```bash
# Retrain via API endpoint
curl -X POST http://localhost:8000/api/admin/retrain \
  -H "X-Admin-Token: your-token"
```

## Troubleshooting

### NLTK Data Not Found

**Error:** `LookupError: Resource 'tokenizers/punkt' not found`

**Solution:**
```bash
python -c "import nltk; nltk.download('punkt')"
```

### Model Not Found on Startup

**Warning:** `No pre-trained model found at app/ml/artifacts/vectorizer.joblib`

**Solution:**
```bash
python -m ml.train_vectorizer
```

### Import Errors

**Error:** `ModuleNotFoundError: No module named 'app'`

**Solution:** Ensure you're running commands from the project root directory.

### Pydantic Import Error

**Error:** `ImportError: cannot import name 'BaseSettings' from 'pydantic'`

**Solution:** Update to pydantic-settings:
```bash
pip install pydantic-settings
```

## API Usage Examples

### Health Check

```bash
curl http://localhost:8000/api/health
```

### Match Resume

```bash
curl -X POST http://localhost:8000/api/match \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "Python developer with 5 years of FastAPI and machine learning experience",
    "job_description": "Looking for a backend developer with Python and FastAPI skills"
  }'
```

### Retrain Model

```bash
curl -X POST http://localhost:8000/api/admin/retrain \
  -H "X-Admin-Token: dev-admin-token-change-in-production"
```

## Performance Tuning

### Increase Workers

```bash
uvicorn app.main:app --workers 4
```

### Enable Caching (Future Enhancement)

Consider adding Redis for caching frequently used vectors.

### Optimize Model

- Adjust TF-IDF parameters in `app/services/vectorizer.py`
- Experiment with different preprocessing strategies
- Use larger training corpus for better vocabulary coverage

## Monitoring

### Basic Logging

All requests are logged via FastAPI's built-in logging.

### Health Checks

Use `/api/health` for Kubernetes liveness/readiness probes:

```yaml
livenessProbe:
  httpGet:
    path: /api/health
    port: 8000
  initialDelaySeconds: 10
  periodSeconds: 30
```

## Next Steps

1. ✅ Complete basic setup
2. ✅ Train initial model
3. ✅ Test API endpoints
4. 📚 Add more training data
5. 🔒 Configure production security
6. 📊 Set up monitoring
7. 🚀 Deploy to production

## Support

For issues and questions:
- Check troubleshooting section
- Review test files for usage examples
- Check API documentation at `/docs`
