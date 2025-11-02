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
    """Get dealflow stages with deals (combines static + sourced startups)"""
    data = data_service.get_vc_dashboard_data()
    dealflow_stages = data.get("dealflowStages", [])
    
    # Get sourced startups from in-memory storage
    sourced_startups = data_service.get_sourced_startups()
    
    # Add sourced startups to the SOURCED stage
    if sourced_startups:
        # Find or create SOURCED stage
        sourced_stage = next((stage for stage in dealflow_stages if stage.get("name") == "SOURCED"), None)
        if not sourced_stage:
            sourced_stage = {"name": "SOURCED", "count": 0, "deals": []}
            dealflow_stages.insert(0, sourced_stage)
        
        # Convert sourced startups to deal format
        for startup in sourced_startups:
            deal = {
                "id": startup.get("id"),
                "title": startup.get("name"),
                "company": startup.get("name"),
                "stage": startup.get("stage"),
                "industry": startup.get("industry"),
                "match": startup.get("match"),
                "timestamp": startup.get("timestamp"),
                "fit": 8,  # Default scores
                "team": 8,
                "market": 7,
                "full_data": startup  # Include full startup data
            }
            # Add to deals if not already there
            if not any(d.get("id") == deal["id"] for d in sourced_stage.get("deals", [])):
                sourced_stage.setdefault("deals", []).append(deal)
        
        sourced_stage["count"] = len(sourced_stage.get("deals", []))
    
    return dealflow_stages


@router.post("/dealflow/source")
async def source_startup_to_dealflow(startup_data: dict):
    """Source a startup to deal flow"""
    startup_id = startup_data.get("id")
    startup_name = startup_data.get("name")
    
    # Add to data service
    data_service.add_sourced_startup(startup_data)
    
    return {
        "success": True,
        "message": f"Successfully sourced {startup_name} to deal flow",
        "startup_id": startup_id,
        "deal_flow_stage": "SOURCED",
        "timestamp": startup_data.get("timestamp")
    }


@router.get("/dealflow/startup/{startup_id}")
async def get_dealflow_startup(startup_id: str):
    """Get detailed information about a startup in deal flow"""
    startup = data_service.get_startup_by_id(startup_id)
    if not startup:
        return {"error": "Startup not found"}
    
    # Get associated data
    deal_notes = data_service.get_deal_notes(startup_id)
    documents = data_service.get_ingested_documents(startup_id)
    
    return {
        "startup": startup,
        "deal_notes": deal_notes,
        "ingested_documents": documents,
        "red_flags": generate_red_flags(startup)
    }


@router.post("/dealflow/startup/{startup_id}/generate-notes")
async def generate_deal_notes(startup_id: str):
    """Generate AI deal notes for a startup"""
    startup = data_service.get_startup_by_id(startup_id)
    if not startup:
        return {"error": "Startup not found"}
    
    # Simulate AI-generated deal notes
    notes = {
        "startup_id": startup_id,
        "generated_at": "2025-11-02T16:45:00Z",
        "summary": f"AI-Generated Analysis for {startup.get('name')}",
        "investment_thesis": f"{startup.get('name')} operates in the {startup.get('industry')} space with strong market positioning. Their {startup.get('pitch', '')}",
        "strengths": [
            f"Strong founding team with {startup.get('teamSize', 0)} employees",
            f"Growing at {startup.get('metrics', {}).get('growth', 'N/A')}",
            f"Secured {startup.get('funding', {}).get('raised', 'N/A')} in previous rounds",
            "Clear product-market fit demonstrated"
        ],
        "concerns": [
            f"Current burn rate of {startup.get('metrics', {}).get('burn', 'N/A')} requires monitoring",
            "Competitive landscape needs deeper analysis",
            "Go-to-market strategy requires validation"
        ],
        "recommendation": "PROCEED TO DUE DILIGENCE",
        "next_steps": [
            "Schedule founder meeting",
            "Review financials in detail",
            "Conduct reference checks",
            "Validate market size assumptions"
        ],
        "valuation_analysis": {
            "asking": startup.get('funding', {}).get('valuation', 'N/A'),
            "comparable_range": "$10M - $20M",
            "recommendation": "Negotiate for $12-15M cap"
        }
    }
    
    # Save notes
    data_service.save_deal_notes(startup_id, notes)
    
    return notes


@router.post("/dealflow/startup/{startup_id}/ingest-documents")
async def ingest_documents(startup_id: str, document_data: dict):
    """Ingest documents (call transcripts, emails) for a startup"""
    startup = data_service.get_startup_by_id(startup_id)
    if not startup:
        return {"error": "Startup not found"}
    
    # Simulate document ingestion
    document_type = document_data.get("type", "call_transcript")
    
    document = {
        "id": f"doc_{len(data_service.get_ingested_documents(startup_id)) + 1}",
        "startup_id": startup_id,
        "type": document_type,
        "ingested_at": "2025-11-02T16:50:00Z",
        "status": "processed",
        "insights": generate_document_insights(startup, document_type)
    }
    
    # Save document
    data_service.add_ingested_document(startup_id, document)
    
    return {
        "success": True,
        "message": f"Successfully ingested {document_type}",
        "document": document
    }


def generate_red_flags(startup: dict) -> list:
    """Generate red flags based on startup data"""
    red_flags = []
    
    # Check burn rate
    burn = startup.get('metrics', {}).get('burn', '')
    if burn and '$' in burn:
        try:
            burn_amount = int(burn.replace('$', '').replace('K', '000').replace('/month', '').replace(',', ''))
            if burn_amount > 200000:
                red_flags.append({
                    "severity": "high",
                    "flag": "High burn rate",
                    "detail": f"Burning {burn} may lead to runway issues"
                })
            elif burn_amount > 100000:
                red_flags.append({
                    "severity": "medium",
                    "flag": "Elevated burn rate",
                    "detail": f"Burn rate of {burn} requires close monitoring"
                })
        except:
            pass
    
    # Check team size
    team_size = startup.get('teamSize', 0)
    if team_size > 0 and team_size < 10:
        red_flags.append({
            "severity": "medium",
            "flag": "Small team size",
            "detail": f"Team of {team_size} may face scaling challenges"
        })
    elif team_size == 0:
        red_flags.append({
            "severity": "low",
            "flag": "Team size unknown",
            "detail": "Limited team information available for assessment"
        })
    
    # Check funding stage
    stage = startup.get('stage', '')
    mrr = startup.get('metrics', {}).get('mrr', '$0')
    if stage == 'Seed' and mrr and '$' in mrr:
        try:
            mrr_amount = int(mrr.replace('$', '').replace('K', '000').replace(',', ''))
            if mrr_amount < 50000:
                red_flags.append({
                    "severity": "medium",
                    "flag": "Low traction for stage",
                    "detail": f"MRR of {mrr} may be below expectations for {stage} stage"
                })
        except:
            pass
    
    # Check location/market risks
    location = startup.get('location', '')
    if 'India' in location or 'Brazil' in location or 'Africa' in location:
        red_flags.append({
            "severity": "low",
            "flag": "Emerging market risk",
            "detail": "Consider regulatory, currency, and exit liquidity risks"
        })
    
    # Check fit/team/market scores for deal flow cards
    fit_score = startup.get('fit', 10)
    team_score = startup.get('team', 10)
    market_score = startup.get('market', 10)
    
    if fit_score < 7:
        red_flags.append({
            "severity": "high",
            "flag": "Low thesis fit",
            "detail": f"Fit score of {fit_score}/10 indicates misalignment with investment thesis"
        })
    elif fit_score < 8:
        red_flags.append({
            "severity": "medium",
            "flag": "Moderate thesis fit",
            "detail": f"Fit score of {fit_score}/10 suggests partial alignment with investment criteria"
        })
    
    if team_score < 7:
        red_flags.append({
            "severity": "high",
            "flag": "Team concerns",
            "detail": f"Team score of {team_score}/10 indicates potential execution risks"
        })
    elif team_score < 8:
        red_flags.append({
            "severity": "medium",
            "flag": "Team assessment needed",
            "detail": f"Team score of {team_score}/10 warrants deeper founder evaluation"
        })
    
    if market_score < 7:
        red_flags.append({
            "severity": "high",
            "flag": "Market risk",
            "detail": f"Market score of {market_score}/10 suggests significant market challenges"
        })
    elif market_score < 8:
        red_flags.append({
            "severity": "medium",
            "flag": "Market dynamics unclear",
            "detail": f"Market score of {market_score}/10 requires deeper market analysis"
        })
    
    # Check overall deal quality
    if fit_score + team_score + market_score < 18:
        red_flags.append({
            "severity": "high",
            "flag": "Overall low scores",
            "detail": f"Combined score of {fit_score + team_score + market_score}/30 indicates high-risk opportunity"
        })
    
    # Check deal title for additional context
    title = startup.get('title', '').lower()
    if 'referral' in title or 'cold' in title:
        red_flags.append({
            "severity": "low",
            "flag": "Source quality",
            "detail": "Deal sourced via referral - validate relationship strength and alignment"
        })
    if 'pilot' in title or 'awaiting' in title:
        red_flags.append({
            "severity": "medium",
            "flag": "Early stage validation",
            "detail": "Deal requires further validation before advancing"
        })
    
    # If no significant flags, add informational flag
    if not red_flags:
        red_flags.append({
            "severity": "low",
            "flag": "Standard due diligence required",
            "detail": "Proceed with standard investment evaluation process"
        })
    
    return red_flags


def generate_document_insights(startup: dict, doc_type: str) -> dict:
    """Generate insights from ingested documents"""
    if doc_type == "call_transcript":
        return {
            "summary": f"30-minute call with {startup.get('name')} founding team",
            "key_points": [
                "Founder demonstrated strong domain expertise",
                "Clear vision for next 18 months",
                "Discussed competitive positioning",
                "Addressed concerns about burn rate"
            ],
            "sentiment": "positive",
            "follow_up_required": ["Financial projections", "Customer references"]
        }
    elif doc_type == "email_thread":
        return {
            "summary": f"Email correspondence with {startup.get('name')} team",
            "key_points": [
                "Responded promptly to all questions",
                "Provided detailed financial breakdown",
                "Shared customer testimonials",
                "Transparent about challenges"
            ],
            "sentiment": "positive",
            "attachments": ["Q3_Financials.pdf", "Customer_References.docx"]
        }
    else:
        return {
            "summary": f"Document analysis for {startup.get('name')}",
            "status": "processed"
        }


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
