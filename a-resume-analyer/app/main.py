from fastapi import FastAPI
from app.models.resume import Resume
from app.utils.text_cleaner import clean_text

if __name__ == "__main__":
    raw_text = "   Hello, World!!!   "
    cleaned = clean_text(raw_text)
    print("Cleaned text:", cleaned)

    resume = Resume(
        name="John Doe",
        skills=["Python", "FastAPI", "SQL", "AI"],
        experience=3
    )

    print()
    print(resume.summary())

