import string

def clean_text(text):
    """
    Returns lowercase text, stripped, with punctuation removed
    """
    text = text.lower().strip()
    return text.translate(str.maketrans("", "", string.punctuation))
