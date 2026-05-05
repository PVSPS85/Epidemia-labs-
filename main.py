
Copy

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import get_settings
 
# Import routers (we'll create these next)
from routes import diseases, simulation, publications, map, auth
 
settings = get_settings()
 
app = FastAPI(
    title="Disease Spread Simulation API",
    description="Backend for the Disease Spread Simulation & Research Platform",
    version="1.0.0",
)
 
# Allow frontend (Next.js) to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
# Register all route groups
app.include_router(auth.router,         prefix="/auth",        tags=["Auth"])
app.include_router(diseases.router,     prefix="/diseases",    tags=["Diseases"])
app.include_router(simulation.router,   prefix="/simulate",    tags=["Simulation"])
app.include_router(publications.router, prefix="/publications", tags=["Publications"])
app.include_router(map.router,          prefix="/map",         tags=["Map"])
 
 
@app.get("/")
def root():
    return {"status": "ok", "message": "Disease Simulation API is running"}
 
 
@app.get("/health")
def health():
    return {"status": "healthy"}
