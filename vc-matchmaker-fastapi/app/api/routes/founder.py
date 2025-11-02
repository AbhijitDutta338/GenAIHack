"""
Founder dashboard routes
"""
from fastapi import APIRouter
from app.services.data_service import data_service


router = APIRouter()


@router.get("/dashboard")
async def get_founder_dashboard():
    """Get complete founder dashboard data"""
    return data_service.get_founder_dashboard_data()


@router.get("/profile/sample")
async def get_completed_profile_sample():
    """Get completed profile sample"""
    data = data_service.get_founder_dashboard_data()
    return data.get("completedProfileSample", {})


@router.get("/profile/form-steps")
async def get_form_steps():
    """Get profile form steps"""
    data = data_service.get_founder_dashboard_data()
    return data.get("formSteps", [])


@router.post("/profile")
async def save_profile(profile_data: dict):
    """Save founder profile"""
    # In production, this would save to database
    return {"message": "Profile saved successfully", "data": profile_data}


@router.get("/profile/{user_id}")
async def get_founder_profile(user_id: str):
    """Get founder profile by user ID"""
    # In production, this would fetch from database
    # For demo, return the sample profile
    data = data_service.get_founder_dashboard_data()
    return data.get("completedProfileSample", {})
