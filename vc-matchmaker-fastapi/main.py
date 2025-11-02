"""
VC Matchmaker FastAPI Application - Main Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import api_router

# Initialize FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="API for VC Matchmaker platform"
)

# CORS Configuration - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=False,  # Must be False when using wildcard origins
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all API routes
app.include_router(api_router, prefix="/api")


@app.get("/")
async def read_root():
    """Root endpoint with API information"""
    return {
        "message": "VC Matchmaker API",
        "version": "1.0.0",
        "endpoints": {
            "auth": "/api/auth/login",
            "vc_dashboard": "/api/vc/dashboard",
            "founder_dashboard": "/api/founder/dashboard",
            "categories": "/api/categories"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "VC Matchmaker API"}