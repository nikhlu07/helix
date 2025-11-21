# backend/app/api/vendor.py - INTEGRATED
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, BackgroundTasks
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import logging
from datetime import datetime
import hashlib
import json
import asyncio

from ..auth.middleware import require_vendor_operations, get_current_user
from ..services.hedera_service import hedera_service
from ..schemas.vendor import ClaimSubmissionRequest, SupplierPaymentRequest

logger = logging.getLogger(__name__)
router = APIRouter()

# ================================================================================
# Claim Management Endpoints
# ================================================================================

@router.post("/claim/submit")
async def submit_claim(
    claim_request: ClaimSubmissionRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(require_vendor_operations)
):
    """
    Submit a vendor claim for payment
    Only approved vendors can submit claims
    """
    try:
        logger.info(f"Vendor {current_user['principal_id']} submitting claim for {claim_request.amount}")
        
        # Generate invoice hash from claim data
        invoice_data = {
            "amount": claim_request.amount,
            "description": claim_request.description,
            "work_details": claim_request.work_details,
            "vendor": current_user['principal_id'],
            "timestamp": datetime.now().isoformat()
        }
        invoice_string = json.dumps(invoice_data, sort_keys=True)
        invoice_hash = hashlib.sha256(invoice_string.encode()).hexdigest()
        
        # Call Hedera service to submit claim
        result = await hedera_service.submit_claim(
            budget_id=claim_request.budget_id,
            allocation_id=claim_request.allocation_id,
            amount=claim_request.amount,
            description=claim_request.description,
            invoice_hash=invoice_hash
        )
        
        if result["status"] == "success":
            claim_id = result.get("claim_id", 789) # Mock ID if not returned
            
            # Add background task for fraud detection
            background_tasks.add_task(trigger_fraud_analysis, claim_id, invoice_data)
            
            return {
                "success": True,
                "claim_id": claim_id,
                "message": f"Claim submitted successfully with ID {claim_id}",
                "claim_details": {
                    "claim_id": claim_id,
                    "amount": claim_request.amount,
                    "budget_id": claim_request.budget_id,
                    "allocation_id": claim_request.allocation_id,
                    "description": claim_request.description,
                    "vendor": current_user['principal_id'],
                    "submitted_at": datetime.now().isoformat(),
                    "status": "pending_review",
                    "fraud_detection": "initiated",
                    "tx_id": result["tx_id"]
                }
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Failed to submit claim")
            )
    
    except Exception as e:
        logger.error(f"Error submitting claim: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit claim"
        )

@router.get("/claims/my-claims")
async def get_my_claims(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve claim details"
        )

# ================================================================================
# Supplier Payment Management
# ================================================================================

@router.post("/payment/supplier")
async def pay_supplier(
    payment_request: SupplierPaymentRequest,
    current_user: dict = Depends(require_vendor_operations)
):
    """
    Pay a supplier/subcontractor
    Only vendors can make supplier payments from their approved claims
    """
    try:
        logger.info(f"Vendor {current_user['principal_id']} paying supplier {payment_request.supplier_principal}")
        
        # Mock payment logic
        
        return {
            "success": True,
            "message": "Supplier payment processed successfully (Mock Hedera)",
            "payment": {
                "claim_id": payment_request.claim_id,
                "supplier": payment_request.supplier_principal,
                "amount": payment_request.amount,
                "formatted_amount": f"${payment_request.amount}",
                "invoice_reference": payment_request.invoice_reference,
                "description": payment_request.description,
                "paid_by": current_user['principal_id'],
                "paid_at": datetime.now().isoformat(),
                "remaining_claim_balance": 10000 # Mock remaining
            }
        }
    
    except Exception as e:
        logger.error(f"Error processing supplier payment: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process supplier payment"
        )

@router.get("/payment/history")
async def get_payment_history(
    current_user: dict = Depends(require_vendor_operations)
):
    """
    Get payment history for the current vendor
    Shows all payments made to suppliers
    """
    try:
        # Mock data
        payment_history = [
            {
                "payment_id": 1,
                "claim_id": 1,
                "supplier": "supplier_demo_1",
                "amount": 500000,
                "formatted_amount": "$500,000",
                "description": "Materials supply for road construction",
                "paid_at": "2024-01-15T10:30:00Z",
                "status": "completed"
            }
        ]
        
        total_paid = sum(p["amount"] for p in payment_history)
        
        return {
            "success": True,
            "payments": payment_history,
            "total_payments": len(payment_history),
            "total_amount_paid": total_paid,
            "formatted_total": f"${total_paid}",
            "vendor": current_user['principal_id']
        }
    
    except Exception as e:
        logger.error(f"Error getting payment history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve payment history"
        )

# ================================================================================
# Vendor Performance and Analytics
# ================================================================================

@router.get("/performance/dashboard")
async def get_vendor_dashboard(
    current_user: dict = Depends(require_vendor_operations)
):
    """
    Get vendor performance dashboard data
    Shows key metrics and analytics for the vendor
    """
    try:
        vendor_principal = current_user['principal_id']
        
        # Mock dashboard data
        return {
            "success": True,
            "dashboard": {
                "vendor_info": {
                    "principal_id": vendor_principal,
                    "formatted_principal": vendor_principal, # Format if needed
                    "registration_status": "approved",
                    "risk_level": "low"
                },
                "claim_statistics": {
                    "total_claims": 10,
                    "approved_claims": 8,
                    "flagged_claims": 0,
                    "paid_claims": 5,
                    "pending_claims": 2,
                    "approval_rate": 80.0,
                    "success_rate": 50.0
                },
                "financial_metrics": {
                    "total_claimed": 1000000,
                    "formatted_total": "$1,000,000",
                    "average_claim_size": 100000,
                    "largest_claim": 200000,
                    "total_paid_to_suppliers": 400000
                },
                "fraud_metrics": {
                    "average_fraud_score": 15.5,
                    "fraud_score_trend": "stable",
                    "total_challenges": 1,
                    "compliance_rating": "good"
                }
            }
        }
    
    except Exception as e:
        logger.error(f"Error getting vendor dashboard: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve vendor dashboard"
        )

# ================================================================================
# Document Management
# ================================================================================

@router.post("/documents/upload")
async def upload_claim_document(
    file: UploadFile = File(...),
    claim_id: Optional[int] = None,
    document_type: str = "invoice",
    current_user: dict = Depends(require_vendor_operations)
):
    """
    Upload supporting documents for claims
    """
    try:
        # Validate file type
        allowed_types = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"]
        file_extension = "." + file.filename.split(".")[-1].lower()
        
        if file_extension not in allowed_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type {file_extension} not allowed. Allowed types: {allowed_types}"
            )
        
        # Read file content
        content = await file.read()
        
        # Generate file hash
        file_hash = hashlib.sha256(content).hexdigest()
        
        logger.info(f"Uploaded document: {file.filename} ({len(content)} bytes) for vendor {current_user['principal_id']}")
        
        return {
            "success": True,
            "message": "Document uploaded successfully",
            "document": {
                "filename": file.filename,
                "file_size": len(content),
                "file_hash": file_hash,
                "document_type": document_type,
                "claim_id": claim_id,
                "uploaded_by": current_user['principal_id'],
                "uploaded_at": datetime.now().isoformat()
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading document: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload document"
        )

# ================================================================================
# Helper Functions
# ================================================================================

def get_claim_status(claim) -> str:
    """Determine claim status based on claim properties"""
    if claim.paid:
        return "paid"
    elif claim.flagged:
        return "flagged"
    elif claim.ai_approved:
        return "approved"
    else:
        return "pending"

async def trigger_fraud_analysis(claim_id: int, invoice_data: dict):
    """
    Background task to trigger fraud analysis
    """
    try:
        logger.info(f"Triggering fraud analysis for claim {claim_id}")
        
        # Simulate analysis delay
        await asyncio.sleep(3)
        
        # Simulate fraud scoring
        import random
        base_score = 15
        
        # Add penalties based on amount
        if invoice_data.get("amount", 0) > 1000000:
            base_score += 30
        
        # Add random variation
        final_score = base_score + random.randint(0, 25)
        
        # In real app, update Hedera state here
        
        logger.info(f"Fraud analysis completed for claim {claim_id} - Score: {final_score}")
        
    except Exception as e:
        logger.error(f"Error in fraud analysis: {e}")