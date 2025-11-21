# 🎣 H.E.L.I.X. Custom React Hooks

## 🏆 Hackathon Innovation: Reusable Logic Patterns

This directory contains **custom React hooks** that encapsulate reusable logic for H.E.L.I.X., including Hedera contract interactions and responsive design utilities.

## 📁 Files in This Directory

| File | Size | Purpose |
|------|------|---------|
| `useContracts.ts` | 12.2 KB | Custom hook for Hedera smart contract interactions |
| `use-media-query.ts` | - | Custom hook for responsive design media queries |
| `README.md` | 531 bytes | This file (updated for hackathon) |

## 📄 File Descriptions

### `useContracts.ts` - Hedera Contract Hook
**12.2 KB of smart contract interaction logic**

**What it does:**
- Provides easy interface to Hedera smart contracts
- Handles contract function calls
- Manages transaction signing
- Processes contract events
- Caches contract data

**Hook Interface:**
```typescript
interface UseContractsReturn {
  // Contract functions
  createTender: (tender: TenderData) => Promise<string>;
  submitBid: (bid: BidData) => Promise<string>;
  approveBid: (tenderId: string, vendorId: string) => Promise<void>;
  releasePayment: (contractId: string, milestoneId: string) => Promise<void>;
  
  // Contract queries
  getTender: (tenderId: string) => Promise<Tender>;
  getBids: (tenderId: string) => Promise<Bid[]>;
  getPaymentHistory: (contractId: string) => Promise<Payment[]>;
  
  // State
  isLoading: boolean;
  error: Error | null;
}
```

**Usage Example:**
```typescript
import { useContracts } from './hooks/useContracts';

const GovernmentDashboard = () => {
  const { createTender, getTender, isLoading } = useContracts();
  
  const handleCreateTender = async () => {
    const tenderId = await createTender({
      description: "Road Construction",
      budget: 1000000,
      deadline: Date.now() + 30 * 24 * 60 * 60 * 1000
    });
    console.log('Tender created:', tenderId);
  };
  
  return <button onClick={handleCreateTender} disabled={isLoading}>
    Create Tender
  </button>;
};
```

**Innovation:** Simplifies Hedera smart contract interactions with React hooks pattern

### `use-media-query.ts` - Responsive Design Hook
**Custom hook for media query detection**

**What it does:**
- Detects screen size changes
- Provides responsive breakpoints
- Updates on window resize
- Optimized with debouncing

**Hook Interface:**
```typescript
function useMediaQuery(query: string): boolean
```

**Usage Example:**
```typescript
import { useMediaQuery } from './hooks/use-media-query';

const ResponsiveComponent = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  
  if (isMobile) return <MobileView />;
  if (isTablet) return <TabletView />;
  return <DesktopView />;
};
```

**Innovation:** Declarative responsive design with React hooks

## 🎯 Hook Patterns

### Contract Interaction Pattern
```
Component → useContracts() → Hedera SDK → Smart Contract → Blockchain
```

**Flow:**
1. Component calls hook function
2. Hook prepares transaction
3. User signs transaction in wallet
4. Transaction submitted to Hedera
5. Hook returns result to component

### Responsive Design Pattern
```
Window Resize → useMediaQuery() → Re-render → Updated UI
```

**Flow:**
1. Window size changes
2. Hook detects change
3. Hook updates boolean value
4. Component re-renders
5. UI adapts to new size

## 🎯 Hackathon Highlights

### Technical Excellence
- **✅ Custom Hooks**: Reusable logic encapsulation
- **✅ TypeScript**: Full type safety
- **✅ Error Handling**: Comprehensive error management
- **✅ Performance**: Optimized with memoization

### Blockchain Integration
- **✅ Hedera SDK**: Direct smart contract calls
- **✅ Transaction Signing**: Wallet integration
- **✅ Event Listening**: Real-time contract events
- **✅ Data Caching**: Efficient data management

### Developer Experience
- **✅ Simple API**: Easy-to-use hook interface
- **✅ Well-Documented**: Inline documentation
- **✅ Type Hints**: Full IntelliSense support
- **✅ Reusable**: DRY principles applied

## 🚀 Quick Start

### Use Contract Hook
```typescript
import { useContracts } from './hooks/useContracts';

const VendorDashboard = () => {
  const { submitBid, getBids, isLoading, error } = useContracts();
  
  const handleSubmitBid = async (tenderId: string) => {
    try {
      const bidId = await submitBid({
        tenderId,
        amount: 500000,
        proposal: "Our proposal..."
      });
      alert(`Bid submitted: ${bidId}`);
    } catch (err) {
      console.error('Bid submission failed:', err);
    }
  };
  
  return <div>{/* UI */}</div>;
};
```

### Use Media Query Hook
```typescript
import { useMediaQuery } from './hooks/use-media-query';

const Dashboard = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
      {isMobile ? <MobileNav /> : <DesktopNav />}
      <Content />
    </div>
  );
};
```

## 📊 Hook Statistics

| Metric | Value |
|--------|-------|
| **Total Code** | ~12.2 KB |
| **Custom Hooks** | 2 hooks |
| **Contract Functions** | 10+ functions |
| **Type Definitions** | 15+ types |
| **Optimizations** | Memoization, debouncing |

## 🔗 Related Documentation

- **Contracts**: [../../contracts/README.md](../../contracts/README.md) - Smart contracts
- **Services**: [../services/README.md](../services/README.md) - API services
- **Contexts**: [../contexts/README.md](../contexts/README.md) - React contexts

## 📝 License

MIT License - see [LICENSE](../../LICENSE) for details.

---

**Built for Hedera Hackathon 2025** | **Category:** React Hooks Innovation
