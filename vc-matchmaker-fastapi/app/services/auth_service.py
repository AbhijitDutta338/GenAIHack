"""
Authentication service
"""
from typing import Optional, Dict, Any
from app.services.data_service import data_service


class AuthService:
    """Service for authentication operations"""
    
    def authenticate_user(self, username_or_email: str, password: str) -> Optional[Dict[str, Any]]:
        """
        Authenticate a user with username/email and password
        Returns user data without password if successful, None otherwise
        """
        users = data_service.get_users()
        
        # Find user by username or email
        user = None
        for u in users:
            if u.get("username") == username_or_email or u.get("email") == username_or_email:
                user = u
                break
        
        if not user:
            return None
        
        # Simple password check (in production, use hashed passwords)
        if user["password"] != password:
            return None
        
        # Return user data without password
        user_response = user.copy()
        del user_response["password"]
        return user_response
    
    def get_user_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        """Get user by username (without password)"""
        user = data_service.get_user_by_username(username)
        if user:
            user_response = user.copy()
            del user_response["password"]
            return user_response
        return None


# Singleton instance
auth_service = AuthService()
