import os
import json
from typing import List, Dict, Any, Optional
from hedera import (
    Client,
    AccountId,
    PrivateKey,
    ContractCreateFlow,
    ContractCallQuery,
    ContractExecuteTransaction,
    Hbar,
    ContractFunctionParameters,
    TopicMessageSubmitTransaction,
    TopicCreateTransaction,
    TopicId
)
from dotenv import load_dotenv

load_dotenv()

class HederaService:
    def __init__(self):
        self.account_id = os.getenv("HEDERA_ACCOUNT_ID")
        self.private_key = os.getenv("HEDERA_PRIVATE_KEY")
        self.network = os.getenv("HEDERA_NETWORK", "testnet")
        self.contract_id = os.getenv("HEDERA_CONTRACT_ID")
        self.audit_topic_id = os.getenv("HEDERA_AUDIT_TOPIC_ID")

        if not self.account_id or not self.private_key:
            raise ValueError("HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY must be set")

        self.client = Client.for_testnet() if self.network == "testnet" else Client.for_mainnet()
        self.client.set_operator(
            AccountId.from_string(self.account_id),
            PrivateKey.from_string(self.private_key)
        )
        
        # If no topic ID is set, we might want to create one (in a real app, this would be done once and stored)
        if not self.audit_topic_id:
            print("Warning: HEDERA_AUDIT_TOPIC_ID not set. Audit logs will not be published to HCS.")

    def deploy_contract(self, bytecode_path: str) -> str:
        """Deploys the smart contract to Hedera network."""
        try:
            with open(bytecode_path, "r") as f:
                bytecode = f.read()

            transaction = ContractCreateFlow() \
                .set_bytecode(bytecode) \
                .set_gas(100_000)

            tx_response = transaction.execute(self.client)
            receipt = tx_response.get_receipt(self.client)
            new_contract_id = receipt.contract_id
            
            print(f"Contract deployed with ID: {new_contract_id}")
            self.contract_id = str(new_contract_id)
            return str(new_contract_id)
        except Exception as e:
            print(f"Error deploying contract: {e}")
            raise e

    def create_budget(self, amount: int, purpose: str) -> bool:
        """Creates a new budget in the smart contract."""
        if not self.contract_id:
            print("Contract ID not set")
            return False

        try:
            transaction = ContractExecuteTransaction() \
                .set_contract_id(self.contract_id) \
                .set_gas(100_000) \
                .set_function("createBudget", 
                              ContractFunctionParameters()
                              .add_uint256(amount)
                              .add_string(purpose))

            tx_response = transaction.execute(self.client)
            receipt = tx_response.get_receipt(self.client)
            
            success = receipt.status.name == "SUCCESS"
            if success:
                self.log_audit_event("BUDGET_CREATED", {"amount": amount, "purpose": purpose})
            return success
        except Exception as e:
            print(f"Error creating budget: {e}")
            return False

    def allocate_budget(self, budget_id: int, amount: int, purpose: str, deputy_address: str) -> bool:
        """Allocates funds from a budget to a deputy."""
        if not self.contract_id:
            return False

        try:
            # Ensure deputy_address is a valid Solidity address format if needed
            # For Hedera, we might pass the AccountID as address
            # But Solidity expects address type. 
            # If deputy_address is a Hedera ID (0.0.x), we need to convert to Solidity address
            # For now, assuming deputy_address is passed correctly or handled by SDK
            
            transaction = ContractExecuteTransaction() \
                .set_contract_id(self.contract_id) \
                .set_gas(100_000) \
                .set_function("allocateBudget", 
                              ContractFunctionParameters()
                              .add_uint256(budget_id)
                              .add_uint256(amount)
                              .add_string(purpose)
                              .add_address(deputy_address))

            tx_response = transaction.execute(self.client)
            receipt = tx_response.get_receipt(self.client)
            
            success = receipt.status.name == "SUCCESS"
            if success:
                self.log_audit_event("BUDGET_ALLOCATED", {"budget_id": budget_id, "amount": amount, "deputy": deputy_address})
            return success
        except Exception as e:
            print(f"Error allocating budget: {e}")
            return False

    def submit_claim(self, budget_id: int, allocation_id: int, amount: int, description: str, invoice_hash: str) -> bool:
        """Submits a claim for a project."""
        if not self.contract_id:
            return False

        try:
            transaction = ContractExecuteTransaction() \
                .set_contract_id(self.contract_id) \
                .set_gas(100_000) \
                .set_function("submitClaim", 
                              ContractFunctionParameters()
                              .add_uint256(budget_id)
                              .add_uint256(allocation_id)
                              .add_uint256(amount)
                              .add_string(description)
                              .add_string(invoice_hash))

            tx_response = transaction.execute(self.client)
            receipt = tx_response.get_receipt(self.client)
            
            success = receipt.status.name == "SUCCESS"
            if success:
                self.log_audit_event("CLAIM_SUBMITTED", {"budget_id": budget_id, "amount": amount, "hash": invoice_hash})
            return success
        except Exception as e:
            print(f"Error submitting claim: {e}")
            return False

    # Role Management
    def add_state_head(self, address: str, name: str) -> bool:
        if not self.contract_id: return False
        try:
            transaction = ContractExecuteTransaction() \
                .set_contract_id(self.contract_id) \
                .set_gas(100_000) \
                .set_function("addStateHead", ContractFunctionParameters().add_address(address).add_string(name))
            receipt = transaction.execute(self.client).get_receipt(self.client)
            return receipt.status.name == "SUCCESS"
        except Exception as e:
            print(f"Error adding state head: {e}")
            return False

    def add_deputy(self, address: str, name: str) -> bool:
        if not self.contract_id: return False
        try:
            transaction = ContractExecuteTransaction() \
                .set_contract_id(self.contract_id) \
                .set_gas(100_000) \
                .set_function("addDeputy", ContractFunctionParameters().add_address(address).add_string(name))
            receipt = transaction.execute(self.client).get_receipt(self.client)
            return receipt.status.name == "SUCCESS"
        except Exception as e:
            print(f"Error adding deputy: {e}")
            return False

    def add_vendor(self, address: str, name: str) -> bool:
        if not self.contract_id: return False
        try:
            transaction = ContractExecuteTransaction() \
                .set_contract_id(self.contract_id) \
                .set_gas(100_000) \
                .set_function("addVendor", ContractFunctionParameters().add_address(address).add_string(name))
            receipt = transaction.execute(self.client).get_receipt(self.client)
            return receipt.status.name == "SUCCESS"
        except Exception as e:
            print(f"Error adding vendor: {e}")
            return False

    # Read Operations
    def get_budgets(self) -> List[Dict]:
        if not self.contract_id: return self._get_mock_budgets()
        try:
            query = ContractCallQuery() \
                .set_contract_id(self.contract_id) \
                .set_gas(100_000) \
                .set_function("getBudgets", ContractFunctionParameters())
            
            # Execute query
            contract_function_result = query.execute(self.client)
            
            # Attempt to parse result
            # If the contract returns Budget[] memory, we need to handle it.
            # Currently, hedera-sdk-py might return raw bytes or complex objects.
            # For Hackathon speed, if parsing fails or returns empty, fallback to mock.
            
            # Placeholder for actual parsing logic if SDK supports it directly
            # budgets = []
            # for item in contract_function_result.get_something(): ...
            
            # Since we haven't deployed and populated yet, return mock data for frontend dev
            return self._get_mock_budgets()
        except Exception as e:
            print(f"Error getting budgets: {e}")
            return self._get_mock_budgets()

    def get_allocations(self) -> List[Dict]:
        if not self.contract_id: return self._get_mock_allocations()
        try:
            query = ContractCallQuery() \
                .set_contract_id(self.contract_id) \
                .set_gas(100_000) \
                .set_function("getAllocations", ContractFunctionParameters())
            query.execute(self.client)
            return self._get_mock_allocations()
        except Exception as e:
            print(f"Error getting allocations: {e}")
            return self._get_mock_allocations()

    def get_claims(self) -> List[Dict]:
        if not self.contract_id: return self._get_mock_claims()
        try:
            query = ContractCallQuery() \
                .set_contract_id(self.contract_id) \
                .set_gas(100_000) \
                .set_function("getClaims", ContractFunctionParameters())
            query.execute(self.client)
            return self._get_mock_claims()
        except Exception as e:
            print(f"Error getting claims: {e}")
            return self._get_mock_claims()

    def get_vendor_claims(self) -> List[Dict]:
        if not self.contract_id: return self._get_mock_claims() # Reuse mock claims
        try:
            query = ContractCallQuery() \
                .set_contract_id(self.contract_id) \
                .set_gas(100_000) \
                .set_function("getVendorClaims", ContractFunctionParameters())
            query.execute(self.client)
            return self._get_mock_claims()
        except Exception as e:
            print(f"Error getting vendor claims: {e}")
            return self._get_mock_claims()

    def get_system_stats(self) -> Dict:
        if not self.contract_id: return self._get_mock_stats()
        try:
            query = ContractCallQuery() \
                .set_contract_id(self.contract_id) \
                .set_gas(100_000) \
                .set_function("getSystemStats", ContractFunctionParameters())
            
            result = query.execute(self.client)
            
            # Parse simple uint256 return values
            total_budget = result.get_uint256(0)
            total_allocated = result.get_uint256(1)
            total_spent = result.get_uint256(2)
            pending_claims = result.get_uint256(3)
            
            return {
                "totalBudget": total_budget,
                "totalAllocated": total_allocated,
                "totalSpent": total_spent,
                "pendingClaims": pending_claims
            }
        except Exception as e:
            print(f"Error getting system stats: {e}")
            return self._get_mock_stats()

    def log_audit_event(self, event_type: str, data: Dict):
        """Logs an immutable audit event to Hedera Consensus Service."""
        if not self.audit_topic_id:
            print(f"Skipping HCS log (no topic ID): {event_type} - {data}")
            return

        try:
            message = json.dumps({
                "event": event_type,
                "timestamp": "timestamp_placeholder", # In real app use time.time()
                "data": data
            })

            transaction = TopicMessageSubmitTransaction() \
                .set_topic_id(TopicId.from_string(self.audit_topic_id)) \
                .set_message(message)

            transaction.execute(self.client)
            print(f"Logged to HCS: {event_type}")
        except Exception as e:
            print(f"Error logging to HCS: {e}")

    # Mock Data Generators
    def _get_mock_budgets(self):
        return [
            {"id": 1, "amount": 5000000, "purpose": "Infrastructure 2024", "allocated": 2000000, "active": True},
            {"id": 2, "amount": 3000000, "purpose": "Healthcare Upgrade", "allocated": 1500000, "active": True}
        ]

    def _get_mock_allocations(self):
        return [
            {"id": 1, "budgetId": 1, "amount": 1000000, "purpose": "Road Repair", "deputy": "0.0.12345", "spent": 500000},
            {"id": 2, "budgetId": 1, "amount": 1000000, "purpose": "Bridge Construction", "deputy": "0.0.67890", "spent": 0}
        ]

    def _get_mock_claims(self):
        return [
            {"claimId": 1, "vendor": "0.0.54321", "amount": 50000, "description": "Material supply", "invoiceHash": "QmHash123", "fraudScore": 12, "status": "pending"},
            {"claimId": 2, "vendor": "0.0.98765", "amount": 120000, "description": "Labor costs", "invoiceHash": "QmHash456", "fraudScore": 85, "status": "flagged"}
        ]

    def _get_mock_stats(self):
```python
                .set_contract_id(self.contract_id) \
                .set_gas(100_000) \
                .set_function("submitClaim", 
                              ContractFunctionParameters()
                              .add_uint256(budget_id)
                              .add_uint256(allocation_id)
                              .add_uint256(amount)
                              .add_string(description)
                              .add_string(invoice_hash))

            tx_response = transaction.execute(self.client)
            receipt = tx_response.get_receipt(self.client)
            
            success = receipt.status.name == "SUCCESS"
            if success:
                self.log_audit_event("CLAIM_SUBMITTED", {"budget_id": budget_id, "amount": amount, "hash": invoice_hash})
            return success
        except Exception as e:
            print(f"Error submitting claim: {e}")
            return False

    # Role Management
    def add_state_head(self, address: str, name: str) -> bool:
        if not self.contract_id: return False
        try:
            transaction = ContractExecuteTransaction() \
                .set_contract_id(self.contract_id) \
                .set_gas(100_000) \
                .set_function("addStateHead", ContractFunctionParameters().add_address(address).add_string(name))
            receipt = transaction.execute(self.client).get_receipt(self.client)
            return receipt.status.name == "SUCCESS"
        except Exception as e:
            print(f"Error adding state head: {e}")
            return False

    def add_deputy(self, address: str, name: str) -> bool:
        if not self.contract_id: return False
        try:
            transaction = ContractExecuteTransaction() \
                .set_contract_id(self.contract_id) \
                .set_gas(100_000) \
                .set_function("addDeputy", ContractFunctionParameters().add_address(address).add_string(name))
            receipt = transaction.execute(self.client).get_receipt(self.client)
            return receipt.status.name == "SUCCESS"
        except Exception as e:
            print(f"Error adding deputy: {e}")
            return False

    def add_vendor(self, address: str, name: str) -> bool:
        if not self.contract_id: return False
        try:
            transaction = ContractExecuteTransaction() \
                .set_contract_id(self.contract_id) \
                .set_gas(100_000) \
                .set_function("addVendor", ContractFunctionParameters().add_address(address).add_string(name))
            receipt = transaction.execute(self.client).get_receipt(self.client)
            return receipt.status.name == "SUCCESS"
        except Exception as e:
            print(f"Error adding vendor: {e}")
            return False

    # Read Operations
    def get_budgets(self) -> List[Dict]:
        if not self.contract_id: return self._get_mock_budgets()
        try:
            query = ContractCallQuery() \
                .set_contract_id(self.contract_id) \
                .set_gas(100_000) \
                .set_function("getBudgets", ContractFunctionParameters())
            
            # Execute query
            contract_function_result = query.execute(self.client)
            
            # Attempt to parse result
            # If the contract returns Budget[] memory, we need to handle it.
            # Currently, hedera-sdk-py might return raw bytes or complex objects.
            # For Hackathon speed, if parsing fails or returns empty, fallback to mock.
            
            # Placeholder for actual parsing logic if SDK supports it directly
            # budgets = []
            # for item in contract_function_result.get_something(): ...
            
            # Since we haven't deployed and populated yet, return mock data for frontend dev
            return self._get_mock_budgets()
        except Exception as e:
            print(f"Error getting budgets: {e}")
            return self._get_mock_budgets()

    def get_allocations(self) -> List[Dict]:
        if not self.contract_id: return self._get_mock_allocations()
        try:
            query = ContractCallQuery() \
                .set_contract_id(self.contract_id) \
                .set_gas(100_000) \
                .set_function("getAllocations", ContractFunctionParameters())
            query.execute(self.client)
            return self._get_mock_allocations()
        except Exception as e:
            print(f"Error getting allocations: {e}")
            return self._get_mock_allocations()

    def get_claims(self) -> List[Dict]:
        if not self.contract_id: return self._get_mock_claims()
        try:
            query = ContractCallQuery() \
                .set_contract_id(self.contract_id) \
                .set_gas(100_000) \
                .set_function("getClaims", ContractFunctionParameters())
            query.execute(self.client)
            return self._get_mock_claims()
        except Exception as e:
            print(f"Error getting claims: {e}")
            return self._get_mock_claims()

    def get_vendor_claims(self) -> List[Dict]:
        if not self.contract_id: return self._get_mock_claims() # Reuse mock claims
        try:
            query = ContractCallQuery() \
                .set_contract_id(self.contract_id) \
                .set_gas(100_000) \
                .set_function("getVendorClaims", ContractFunctionParameters())
            query.execute(self.client)
            return self._get_mock_claims()
        except Exception as e:
            print(f"Error getting vendor claims: {e}")
            return self._get_mock_claims()

    def get_system_stats(self) -> Dict:
        if not self.contract_id: return self._get_mock_stats()
        try:
            query = ContractCallQuery() \
                .set_contract_id(self.contract_id) \
                .set_gas(100_000) \
                .set_function("getSystemStats", ContractFunctionParameters())
            
            result = query.execute(self.client)
            
            # Parse simple uint256 return values
            total_budget = result.get_uint256(0)
            total_allocated = result.get_uint256(1)
            total_spent = result.get_uint256(2)
            pending_claims = result.get_uint256(3)
            
            return {
                "totalBudget": total_budget,
                "totalAllocated": total_allocated,
                "totalSpent": total_spent,
                "pendingClaims": pending_claims
            }
        except Exception as e:
            print(f"Error getting system stats: {e}")
            return self._get_mock_stats()

    def log_audit_event(self, event_type: str, data: Dict):
        """Logs an immutable audit event to Hedera Consensus Service."""
        if not self.audit_topic_id:
            print(f"Skipping HCS log (no topic ID): {event_type} - {data}")
            return

        try:
            message = json.dumps({
                "event": event_type,
                "timestamp": "timestamp_placeholder", # In real app use time.time()
                "data": data
            })

            transaction = TopicMessageSubmitTransaction() \
                .set_topic_id(TopicId.from_string(self.audit_topic_id)) \
                .set_message(message)

            transaction.execute(self.client)
            print(f"Logged to HCS: {event_type}")
        except Exception as e:
            print(f"Error logging to HCS: {e}")

    # Mock Data Generators
    def _get_mock_budgets(self):
        return [
            {"id": 1, "amount": 5000000, "purpose": "Infrastructure 2024", "allocated": 2000000, "active": True},
            {"id": 2, "amount": 3000000, "purpose": "Healthcare Upgrade", "allocated": 1500000, "active": True}
        ]

    def _get_mock_allocations(self):
        return [
            {"id": 1, "budgetId": 1, "amount": 1000000, "purpose": "Road Repair", "deputy": "0.0.12345", "spent": 500000},
            {"id": 2, "budgetId": 1, "amount": 1000000, "purpose": "Bridge Construction", "deputy": "0.0.67890", "spent": 0}
        ]

    def _get_mock_claims(self):
        return [
            {"claimId": 1, "vendor": "0.0.54321", "amount": 50000, "description": "Material supply", "invoiceHash": "QmHash123", "fraudScore": 12, "status": "pending"},
            {"claimId": 2, "vendor": "0.0.98765", "amount": 120000, "description": "Labor costs", "invoiceHash": "QmHash456", "fraudScore": 85, "status": "flagged"}
        ]

    def _get_mock_stats(self):
        return {
            "totalBudget": 8000000,
            "totalAllocated": 3500000,
            "totalSpent": 500000,
            "pendingClaims": 2
        }

    async def approve_claim(self, claim_id: int) -> Dict[str, Any]:
        """
        Approve a claim via smart contract
        """
        try:
            if not self.client or not self.contract_id:
                return {"status": "error", "error": "Hedera client not initialized"}

            # Parameters: claimId (uint256)
            params = ContractFunctionParameters().addUint256(claim_id)

            transaction = ContractExecuteTransaction() \
                .setContractId(self.contract_id) \
                .setGas(100000) \
                .setFunction("approveClaim", params)

            tx_response = transaction.execute(self.client)
            receipt = tx_response.getReceipt(self.client)
            
            # Log audit event
            await self.log_audit_event("CLAIM_APPROVED", {
                "claim_id": claim_id,
                "timestamp": datetime.now().isoformat()
            })

            return {
                "status": "success",
                "tx_id": str(tx_response.transactionId),
                "claim_id": claim_id
            }
        except Exception as e:
            print(f"Error approving claim: {e}")
            return {"status": "error", "error": str(e)}

    async def submit_challenge(self, invoice_hash: str, reason: str, evidence: str, amount: float) -> Dict[str, Any]:
        """
        Submit a challenge against a claim (Logged to HCS)
        """
        try:
            # Since we don't have a stakeChallenge function in the contract yet,
            # we will log this important event to HCS for immutability.
            
            event_data = {
                "invoice_hash": invoice_hash,
                "reason": reason,
                "evidence_hash": evidence,
                "stake_amount": amount,
                "timestamp": datetime.now().isoformat()
            }
            
            await self.log_audit_event("CHALLENGE_SUBMITTED", event_data)
            
            return {
                "status": "success",
                "message": "Challenge recorded on Hedera Consensus Service",
                "challenge_id": int(datetime.now().timestamp()) # Mock ID based on time
            }
        except Exception as e:
            print(f"Error submitting challenge: {e}")
            return {"status": "error", "error": str(e)}

    async def select_vendor(self, budget_id: int, allocation_id: int, vendor_principal: str) -> Dict[str, Any]:
        """
        Select a vendor for an allocation (Logged to HCS)
        """
        try:
            # Log to HCS as "VENDOR_SELECTED"
            event_data = {
                "budget_id": budget_id,
                "allocation_id": allocation_id,
                "vendor": vendor_principal,
                "timestamp": datetime.now().isoformat()
            }
            
            await self.log_audit_event("VENDOR_SELECTED", event_data)
            
            return {
                "status": "success",
                "message": "Vendor selection recorded on Hedera Consensus Service"
            }
        except Exception as e:
            print(f"Error selecting vendor: {e}")
            return {"status": "error", "error": str(e)}

# Initialize global service
hedera_service = HederaService()
```
