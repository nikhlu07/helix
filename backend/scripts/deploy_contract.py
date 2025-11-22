import os
import json
import sys
from hedera import (
    Client,
    AccountId,
    PrivateKey,
    ContractCreateFlow,
    ContractFunctionParameters
)
from dotenv import load_dotenv
from solcx import compile_standard, install_solc

# Load environment variables
load_dotenv()

def deploy_contract():
    print("🚀 Starting Hedera Smart Contract Deployment...")

    # 1. Initialize Client
    try:
        account_id = AccountId.fromString(os.getenv("HEDERA_ACCOUNT_ID"))
        private_key = PrivateKey.fromString(os.getenv("HEDERA_PRIVATE_KEY"))
        
        network = os.getenv("HEDERA_NETWORK", "testnet")
        client = Client.forMainnet() if network == "mainnet" else Client.forTestnet()
        client.setOperator(account_id, private_key)
        print(f"✅ Client initialized on {network}")
    except Exception as e:
        print(f"❌ Failed to initialize client: {e}")
        return

    # 2. Compile Contract
    print("🔨 Compiling Procurement.sol...")
    try:
        # Install specific solc version if needed
        install_solc('0.8.20')
        
        contract_path = os.path.join(os.path.dirname(__file__), "..", "..", "contracts", "Procurement.sol")
        with open(contract_path, "r") as f:
            source = f.read()

        compiled_sol = compile_standard({
            "language": "Solidity",
            "sources": {"Procurement.sol": {"content": source}},
            "settings": {
                "outputSelection": {
                    "*": {
                        "*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]
                    }
                }
            },
        }, solc_version='0.8.20')

        bytecode = compiled_sol['contracts']['Procurement.sol']['Procurement']['evm']['bytecode']['object']
        abi = compiled_sol['contracts']['Procurement.sol']['Procurement']['abi']
        
        print("✅ Compilation successful")
        
        # Save ABI for frontend/backend use
        with open("Procurement_ABI.json", "w") as f:
            json.dump(abi, f, indent=2)
        print("💾 ABI saved to Procurement_ABI.json")

    except Exception as e:
        print(f"❌ Compilation failed: {e}")
        print("Ensure py-solc-x is installed: pip install py-solc-x")
        return

    # 3. Deploy Contract
    print("Deploying contract to Hedera network (this may take a few seconds)...")
    try:
        transaction = (
            ContractCreateFlow()
            .setBytecode(bytecode)
            .setGas(1000000) # Adjust gas as needed
        )
        
        tx_response = transaction.execute(client)
        receipt = tx_response.getReceipt(client)
        contract_id = receipt.contractId
        
        print(f"🎉 Contract Deployed Successfully!")
        print(f"📜 Contract ID: {contract_id}")
        print(f"🔗 Explorer: https://hashscan.io/{network}/contract/{contract_id}")
        
        # Update .env or config if needed (manual step for now)
        print(f"\n⚠️  IMPORTANT: Update your .env file with HEDERA_CONTRACT_ID={contract_id}")

    except Exception as e:
        print(f"❌ Deployment failed: {e}")

if __name__ == "__main__":
    deploy_contract()
