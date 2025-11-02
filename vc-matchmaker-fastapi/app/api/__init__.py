"""
API routes aggregation
"""
from fastapi import APIRouter
from app.api.routes import auth, vc, founder, categories


api_router = APIRouter()

# Include all route modules
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(vc.router, prefix="/vc", tags=["VC Dashboard"])
api_router.include_router(founder.router, prefix="/founder", tags=["Founder Dashboard"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
