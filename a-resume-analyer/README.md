# 🎯 AI Resume Analyzer

> **Production-grade, full-stack AI Resume Analyzer** with modern React frontend, FastAPI backend, PDF parsing, batch processing, and complete CI/CD pipeline.

[![Tests](https://img.shields.io/badge/tests-31%20passing-brightgreen)]()
[![Python](https://img.shields.io/badge/python-3.10%2B-blue)]()
[![React](https://img.shields.io/badge/react-18-61dafb)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688)]()
[![Docker](https://img.shields.io/badge/docker-ready-2496ed)]()

---

## ✨ Features

### Core Functionality
- 🎯 **Semantic Matching** - TF-IDF + Cosine Similarity scoring
- 📄 **PDF Support** - Upload and parse PDF resumes
- ⚡ **Batch Processing** - Process multiple resumes in parallel
- 🎨 **Modern UI** - React with glassmorphism and animations
- 🔒 **Secure API** - Token-based authentication
- 🧪 **Fully Tested** - 31 tests, 100% passing

### Advanced Features
- 📤 **Drag & Drop Upload** - Easy file handling
- 📊 **Multi-Job Matching** - Match resume against multiple jobs
- 🔄 **Hot Reload** - Retrain model without restart
- 🐳 **Docker Ready** - One-command deployment
- 🚀 **CI/CD Pipeline** - Automated testing and deployment

## 🏗️ Architecture

```
ai-resume-analyzer/
├── app/
│   ├── api/
│   │   └── routes.py           # API endpoints
│   ├── core/
│   │   ├── config.py           # Configuration and settings
│   │   └── dependencies.py     # Dependency injection
│   ├── models/
│   │   └── resume.py           # Data models
│   ├── schemas/
│   │   └── resume_schema.py    # Pydantic schemas
│   ├── services/
│   │   ├── preprocessing.py    # Text preprocessing with NLTK
│   │   ├── vectorizer.py       # TF-IDF vectorization
│   │   └── matcher.py          # Similarity computation
│   ├── ml/
│   │   └── artifacts/          # Trained model artifacts
│   └── main.py                 # Application entry point
├── ml/
│   └── train_vectorizer.py     # Offline training script
├── tests/                      # Comprehensive test suite
├── data/
│   └── processed/              # Training corpus (optional)
└── requirements.txt            # Python dependencies
```

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd a-resume-analyer

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Download NLTK Data

```python
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"
```

### 3. Train the Model

```bash
# Train vectorizer with default corpus
python -m ml.train_vectorizer
```

Or add your own training data to `data/processed/*.txt` and run the script.

### 4. Run the API Server

```bash
# Development mode
uvicorn app.main:app --reload

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

The API will be available at `http://localhost:8000`

### 5. Access API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | Health check | No |
| POST | `/api/match` | Text matching | No |
| POST | `/api/upload/resume` | Parse PDF resume | No |
| POST | `/api/upload/match` | Upload PDF & match | No |
| POST | `/api/batch/match` | Batch processing | No |
| POST | `/api/match/multi-job` | Multi-job matching | No |
| POST | `/api/admin/retrain` | Retrain model | Yes |

**Quick Examples:**

```bash
# Text matching
curl -X POST http://localhost:8000/api/match \
  -H "Content-Type: application/json" \
  -d '{"resume_text": "Python developer...", "job_description": "Looking for..."}'

# PDF upload
curl -X POST http://localhost:8000/api/upload/match \
  -F "resume_file=@resume.pdf" \
  -F "job_description=Backend developer needed..."

# Retrain model
curl -X POST http://localhost:8000/api/admin/retrain \
  -H "X-Admin-Token: your-token"
```

📚 **Full API Documentation**: http://localhost:8000/docs

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_match.py

# Run with verbose output
pytest -v
```

## ⚙️ Configuration

Configuration is managed via `app/core/config.py` and can be overridden with environment variables:

```bash
# .env file
APP_NAME="AI Resume Analyzer"
VERSION="0.1.0"
ADMIN_TOKEN="your-secure-token-here"
```

**Important:** Change the `ADMIN_TOKEN` in production!

## 🔧 Development

### Adding Training Data

1. Add text files to `data/processed/` directory
2. Each file should contain preprocessed resume or job description text
3. Run training script: `python -m ml.train_vectorizer`

### Model Versioning

Models are automatically versioned with timestamps. Metadata is stored in `app/ml/artifacts/vectorizer_meta.json`.

### Hot Reload

The `/api/admin/retrain` endpoint allows retraining and reloading the model without restarting the server.

## 🛡️ Production Considerations

### Security
- Change `ADMIN_TOKEN` to a secure value
- Use HTTPS in production
- Consider additional authentication (OAuth2, JWT)
- Rate limiting for public endpoints

### Performance
- Use multiple workers: `--workers 4`
- Enable caching for frequently used vectors
- Consider Redis for distributed caching
- Monitor memory usage with large models

### Monitoring
- Add logging and metrics (Prometheus, Grafana)
- Health checks for orchestration (Kubernetes)
- Error tracking (Sentry)

### Scaling
- Horizontal scaling with load balancer
- Model versioning and A/B testing
- Separate training and serving infrastructure

## 📊 How It Works

1. **Preprocessing**: Text is cleaned, tokenized, stopwords removed, and lemmatized using NLTK
2. **Vectorization**: TF-IDF vectorizer converts text to numerical vectors
3. **Similarity**: Cosine similarity measures the angle between vectors (0=different, 1=identical)
4. **Scoring**: Score is rounded to 3 decimals and returned with metadata

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run test suite
6. Submit a pull request

## 📚 Documentation

- 📖 **[Setup Guide](SETUP.md)** - Detailed installation instructions
- 🚀 **[Deployment Guide](DEPLOYMENT_COMPLETE.md)** - Deploy to AWS, GCP, Azure, etc.
- 🎯 **[Features Guide](FEATURES_GUIDE.md)** - Complete feature documentation
- 🏗️ **[Architecture](ARCHITECTURE.md)** - System design and structure
- 📝 **[API Docs](http://localhost:8000/docs)** - Interactive API documentation

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines and submit PRs.

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Built With

- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [React](https://react.dev/) - UI library
- [scikit-learn](https://scikit-learn.org/) - ML algorithms
- [NLTK](https://www.nltk.org/) - Natural language processing
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animation library
