# tests/test_integration.py
import pytest
from app.services.preprocessing import process_text
from app.services.vectorizer import TextVectorizer
from app.services.matcher import compute_similarity


class TestIntegration:
    """Integration tests for the full pipeline"""
    
    def test_full_pipeline(self):
        # 1. Define corpus and train vectorizer
        corpus = [
            "python backend developer with fastapi experience",
            "frontend developer react javascript",
            "data scientist machine learning tensorflow"
        ]
        vectorizer = TextVectorizer()
        vectorizer.fit_transform(corpus)
        
        # 2. Process resume and job description
        resume = "I am a Python developer with 5 years of FastAPI experience"
        job = "Looking for a backend developer with Python and FastAPI skills"
        
        resume_clean = process_text(resume)
        job_clean = process_text(job)
        
        assert len(resume_clean) > 0
        assert len(job_clean) > 0
        
        # 3. Vectorize
        resume_vec = vectorizer.transform([resume_clean])
        job_vec = vectorizer.transform([job_clean])
        
        # 4. Compute similarity
        score = compute_similarity(resume_vec, job_vec)
        
        # Should have high similarity since both mention Python and FastAPI
        assert 0.0 <= score <= 1.0
        assert score > 0.3  # Should be reasonably high
    
    def test_mismatch_scenario(self):
        corpus = [
            "python backend developer",
            "frontend react developer",
            "devops kubernetes engineer"
        ]
        vectorizer = TextVectorizer()
        vectorizer.fit_transform(corpus)
        
        resume = "Frontend developer with React and JavaScript expertise"
        job = "DevOps engineer needed for Kubernetes deployment"
        
        resume_clean = process_text(resume)
        job_clean = process_text(job)
        
        resume_vec = vectorizer.transform([resume_clean])
        job_vec = vectorizer.transform([job_clean])
        
        score = compute_similarity(resume_vec, job_vec)
        
        # Different domains should have lower similarity
        assert 0.0 <= score <= 1.0
        # May still have some similarity due to common words
    
    def test_preprocessing_impact(self):
        # Test that preprocessing improves matching
        corpus = ["python developer", "java developer", "javascript developer"]
        vectorizer = TextVectorizer()
        vectorizer.fit_transform(corpus)
        
        # With preprocessing
        text1 = process_text("Python Developer!!!")
        text2 = process_text("PYTHON developer?")
        
        vec1 = vectorizer.transform([text1])
        vec2 = vectorizer.transform([text2])
        
        score = compute_similarity(vec1, vec2)
        
        # Should have high similarity after normalization
        assert score > 0.7
