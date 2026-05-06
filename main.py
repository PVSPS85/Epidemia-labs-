from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import get_settings

# We will uncomment these as we build them in the next batch
# from routes import auth, diseases, simulation, publications, map

settings = get_settings()

app = FastAPI(
    title="Disease Spread Simulation API",
    description="Production backend for the Epidemiology Simulation and Research Platform",
    version="1.0.0",
)

# Configure CORS to allow the Next.js frontend to securely connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Router Registration (Placeholder for Batch 2) ---
# app.include_router(auth.router,         prefix="/auth",         tags=["Auth"])
# app.include_router(diseases.router,     prefix="/diseases",     tags=["Diseases"])
# app.include_router(simulation.router,   prefix="/simulate",     tags=["Simulation"])
# app.include_router(publications.router, prefix="/publications", tags=["Publications"])
# app.include_router(map.router,          prefix="/map",          tags=["Map"])


@app.get("/", tags=["System"])
def root():
    return {
        "status": "ok", 
        "message": "Disease Simulation API is fully operational"
    }

@app.get("/health", tags=["System"])
def health_check():
    return {"status": "healthy"}