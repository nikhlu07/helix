# 🔌 H.E.L.I.X. Frontend Services

## 🏆 Hackathon Innovation: API Integration Layer

This directory contains **frontend service modules** that handle API communication, Hedera integration, and business logic for the H.E.L.I.X. frontend application.

## 📁 Files in This Directory

| File | Size | Purpose |
|------|------|---------|
| `api.ts` | 5.0 KB | Base API client with authentication and error handling |
| `corruptGuardService.ts` | 8.5 KB | Main service for fraud detection and government operations |
| `hederaService.ts` | 2.8 KB | Hedera blockchain integration service |
| `README.md` | 948 bytes | This file (updated for hackathon) |

## 📄 File Descriptions

### `api.ts` - Base API Client
**5.0 KB of API communication logic**

**What it does:**
- Provides base HTTP client for API requests
- Handles authentication token injection
- Manages request/response interceptors
- Implements error handling and retry logic
- Supports request cancellation

**Key Functions:**
```typescript
// Make GET request
async function get<T>(endpoint: string): Promise<T>

// Make POST request
async function post<T>(endpoint: string, data: any): Promise<T>

// Make PUT request
async function put<T>(endpoint: string, data: any): Promise<T>

// Make DELETE request
async function del<T>(endpoint: string): Promise<T>

// Set authentication token
function setAuthToken(token: string): void
```

**Innovation:** Centralized API client with automatic authentication and error handling

### `corruptGuardService.ts` - Main Application Service
**8.5 KB of business logic**

**What it does:**
- Fraud detection API calls
- Government operations (budget allocation, transactions)
- User management and authentication
- Dashboard data fetching
- Real-time fraud alerts

**Key Functions:**
```typescript
// Analyze transaction for fraud
async function analyzeTransaction(transaction: Transaction): Promise<FraudAnalysis>

// Get fraud alerts
async function getFraudAlerts(): Promise<FraudAlert[]>

// Allocate budget (government)
async function allocateBudget(allocation: BudgetAllocation): Promise<void>

// Process vendor claim (deputy)
async function processClaim(claim: Claim): Promise<ClaimResult>

// Get dashboard data
async function getDashboardData(role: UserRole): Promise<DashboardData>
```

**Innovation:** Comprehensive service layer abstracting all backend operations

### `hederaService.ts` - Hedera Blockchain Service
**2.8 KB of blockchain integration**

**What it does:**
- Hedera Consensus Service (HCS) integration
- Smart contract interactions (HSCS)
- DID verification
- Transaction submission to blockchain
- Blockchain data retrieval

**Key Functions:**
```typescript
// Submit transaction to HCS
async function submitToConsensus(data: any): Promise<string>

// Call smart contract function
async function callContract(contractId: string, functionName: string, params: any[]): Promise<any>

// Verify DID
async function verifyDID(did: string): Promise<boolean>

// Get transaction from blockchain
async function getTransaction(txId: string): Promise<Transaction>
```

**Innovation:** Seamless Hedera blockchain integration from frontend

## 🔄 Service Architecture

### API Request Flow
```
Component → Service Function → API Client → Backend API → Response → Service → Component
```

**Example:**
```typescript
// Component calls service
const alerts = await corruptGuardService.getFraudAlerts();

// Service calls API client
const response = await api.get('/fraud/alerts');

// API client adds auth and makes request
const data = await fetch(url, { headers: { Authorization: token } });

// Response flows back through layers
return data;
```

### Error Handling Flow
```
API Error → API Client Intercepts → Service Handles → Component Displays
```

**Example:**
```typescript
try {
  const data = await corruptGuardService.allocateBudget(allocation);
} catch (error) {
  if (error.status === 401) {
    // Redirect to login
  } else if (error.status === 403) {
    // Show permission error
  } else {
    // Show generic error
  }
}
```

## 🎯 Hackathon Highlights

### Technical Excellence
- **✅ Service Layer Pattern**: Clean separation of concerns
- **✅ Type Safety**: Full TypeScript coverage
- **✅ Error Handling**: Comprehensive error management
- **✅ Async/Await**: Modern async patterns

### Integration Features
- **✅ Hedera Integration**: Direct blockchain communication
- **✅ Fraud Detection**: Real-time AI analysis calls
- **✅ Authentication**: Automatic token management
- **✅ Caching**: Response caching for performance

### Developer Experience
- **✅ Simple API**: Easy-to-use service functions
- **✅ Well-Documented**: Inline documentation
- **✅ Type Hints**: Full IntelliSense support
- **✅ Testable**: Mockable service layer

## 🚀 Quick Start

### Use Services in Components
```typescript
import { corruptGuardService } from './services/corruptGuardService';
import { hederaService } from './services/hederaService';

// In component
const MyComponent = () => {
  const [alerts, setAlerts] = useState([]);
  
  useEffect(() => {
    // Fetch fraud alerts
    corruptGuardService.getFraudAlerts()
      .then(setAlerts)
      .catch(console.error);
  }, []);
  
  const handleAllocate = async (allocation) => {
    // Allocate budget
    await corruptGuardService.allocateBudget(allocation);
    
    // Submit to blockchain
    await hederaService.submitToConsensus(allocation);
  };
  
  return <div>{/* UI */}</div>;
};
```

### Configure API Client
```typescript
import { api } from './services/api';

// Set base URL
api.setBaseURL('https://api.helix.com');

// Set auth token
api.setAuthToken(userToken);

// Make requests
const data = await api.get('/government/overview');
```

## 📊 Service Statistics

| Metric | Value |
|--------|-------|
| **Total Code** | ~16.3 KB |
| **Service Files** | 3 files |
| **API Functions** | 30+ functions |
| **Type Definitions** | 20+ types |
| **Error Handlers** | 5+ error types |

## 🔗 Related Documentation

- **API Endpoints**: [../../backend/app/api/README.md](../../backend/app/api/README.md) - Backend API docs
- **Auth**: [../auth/README.md](../auth/README.md) - Authentication
- **Hooks**: [../hooks/README.md](../hooks/README.md) - Custom hooks using services

## 📝 License

MIT License - see [LICENSE](../../LICENSE) for details.

---

**Built for Hedera Hackathon 2025** | **Category:** Frontend Architecture
