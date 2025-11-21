# 💰 ckUSDC Integration Guide for H.E.L.I.X.

## 🎯 Overview

This guide explains how **ckUSDC (Chain-key USDC)** stablecoin integration works in the H.E.L.I.X. procurement system.

## 🔑 Key Concepts

### What is ckUSDC?

- **ckUSDC** = Chain-key USDC on Internet Computer
- 1:1 backed by real USDC on Ethereum
- **6 decimals** (same as USDC)
- Example: `1000000 = 1.00 USDC`
- **Canister ID**: `xevnm-gaaaa-aaaar-qafnq-cai`

### ICRC-1 Standard

ckUSDC follows the **ICRC-1 token standard** (like ERC-20 on Ethereum):
- `icrc1_balance_of()` - Check balance
- `icrc1_transfer()` - Send tokens
- `icrc1_fee()` - Get transfer fee
- `icrc1_decimals()` - Get decimal places

---

## 🔐 Transaction Flow with ckUSDC

### Phase 1: Authentication (One Time)

```
User clicks "Login with Internet Identity"
                ↓
┌────────────────────────────────────────┐
│  Internet Identity Popup Opens         │
│  ────────────────────────────────────  │
│  [Face ID/Fingerprint Authentication]  │
│                                        │
│  ✓ Authenticated                       │
│  Session: 7 days                       │
└────────────────────────────────────────┘
                ↓
User is logged in (NO MORE POPUPS for now)
```

### Phase 2: Budget Lock Transaction

**Step 1: Government Approves ckUSDC Transfer**

```typescript
// Government must first transfer ckUSDC to the canister
const ckusdcLedger = actor("xevnm-gaaaa-aaaar-qafnq-cai");

await ckusdcLedger.icrc1_transfer({
  to: { 
    owner: PROCUREMENT_CANISTER_ID,
    subaccount: null 
  },
  amount: 1_000_000_000_000n, // 1 million USDC
  fee: 10_000n, // 0.01 USDC fee
  memo: null,
  created_at_time: null
});
```

**❓ Does a Wallet Popup Appear?**

**Answer: IT DEPENDS on your authentication method:**

| Auth Method | Popup Behavior |
|-------------|----------------|
| **Internet Identity Only** | ❌ NO popup - Auto-signed |
| **Plug Wallet** | ✅ YES - Approval popup |
| **Stoic Wallet** | ✅ YES - Approval popup |
| **NFID** | ✅ YES - Approval popup |

**Step 2: Lock Budget in Canister**

```typescript
// Frontend call
const budgetId = await icpCanisterService.lockBudgetWithPayment(
  1_000_000_000_000, // 1M USDC
  "Infrastructure Development"
);

// ❌ NO POPUP - Transaction signed automatically with II delegation
```

### Phase 3: Claim Payment Transaction

**User Interface:**

```
┌────────────────────────────────────────┐
│  Pay Claim #123                        │
│  ────────────────────────────────────  │
│  Vendor: Alice                         │
│  Amount: 50,000 USDC                   │
│  Status: Approved by AI                │
│                                        │
│  ⏳ Processing payment...              │
│                                        │
│  [ Processing... ]                     │
└────────────────────────────────────────┘
```

**Backend Process:**

```motoko
// Smart contract executes ckUSDC transfer
let result = await ckusdcLedger.icrc1_transfer({
  from_subaccount: null,
  to: { owner: vendorPrincipal, subaccount: null },
  amount: 50_000_000_000, // 50k USDC
  fee: ?10_000,
  memo: ?"Claim payment #123",
  created_at_time: ?timestamp
});

// ✅ SUCCESS - Transaction complete
// NO POPUP - Canister signs the transaction
```

---

## 💡 Wallet Popups: When Do They Appear?

### Scenario A: Using Internet Identity ONLY

```
Login            → ✅ POPUP (Face ID/Fingerprint)
Transfer ckUSDC  → ❌ NO POPUP (Auto-signed)
Pay Claim        → ❌ NO POPUP (Auto-signed)
Lock Budget      → ❌ NO POPUP (Auto-signed)
```

**Why?** Once authenticated with II, your delegation allows automatic signing for 7 days.

### Scenario B: Using Plug Wallet

```
Login               → ✅ POPUP (Connect Plug)
Transfer ckUSDC     → ✅ POPUP (Approve transaction)
Approve Canister    → ✅ POPUP (Grant permission)
Lock Budget         → ✅ POPUP (Confirm transfer)
```

**Why?** Plug Wallet requires explicit approval for every token transfer.

### Scenario C: Using Your Current Setup

**Current Implementation:**
- ✅ Internet Identity authentication
- ❌ NO wallet integration (Plug/Stoic)
- ❌ Transactions are auto-signed by canister

**Result:** 
- Login: **POPUP appears** (II authentication)
- All transactions: **NO POPUPS** (seamless)

---

## 🛠️ Implementation Steps

### Step 1: Update Smart Contract

Replace your `main.mo` with `main_with_ckusdc.mo`:

```bash
cd canisters/procurement/src
cp main_with_ckusdc.mo main.mo
```

### Step 2: Update Frontend Budget Locking

```typescript
// frontend/src/components/Dashboard/MainGovernmentDashboard.tsx

const handleLockBudget = async () => {
  if (!budgetAmount || !budgetPurpose) {
    showToast('Please fill in all details', 'warning');
    return;
  }

  try {
    setLoading(true);

    // Convert USDC to token units (6 decimals)
    const amountInTokenUnits = parseFloat(budgetAmount) * 1_000_000;

    // 1. First transfer ckUSDC to canister
    showToast('Step 1: Transferring ckUSDC to canister...', 'info');
    const transferResult = await ckusdcLedgerService.transfer(
      PROCUREMENT_CANISTER_ID,
      amountInTokenUnits,
      { memo: new Uint8Array([1, 2, 3]) }
    );

    if ('err' in transferResult) {
      throw new Error('ckUSDC transfer failed');
    }

    // 2. Lock budget in canister
    showToast('Step 2: Locking budget...', 'info');
    const budgetId = await icpCanisterService.lockBudgetWithPayment(
      amountInTokenUnits,
      budgetPurpose
    );

    showToast(`✅ Budget locked! ID: ${budgetId}`, 'success');
    setBudgetAmount('');
    setBudgetPurpose('');

  } catch (error) {
    showToast(`❌ Failed: ${error.message}`, 'error');
  } finally {
    setLoading(false);
  }
};
```

### Step 3: Add Claim Payment UI

```typescript
// frontend/src/components/Dashboard/DeputyDashboard.tsx

const handlePayClaim = async (claimId: number) => {
  try {
    setLoading(true);
    showToast('Processing payment...', 'info');

    // Call smart contract to pay claim
    const txIndex = await icpCanisterService.payClaim(claimId);

    showToast(`✅ Payment completed! TX: ${txIndex}`, 'success');
    
    // Show transaction on ICP Explorer
    window.open(`https://dashboard.internetcomputer.org/transaction/${txIndex}`, '_blank');

  } catch (error) {
    showToast(`❌ Payment failed: ${error.message}`, 'error');
  } finally {
    setLoading(false);
  }
};
```

### Step 4: Update ICP Canister Service

```typescript
// frontend/src/services/icpCanisterService.ts

const idlFactory = ({ IDL }: { IDL: any }) => {
  return IDL.Service({
    // Add new ckUSDC functions
    lockBudgetWithPayment: IDL.Func(
      [IDL.Nat, IDL.Text], 
      [Result(IDL.Nat)], 
      []
    ),
    payClaim: IDL.Func(
      [IDL.Nat], 
      [Result(IDL.Nat)], 
      []
    ),
    getCanisterBalance: IDL.Func(
      [], 
      [IDL.Nat], 
      ['query']
    ),
    getPaymentHistory: IDL.Func(
      [IDL.Principal], 
      [IDL.Vec(PaymentRecord)], 
      ['query']
    ),
  });
};

// Add methods
class ICPCanisterService {
  async lockBudgetWithPayment(amount: number, purpose: string): Promise<number> {
    await this.ensureActor();
    const result = await (this.actor as any).lockBudgetWithPayment(
      BigInt(amount), 
      purpose
    );
    return Number(this.handleResult(result));
  }

  async payClaim(claimId: number): Promise<number> {
    await this.ensureActor();
    const result = await (this.actor as any).payClaim(BigInt(claimId));
    return Number(this.handleResult(result));
  }

  async getCanisterBalance(): Promise<number> {
    await this.ensureActor();
    const balance = await (this.actor as any).getCanisterBalance();
    return Number(balance);
  }
}
```

---

## 🧪 Testing

### Test 1: Check Canister Balance

```typescript
const balance = await icpCanisterService.getCanisterBalance();
console.log(`Canister has ${balance / 1_000_000} USDC`);
```

### Test 2: Transfer ckUSDC to Canister

```typescript
// From your wallet
const result = await ckusdcLedgerService.transfer(
  "your-canister-id",
  1_000_000, // 1 USDC
  { memo: new Uint8Array([]) }
);
console.log('Transfer result:', result);
```

### Test 3: Lock Budget

```typescript
const budgetId = await icpCanisterService.lockBudgetWithPayment(
  1_000_000, // 1 USDC
  "Test budget"
);
console.log('Budget locked:', budgetId);
```

### Test 4: Pay Claim

```typescript
const txIndex = await icpCanisterService.payClaim(1);
console.log('Payment TX:', txIndex);
```

---

## 📊 User Experience Flow

### For Government Officials

```
1. Login with II              → POPUP (one time)
2. Transfer ckUSDC to canister → Loading... (no popup)
3. Lock budget                → Loading... (no popup)
4. ✅ Success notification
```

### For Vendors

```
1. Login with II              → POPUP (one time)
2. Submit claim               → Loading... (no popup)
3. Wait for approval          → Notification
4. Receive ckUSDC payment     → ✅ Tokens in wallet
5. Check balance              → Show balance
```

### For Citizens

```
1. Login with II              → POPUP (one time)
2. View all transactions      → Real-time data
3. Check payment on blockchain → Link to ICP Explorer
4. Verify amounts             → All transparent
```

---

## 🔗 Important Links

- **ckUSDC Ledger**: `xevnm-gaaaa-aaaar-qafnq-cai`
- **ICP Explorer**: https://dashboard.internetcomputer.org/
- **ICRC-1 Spec**: https://github.com/dfinity/ICRC-1
- **ckUSDC Docs**: https://internetcomputer.org/docs/current/developer-docs/integrations/ckusdc

---

## 💸 Fee Structure

| Operation | Fee | Example |
|-----------|-----|---------|
| ckUSDC Transfer | 0.01 USDC | Fixed |
| Canister Call | ~0 ICP | Paid by canister (cycles) |
| Budget Lock | 0.01 USDC | Transfer fee |
| Claim Payment | 0.01 USDC | Transfer fee |

**Note:** Users only pay ckUSDC transfer fees, NOT gas fees!

---

## 🚨 Security Considerations

1. **Escrow Period**: 24-hour holding period before payment release
2. **AI Approval**: Claims must be approved by fraud detection AI
3. **Multi-sig**: Main government + deputy approval for large amounts
4. **Audit Trail**: All payments recorded on blockchain
5. **Balance Checks**: Verify sufficient funds before transfers

---

## 🎯 Next Steps

1. ✅ Deploy smart contract with ckUSDC integration
2. ✅ Update frontend to use new payment functions
3. ✅ Test on local replica
4. ✅ Test on IC testnet
5. ✅ Deploy to IC mainnet
6. ✅ Fund canister with cycles
7. ✅ Transfer initial ckUSDC to canister
8. 🚀 Go live!

---

## 📞 Support

If you need help with ckUSDC integration:
- ICP Forum: https://forum.dfinity.org/
- Discord: https://discord.gg/internetcomputer
- Docs: https://internetcomputer.org/docs

