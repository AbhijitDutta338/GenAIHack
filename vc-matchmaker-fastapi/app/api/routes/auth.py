"""
Authentication routes
"""
from fastapi import APIRouter, HTTPException
from app.models.user import LoginRequest
from app.services.auth_service import auth_service


router = APIRouter()


@router.post("/login")
async def login(credentials: LoginRequest):
    """Login endpoint"""
    user = auth_service.authenticate_user(credentials.username, credentials.password)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # In production, generate a real JWT token here
    return {
        "token": f"demo-token-{user['uid']}",
        "user": user
    }


@router.get("/user/{username}")
async def get_user(username: str):
    """Get user by username"""
    user = auth_service.get_user_by_username(username)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user
