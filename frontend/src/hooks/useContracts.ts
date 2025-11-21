import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import hederaWallet from '../auth/hederaWallet';
import { authService } from '../auth/authService';

export interface ContractState {
  loading: boolean;
  error: string | null;
  connected: boolean;
}

export interface BudgetData {
  id: number;
  amount: number;
  purpose: string;
  allocated: number;
  remaining: number;
  utilizationPercentage: number;
}

export interface ClaimData {
  claimId: number;
  vendor: string;
  amount: number;
  formattedAmount: string;
  invoiceHash: string;
  deputy: string;
  aiApproved: boolean;
  flagged: boolean;
  paid: boolean;
  fraudScore?: number;
  riskLevel: string;
  challengeCount: number;
  status: string;
  alerts: FraudAlert[];
}

export interface FraudAlert {
  type: string;
  severity: string;
  description: string;
  timestamp: number;
  resolved: boolean;
}

export interface SystemStats {
  totalBudget: number;
  activeClaims: number;
  flaggedClaims: number;
  totalChallenges: number;
  vendorCount: number;
  fraudRate: number;
  challengeRate: number;
}

export const useContract = () => {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<ContractState>({
    loading: false,
    error: null,
    connected: false
  });

  // Initialize Hedera connection
  useEffect(() => {
    const initConnection = async () => {
      if (isAuthenticated) {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
          await hederaWallet.init();
          setState(prev => ({ ...prev, connected: true, loading: false }));
        } catch (error) {
          console.error('Failed to connect to Hedera wallet:', error);
          setState(prev => ({
            ...prev,
            connected: false,
            loading: false,
            error: 'Failed to connect to Hedera wallet'
          }));
        }
      }
    };

    initConnection();
  }, [isAuthenticated]);

  // Generic contract call wrapper
  const callContract = useCallback(async <T>(
    operation: () => Promise<T>,
    errorMessage: string = 'Contract operation failed'
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await operation();
      setState(prev => ({ ...prev, loading: false }));
      return result;
    } catch (error) {
      console.error(`Contract call failed:`, error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : errorMessage
      }));
      return null;
    }
  }, []);

  // Backend API Integration
  const callBackendAPI = useCallback(async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await authService.apiCall(endpoint, options);

      if (!response.ok) {
        // Try to parse error message
        try {
          const errorData = await response.json();
          throw new Error(errorData.detail || `API call failed: ${response.statusText}`);
        } catch (e) {
          throw new Error(`API call failed: ${response.statusText}`);
        }
      }

      const result = await response.json();
      setState(prev => ({ ...prev, loading: false }));
      return result;
    } catch (error) {
      console.error('Backend API call failed:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'API call failed'
      }));
      return null;
    }
  }, []);

  // Government Operations
  const lockBudget = useCallback(async (amount: number, purpose: string) => {
    return callBackendAPI('/government/budget/create', {
      method: 'POST',
      body: JSON.stringify({ amount, purpose })
    });
  }, [callBackendAPI]);

  const allocateBudget = useCallback(async (
    budgetId: number,
    amount: number,
    area: string,
    deputy: string
  ) => {
    return callBackendAPI(`/government/budget/${budgetId}/allocate`, {
      method: 'POST',
      body: JSON.stringify({ amount, area, deputy })
    });
  }, [callBackendAPI]);

  const proposeStateHead = useCallback(async (principal: string) => {
    // Mock implementation for now, or add endpoint
    console.log("Proposing state head:", principal);
    return { success: true };
  }, []);

  const confirmStateHead = useCallback(async (principal: string) => {
    // Mock implementation
    console.log("Confirming state head:", principal);
    return { success: true };
  }, []);

  const proposeVendor = useCallback(async (principal: string) => {
    // Mock implementation
    console.log("Proposing vendor:", principal);
    return { success: true };
  }, []);

  const approveVendor = useCallback(async (principal: string) => {
    // Mock implementation
    console.log("Approving vendor:", principal);
    return { success: true };
  }, []);

  // Vendor Operations
  const submitClaim = useCallback(async (
    budgetId: number,
    allocationId: number,
    amount: number,
    description: string,
    workDetails: string
  ) => {
    return callBackendAPI('/vendor/claim/submit', {
      method: 'POST',
      body: JSON.stringify({
        budget_id: budgetId,
        allocation_id: allocationId,
        amount,
        description,
        work_details: workDetails
      })
    });
  }, [callBackendAPI]);

  // Fraud Detection Operations
  const updateFraudScore = useCallback(async (claimId: number, score: number) => {
    // Mock or add endpoint
    console.log("Updating fraud score:", claimId, score);
    return { success: true };
  }, []);

  const approveClaimByAI = useCallback(async (
    claimId: number,
    approve: boolean,
    reason: string
  ) => {
    // Mock or add endpoint
    console.log("AI Approving claim:", claimId, approve, reason);
    return { success: true };
  }, []);

  const addFraudAlert = useCallback(async (
    claimId: number,
    alertType: string,
    severity: string,
    description: string
  ) => {
    // Mock or add endpoint
    console.log("Adding fraud alert:", claimId, alertType);
    return { success: true };
  }, []);

  // Challenge System
  const stakeChallenge = useCallback(async (
    invoiceHash: string,
    reason: string,
    evidence: string
  ) => {
    return callBackendAPI('/citizen/challenge/stake', {
      method: 'POST',
      body: JSON.stringify({
        invoice_hash: invoiceHash,
        reason,
        evidence
      })
    });
  }, [callBackendAPI]);

  // Query Operations
  const getClaim = useCallback(async (claimId: number) => {
    // Mock or add endpoint
    return null;
  }, []);

  const getAllClaims = useCallback(async (): Promise<ClaimData[] | null> => {
    // Use backend API to get claims
    // This endpoint might need to be adjusted based on actual backend implementation
    // For now, returning mock data or empty list if endpoint fails
    const result = await callBackendAPI<any[]>('/government/claims/all'); // Adjust endpoint
    if (!result) return [];

    return result.map((claim: any) => ({
      claimId: claim.id,
      vendor: claim.vendor_id,
      amount: claim.amount,
      formattedAmount: `$${claim.amount}`,
      invoiceHash: claim.invoice_hash || "N/A",
      deputy: claim.deputy_id || "N/A",
      aiApproved: claim.status === 'approved',
      flagged: claim.status === 'flagged',
      paid: claim.status === 'paid',
      fraudScore: claim.fraud_score,
      riskLevel: calculateRiskLevel(claim.fraud_score),
      challengeCount: 0,
      status: claim.status,
      alerts: []
    }));
  }, [callBackendAPI]);

  const getHighRiskClaims = useCallback(async () => {
    return callBackendAPI('/government/fraud/alerts/high-risk');
  }, [callBackendAPI]);

  const getBudgetTransparency = useCallback(async (): Promise<BudgetData[] | null> => {
    const result = await callBackendAPI<any[]>('/government/budget/transparency');
    if (!result) return [];

    return result.map((budget: any) => ({
      id: budget.id,
      amount: budget.total_amount,
      purpose: budget.purpose,
      allocated: budget.allocated_amount,
      remaining: budget.remaining_amount,
      utilizationPercentage: budget.total_amount > 0
        ? (budget.allocated_amount / budget.total_amount) * 100
        : 0
    }));
  }, [callBackendAPI]);

  const getSystemStats = useCallback(async (): Promise<SystemStats | null> => {
    const result = await callBackendAPI<any>('/government/stats/system');
    if (!result) return null;

    return {
      totalBudget: result.total_budget || 0,
      activeClaims: result.active_claims || 0,
      flaggedClaims: result.flagged_claims || 0,
      totalChallenges: result.total_challenges || 0,
      vendorCount: result.vendor_count || 0,
      fraudRate: result.fraud_rate || 0,
      challengeRate: result.challenge_rate || 0
    };
  }, [callBackendAPI]);

  const getFraudAlerts = useCallback(async (claimId: number) => {
    // Mock
    return [];
  }, []);

  const getAllBudgets = useCallback(async () => {
    return getBudgetTransparency();
  }, [getBudgetTransparency]);


  // Utility functions
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const refreshConnection = useCallback(async () => {
    // Re-init wallet
    await hederaWallet.init();
  }, []);

  return {
    // State
    ...state,

    // Operations
    lockBudget,
    allocateBudget,
    proposeStateHead,
    confirmStateHead,
    proposeVendor,
    approveVendor,
    submitClaim,
    updateFraudScore,
    approveClaimByAI,
    addFraudAlert,
    stakeChallenge,

    // Query operations
    getClaim,
    getAllClaims,
    getHighRiskClaims,
    getBudgetTransparency,
    getAllBudgets, // Alias for compatibility
    getSystemStats,
    getFraudAlerts,

    // Utilities
    clearError,
    refreshConnection,
    callContract,
    callBackendAPI
  };
};

// Helper functions
function calculateRiskLevel(fraudScore?: number): string {
  if (fraudScore === undefined) return 'unknown';
  if (fraudScore >= 80) return 'critical';
  if (fraudScore >= 60) return 'high';
  if (fraudScore >= 30) return 'medium';
  return 'low';
}

function getClaimStatus(claim: Record<string, unknown>): string {
  if (claim.paid) return 'paid';
  if (claim.flagged) return 'flagged';
  if (claim.aiApproved) return 'approved';
  return 'pending';
}

// Hook for role-specific contract operations
export const useRoleBasedContract = () => {
  const { user } = useAuth();
  const contract = useContract();

  const getAvailableOperations = useCallback(() => {
    if (!user) return [];

    const operations = [];

    if (user.role === 'main_government') {
      operations.push(
        'lockBudget',
        'proposeStateHead',
        'confirmStateHead',
        'proposeVendor',
        'approveVendor',
        'updateFraudScore',
        'approveClaimByAI',
        'addFraudAlert'
      );
    }

    if (user.role === 'state_head' || user.role === 'main_government') {
      operations.push('allocateBudget');
    }

    if (user.role === 'vendor') {
      operations.push('submitClaim');
    }

    if (user.role === 'citizen') {
      operations.push('stakeChallenge');
    }

    // All authenticated users can query
    operations.push(
      'getClaim',
      'getAllClaims',
      'getBudgetTransparency',
      'getSystemStats'
    );

    return operations;
  }, [user]);

  return {
    ...contract,
    availableOperations: getAvailableOperations(),
    canPerformOperation: useCallback((operation: string) => {
      return getAvailableOperations().includes(operation);
    }, [getAvailableOperations])
  };
};