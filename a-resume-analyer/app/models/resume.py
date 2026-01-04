class Resume:
    def __init__(self, name: str, skills: list[str], experience: int):
        self.name = name
        self.skills = skills
        self.experience = experience

    def summary(self) -> str:
        skills_str = ', '.join(self.skills)
        return (
            f"Resume Summary:\n"
            f"Name: {self.name}\n"
            f"Skills: {', '.join(self.skills)}\n"
            f"Experience: {self.experience} years"
        )