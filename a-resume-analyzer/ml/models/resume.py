from typing import List

class Resume:
    def __init__(self, name: str = "", skills: List[str] | None = None, experience_years: int = 0):
        self.name = name
        self.skills = skills or []
        self.experience_years = experience_years

    def summary(self) -> str:
        skills_str = ", ".join(self.skills)
        return f"Name: {self.name}\nSkills: {skills_str}\nExperience: {self.experience_years} years"

