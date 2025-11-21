# backend/app/auth/principal_auth.py
from typing import Optional, Dict, Any, List
from fastapi import HTTPException, status
from datetime import datetime, timedelta
import jwt
import logging
import hashlib
from ..config.settings import settings

logger = logging.getLogger(__name__)

class PrincipalAuthService:
    """
    Handles principal-based authentication for CorruptGuard
    """
    
    def __init__(self):
        self.secret_key = settings.JWT_SECRET_KEY
        self.algorithm = "HS256"
        self.access_token_expire_minutes = 30  # 30 minutes for security
    
    async def verify_internet_identity(self, principal_id: str, delegation_chain: List[Dict], domain: Optional[str] = None) -> bool:
        """
        Verify Internet Identity delegation chain (Mock for now)
        """
        # In a real migration, this would be replaced by Hedera wallet verification
        return True
    
    async def get_user_role(self, principal_id: str) -> str:
        """
        Determine user role
        """
        # Mock role determination logic
        return self._get_demo_role(principal_id)
    
    def _get_demo_role(self, principal_id: str) -> str:
        """
        Simple demo role mapping based on principal ID patterns
        """
        try:
            # Use last few characters of principal for role assignment
            last_chars = principal_id[-4:].lower()
            
            # Simple hash-based role assignment for demo
            hash_value = int(hashlib.md5(principal_id.encode()).hexdigest()[:8], 16)
            role_index = hash_value % 5
            
            roles = ["citizen", "vendor", "deputy", "state_head", "main_government"]
            return roles[role_index]
            
        except Exception:
            return "citizen"  # Default fallback
    
    async def authenticate_user(self, principal_id: str, signature: str) -> Dict[str, Any]:
        """
        Complete authentication flow
        """
        try:
            # Verify signature (Mock)
            # In real Hedera integration, verify signature of a message signed by the wallet
            
            # Get user role
            role = await self.get_user_role(principal_id)
            
            # Create access token
            access_token = self.create_access_token(
                data={"principal_id": principal_id, "role": role}
            )
            
            # Get additional user info based on role
            user_info = await self.get_user_info(principal_id, role)
            
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "principal_id": principal_id,
                "role": role,
                "user_info": user_info,
                "expires_in": self.access_token_expire_minutes * 60,
                "demo_mode": True
            }
            
        except Exception as e:
            logger.error(f"Authentication failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Authentication service error"
            )
    
    def create_access_token(self, data: dict) -> str:
        """
        Create JWT access token
        """
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
        to_encode.update({"exp": expire})
        
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    async def verify_token(self, token: str) -> Dict[str, Any]:
        """
        Verify and decode JWT token
        """
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            principal_id: str = payload.get("principal_id")
            role: str = payload.get("role")
            
            if principal_id is None or role is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token payload"
                )
            
            return {
                "principal_id": principal_id,
                "role": role,
                "valid": True
            }
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired"
            )
        except jwt.JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
    
    async def get_user_info(self, principal_id: str, role: str) -> Dict[str, Any]:
        """
        Get additional user information based on role
        """
        try:
            base_info = {
                "principal_id": principal_id,
                "role": role,
                "authenticated_at": datetime.utcnow().isoformat()
            }
            
            if role == "main_government":
                base_info.update({
                    "name": "Government Authority",
                    "title": "Main Government Authority",
                    "permissions": ["budget_control", "role_management", "fraud_oversight", "system_administration"],
                    "system_stats": {"total_users": 150, "active_projects": 25, "fraud_cases": 8}
                })
            
            elif role == "state_head":
                base_info.update({
                    "name": "State Administrator",
                    "title": "State Head",
                    "permissions": ["budget_allocation", "deputy_management", "regional_oversight"],
                    "state": "Maharashtra"
                })
            
            elif role == "deputy":
                base_info.update({
                    "name": "District Officer",
                    "title": "District Deputy",
                    "permissions": ["vendor_selection", "project_management", "claim_review"],
                    "district": "Mumbai"
                })
            
            elif role == "vendor":
                base_info.update({
                    "name": "Contractor",
                    "title": "Registered Vendor",
                    "permissions": ["claim_submission", "payment_tracking", "supplier_management"],
                    "vendor_status": "approved"
                })
            
            else:  # citizen
                base_info.update({
                    "name": "Community Member",
                    "title": "Citizen Observer",
                    "permissions": ["transparency_access", "corruption_reporting", "community_verification"],
                    "stake_balance": "1.5"
                })
            
            return base_info
            
        except Exception as e:
            logger.error(f"Failed to get user info for {principal_id}: {e}")
            return {
                "principal_id": principal_id,
                "role": role,
                "name": role.replace("_", " ").title(),
                "title": role.replace("_", " ").title(),
                "permissions": [],
                "error": "Failed to load user details"
            }

# Singleton instance
principal_auth_service = PrincipalAuthService()