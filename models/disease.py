from pydantic import BaseModel
from typing import List

class DiseaseBase(BaseModel):
    name: str
    description: str
    symptoms: List[str]
    transmission: str
    r0: float
    population: int

class DiseaseResponse(DiseaseBase):
    id: str