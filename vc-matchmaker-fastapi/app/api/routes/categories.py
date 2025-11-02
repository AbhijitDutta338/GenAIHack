"""
Categories routes
"""
from fastapi import APIRouter
from app.services.data_service import data_service


router = APIRouter()


@router.get("/all")
async def get_all_categories():
    """Get all categories"""
    return data_service.get_categories()


@router.get("/industries")
async def get_industries():
    """Get list of industries"""
    data = data_service.get_categories()
    return data.get("industries", [])


@router.get("/stages")
async def get_stages():
    """Get list of funding stages"""
    data = data_service.get_categories()
    return data.get("stages", [])


@router.get("/regions")
async def get_regions():
    """Get list of regions"""
    data = data_service.get_categories()
    return data.get("regions", [])
