from pydantic import BaseModel
from enum import Enum

class UserRole(str, Enum):
    VIEWER = "Viewer"
    PUBLISHER = "Research Publisher"

class UserBase(BaseModel):
    email: str
    role: UserRole

class UserResponse(UserBase):
    id: str