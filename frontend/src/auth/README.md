# 🔐 H.E.L.I.X. Frontend Authentication

## 🏆 Hackathon Innovation: Hedera Wallet Integration

This directory contains **frontend authentication logic** for H.E.L.I.X., featuring Hedera wallet integration, DID authentication, and demo mode support.

## 📁 Files in This Directory

| File | Size | Purpose |
|------|------|---------|
| `hederaWallet.ts` | 13.4 KB | Hedera wallet integration and API communication |
| `types.ts` | 1.0 KB | TypeScript type definitions for authentication |
| `README.md` | 1.3 KB | This file (updated for hackathon) |

## 📄 File Descriptions

### `hederaWallet.ts` - Hedera Wallet Integration
**13.4 KB of Hedera authentication logic**

**What it does:**
- Connects to Hedera wallets (HashPack, Blade, etc.)
- Signs authentication challenges
- Manages wallet sessions
- Handles DID verification
- Provides API request wrapper with authentication
- Manages token refresh

**Key Functions:**
```typescript
// Connect to Hedera wallet
async function connectWallet(): Promise<WalletConnection>

// Sign authentication message
async function signMessage(message: string): Promise<string>

// Make authenticated API request
async function apiRequest<T>(endpoint: string, options?: RequestOptions): Promise<T>

// Disconnect wallet
async function disconnectWallet(): Promise<void>

// Get current wallet info
function getWalletInfo(): WalletInfo | null
```

**Supported Wallets:**
- ✅ HashPack (primary)
- ✅ Blade Wallet
- ✅ Demo Mode (no wallet required)

**Innovation:** Seamless integration with Hedera ecosystem while maintaining demo mode for testing

### `types.ts` - Authentication Types
**1.0 KB of TypeScript type definitions**

**What it defines:**
```typescript
// User authentication state
interface AuthUser {
  principal: string;
  role: UserRole;
  displayName: string;
  walletAddress?: string;
}

// Wallet connection info
interface WalletConnection {
  accountId: string;
  publicKey: string;
  network: 'mainnet' | 'testnet';
}

// Authentication methods
type AuthMethod = 'hedera_wallet' | 'simple_did' | 'demo';

// User roles
type UserRole = 
  | 'main_government'
  | 'state_head'
  | 'deputy'
  | 'vendor'
  | 'sub_supplier'
  | 'citizen';
```

**Innovation:** Type-safe authentication with support for multiple methods

## 🔄 Authentication Flow

### 1. Hedera Wallet Authentication
```
User → Click "Connect Wallet" → Select Wallet → Approve Connection → 
Sign Challenge → Verify Signature → Generate JWT → Login Success
```

**Process:**
1. User clicks "Connect Wallet" button
2. Wallet selector appears (HashPack, Blade, etc.)
3. User approves connection in wallet
4. Backend sends authentication challenge
5. User signs challenge with private key
6. Frontend sends signature to backend
7. Backend verifies signature and issues JWT
8. Frontend stores JWT and user info

### 2. Simple DID Authentication
```
User → Enter DID → Verify Format → Backend Validates → Generate JWT → Login Success
```

**Process:**
1. User enters Hedera DID
2. Frontend validates DID format
3. Backend checks DID registry
4. Backend issues JWT
5. Frontend stores JWT and user info

### 3. Demo Mode
```
User → Select Role → Generate Demo JWT → Login Success
```

**Process:**
1. User selects role from dropdown
2. Frontend requests demo JWT from backend
3. Backend issues demo JWT with selected role
4. Frontend stores JWT and user info

## 🎯 Hackathon Highlights

### Technical Innovation
- **✅ Multi-Wallet Support**: Works with HashPack, Blade, and more
- **✅ DID Integration**: Decentralized identity verification
- **✅ Demo Mode**: Easy testing without wallet
- **✅ Type Safety**: Full TypeScript coverage

### Security Features
- **✅ Signature Verification**: Cryptographic authentication
- **✅ Token Management**: Secure JWT storage and refresh
- **✅ Session Handling**: Automatic session expiration
- **✅ Error Handling**: Graceful error recovery

### Developer Experience
- **✅ Simple API**: Easy-to-use authentication functions
- **✅ Well-Documented**: Comprehensive inline documentation
- **✅ Type Hints**: Full TypeScript IntelliSense support
- **✅ Error Messages**: Clear, actionable error messages

## 🚀 Quick Start

### Connect Hedera Wallet
```typescript
import { connectWallet, signMessage } from './auth/hederaWallet';

// Connect wallet
const connection = await connectWallet();
console.log('Connected:', connection.accountId);

// Sign authentication challenge
const challenge = await fetch('/api/auth/challenge').then(r => r.json());
const signature = await signMessage(challenge.message);

// Login with signature
const response = await fetch('/api/auth/hedera/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ signature, accountId: connection.accountId })
});
```

### Make Authenticated API Request
```typescript
import { apiRequest } from './auth/hederaWallet';

// Make authenticated request
const data = await apiRequest('/api/government/overview');
console.log('Dashboard data:', data);

// Request automatically includes JWT token
// Handles token refresh if needed
```

## 📊 Authentication Statistics

| Metric | Value |
|--------|-------|
| **Total Code** | ~14.4 KB |
| **Supported Wallets** | 3+ wallets |
| **Authentication Methods** | 3 methods |
| **Type Definitions** | 10+ types |
| **Functions** | 15+ functions |

## 🔗 Related Documentation

- **Backend Auth**: [../../backend/app/auth/README.md](../../backend/app/auth/README.md) - Backend authentication
- **Auth Context**: [../contexts/README.md](../contexts/README.md) - React auth context
- **Frontend README**: [../README.md](../README.md) - Frontend overview

## 📝 License

MIT License - see [LICENSE](../../LICENSE) for details.

---

**Built for Hedera Hackathon 2025** | **Category:** Blockchain Authentication
