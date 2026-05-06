from fastapi import APIRouter, HTTPException
from typing import List, Optional
from models.publication import PublicationBase, PublicationResponse
from database import supabase

router = APIRouter()

@router.get("/", response_model=List[PublicationResponse])
async def get_publications(disease: Optional[str] = None):
    try:
        query = supabase.table("publications").select("*")
        if disease:
            query = query.eq("disease_name", disease)
            
        response = query.execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=PublicationResponse)
async def create_publication(publication: PublicationBase):
    try:
        data = publication.model_dump()
        response = supabase.table("publications").insert(data).execute()
        
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to create publication")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
