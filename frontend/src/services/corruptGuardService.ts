// CorruptGuard Service - Handles Backend API and Hedera Integration
import { apiGet, apiPost, apiGetWithToken } from './api';
import hederaAuth from '../auth/hederaWallet';
import type { User, UserRole } from '../auth/types';

export interface FraudDetectionRequest {
  claim_id: number;
  vendor_id: string;
  amount: number;
  budget_id: number;
  allocation_id: number;
  invoice_hash: string;
  deputy_id: string;
  area: string;
  vendor_history?: Record<string, unknown>;
}

export interface FraudDetectionResponse {
  claim_id: number;
  score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  flags: string[];
  reasoning: string;
  confidence: number;
  timestamp: string;
}

export interface ClaimData {
  claim_id: number;
  vendor: string;
  amount: number;
  invoice_hash: string;
  deputy: string;
  ai_approved: boolean;
  flagged: boolean;
  paid: boolean;
  escrow_time: number;
  total_paid_to_suppliers: number;
  fraud_score?: number;
  challenge_count: number;
}

export interface BudgetData {
  budget_id: number;
  amount: number;
  purpose: string;
  allocated: number;
  remaining: number;
}

export interface FraudAlert {
  claim_id: number;
  alert_type: string;
  severity: string;
  description: string;
  timestamp: number;
  resolved: boolean;
}

export interface SystemStats {
  total_budget: number;
  active_claims: number;
  flagged_claims: number;
  total_challenges: number;
  vendor_count: number;
}

export interface DemoLoginRequest {
  role: string;
}

export interface DemoLoginResponse {
  access_token: string;
  token_type: string;
  principal_id: string;
  role: string;
  user_info: {
    name: string;
    title: string;
    permissions: string[];
    authenticated_at: string;
    demo_mode: boolean;
  };
  expires_in: number;
  demo_mode: boolean;
}

class CorruptGuardService {
  private currentUser: User | null = null;
  private accessToken: string | null = null;

  constructor() {
    // Auth handled by singleton hederaAuth
  }

  // Authentication Methods
  async init(): Promise<void> {
    await hederaAuth.init();
    this.currentUser = hederaAuth.user;
    this.accessToken = hederaAuth.token;
  }

  async loginWithHedera(): Promise<User> {
    try {
      const user = await hederaAuth.login();
      this.currentUser = user;
      this.accessToken = hederaAuth.token;
      return user;
    } catch (error) {
      console.error('Hedera login failed:', error);
      throw error;
    }
  }

  async loginWithDemo(role: string): Promise<User> {
    try {
      // Generate a mock principal for demo
      const mockPrincipal = `demo-${role}-${Date.now()}`;
      const user = await hederaAuth.loginDemo(mockPrincipal, role as UserRole);

      this.currentUser = user;
      this.accessToken = hederaAuth.token;

      console.log('✅ Demo login successful:', {
        role: user.role,
        name: user.name,
        isAuthenticated: hederaAuth.authenticated,
        hasToken: !!this.accessToken
      });

      return user;
    } catch (error) {
      console.error('Demo login failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await hederaAuth.logout();
      this.currentUser = null;
      this.accessToken = null;
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    // Check hederaAuth state
    if (hederaAuth.authenticated) {
      this.currentUser = hederaAuth.user;
      this.accessToken = hederaAuth.token;
      return this.currentUser;
    }

    // Try to restore if not currently authenticated but might have session
    const restored = await hederaAuth.restoreAuth();
    if (restored) {
      this.currentUser = hederaAuth.user;
      this.accessToken = hederaAuth.token;
      return this.currentUser;
    }

    return null;
  }

  // Fraud Detection Methods
  async detectFraud(claimData: FraudDetectionRequest): Promise<FraudDetectionResponse> {
    try {
      const response = await apiPost<FraudDetectionResponse>(
        '/api/v1/fraud/detect',
        claimData,
        {},
        true
      );
      return response.data;
    } catch (error) {
      console.error('Fraud detection failed:', error);
      throw error;
    }
  }

  async getFraudHistory(limit: number = 50): Promise<FraudDetectionResponse[]> {
    try {
      const response = await apiGet<FraudDetectionResponse[]>(
        `/api/v1/fraud/history?limit=${limit}`,
        {},
        true
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get fraud history:', error);
      throw error;
    }
  }

  // Hedera Smart Contract Methods
  async getClaims(): Promise<ClaimData[]> {
    try {
      const response = await apiGet<ClaimData[]>(
        '/api/v1/icp/claims',
        {},
        true
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get claims:', error);
      throw error;
    }
  }

  async getClaimById(claimId: number): Promise<ClaimData> {
    try {
      const response = await apiGet<ClaimData>(
        `/api/v1/icp/claims/${claimId}`,
        {},
        true
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get claim:', error);
      throw error;
    }
  }

  async submitClaim(claimData: Omit<ClaimData, 'claim_id' | 'escrow_time' | 'total_paid_to_suppliers' | 'challenge_count'>): Promise<ClaimData> {
    try {
      const response = await apiPost<ClaimData>(
        '/api/v1/icp/claims',
        claimData,
        {},
        true
      );
      return response.data;
    } catch (error) {
      console.error('Failed to submit claim:', error);
      throw error;
    }
  }

  async getBudgets(): Promise<BudgetData[]> {
    try {
      const response = await apiGet<BudgetData[]>(
        '/api/v1/icp/budgets',
        {},
        true
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get budgets:', error);
      throw error;
    }
  }

  async getFraudAlerts(): Promise<FraudAlert[]> {
    try {
      const response = await apiGet<FraudAlert[]>(
        '/api/v1/icp/fraud-alerts',
        {},
        true
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get fraud alerts:', error);
      throw error;
    }
  }

  async getSystemStats(): Promise<SystemStats> {
    try {
      const response = await apiGet<SystemStats>(
        '/api/v1/icp/stats',
        {},
        true
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get system stats:', error);
      throw error;
    }
  }

  // Demo Methods
  async generateTestScenario(): Promise<Record<string, unknown>> {
    try {
      const response = await apiPost(
        '/api/v1/demo/generate-test-scenario',
        {},
        {},
        true
      );
      return response.data;
    } catch (error) {
      console.error('Failed to generate test scenario:', error);
      throw error;
    }
  }

  async getFraudPatterns(): Promise<Record<string, unknown>> {
    try {
      const response = await apiGet(
        '/api/v1/demo/fraud-patterns',
        {},
        true
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get fraud patterns:', error);
      throw error;
    }
  }

  // Health Check
  async getHealth(): Promise<Record<string, unknown>> {
    try {
      const response = await apiGet('/health', {}, false);
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // Utility Methods
  isAuthenticated(): boolean {
    return this.currentUser !== null && this.accessToken !== null;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getUserRole(): string | null {
    return this.currentUser?.role || null;
  }

  isDemoMode(): boolean {
    return localStorage.getItem('demo_access_token') !== null;
  }
}

// Export singleton instance
export const corruptGuardService = new CorruptGuardService();
export default corruptGuardService;
