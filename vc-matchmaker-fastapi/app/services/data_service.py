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


# Singleton instance
data_service = DataService()
