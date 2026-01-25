# 🚀 Complete Deployment Guide - AI Resume Analyzer

## 📋 Table of Contents

1. [Quick Start with Docker](#quick-start-with-docker)
2. [Local Development Setup](#local-development-setup)
3. [CI/CD Pipeline](#cicd-pipeline)
4. [Cloud Deployment](#cloud-deployment)
5. [Environment Variables](#environment-variables)
6. [Monitoring & Logging](#monitoring--logging)
7. [Scaling & Performance](#scaling--performance)

---

## 🐳 Quick Start with Docker

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

### One-Command Deployment

```bash
# Clone repository
git clone <repository-url>
cd a-resume-analyer

# Create environment file
cp .env.example .env

# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

**Access:**
- Frontend: http://localhost
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Docker Commands

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild after code changes
docker-compose up -d --build
```

---

## 💻 Local Development Setup

### Backend Setup

```bash
# 1. Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# 2. Install dependencies
pip install -r requirements.txt

# 3. Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet'); nltk.download('omw-1.4')"

# 4. Train model
python -m ml.train_vectorizer

# 5. Run development server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:3000
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

**Automated on every push:**

1. **Backend Tests** - Pytest with coverage
2. **Frontend Tests** - ESLint and build
3. **Security Scanning** - Trivy vulnerability scanner
4. **Docker Build** - Build and push images (main branch only)
5. **Deployment** - Auto-deploy on main branch

### Setup GitHub Secrets

Navigate to **Settings → Secrets and variables → Actions** and add:

```
DOCKER_USERNAME=your_dockerhub_username
DOCKER_PASSWORD=your_dockerhub_password
ADMIN_TOKEN=your_secure_admin_token
```

### Workflow Files

- `.github/workflows/ci.yml` - Continuous Integration
- `.github/workflows/deploy.yml` - Deployment automation

### Branch Protection Rules

Recommended settings for `main` branch:
- ✅ Require pull request reviews
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Include administrators

---

## ☁️ Cloud Deployment

### Option 1: AWS (Elastic Beanstalk + S3)

**Backend (Elastic Beanstalk):**

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p docker ai-resume-analyzer

# Create environment
eb create production

# Deploy
eb deploy

# Open in browser
eb open
```

**Frontend (S3 + CloudFront):**

```bash
cd frontend

# Build
npm run build

# Deploy to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### Option 2: Google Cloud Platform (Cloud Run)

**Backend:**

```bash
# Build and push
gcloud builds submit --tag gcr.io/PROJECT_ID/ai-resume-analyzer

# Deploy
gcloud run deploy ai-resume-analyzer \
  --image gcr.io/PROJECT_ID/ai-resume-analyzer \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

**Frontend:**

```bash
cd frontend

# Deploy to Firebase Hosting
firebase deploy
```

### Option 3: Azure (Container Instances + Blob Storage)

**Backend:**

```bash
# Create container registry
az acr create --resource-group myResourceGroup --name myregistry --sku Basic

# Build and push
az acr build --registry myregistry --image ai-resume-analyzer:latest .

# Deploy
az container create \
  --resource-group myResourceGroup \
  --name ai-resume-analyzer \
  --image myregistry.azurecr.io/ai-resume-analyzer:latest \
  --dns-name-label ai-resume-analyzer \
  --ports 8000
```

### Option 4: DigitalOcean (App Platform)

```bash
# Install doctl
brew install doctl  # Mac

# Authenticate
doctl auth init

# Deploy via UI or spec file
doctl apps create --spec .do/app.yaml
```

### Option 5: Heroku

**Backend:**

```bash
# Login
heroku login

# Create app
heroku create ai-resume-analyzer

# Deploy
git push heroku main

# Scale
heroku ps:scale web=1
```

**Frontend:**

```bash
cd frontend

# Build
npm run build

# Deploy with Heroku Buildpack
heroku buildpacks:set heroku/nodejs
git push heroku main
```

### Option 6: Kubernetes (K8s)

```bash
# Apply configurations
kubectl apply -f k8s/

# Check status
kubectl get pods
kubectl get services

# Scale
kubectl scale deployment backend --replicas=3
```

---

## 🔐 Environment Variables

### Backend (.env)

```bash
# Application
APP_NAME="AI Resume Analyzer"
VERSION="0.1.0"

# Security
ADMIN_TOKEN="your-super-secure-token-here"

# Database (if using)
DATABASE_URL="postgresql://user:pass@localhost/dbname"

# Redis (for caching)
REDIS_URL="redis://localhost:6379"

# CORS
ALLOWED_ORIGINS="http://localhost:3000,https://yourdomain.com"

# Logging
LOG_LEVEL="INFO"
```

### Frontend (.env)

```bash
VITE_API_URL=https://api.yourdomain.com
VITE_GA_ID=your-google-analytics-id
```

---

## 📊 Monitoring & Logging

### Application Monitoring

**Option 1: Prometheus + Grafana**

```yaml
# docker-compose.yml addition
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
  
  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
```

**Option 2: Sentry (Error Tracking)**

```python
# Add to requirements.txt
sentry-sdk

# Configure in app/main.py
import sentry_sdk
sentry_sdk.init(dsn="your-sentry-dsn")
```

**Option 3: ELK Stack (Logging)**

```bash
# Elasticsearch, Logstash, Kibana
docker-compose -f docker-compose.elk.yml up -d
```

### Health Checks

```bash
# Backend health
curl http://localhost:8000/api/health

# Frontend health
curl http://localhost/

# Docker health status
docker-compose ps
```

---

## 📈 Scaling & Performance

### Horizontal Scaling

**Docker Swarm:**

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml ai-resume

# Scale services
docker service scale ai-resume_backend=3
```

**Kubernetes:**

```bash
# Scale deployment
kubectl scale deployment backend --replicas=5

# Autoscaling
kubectl autoscale deployment backend --cpu-percent=70 --min=2 --max=10
```

### Load Balancing

**Nginx Load Balancer:**

```nginx
upstream backend {
    least_conn;
    server backend1:8000;
    server backend2:8000;
    server backend3:8000;
}

server {
    listen 80;
    location /api {
        proxy_pass http://backend;
    }
}
```

### Caching Strategy

**Redis Caching:**

```python
# Add to requirements.txt
redis>=5.0.0

# Cache vectorizer results
import redis
cache = redis.Redis(host='redis', port=6379)
```

### Database Optimization

```sql
-- Add indexes for frequent queries
CREATE INDEX idx_match_score ON matches(match_score DESC);
CREATE INDEX idx_created_at ON matches(created_at DESC);
```

### CDN for Frontend

Use CloudFlare, AWS CloudFront, or Vercel for:
- Static asset caching
- Global edge distribution
- DDoS protection
- SSL/TLS termination

---

## 🔒 Security Best Practices

### 1. Environment Security

- ✅ Never commit `.env` files
- ✅ Use secret management (AWS Secrets Manager, Azure Key Vault)
- ✅ Rotate admin tokens regularly
- ✅ Use HTTPS in production

### 2. API Security

```python
# Add rate limiting
from slowapi import Limiter
limiter = Limiter(key_func=get_remote_address)

@router.post("/match")
@limiter.limit("10/minute")
async def match_resume():
    pass
```

### 3. Docker Security

- ✅ Use non-root users in containers
- ✅ Scan images for vulnerabilities
- ✅ Keep base images updated
- ✅ Use multi-stage builds

---

## 🧪 Testing in Production

### Smoke Tests

```bash
# Test all endpoints
curl http://your-domain.com/api/health
curl -X POST http://your-domain.com/api/match -d '{"resume_text":"...","job_description":"..."}'
```

### Load Testing

```bash
# Install Apache Bench
apt-get install apache2-utils

# Test
ab -n 1000 -c 10 http://your-domain.com/api/health
```

### Monitoring Dashboards

Set up dashboards for:
- Request rate (requests/second)
- Response time (p50, p95, p99)
- Error rate
- CPU/Memory usage
- Database connections

---

## 📞 Support & Maintenance

### Backup Strategy

```bash
# Backup model artifacts
tar -czf backup-$(date +%Y%m%d).tar.gz app/ml/artifacts/

# Backup database (if using)
pg_dump dbname > backup-$(date +%Y%m%d).sql
```

### Update Strategy

```bash
# 1. Pull latest changes
git pull origin main

# 2. Backup current state
docker-compose down
cp -r app/ml/artifacts/ backup/

# 3. Rebuild and deploy
docker-compose up -d --build

# 4. Verify health
docker-compose ps
curl http://localhost:8000/api/health
```

### Rollback Procedure

```bash
# Revert to previous version
git checkout previous-tag
docker-compose up -d --build

# Or use Docker image tag
docker pull username/ai-resume-analyzer:previous-tag
docker-compose up -d
```

---

## 🎯 Production Checklist

Before going live:

- [ ] Change default `ADMIN_TOKEN`
- [ ] Configure CORS for production domains
- [ ] Set up SSL/TLS certificates
- [ ] Configure monitoring and alerts
- [ ] Set up log aggregation
- [ ] Configure automatic backups
- [ ] Test disaster recovery
- [ ] Document runbook procedures
- [ ] Set up CI/CD pipelines
- [ ] Configure rate limiting
- [ ] Enable error tracking (Sentry)
- [ ] Set up uptime monitoring
- [ ] Configure CDN for frontend
- [ ] Optimize Docker images
- [ ] Set resource limits
- [ ] Configure firewall rules

---

## 🚀 Quick Deploy Commands

```bash
# Production deployment (Docker)
docker-compose -f docker-compose.prod.yml up -d

# Production deployment (Kubernetes)
kubectl apply -f k8s/production/

# Check deployment status
kubectl rollout status deployment/backend

# View production logs
kubectl logs -f deployment/backend
```

---

## 📚 Additional Resources

- [API Documentation](http://localhost:8000/docs)
- [Frontend README](frontend/README.md)
- [Architecture Diagram](docs/architecture.md)
- [Troubleshooting Guide](docs/troubleshooting.md)

---

**🎉 Your AI Resume Analyzer is now production-ready!**

For questions or issues, please open a GitHub issue or contact support.
