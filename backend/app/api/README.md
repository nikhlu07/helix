# 🔌 H.E.L.I.X. Backend API Endpoints

## 🏆 Hackathon Innovation: Role-Based API Architecture

This directory contains **all API endpoint definitions** for H.E.L.I.X.'s role-based access system. Each file implements endpoints for a specific user role, providing tailored functionality for government officials, vendors, and citizens.

## 📁 Files in This Directory

| File | Size | Purpose |
|------|------|---------|
| `__init__.py` | - | Python package initializer |
| `auth.py` | 27.4 KB | Authentication endpoints (login, logout, token refresh, DID verification) |
| `citizen.py` | 4.9 KB | Citizen dashboard endpoints (transparency, reporting, verification) |
| `deps.py` | 9.6 KB | Dependency injection for authentication and authorization |
| `deputy.py` | 15.7 KB | Deputy officer endpoints (project management, vendor evaluation, claims) |
| `fraud.py` | 21.5 KB | Fraud detection endpoints (analysis, alerts, patterns, reporting) |
| `government.py` | 6.5 KB | Main government endpoints (overview, budget allocation, policy) |
| `vendor.py` | 12.3 KB | Vendor endpoints (contracts, payments, compliance, performance) |

## 🎯 API Endpoints by Role

### 🔐 Authentication (`auth.py`)
**27.4 KB of authentication logic**

- `POST /auth/hedera/login` - Hedera wallet authentication with DID verification
- `POST /auth/demo/login` - Demo mode login for testing
- `POST /auth/simple-did/login` - Simple DID authentication
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Secure logout
- `GET /auth/me` - Get current user info
- `GET /auth/verify` - Verify token validity

**Innovation:** Supports 3 authentication methods (Hedera Wallet, Simple DID, Demo Mode)

### 🏛️ Main Government (`government.py`)
**6.5 KB of government oversight endpoints**

- `GET /government/overview` - National fraud statistics and trends
- `GET /government/budget` - Budget allocation across all states
- `POST /government/allocate-budget` - Allocate budget to state heads
- `GET /government/states` - Inter-state corruption patterns
- `GET /government/analytics` - Data-driven policy recommendations

**Innovation:** Hierarchical budget allocation with real-time tracking

### 👮 Deputy Officers (`deputy.py`)
**15.7 KB of district management endpoints**

- `GET /deputy/projects` - District project management
- `GET /deputy/vendors` - Vendor evaluation and performance
- `POST /deputy/process-claim` - Process vendor payment claims
- `GET /deputy/investigations` - Local fraud investigations
- `POST /deputy/approve-payment` - Approve vendor payments
- `GET /deputy/budget` - District budget status

**Innovation:** Real-time fraud detection during claim processing

### 🏗️ Vendors (`vendor.py`)
**12.3 KB of vendor management endpoints**

- `GET /vendor/contracts` - Contract management and status
- `GET /vendor/payments` - Payment tracking and history
- `POST /vendor/submit-claim` - Submit payment claims
- `POST /vendor/compliance` - Compliance reporting
- `GET /vendor/performance` - Performance analytics and ratings
- `GET /vendor/bids` - Bid history and status

**Innovation:** Transparent payment tracking with blockchain verification

### 👩‍💻 Citizens (`citizen.py`)
**4.9 KB of public transparency endpoints**

- `GET /citizen/transparency` - Public procurement data access
- `POST /citizen/report` - Anonymous corruption reporting
- `GET /citizen/verify` - Community verification of projects
- `GET /citizen/impact` - Impact tracking of citizen reports
- `GET /citizen/projects` - Public project database

**Innovation:** Empowers citizens with oversight tools and anonymous reporting

### 🚨 Fraud Detection (`fraud.py`)
**21.5 KB of AI-powered fraud detection endpoints**

- `POST /fraud/analyze` - Analyze transaction for fraud (calls AI engine)
- `GET /fraud/alerts` - Get active fraud alerts
- `GET /fraud/patterns` - Historical fraud pattern analysis
- `POST /fraud/report` - Report suspicious activity
- `GET /fraud/statistics` - Fraud detection performance metrics
- `GET /fraud/claim/{id}` - Get fraud analysis for specific claim

**Innovation:** Real-time AI analysis with hybrid LLM + rules engine

### 🔧 Dependencies (`deps.py`)
**9.6 KB of dependency injection logic**

- `get_current_user()` - Extract and validate current user from JWT
- `require_role()` - Role-based access control decorator
- `get_db()` - Database session management
- `verify_hedera_signature()` - Hedera DID signature verification
- `rate_limiter()` - API rate limiting

**Innovation:** Comprehensive RBAC with Hedera DID integration

## 🎯 Hackathon Highlights

### Technical Excellence
- **✅ RESTful Design**: Clean, consistent API design following REST principles
- **✅ Role-Based Access**: 6 distinct user roles with tailored endpoints
- **✅ Type Safety**: Full Pydantic models for request/response validation
- **✅ Error Handling**: Comprehensive error responses with helpful messages
- **✅ Documentation**: Auto-generated OpenAPI docs at `/docs`

### Security Features
- **✅ JWT Authentication**: Secure token-based authentication
- **✅ Role Verification**: Every endpoint checks user permissions
- **✅ Rate Limiting**: Prevents API abuse
- **✅ Input Validation**: Pydantic models validate all inputs
- **✅ SQL Injection Protection**: SQLAlchemy ORM prevents injection attacks

### Real-World Impact
- **✅ Fraud Prevention**: Real-time AI analysis on every transaction
- **✅ Transparency**: Public endpoints for citizen oversight
- **✅ Accountability**: Immutable audit trails via Hedera
- **✅ Efficiency**: Streamlined workflows for government officials

## 🚀 Quick Start

### View API Documentation
```bash
# Start backend server
cd backend
uvicorn app.main:app --reload

# Open browser to:
http://localhost:8000/docs  # Swagger UI
http://localhost:8000/redoc # ReDoc
```

### Test Endpoints
```bash
# Login (demo mode)
curl -X POST http://localhost:8000/auth/demo/login \
  -H "Content-Type: application/json" \
  -d '{"role": "main_government"}'

# Get fraud alerts
curl -X GET http://localhost:8000/fraud/alerts \
  -H "Authorization: Bearer YOUR_TOKEN"

# Analyze transaction
curl -X POST http://localhost:8000/fraud/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000000, "vendor_id": "V001", "description": "Road construction"}'
```

## 📊 API Statistics

| Metric | Value |
|--------|-------|
| **Total Endpoints** | 40+ endpoints |
| **Total Code** | ~98 KB |
| **User Roles** | 6 roles |
| **Authentication Methods** | 3 methods |
| **Response Time** | < 100ms (avg) |

## 🔗 Related Documentation

- **Backend README**: [../README.md](../README.md) - Backend overview
- **Schemas**: [../schemas/README.md](../schemas/README.md) - Data models
- **Services**: [../services/README.md](../services/README.md) - Business logic

## 📝 License

MIT License - see [LICENSE](../../LICENSE) for details.

---

**Built for Hedera Hackathon 2025** | **Category:** API Architecture Excellence
