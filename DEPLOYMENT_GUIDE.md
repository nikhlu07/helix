# 🚀 H.E.L.I.X. Smart Contract Deployment Guide

This guide will walk you through deploying the Procurement smart contract to Hedera testnet.

## Prerequisites

✅ **Already Completed:**
- Python 3.11.9 installed
- Required packages installed:
  - `hedera-sdk-python`
  - `py-solc-x`
  - `python-dotenv`

## Step 1: Get Hedera Testnet Credentials

You need a Hedera testnet account to deploy the contract.

### Option A: Use Existing Testnet Account
If you already have a Hedera testnet account, skip to Step 2.

### Option B: Create New Testnet Account
1. Visit the [Hedera Portal](https://portal.hedera.com/)
2. Sign up for a free testnet account
3. You'll receive:
   - **Account ID** (format: `0.0.XXXXXX`)
   - **Private Key** (format: `302e020100300506032b657004220420...`)

## Step 2: Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and add your Hedera credentials:

```env
# Hedera Configuration
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.YOUR_ACCOUNT_ID_HERE
HEDERA_PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE

# Contract Configuration (will be populated after deployment)
HEDERA_CONTRACT_ID=

# Backend Configuration
PORT=8000
DEBUG=True

# Frontend Configuration
VITE_HEDERA_NETWORK=testnet
VITE_API_URL=http://localhost:8000
```

> ⚠️ **IMPORTANT:** Never commit your `.env` file to git! It's already in `.gitignore`.

## Step 3: Deploy the Contract

Run the deployment script:

```bash
cd backend/scripts
python deploy_contract.py
```

### Expected Output:

```
🚀 Starting Hedera Smart Contract Deployment...
✅ Client initialized on testnet
🔨 Compiling Procurement.sol...
✅ Compilation successful
💾 ABI saved to Procurement_ABI.json
Deploying contract to Hedera network (this may take a few seconds)...
🎉 Contract Deployed Successfully!
📜 Contract ID: 0.0.XXXXXXX
🔗 Explorer: https://hashscan.io/testnet/contract/0.0.XXXXXXX

⚠️  IMPORTANT: Update your .env file with HEDERA_CONTRACT_ID=0.0.XXXXXXX
```

## Step 4: Update Configuration

1. Copy the **Contract ID** from the output
2. Update your `.env` file:
   ```env
   HEDERA_CONTRACT_ID=0.0.XXXXXXX
   ```

3. The deployment also creates `Procurement_ABI.json` in the `backend/scripts` directory. This file is used by the frontend and backend to interact with the contract.

## Step 5: Verify Deployment

1. Visit the Hashscan explorer link from the deployment output
2. You should see your deployed contract with:
   - Contract ID
   - Deployment timestamp
   - Bytecode
   - Transaction history

## Troubleshooting

### Error: "Failed to initialize client"
- Check that your `HEDERA_ACCOUNT_ID` and `HEDERA_PRIVATE_KEY` are correct
- Ensure the `.env` file is in the project root directory

### Error: "Compilation failed"
- Ensure `py-solc-x` is installed: `pip install py-solc-x`
- The script will automatically install Solidity compiler version 0.8.20

### Error: "Insufficient balance"
- Your testnet account needs HBAR for gas fees
- Visit the [Hedera Faucet](https://portal.hedera.com/faucet) to get free testnet HBAR

### Error: "Module not found: hedera"
- Install the Hedera SDK: `pip install hedera-sdk-python`

## Next Steps

After successful deployment:

1. ✅ Contract is deployed to Hedera testnet
2. ✅ ABI file is generated for frontend/backend integration
3. ✅ Contract ID is saved in `.env`

You can now:
- Test contract functions using the frontend
- Interact with the contract via the backend API
- View transactions on Hashscan explorer

## Contract Functions

The deployed Procurement contract includes:

### Role Management
- `addStateHead(address)` - Add state government officials
- `addDeputy(address)` - Add deputy officials
- `addVendor(address)` - Register vendors

### Budget Management
- `createBudget(amount, purpose)` - Create new budget
- `allocateBudget(budgetId, amount, area, deputy)` - Allocate funds

### Claim Management
- `submitClaim(budgetId, allocationId, amount, description, invoiceHash)` - Submit vendor claim
- `approveClaim(claimId)` - Approve claim
- `flagClaim(claimId, fraudScore)` - Flag fraudulent claim

### Read Functions
- `getBudgets(offset, limit)` - Get all budgets
- `getAllocations(budgetId)` - Get allocations for a budget
- `getClaims(offset, limit)` - Get all claims
- `getVendorClaims(vendor)` - Get claims by vendor
- `getSystemStats()` - Get system statistics

## Support

For issues or questions:
- Check the [Hedera Documentation](https://docs.hedera.com/)
- Review the contract code in `contracts/Procurement.sol`
- Check the deployment script in `backend/scripts/deploy_contract.py`
