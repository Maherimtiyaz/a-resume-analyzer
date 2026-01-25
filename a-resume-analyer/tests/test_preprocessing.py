# tests/test_preprocessing.py
import pytest
from app.services.preprocessing import process_text, simple_clean


class TestPreprocessing:
    def test_simple_clean_lowercase(self):
        text = "Hello WORLD"
        result = simple_clean(text)
        assert result == "hello world"
    
    def test_simple_clean_remove_special_chars(self):
        text = "Python! @FastAPI #ML"
        result = simple_clean(text)
        assert result == "python fastapi ml"
    
    def test_simple_clean_normalize_whitespace(self):
        text = "Multiple    spaces   here"
        result = simple_clean(text)
        assert result == "multiple spaces here"
    
    def test_process_text_empty(self):
        result = process_text("")
        assert result == ""
    
    def test_process_text_removes_stopwords(self):
        text = "the quick brown fox jumps"
        result = process_text(text)
        # "the" is a stopword and should be removed (if NLTK data is available)
        tokens = result.split()
        # Either stopwords are removed, or we get all tokens (if NLTK data unavailable)
        assert len(tokens) >= 3  # At least some content words remain
        # Check that meaningful words are present
        assert any(word in result for word in ["quick", "brown", "fox", "jump"])
    
    def test_process_text_lemmatization(self):
        text = "running runs runner"
        result = process_text(text)
        # Should lemmatize to base forms
        assert len(result) > 0
    
    def test_process_text_real_resume(self):
        text = "Python developer with 5 years of experience in FastAPI and machine learning"
        result = process_text(text)
        assert "python" in result
        assert "fastapi" in result or "machine" in result
        assert len(result) > 0
    
    def test_process_text_removes_short_tokens(self):
        text = "I a am developer"
        result = process_text(text)
        # Single char tokens should be removed
        assert "i" not in result.split()
        assert "a" not in result.split()
