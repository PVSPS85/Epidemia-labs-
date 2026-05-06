from fastapi import APIRouter
from pydantic import BaseModel
from models.user import UserRole, UserResponse

router = APIRouter()

class AuthRequest(BaseModel):
    email: str
    password: str
    role: UserRole = UserRole.VIEWER

@router.post("/signup", response_model=UserResponse)
async def signup(request: AuthRequest):
    # TODO: Connect to Supabase Auth
    return UserResponse(id="temp-uuid-123", email=request.email, role=request.role)

@router.post("/login")
async def login(request: AuthRequest):
    # TODO: Connect to Supabase Auth
    return {"message": "Login successful", "token": "temp-jwt-token"}