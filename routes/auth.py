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
        response = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password,
        })
        if response.user:
            user = {
                "id": response.user.id,
                "email": request.email,
                "role": request.role,
            }
            # signup may not return a session until email is confirmed;
            # return a token only if one is available
            token = response.session.access_token if response.session else ""
            return {"user": user, "token": token}
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
        user = {
            "id": response.user.id,
            "email": response.user.email,
            "role": request.role,
        }
        return {
            "message": "Login successful",
            "user": user,
            "token": response.session.access_token,
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")