import re
import string
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

# Try to import and download small NLTK data sets if not already present.
# If downloads fail in the environment, fall back to simple methods.

try:
    _ = nltk.data.find("tokenizers/punkt")
except Exception:
    try:
        nltk.download("punkt", quiet=True)
    except Exception:
        pass

try:
    _ = nltk.data.find("corpora/stopwords")
except Exception:
    try:
        nltk.download("stopwords", quiet=True)
    except Exception:
        pass

try:
    _ = nltk.data.find("corpora/wordnet")
except Exception:
    try:
        nltk.download("wordnet", quiet=True)
    except Exception:
        pass

from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize

# Initialize stopwords and lemmatizer
try:
    STOPWORDS = set(stopwords.words("english"))
except Exception:
    STOPWORDS = set()

LEMMATIZER = WordNetLemmatizer()


def simple_clean(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def process_text(text: str) -> str:
    """Preprocessing pipeline:
       - lowercase
       - remove non-alphanum characters
       - tokenize
       - remove stopwords
       - lemmatize
       - return joined string
    """
    if not text:
        return ""

    text = simple_clean(text)
    try:
        tokens = word_tokenize(text)
    except Exception:
        tokens = text.split()

    filtered = []
    for t in tokens:
        if t in STOPWORDS or len(t) <= 1:
            continue
        try:
            lemma = LEMMATIZER.lemmatize(t)
        except Exception:
            lemma = t
        filtered.append(lemma)

    return " ".join(filtered)
