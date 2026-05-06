from pydantic import BaseModel, field_validator

class StandupInput(BaseModel):
    yesterday: str
    today: str
    blockers: str

    @field_validator("yesterday", "today", "blockers")
    @classmethod
    def must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Field cannot be empty")
        return v.strip()

class StandupResponse(BaseModel):
    summary: str
    id: int | None = None
