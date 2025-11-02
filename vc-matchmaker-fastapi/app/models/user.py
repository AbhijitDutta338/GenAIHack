"""
User data models
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any


class LoginRequest(BaseModel):
    """Login request model"""
    username: str
    password: str


class UserProfile(BaseModel):
    """User profile model"""
    company: Optional[str] = None
    firm: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None


class User(BaseModel):
    """User model"""
    uid: str
    email: EmailStr
    username: str
    password: str
    userType: str
    role: str
    profile: Optional[Dict[str, Any]] = None


class UserResponse(BaseModel):
    """User response model (without password)"""
    uid: str
    email: EmailStr
    username: str
    userType: str
    role: str
    profile: Optional[Dict[str, Any]] = None
