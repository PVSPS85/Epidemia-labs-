from pydantic import BaseModel, field_validator
from typing import List, Any
import json

class DiseaseBase(BaseModel):
    name: str
    description: str
    symptoms: List[str]
    transmission: str
    r0: float
    population: int

    @field_validator('symptoms', mode='before')
    @classmethod
    def parse_symptoms(cls, v: Any) -> List[str]:
        """Handle symptoms stored as JSON string in Supabase."""
        if isinstance(v, str):
            try:
                parsed = json.loads(v)
                if isinstance(parsed, list):
                    return parsed
            except (json.JSONDecodeError, TypeError):
                return [v]
        if isinstance(v, list):
            return v
        return []

class DiseaseResponse(DiseaseBase):
    id: str