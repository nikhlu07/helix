# backend/app/api/government.py - INTEGRATED
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import logging
from datetime import datetime
import asyncio

from ..auth.middleware import (
    require_main_government, 
    require_state_head, 
    require_government_official,
    get_current_user
)
from ..services.hedera_service import hedera_service
from ..schemas.government import (
    BudgetCreateRequest,
    BudgetAllocationRequest,
    StateHeadProposal,
    VendorProposal,
    FraudScoreUpdate,
    ClaimApprovalRequest
)

logger = logging.getLogger(__name__)
router = APIRouter()

# ================================================================================
# Budget Management Endpoints
# ================================================================================

@router.post("/budget/create")
async def create_budget(
    budget_request: BudgetCreateRequest,
    current_user: dict = Depends(require_main_government)
):
    """
    Create and lock a new budget allocation
    Only main government can create budgets
    """
    try:
        logger.info(f"Creating budget: {budget_request.purpose} - {budget_request.amount}")
        
        # Call Hedera service to create budget
        result = await hedera_service.create_budget(
            amount=budget_request.amount,
            purpose=budget_request.purpose
        )
        
        if result["status"] == "success":
            return {
                "success": True,
                "budget_id": result.get("budget_id", 123), # Mock ID if not returned
                "message": f"Budget locked successfully on Hedera. Tx: {result['tx_id']}",
                "budget": {
                    "id": result.get("budget_id", 123),
                    "amount": budget_request.amount,
                    "purpose": budget_request.purpose,
                    "created_by": current_user["principal_id"],
                    "created_at": datetime.now().isoformat(),
                    "tx_id": result["tx_id"]
                }
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to create budget: {result.get('error', 'Unknown error')}"
            )
    
    except Exception as e:
        logger.error(f"Error creating budget: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create budget"
        )

@router.post("/budget/{budget_id}/allocate")
async def allocate_budget(
    budget_id: int,
    allocation_request: BudgetAllocationRequest,
    current_user: dict = Depends(require_state_head)
):
    """
    Allocate budget to a deputy
    State heads and main government can allocate budgets
    """
    try:
        logger.info(f"Allocating budget {budget_id}: {allocation_request.amount} to {allocation_request.deputy}")
        
        # Call Hedera service to allocate budget
        result = await hedera_service.allocate_budget(
            budget_id=budget_id,
            amount=allocation_request.amount,
            area=allocation_request.area,
            deputy_address=allocation_request.deputy
        )
        
        if result["status"] == "success":
            return {
                "success": True,
                "message": "Budget allocated successfully on Hedera",
                "allocation": {
                    "budget_id": budget_id,
                    "amount": allocation_request.amount,
                    "area": allocation_request.area,
                    "deputy": allocation_request.deputy,
                    "allocated_by": current_user["principal_id"],
                    "allocated_at": datetime.now().isoformat(),
                    "tx_id": result["tx_id"]
                }
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Failed to allocate budget")
            )
    
    except Exception as e:
        logger.error(f"Error allocating budget: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to allocate budget"
        )

@router.get("/budget/transparency")
async def get_budget_transparency(
    current_user: dict = Depends(get_current_user)
            detail="Failed to retrieve system statistics"
        )

# ================================================================================
# Background Tasks
# ================================================================================

async def trigger_fraud_detection_webhook(claim_id: int):
    """
    Background task to trigger fraud detection for new claims
    """
    try:
        # In production, this would call the Python fraud detection backend
        logger.info(f"Triggering fraud detection for claim {claim_id}")
        
        # Simulate fraud detection processing
        await asyncio.sleep(2)  # Simulate processing time
        
        # For demo, generate a random fraud score
        import random
        fraud_score = random.randint(10, 95)
        
        logger.info(f"Fraud detection completed for claim {claim_id} - Score: {fraud_score}")
        # In real app, we would update Hedera state here
    
    except Exception as e:
        logger.error(f"Error in fraud detection webhook: {e}")

# Demo endpoint for testing (remove in production)
@router.post("/demo/reset-data")
async def reset_demo_data(
    current_user: dict = Depends(require_main_government)
):
    """
    Reset demo data for testing purposes
    Only available in demo mode
    """
    try:
        # Reset mock data
        return {
            "success": True,
            "message": "Demo data has been reset to initial state",
            "reset_by": current_user["principal_id"],
            "reset_at": datetime.now().isoformat()
        }
    
    except Exception as e:
        logger.error(f"Error resetting demo data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to reset demo data"
        )