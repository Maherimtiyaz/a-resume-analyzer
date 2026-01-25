# tests/test_vectorizer.py
import pytest
import tempfile
from pathlib import Path
from app.services.vectorizer import TextVectorizer


class TestVectorizer:
    def test_vectorizer_fit_transform(self):
        docs = ["python machine learning", "fastapi backend development"]
        vectorizer = TextVectorizer()
        vectors = vectorizer.fit_transform(docs)
        assert vectors.shape[0] == 2
        assert vectors.shape[1] > 0
    
    def test_vectorizer_transform(self):
        docs = ["python machine learning", "fastapi backend development"]
        vectorizer = TextVectorizer()
        vectorizer.fit_transform(docs)
        
        # Transform new document
        new_doc = ["python backend"]
        vector = vectorizer.transform(new_doc)
        assert vector.shape[0] == 1
        assert vector.shape[1] > 0
    
    def test_vectorizer_save_load(self):
        docs = ["python machine learning", "fastapi backend development"]
        vectorizer = TextVectorizer()
        vectorizer.fit_transform(docs)
        
        # Save and load
        with tempfile.NamedTemporaryFile(delete=False, suffix=".joblib") as f:
            temp_path = f.name
        
        try:
            vectorizer.save(temp_path)
            assert Path(temp_path).exists()
            
            # Load in new instance
            new_vectorizer = TextVectorizer()
            new_vectorizer.load(temp_path)
            
            # Test that loaded vectorizer works
            vector = new_vectorizer.transform(["python"])
            assert vector.shape[0] == 1
        finally:
            Path(temp_path).unlink(missing_ok=True)
    
    def test_vectorizer_empty_docs(self):
        docs = []
        vectorizer = TextVectorizer()
        with pytest.raises(Exception):
            vectorizer.fit_transform(docs)
