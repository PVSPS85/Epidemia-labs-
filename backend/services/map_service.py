import random
from typing import Dict, Any

def generate_heatmap_geojson(disease_name: str, day: int) -> Dict[str, Any]:
    """
    Generates realistic GeoJSON point data for Mapbox based on the simulation day.
    This creates a simulated spread of the disease across the globe.
    """
    features = []
    
    # Simulate a logistic growth curve for visual effect on the map
    base_hotspots = 50
    growth_factor = 1.15
    # Cap the growth to prevent overwhelming the browser rendering
    num_hotspots = int(base_hotspots * (growth_factor ** min(day, 50))) 
    
    for _ in range(num_hotspots):
        # Generate random global coordinates 
        lon = random.uniform(-130.0, 150.0)
        lat = random.uniform(-40.0, 60.0)
        
        # Outbreak intensity grows with time
        intensity = random.uniform(0.1, 0.5) + (day * 0.01)
        
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lon, lat]
            },
            "properties": {
                "disease": disease_name,
                "day_reported": day,
                "intensity": min(intensity, 1.0) # Cap visual intensity at 1.0
            }
        })
        
    return {
        "type": "FeatureCollection",
        "features": features
    }
