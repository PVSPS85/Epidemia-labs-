from pydantic import BaseModel

class SimulationData(BaseModel):
    day: int
    susceptible: float
    infected: float
    recovered: float