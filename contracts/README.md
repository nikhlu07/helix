# ⛓️ H.E.L.I.X. Smart Contracts

## 🏆 Hackathon Innovation: Blockchain-Powered Procurement

This directory contains the **Hedera smart contracts** that power H.E.L.I.X.'s immutable procurement system. Built on Hedera Smart Contract Service (HSCS), these contracts ensure transparency and tamper-proof execution of government procurement processes.

## 📁 Files in This Directory

| File | Size | Purpose |
|------|------|---------|
| `Procurement.sol` | 8.6 KB | Main procurement smart contract with bid management, approval workflows, and payment processing |

## 🎯 Procurement Smart Contract

### Overview
`Procurement.sol` is a comprehensive Solidity smart contract deployed on Hedera Smart Contract Service (HSCS). It manages the entire procurement lifecycle from tender creation to payment disbursement.

### Key Features

#### 🏗️ Tender Management
- **Create Tenders**: Government officials can create procurement tenders with specifications
- **Bid Submission**: Vendors submit bids with pricing and delivery timelines
- **Bid Evaluation**: Automated and manual bid evaluation with scoring
- **Winner Selection**: Transparent winner selection with immutable records

#### 💰 Payment Processing
- **Milestone-Based Payments**: Payments tied to project milestones
- **Escrow System**: Funds held in contract until delivery verification
- **Automatic Disbursement**: Smart contract releases payments upon approval
- **Audit Trail**: Complete payment history stored on-chain

#### 🛡️ Fraud Prevention
- **Immutable Records**: All bids and decisions permanently recorded
- **Timestamp Verification**: Prevents backdating and timeline manipulation
- **Multi-Signature Approvals**: Requires multiple officials for large transactions
- **Transparent Bidding**: All bid data visible for public scrutiny

#### 👥 Role-Based Access Control
- **Government Officials**: Create tenders, approve payments
- **Vendors**: Submit bids, track contract status
- **Auditors**: Read-only access to all procurement data
- **Citizens**: Public transparency for oversight

## 🚀 Deployment

### Prerequisites
```bash
# Install Hedera SDK
npm install @hashgraph/sdk

# Set up Hedera account
# Get testnet account from: https://portal.hedera.com
```

### Deploy to Hedera Testnet
```bash
# Navigate to backend directory
cd ../backend

# Run deployment script
python scripts/deploy_contract.py

# Contract will be deployed to Hedera testnet
# Contract ID will be saved to .env file
```

### Deploy to Hedera Mainnet
```bash
# Set environment to mainnet
export HEDERA_NETWORK=mainnet

# Deploy contract
python scripts/deploy_contract.py --network mainnet

# IMPORTANT: Mainnet deployment requires real HBAR
```

## 🔧 Contract Functions

### For Government Officials
```solidity
// Create a new procurement tender
function createTender(
    string memory description,
    uint256 budget,
    uint256 deadline
) public onlyGovernment returns (uint256 tenderId)

// Approve a vendor bid
function approveBid(
    uint256 tenderId,
    address vendor
) public onlyGovernment

// Release milestone payment
function releasePayment(
    uint256 contractId,
    uint256 milestoneId
) public onlyGovernment
```

### For Vendors
```solidity
// Submit a bid for a tender
function submitBid(
    uint256 tenderId,
    uint256 bidAmount,
    string memory proposal
) public onlyVendor returns (uint256 bidId)

// Update contract delivery status
function updateDeliveryStatus(
    uint256 contractId,
    uint256 milestoneId,
    string memory proof
) public onlyVendor
```

### For Public Transparency
```solidity
// Get tender details (public)
function getTender(uint256 tenderId) 
    public view returns (Tender memory)

// Get all bids for a tender (public)
function getTenderBids(uint256 tenderId) 
    public view returns (Bid[] memory)

// Get contract payment history (public)
function getPaymentHistory(uint256 contractId) 
    public view returns (Payment[] memory)
```

## 🎯 Hackathon Highlights

### Technical Innovation
- **✅ Hedera HSCS Integration**: Full smart contract deployment on Hedera
- **✅ EVM Compatibility**: Standard Solidity contract works on Hedera
- **✅ Gas Efficiency**: Optimized for low transaction costs
- **✅ Event Emission**: Comprehensive event logging for transparency

### Social Impact
- **✅ Immutable Audit Trail**: Cannot delete or modify procurement records
- **✅ Public Transparency**: All procurement data accessible to citizens
- **✅ Fraud Prevention**: Smart contract logic prevents common corruption patterns
- **✅ Automated Compliance**: Contract enforces procurement rules automatically

### Production Ready
- **✅ Tested**: Comprehensive test suite for all contract functions
- **✅ Deployed**: Live on Hedera testnet
- **✅ Integrated**: Connected to H.E.L.I.X. backend via Hedera SDK
- **✅ Documented**: Full API documentation and deployment guides

## 🔗 Integration with H.E.L.I.X.

The smart contract integrates with the H.E.L.I.X. backend through the Hedera SDK:

```python
# Backend integration (Python)
from hedera import ContractExecuteTransaction, ContractId

# Call contract function
contract_exec = ContractExecuteTransaction()
    .setContractId(ContractId.fromString(contract_id))
    .setGas(100000)
    .setFunction("createTender", parameters)
    .execute(client)

# Get transaction receipt
receipt = contract_exec.getReceipt(client)
```

```typescript
// Frontend integration (TypeScript)
import { ContractExecuteTransaction } from "@hashgraph/sdk";

// Execute contract function
const contractExec = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction("submitBid", parameters)
    .execute(client);
```

## 📊 Contract Statistics

| Metric | Value |
|--------|-------|
| **Contract Size** | 8.6 KB |
| **Functions** | 25+ public functions |
| **Events** | 12 event types |
| **Gas Optimization** | < 100k gas per transaction |
| **Security Audits** | Self-audited, ready for professional audit |

## 🧪 Testing

```bash
# Run contract tests
cd ../backend
pytest tests/test_contracts.py -v

# Test deployment
python scripts/deploy_contract.py --test
```

## 🔐 Security Features

- **✅ Access Control**: Role-based permissions enforced at contract level
- **✅ Reentrancy Protection**: Guards against reentrancy attacks
- **✅ Integer Overflow Protection**: Solidity 0.8+ built-in protection
- **✅ Input Validation**: All inputs validated before processing
- **✅ Emergency Pause**: Contract can be paused in case of emergency

## 📚 Additional Resources

- **Hedera Documentation**: [docs.hedera.com](https://docs.hedera.com)
- **Solidity Guide**: [docs.soliditylang.org](https://docs.soliditylang.org)
- **HSCS Overview**: [hedera.com/smart-contract](https://hedera.com/smart-contract)

## 📝 License

MIT License - see [LICENSE](../LICENSE) for details.

---

**Built for Hedera Hackathon 2025** | **Category:** Blockchain for Government Transparency
