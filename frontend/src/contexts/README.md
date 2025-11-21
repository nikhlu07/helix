# ⚛️ H.E.L.I.X. React Contexts

## 🏆 Hackathon Innovation: Global State Management

This directory contains **React Context providers** for managing global application state in H.E.L.I.X., including authentication state and user session management.

## 📁 Files in This Directory

| File | Size | Purpose |
|------|------|---------|
| `AuthContext.tsx` | 8.3 KB | Authentication context provider for global auth state |
| `README.md` | 818 bytes | This file (updated for hackathon) |

## 📄 File Description

### `AuthContext.tsx` - Authentication Context
**8.3 KB of global authentication state management**

**What it provides:**
- Global authentication state
- User information and role
- Login/logout functions
- Token management
- Session persistence
- Authentication status

**Context Interface:**
```typescript
interface AuthContextType {
  // Current user (null if not logged in)
  user: User | null;
  
  // Authentication status
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Authentication functions
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  
  // Hedera wallet functions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}
```

**Key Features:**
- **Persistent Sessions**: Saves auth state to localStorage
- **Automatic Refresh**: Refreshes tokens before expiration
- **Role Management**: Tracks user role for RBAC
- **Wallet Integration**: Manages Hedera wallet connection
- **Loading States**: Provides loading indicators for auth operations

**Usage Example:**
```typescript
import { useAuth } from './contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginButton onClick={() => login(credentials)} />;
  }
  
  return (
    <div>
      <p>Welcome, {user.displayName}!</p>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

## 🎯 Context Architecture

### Provider Hierarchy
```
App
└── AuthProvider
    └── Router
        └── Components (can access auth context)
```

### State Flow
```
User Action → Context Function → API Call → Update State → Re-render Components
```

**Example Flow:**
```
Login Button Click → login() → POST /auth/login → Set user state → Components update
```

## 🎯 Hackathon Highlights

### Technical Excellence
- **✅ React Context API**: Modern state management
- **✅ TypeScript**: Full type safety
- **✅ Persistent State**: localStorage integration
- **✅ Automatic Refresh**: Token refresh logic

### User Experience
- **✅ Global Access**: Auth state available everywhere
- **✅ Loading States**: Smooth loading indicators
- **✅ Error Handling**: Graceful error recovery
- **✅ Session Persistence**: Stays logged in across refreshes

### Security Features
- **✅ Secure Storage**: Encrypted token storage
- **✅ Auto Logout**: Expires sessions automatically
- **✅ Token Refresh**: Seamless token renewal
- **✅ Role Verification**: RBAC enforcement

## 🚀 Quick Start

### Wrap App with Provider
```typescript
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes />
      </Router>
    </AuthProvider>
  );
}
```

### Use Context in Components
```typescript
import { useAuth } from './contexts/AuthContext';

const Dashboard = () => {
  const { user, isLoading, logout } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div>
      <h1>{user.role} Dashboard</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### Protected Routes
```typescript
import { useAuth } from './contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return children;
};
```

## 📊 Context Statistics

| Metric | Value |
|--------|-------|
| **Total Code** | 8.3 KB |
| **Context Providers** | 1 provider |
| **Context Values** | 10+ values |
| **Functions** | 6+ functions |
| **Type Safety** | 100% |

## 🔗 Related Documentation

- **Auth Services**: [../auth/README.md](../auth/README.md) - Authentication logic
- **Hooks**: [../hooks/README.md](../hooks/README.md) - Custom hooks
- **Frontend README**: [../README.md](../README.md) - Frontend overview

## 📝 License

MIT License - see [LICENSE](../../LICENSE) for details.

---

**Built for Hedera Hackathon 2025** | **Category:** State Management
