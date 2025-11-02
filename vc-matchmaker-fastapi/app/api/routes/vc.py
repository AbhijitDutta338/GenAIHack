"""
VC dashboard routes
"""
from fastapi import APIRouter
from app.services.data_service import data_service


router = APIRouter()


@router.get("/dashboard")
async def get_vc_dashboard():
    """Get complete VC dashboard data"""
    return data_service.get_vc_dashboard_data()


@router.get("/metrics")
async def get_vc_metrics():
    """Get VC key metrics"""
    data = data_service.get_vc_dashboard_data()
    return data.get("keyMetrics", {})


@router.get("/portfolio")
async def get_portfolio_summary():
    """Get portfolio summary"""
    data = data_service.get_vc_dashboard_data()
    return data.get("portfolioSummary", {})


@router.get("/portfolio/holdings")
async def get_portfolio_holdings():
    """Get portfolio holdings"""
    data = data_service.get_vc_dashboard_data()
    return data.get("portfolioHoldings", [])


@router.get("/portfolio/holdings-data")
async def get_holdings_data():
    """Get detailed holdings data with P&L"""
    data = data_service.get_vc_dashboard_data()
    return data.get("holdingsData", [])


@router.get("/models")
async def get_weighted_models():
    """Get weighted models"""
    data = data_service.get_vc_dashboard_data()
    return data.get("weightedModels", [])


@router.get("/scores")
async def get_score_gauges():
    """Get score gauges"""
    data = data_service.get_vc_dashboard_data()
    return data.get("scoreGauges", [])


@router.get("/alerts")
async def get_recent_alerts():
    """Get recent alerts"""
    data = data_service.get_vc_dashboard_data()
    return data.get("recentAlerts", [])


@router.get("/startups-to-watch")
async def get_startups_to_watch():
    """Get startups to watch"""
    data = data_service.get_vc_dashboard_data()
    return data.get("startupsToWatch", [])


@router.get("/dealflow")
async def get_dealflow_stages():
    """Get dealflow stages with deals"""
    data = data_service.get_vc_dashboard_data()
    return data.get("dealflowStages", [])


@router.get("/investment-thesis")
async def get_investment_thesis():
    """Get default investment thesis"""
    data = data_service.get_vc_dashboard_data()
    return {"thesis": data.get("defaultInvestmentThesis", "")}


@router.post("/investment-thesis")
async def update_investment_thesis(data: dict):
    """Update investment thesis"""
    # In production, this would save to database
    return {"message": "Investment thesis updated successfully"}


@router.get("/model-weights")
async def get_model_weights():
    """Get default model weights"""
    data = data_service.get_vc_dashboard_data()
    return data.get("defaultModelWeights", {})


@router.post("/model-weights")
async def update_model_weights(weights: dict):
    """Update model weights"""
    # In production, this would save to database
    return {"message": "Model weights updated successfully"}
