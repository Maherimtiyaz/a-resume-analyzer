# app/ml/train_vectorizer.py
from pathlib import Path
from datetime import datetime
import json

from app.services.vectorizer import TextVectorizer

ARTIFACT_DIR = Path("app/ml/artifacts")
ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
VECTOR_PATH = ARTIFACT_DIR / "vectorizer.joblib"
META_PATH = ARTIFACT_DIR / "vectorizer_meta.json"

# Minimal training corpus fallback (if data/processed empty)
DEFAULT_CORPUS = [
    "python fastapi sql backend developer",
    "machine learning data scientist python pandas numpy",
    "frontend developer react javascript css html",
    "devops kubernetes docker cloud infrastructure",
    "data engineer spark hive aws bigdata",
]

def load_corpus_from_data_folder():
    data_dir = Path("data/processed")
    texts = []
    if data_dir.exists() and data_dir.is_dir():
        for p in sorted(data_dir.glob("*.txt")):
            try:
                texts.append(p.read_text(encoding="utf-8"))
            except Exception:
                continue
    return texts

def main():
    # 1) Load corpus
    corpus = load_corpus_from_data_folder()
    if not corpus:
        corpus = DEFAULT_CORPUS

    # 2) Train vectorizer
    tv = TextVectorizer()
    tv.fit_transform(corpus)

    # 3) Save artifact and metadata
    tv.save(str(VECTOR_PATH))

    meta = {
        "version": f"v{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "created_at": datetime.now().isoformat() + "Z",
        "num_docs": len(corpus)
    }
    META_PATH.write_text(json.dumps(meta), encoding="utf-8")
    print("Saved vectorizer to:", VECTOR_PATH)
    print("Saved metadata to:", META_PATH)
    print("Meta:", meta)

if __name__ == "__main__":
    main()
