"""
Data service for loading and accessing JSON data
"""
import json
from pathlib import Path
from typing import Dict, Any, List, Optional


class DataService:
    """Service for loading and accessing JSON data files"""
    
    def __init__(self):
        self.data_dir = Path(__file__).parent.parent.parent / "Data"
        self._cache: Dict[str, Any] = {}
        # In-memory storage for dynamic data
        self._sourced_startups: List[Dict[str, Any]] = []
        self._deal_notes: Dict[str, Dict[str, Any]] = {}  # startup_id -> notes
        self._ingested_documents: Dict[str, List[Dict[str, Any]]] = {}  # startup_id -> documents
    
    def _load_json(self, filename: str) -> Dict[str, Any]:
        """Load JSON file with caching"""
        if filename not in self._cache:
            file_path = self.data_dir / filename
            with open(file_path, 'r', encoding='utf-8') as f:
                self._cache[filename] = json.load(f)
        return self._cache[filename]
    
    def get_users(self) -> List[Dict[str, Any]]:
        """Get all users"""
        data = self._load_json("users.json")
        # Handle both array format and object format with "users" key
        if isinstance(data, dict) and "users" in data:
            return data["users"]
        return data if isinstance(data, list) else []
    
    def get_user_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        """Get user by username"""
        users = self.get_users()
        return next((u for u in users if u["username"] == username), None)
    
    def get_vc_dashboard_data(self) -> Dict[str, Any]:
        """Get VC dashboard data"""
        return self._load_json("vc_dashboard.json")
    
    def get_founder_dashboard_data(self) -> Dict[str, Any]:
        """Get founder dashboard data"""
        return self._load_json("founder_dashboard.json")
    
    def get_categories(self) -> Dict[str, Any]:
        """Get categories data"""
        return self._load_json("categories.json")
    
    def clear_cache(self):
        """Clear the data cache"""
        self._cache.clear()
    
    # Deal flow management
    def add_sourced_startup(self, startup_data: Dict[str, Any]) -> Dict[str, Any]:
        """Add a startup to the sourced deal flow"""
        # Add timestamp and stage if not present
        if "timestamp" not in startup_data:
            from datetime import datetime
            startup_data["timestamp"] = datetime.now().isoformat()
        if "stage" not in startup_data:
            startup_data["dealflow_stage"] = "SOURCED"
        
        # Check if already exists
        existing = next((s for s in self._sourced_startups if s.get("id") == startup_data.get("id")), None)
        if not existing:
            self._sourced_startups.append(startup_data)
        
        return startup_data
    
    def get_sourced_startups(self) -> List[Dict[str, Any]]:
        """Get all sourced startups"""
        return self._sourced_startups
    
    def get_startup_by_id(self, startup_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific startup by ID (searches both sourced and static data)"""
        # First check sourced startups
        startup = next((s for s in self._sourced_startups if s.get("id") == startup_id), None)
        if startup:
            return startup
        
        # Then check static deal flow stages
        vc_data = self.get_vc_dashboard_data()
        for stage in vc_data.get("dealflowStages", []):
            for deal in stage.get("deals", []):
                if deal.get("id") == startup_id:
                    return deal
        
        # Finally check startupsToWatch
        for startup in vc_data.get("startupsToWatch", []):
            if startup.get("id") == startup_id:
                return startup
        
        return None
    
    # Deal notes management
    def save_deal_notes(self, startup_id: str, notes: Dict[str, Any]) -> Dict[str, Any]:
        """Save deal notes for a startup"""
        self._deal_notes[startup_id] = notes
        return notes
    
    def get_deal_notes(self, startup_id: str) -> Optional[Dict[str, Any]]:
        """Get deal notes for a startup"""
        return self._deal_notes.get(startup_id)
    
    # Document management
    def add_ingested_document(self, startup_id: str, document: Dict[str, Any]) -> Dict[str, Any]:
        """Add an ingested document for a startup"""
        if startup_id not in self._ingested_documents:
            self._ingested_documents[startup_id] = []
        self._ingested_documents[startup_id].append(document)
        return document
    
    def get_ingested_documents(self, startup_id: str) -> List[Dict[str, Any]]:
        """Get all ingested documents for a startup"""
        return self._ingested_documents.get(startup_id, [])


# Singleton instance
data_service = DataService()
