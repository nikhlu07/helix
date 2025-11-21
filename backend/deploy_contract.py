import os
import json
import sys
from hedera import (
    Client,
    AccountId,
    PrivateKey,
    ContractCreateFlow,
    ContractFunctionParameters,
    Hbar
)
from solcx import compile_standard, install_solc
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def deploy_contract():
    """
    Compile and deploy Procurement.sol to Hedera Testnet
    """
    # 1. Setup Hedera Client
    try:
        account_id = AccountId.fromString(os.getenv("HEDERA_ACCOUNT_ID"))
        private_key = PrivateKey.fromString(os.getenv("HEDERA_PRIVATE_KEY"))
        
        if os.getenv("HEDERA_NETWORK", "testnet") == "mainnet":
            client = Client.forMainnet()
        else:
            client = Client.forTestnet()
            
        client.setOperator(account_id, private_key)
        logger.info(f"Hedera Client initialized for account: {account_id}")
    except Exception as e:
        logger.error(f"Failed to initialize Hedera client: {e}")
        logger.error("Please ensure HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY are set in environment")
        return

    # 2. Compile Contract
    logger.info("Compiling Procurement.sol...")
    try:
        # Install specific solc version
        install_solc('0.8.20')
        
        with open("../contracts/Procurement.sol", "r") as f:
            contract_source = f.read()
            
        compiled_sol = compile_standard(
            {
                "language": "Solidity",
                "sources": {"Procurement.sol": {"content": contract_source}},
                "settings": {
                    "outputSelection": {
                        "*": {
                            "*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]
                        }
                    }
                },
            },
            solc_version='0.8.20',
        )
        
        bytecode = compiled_sol["contracts"]["Procurement.sol"]["Procurement"]["evm"]["bytecode"]["object"]
        abi = compiled_sol["contracts"]["Procurement.sol"]["Procurement"]["abi"]
        
        logger.info("Compilation successful!")
        
        # Save ABI for frontend/backend use
        with open("app/services/procurement_abi.json", "w") as f:
            json.dump(abi, f, indent=2)
        logger.info("ABI saved to app/services/procurement_abi.json")
        
    except Exception as e:
        logger.error(f"Compilation failed: {e}")
        return

    # 3. Deploy Contract
    logger.info("Deploying contract to Hedera...")
    try:
        transaction = ContractCreateFlow() \
            .setBytecode(bytecode) \
            .setGas(1000000) \
            .setAdminKey(private_key) # Set admin key to allow updates if needed
            
        tx_response = transaction.execute(client)
        receipt = tx_response.getReceipt(client)
        contract_id = receipt.contractId
        
        logger.info(f"Contract deployed successfully!")
        logger.info(f"Contract ID: {contract_id}")
        logger.info(f"Transaction ID: {tx_response.transactionId}")
        
        # Update .env or print instruction
        print(f"\n[IMPORTANT] Update your .env file with:\nHEDERA_CONTRACT_ID={contract_id}\n")
        
    except Exception as e:
        logger.error(f"Deployment failed: {e}")

if __name__ == "__main__":
    deploy_contract()
