from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from models.simulation import SimulationData
from services.sir_model import generate_sir_data

router = APIRouter()

class SimulationRequest(BaseModel):
    population: int
    r0: float
    days: int = 100

@router.post("/run", response_model=List[SimulationData])
async def run_simulation(request: SimulationRequest):
    try:
        data = generate_sir_data(
            population=request.population,
            r0=request.r0,
            days=request.days
        )
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")
