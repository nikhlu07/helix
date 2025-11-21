# 🔐 H.E.L.I.X. Authentication System

## 🏆 Hackathon Innovation: Multi-Method Hedera Authentication

This directory contains the **authentication and authorization system** for H.E.L.I.X., featuring Hedera DID integration, principal-based auth, and flexible authentication methods for demos and production.

## 📁 Files in This Directory

| File | Size | Purpose |
|------|------|---------|
| `__init__.py` | - | Python package initializer |
| `middleware.py` | 9.8 KB | Authentication middleware for request processing |
| `prinicipal_auth.py` | 7.6 KB | Hedera principal ID authentication and verification |

## 📄 File Descriptions

### `middleware.py` - Authentication Middleware
**9.8 KB of request authentication logic**

**What it does:**
- Intercepts all API requests
- Extracts and validates JWT tokens
- Verifies Hedera DID signatures
- Enforces role-based access control
- Logs authentication events
- Handles authentication errors gracefully

**Key Functions:**
```python
async def authenticate_request(request: Request)
    # Validates JWT token and extracts user info
    
async def verify_hedera_did(did: str, signature: str)
    # Verifies Hedera DID signature
    
async def check_role_permissions(user: User, endpoint: str)
    # Enforces role-based access control
```

**Innovation:** Supports multiple authentication methods seamlessly

### `prinicipal_auth.py` - Principal ID Authentication
**7.6 KB of Hedera principal verification**

**What it does:**
- Authenticates users via Hedera principal IDs
- Maps principal IDs to user roles
- Verifies Hedera wallet signatures
- Manages principal-to-role mappings
- Handles DID (Decentralized Identifier) verification

**Key Functions:**
```python
def verify_principal_signature(principal: str, signature: str)
    # Verifies Hedera wallet signature
    
def get_user_from_principal(principal: str)
    # Maps principal ID to user account
    
def register_principal(principal: str, role: str)
    # Registers new principal with role
```

**Innovation:** Blockchain-based identity verification with Hedera DIDs

## 🎯 Authentication Flow

### 1. Hedera Wallet Authentication
```
User → Connect Wallet → Sign Message → Verify Signature → Generate JWT → Access Granted
```

**Process:**
1. User connects Hedera wallet (HashPack)
2. Backend sends challenge message
3. User signs message with private key
4. Backend verifies signature against public key
5. Backend generates JWT token
6. User accesses protected endpoints with token

### 2. Simple DID Authentication
```
User → Enter DID → Verify DID → Generate JWT → Access Granted
```

**Process:**
1. User enters Hedera DID
2. Backend verifies DID format
3. Backend checks DID against registry
4. Backend generates JWT token
5. User accesses protected endpoints

### 3. Demo Mode Authentication
```
User → Select Role → Generate Demo JWT → Access Granted
```

**Process:**
1. User selects role (Government, Deputy, Vendor, etc.)
2. Backend generates demo JWT with selected role
3. User accesses all features without blockchain verification

## 🔐 Security Features

### JWT Token Security
- **✅ Short Expiration**: Tokens expire in 30 minutes
- **✅ Refresh Tokens**: Long-lived refresh tokens for session management
- **✅ Secure Signing**: HS256 algorithm with secret key
- **✅ Token Rotation**: Refresh tokens rotate on use

### Hedera DID Security
- **✅ Signature Verification**: Cryptographic signature validation
- **✅ Public Key Cryptography**: Asymmetric encryption for security
- **✅ DID Registry**: Decentralized identity verification
- **✅ Replay Protection**: Nonce-based replay attack prevention

### Role-Based Access Control (RBAC)
- **✅ Granular Permissions**: Each role has specific endpoint access
- **✅ Hierarchical Roles**: Government > State > Deputy > Vendor
- **✅ Endpoint Protection**: Every endpoint checks user role
- **✅ Audit Logging**: All access attempts logged

## 🎯 Hackathon Highlights

### Technical Innovation
- **✅ Multi-Method Auth**: 3 authentication methods in one system
- **✅ Hedera Integration**: Full DID and wallet integration
- **✅ Production Ready**: Secure JWT implementation
- **✅ Demo Friendly**: Easy demo mode for judges

### Security Excellence
- **✅ Cryptographic Verification**: Blockchain-based identity
- **✅ Zero Trust**: Every request verified
- **✅ Audit Trail**: Complete authentication logging
- **✅ Error Handling**: Secure error messages

### Developer Experience
- **✅ Easy Testing**: Demo mode for rapid development
- **✅ Clear Documentation**: Well-documented functions
- **✅ Type Safety**: Full type hints throughout
- **✅ Middleware Pattern**: Clean separation of concerns

## 🚀 Quick Start

### Test Authentication
```python
# Demo mode login
response = client.post("/auth/demo/login", json={"role": "main_government"})
token = response.json()["access_token"]

# Use token for protected endpoints
headers = {"Authorization": f"Bearer {token}"}
response = client.get("/government/overview", headers=headers)
```

### Hedera Wallet Login
```python
# Connect wallet and get signature
wallet_signature = await hedera_wallet.sign(challenge_message)

# Login with signature
response = client.post("/auth/hedera/login", json={
    "principal": principal_id,
    "signature": wallet_signature
})
```

## 📊 Authentication Statistics

| Metric | Value |
|--------|-------|
| **Total Code** | ~17.4 KB |
| **Authentication Methods** | 3 methods |
| **Token Expiration** | 30 minutes |
| **Refresh Token Expiration** | 7 days |
| **Supported Roles** | 6 roles |

## 🔗 Related Documentation

- **API Endpoints**: [../api/README.md](../api/README.md) - API endpoint documentation
- **Backend README**: [../README.md](../README.md) - Backend overview
- **Frontend Auth**: [../../frontend/src/auth/README.md](../../frontend/src/auth/README.md) - Frontend authentication

## 📝 License

MIT License - see [LICENSE](../../LICENSE) for details.

---

**Built for Hedera Hackathon 2025** | **Category:** Blockchain Authentication Innovation
