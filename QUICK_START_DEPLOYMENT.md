# Smart Contract Deployment - Quick Start

## ✅ Setup Complete

All dependencies are installed and ready:
- ✅ Python 3.11.9
- ✅ hedera-sdk-python
- ✅ py-solc-x  
- ✅ python-dotenv
- ✅ Deployment script fixed

## 🚀 Next Steps

### 1. Get Hedera Testnet Account

**Option A:** If you have an existing Hedera testnet account, use those credentials.

**Option B:** Create a new testnet account:
- Visit: https://portal.hedera.com/
- Sign up for free testnet account
- Get free testnet HBAR from the faucet

You'll receive:
- Account ID (e.g., `0.0.123456`)
- Private Key (long hex string starting with `302e...`)

### 2. Create .env File

```bash
# Copy the template
cp .env.example .env
```

Then edit `.env` and add your credentials:

```env
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.YOUR_ACCOUNT_ID
HEDERA_PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
```

### 3. Deploy Contract

```bash
cd backend/scripts
python deploy_contract.py
```

### 4. Save Contract ID

After deployment, copy the Contract ID from the output and update `.env`:

```env
HEDERA_CONTRACT_ID=0.0.XXXXXXX
```

## 📚 Full Documentation

See [`DEPLOYMENT_GUIDE.md`](file:///c:/Users/HPP/Downloads/hacks/Helix/DEPLOYMENT_GUIDE.md) for complete instructions, troubleshooting, and contract function reference.

## ⚡ Quick Commands

```bash
# Check Python version
python --version

# Install dependencies (if needed)
pip install hedera-sdk-python py-solc-x python-dotenv

# Deploy contract
cd backend/scripts
python deploy_contract.py

# View deployment on explorer
# https://hashscan.io/testnet/contract/YOUR_CONTRACT_ID
```

## 🔧 Files Created

- ✅ `DEPLOYMENT_GUIDE.md` - Comprehensive deployment guide
- ✅ `.env.example` - Environment variable template
- ✅ `backend/scripts/deploy_contract.py` - Fixed deployment script

## ❓ Need Help?

Common issues:
- **"Failed to initialize client"** → Check your credentials in `.env`
- **"Insufficient balance"** → Get testnet HBAR from portal.hedera.com/faucet
- **"Module not found"** → Run `pip install hedera-sdk-python`

Full troubleshooting in [`DEPLOYMENT_GUIDE.md`](file:///c:/Users/HPP/Downloads/hacks/Helix/DEPLOYMENT_GUIDE.md)
