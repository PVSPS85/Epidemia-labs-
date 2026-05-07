from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.user import UserRole
from database import supabase

router = APIRouter()

class AuthRequest(BaseModel):
    email: str
    password: str
    role: UserRole = UserRole.VIEWER

@router.post("/signup")
async def signup(request: AuthRequest):
    try:
        # Talk to Supabase to create the user securely
        response = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password,
        })
        
        # Return the real User ID from Supabase
        if response.user:
            return {"id": response.user.id, "email": request.email, "role": request.role}
        else:
            raise HTTPException(status_code=400, detail="Signup failed.")
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login(request: AuthRequest):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password,
        })
        return {"message": "Login successful", "token": response.session.access_token}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")