from pydantic import BaseModel
from typing import List

class ResumeIn(BaseModel):
    name: str | None = None
    raw_text: str

class JobIn(BaseModel):
    title: str | None = None
    raw_text: str

class MatchOut(BaseModel):
    match_score: float

# Note: Right now routes use MatchRequest in routes.py; these schema files are for expansion later.
