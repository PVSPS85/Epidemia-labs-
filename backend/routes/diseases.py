from fastapi import APIRouter, HTTPException
from typing import List
from models.disease import DiseaseResponse
from database import supabase

router = APIRouter()

@router.get("/", response_model=List[DiseaseResponse])
async def get_all_diseases():
    try:
        response = supabase.table("diseases").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{disease_id}", response_model=DiseaseResponse)
async def get_disease(disease_id: str):
    try:
        response = supabase.table("diseases").select("*").eq("id", disease_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Disease not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))