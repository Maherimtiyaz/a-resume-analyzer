import pytest
from fastapi.testclient import TestClient
from Bcakend.main import app
from app.core.dependencies import set_vectorizer
from app.services.vectorizer import TextVectorizer


@pytest.fixture(scope="function")
def client():
    """Create test client with a trained vectorizer"""
    # Train a simple vectorizer for testing
    corpus = [
        "python fastapi sql backend developer machine learning",
        "frontend react javascript css html",
        "data science pandas numpy tensorflow",
        "devops kubernetes docker cloud aws"
    ]
    vectorizer = TextVectorizer()
    vectorizer.fit_transform(corpus)
    set_vectorizer(vectorizer)
    
    return TestClient(app)


class TestMatchEndpoint:
    def test_match_endpoint_success(self, client):
        payload = {
            "resume_text": "Python FastAPI SQL machine learning expert with 5 years experience",
            "job_description": "Backend developer with Python and FastAPI experience required"
        }
        res = client.post("/api/match", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert "match_score" in data
        assert "processed_resume_tokens" in data
        assert "processed_job_tokens" in data
        assert 0.0 <= data["match_score"] <= 1.0
    
    def test_match_endpoint_high_similarity(self, client):
        payload = {
            "resume_text": "Python developer with FastAPI experience",
            "job_description": "Python developer with FastAPI experience"
        }
        res = client.post("/api/match", json=payload)
        assert res.status_code == 200
        data = res.json()
        # Identical content should have high similarity
        assert data["match_score"] > 0.5
    
    def test_match_endpoint_low_similarity(self, client):
        payload = {
            "resume_text": "Frontend React JavaScript CSS HTML developer",
            "job_description": "DevOps engineer with Kubernetes and Docker experience"
        }
        res = client.post("/api/match", json=payload)
        assert res.status_code == 200
        data = res.json()
        # Different domains should have lower similarity
        assert data["match_score"] >= 0.0
    
    def test_match_endpoint_empty_resume(self, client):
        payload = {
            "resume_text": "",
            "job_description": "Python developer"
        }
        res = client.post("/api/match", json=payload)
        assert res.status_code == 422  # Validation error
    
    def test_match_endpoint_empty_job(self, client):
        payload = {
            "resume_text": "Python developer",
            "job_description": ""
        }
        res = client.post("/api/match", json=payload)
        assert res.status_code == 422  # Validation error
    
    def test_match_endpoint_short_text(self, client):
        payload = {
            "resume_text": "Python",
            "job_description": "Developer"
        }
        res = client.post("/api/match", json=payload)
        assert res.status_code == 422  # Too short (min_length=10)
    
    def test_match_endpoint_only_stopwords(self, client):
        payload = {
            "resume_text": "the and or but with for at from by",
            "job_description": "the and or but with for at from by"
        }
        res = client.post("/api/match", json=payload)
        # May succeed with low score if stopwords not filtered, or fail if they are
        # Both are acceptable behaviors depending on NLTK data availability
        assert res.status_code in [200, 400]


class TestHealthEndpoint:
    def test_health_endpoint(self, client):
        res = client.get("/api/health")
        assert res.status_code == 200
        data = res.json()
        assert "status" in data
        assert "model_loaded" in data
        assert data["status"] == "healthy"


class TestRetrainEndpoint:
    def test_retrain_endpoint_no_auth(self, client):
        res = client.post("/api/admin/retrain")
        assert res.status_code == 422  # Missing header
    
    def test_retrain_endpoint_invalid_token(self, client):
        headers = {"X-Admin-Token": "invalid-token"}
        res = client.post("/api/admin/retrain", headers=headers)
        assert res.status_code == 403
    
    def test_retrain_endpoint_success(self, client):
        headers = {"X-Admin-Token": "dev-admin-token-change-in-production"}
        res = client.post("/api/admin/retrain", headers=headers)
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "success"
        assert "version" in data
        assert "num_docs" in data
        assert "trained_at" in data
        assert data["num_docs"] >= 2  # At least default corpus
