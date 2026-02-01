from sklearn.feature_extraction.text import TfidfVectorizer
from typing import List

class TextVectorizer:
    def __init__(self, **kwargs):
        # keep default params simple; override later for experiments
        self.vectorizer = TfidfVectorizer(**kwargs)

    def fit_transform(self, documents: List[str]):
        return self.vectorizer.fit_transform(documents)

    def transform(self, documents: List[str]):
        return self.vectorizer.transform(documents)

    def save(self, path: str):
        import joblib
        joblib.dump(self.vectorizer, path)

    def load(self, path: str):
        import joblib
        self.vectorizer = joblib.load(path)
        return self.vectorizer
