from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from services.map_service import generate_heatmap_geojson

router = APIRouter()

@router.get("/heatmap/{disease_name}", response_model=Dict[str, Any])
async def get_map_heatmap(disease_name: str, day: int = 0):
    """
    Returns GeoJSON data for Mapbox to render the disease spread heatmap.
    """
    try:
        geojson_data = generate_heatmap_geojson(disease_name, day)
        return geojson_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate map data: {str(e)}")
