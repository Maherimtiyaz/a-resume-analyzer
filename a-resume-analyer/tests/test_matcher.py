# tests/test_matcher.py
import pytest
import numpy as np
from scipy.sparse import csr_matrix
from app.services.matcher import compute_similarity


class TestMatcher:
    def test_compute_similarity_identical(self):
        # Identical vectors should have similarity 1.0
        vec = csr_matrix([[1, 2, 3]])
        score = compute_similarity(vec, vec)
        assert score == 1.0
    
    def test_compute_similarity_orthogonal(self):
        # Orthogonal vectors should have similarity 0.0
        vec1 = csr_matrix([[1, 0, 0]])
        vec2 = csr_matrix([[0, 1, 0]])
        score = compute_similarity(vec1, vec2)
        assert score == 0.0
    
    def test_compute_similarity_similar(self):
        # Similar vectors should have score > 0 and < 1
        vec1 = csr_matrix([[1, 2, 3]])
        vec2 = csr_matrix([[1, 2, 2]])
        score = compute_similarity(vec1, vec2)
        assert 0.0 < score < 1.0
    
    def test_compute_similarity_range(self):
        # Score should be between 0 and 1
        vec1 = csr_matrix([[5, 10, 15]])
        vec2 = csr_matrix([[2, 4, 6]])
        score = compute_similarity(vec1, vec2)
        assert 0.0 <= score <= 1.0
    
    def test_compute_similarity_rounded(self):
        # Score should be rounded to 3 decimals
        vec1 = csr_matrix([[1, 2, 3]])
        vec2 = csr_matrix([[1, 2, 2.5]])
        score = compute_similarity(vec1, vec2)
        # Check it has at most 3 decimal places
        assert len(str(score).split('.')[-1]) <= 3
