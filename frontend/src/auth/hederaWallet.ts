/**
 * CorruptGuard Hedera Wallet Integration
 * Handles authentication with Hedera and API communication
 */

import type {
  User,
  UserRole,
  SessionData,
  ApiRequestOptions,
  DemoUser,
  AuthResponse
} from './types';
import { hederaService } from '../services/hederaService';

// Configuration
interface Config {
  // Backend API URL
  API_URL: string;
  // Hedera Network
  NETWORK: string;
}

const CONFIG: Config = {
  // Backend API URL
  API_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api/v1',
  // Hedera Network
  NETWORK: import.meta.env.VITE_HEDERA_NETWORK || 'testnet'
};

type AuthListener = (state: { isAuthenticated: boolean; user: User | null; principal: string | null }) => void;

class HederaAuth {
  private principal: string | null = null;
  private isAuthenticated: boolean = false;
  private userProfile: User | null = null;
  private apiToken: string | null = null;
  private sessionId: string | null = null;
  private authListeners: AuthListener[] = [];

  /**
   * Initialize the authentication client
   */
  async init(): Promise<void> {
    try {
      console.log('🔧 Initializing Hedera auth client...');
      // Check for existing session
      await this.restoreAuth();
    } catch (error) {
      console.error('❌ Failed to initialize auth client:', error);
      throw error;
    }
  }

  /**
   * Login with Hedera Wallet
   */
  async login(): Promise<User> {
    try {
      console.log('🔐 Starting Hedera wallet login...');

      const walletData = await hederaService.connectWallet();

      if (!walletData || !walletData.accountId) {
        throw new Error("Wallet connection failed or rejected");
      }

      await this.handleAuthSuccess(walletData.accountId);

      if (this.userProfile) {
        return this.userProfile;
      } else {
        throw new Error('Failed to get user profile after login');
      }
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  }

  /**
   * Login with demo credentials (development only)
   */
  async loginDemo(principalId: string, role: UserRole): Promise<User> {
    try {
      console.log('🎭 Demo login as:', role);

      const response = await fetch(`${CONFIG.API_URL}/auth/demo-login/${role}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Demo login failed: ${response.statusText}`);
      }

      const data: AuthResponse = await response.json();

      // Adapt to backend response shape
      this.userProfile = {
        principal: principalId,
        role: data.role as UserRole,
        name: data.user_info?.name || 'Demo User',
        permissions: data.user_info?.permissions || [],
      } as unknown as User;
      this.apiToken = data.access_token;
      this.sessionId = 'demo-session';
      this.isAuthenticated = true;
      this.principal = principalId;

      const sessionData: SessionData = {
        token: this.apiToken,
        sessionId: this.sessionId,
        user: this.userProfile,
        demoMode: true
      };
      localStorage.setItem('corruptguard_auth', JSON.stringify(sessionData));

      this.notifyAuthListeners(true);
      console.log('✅ Demo authentication successful');
      return this.userProfile;
    } catch (error) {
      console.error('❌ Demo login failed:', error);
      throw error;
    }
  }

  private async handleAuthSuccess(accountId: string): Promise<void> {
    try {
      this.principal = accountId;
      console.log('🆔 Account ID:', this.principal);

      // Authenticate with backend
      // Note: In real implementation, we would sign a message with the wallet
      // and send the signature to the backend for verification.
      // For now, we just mock the backend login call or use a dev endpoint.

      // Mock backend response for now since /auth/login/hedera might not exist yet
      const mockResponse: AuthResponse = {
        access_token: "mock_hedera_token",
        token_type: "bearer",
        role: "citizen", // Default role
        user_info: {
          name: "Hedera User",
          permissions: []
        },
        expires_in: 3600
      };

      this.userProfile = {
        principal: this.principal,
        role: mockResponse.role as UserRole,
        name: mockResponse.user_info?.name || 'Hedera User',
        permissions: mockResponse.user_info?.permissions || [],
      } as unknown as User;

      this.apiToken = mockResponse.access_token;
      this.sessionId = 'hedera-session';
      this.isAuthenticated = true;

      const sessionData: SessionData = {
        token: this.apiToken,
        sessionId: this.sessionId,
        user: this.userProfile,
        demoMode: false
      };
      localStorage.setItem('corruptguard_auth', JSON.stringify(sessionData));

      this.notifyAuthListeners(true);
      console.log('✅ Backend authentication successful');
    } catch (error) {
      console.error('❌ Auth success handling failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      console.log('👋 Logging out...');

      // Logout from backend
      if (this.apiToken) {
        try {
          await fetch(`${CONFIG.API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.apiToken}`
            },
            body: JSON.stringify({
              token: this.apiToken,
              session_id: this.sessionId
            })
          });
        } catch (error) {
          console.warn('⚠️ Backend logout failed:', error);
        }
      }

      // Clear local state
      this.clearAuthState();

      // Clear localStorage
      localStorage.removeItem('corruptguard_auth');

      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      // Still clear local state even if logout API fails
      this.clearAuthState();
      localStorage.removeItem('corruptguard_auth');
    }
  }

  private clearAuthState(): void {
    this.principal = null;
    this.isAuthenticated = false;
    this.userProfile = null;
    this.apiToken = null;
    this.sessionId = null;
    this.notifyAuthListeners(false);
  }

  async restoreAuth(): Promise<boolean> {
    try {
      const storedAuth = localStorage.getItem('corruptguard_auth');

      if (storedAuth) {
        const authData: SessionData = JSON.parse(storedAuth);

        // Verify token is still valid
        const isValid = await this.verifyToken(authData.token);

        if (isValid) {
          this.userProfile = authData.user;
          this.apiToken = authData.token;
          this.sessionId = authData.sessionId;
          this.isAuthenticated = true;
          this.principal = authData.user.principal;

          this.notifyAuthListeners(true);
          console.log('✅ Authentication restored from storage');
          return true;
        } else {
          // Token invalid, clear storage
          localStorage.removeItem('corruptguard_auth');
          console.log('⚠️ Stored token invalid, cleared');
        }
      }

      return false;
    } catch (error) {
      console.error('❌ Failed to restore auth:', error);
      localStorage.removeItem('corruptguard_auth');
      return false;
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${CONFIG.API_URL}/auth/verify-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      if (response.ok) {
        const data: { data?: { valid?: boolean } } = await response.json();
        return !!data.data?.valid;
      }
      return false;
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      return false;
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      if (!this.apiToken) {
        throw new Error('No token to refresh');
      }

      const response = await fetch(`${CONFIG.API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiToken}`
        },
        body: JSON.stringify({
          token: this.apiToken
        })
      });

      if (response.ok) {
        const data: { success: boolean; data: { token: string } } = await response.json();

        if (data.success) {
          this.apiToken = data.data.token;

          // Update localStorage
          const storedAuth = localStorage.getItem('corruptguard_auth');
          if (storedAuth) {
            const authData: SessionData = JSON.parse(storedAuth);
            authData.token = this.apiToken;
            localStorage.setItem('corruptguard_auth', JSON.stringify(authData));
          }

          console.log('✅ Token refreshed successfully');
          return true;
        }
      }

      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      // If refresh fails, logout user
      await this.logout();
      return false;
    }
  }

  getAuthHeaders(): Record<string, string> {
    if (!this.apiToken) {
      return {};
    }

    return {
      'Authorization': `Bearer ${this.apiToken}`,
      'X-Session-ID': this.sessionId || '',
      'X-Principal-ID': this.principal || ''
    };
  }

  async apiRequest(endpoint: string, options: ApiRequestOptions = {}): Promise<Response> {
    try {
      const url = endpoint.startsWith('http') ? endpoint : `${CONFIG.API_URL}${endpoint}`;

      const requestOptions: RequestInit = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
          ...options.headers
        }
      };

      const response = await fetch(url, requestOptions);

      // Handle token expiration
      if (response.status === 401) {
        console.log('🔄 Token expired, attempting refresh...');
        const refreshed = await this.refreshToken();

        if (refreshed) {
          // Retry request with new token
          requestOptions.headers = {
            ...requestOptions.headers,
            ...this.getAuthHeaders()
          };
          return await fetch(url, requestOptions);
        } else {
          throw new Error('Authentication required');
        }
      }

      return response;
    } catch (error) {
      console.error('❌ API request failed:', error);
      throw error;
    }
  }

  async getUserProfile(): Promise<User> {
    try {
      const response = await this.apiRequest('/auth/profile');

      if (response.ok) {
        const data: { success: boolean; data: User } = await response.json();
        if (data.success) {
          this.userProfile = data.data;
          return this.userProfile;
        }
      }

      throw new Error('Failed to get user profile');
    } catch (error) {
      console.error('❌ Failed to get user profile:', error);
      throw error;
    }
  }

  addAuthListener(callback: AuthListener): void {
    this.authListeners.push(callback);
  }

  removeAuthListener(callback: AuthListener): void {
    this.authListeners = this.authListeners.filter(listener => listener !== callback);
  }

  private notifyAuthListeners(isAuthenticated: boolean): void {
    this.authListeners.forEach(callback => {
      try {
        callback({
          isAuthenticated,
          user: this.userProfile,
          principal: this.principal
        });
      } catch (error) {
        console.error('❌ Auth listener error:', error);
      }
    });
  }

  hasPermission(permission: string): boolean {
    if (!this.userProfile || !this.userProfile.permissions) {
      return false;
    }

    return this.userProfile.permissions.includes(permission);
  }

  hasRole(role: UserRole): boolean {
    return this.userProfile?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return this.userProfile ? roles.includes(this.userProfile.role) : false;
  }

  async getDemoUsers(): Promise<DemoUser[]> {
    try {
      const response = await fetch(`${CONFIG.API_URL}/auth/dev/mock-users`);

      if (response.ok) {
        const data: { data: { mock_users: DemoUser[] } } = await response.json();
        return data.data?.mock_users || [];
      }

      return [];
    } catch (error) {
      console.error('❌ Failed to get demo users:', error);
      return [];
    }
  }

  // Getters
  get authenticated(): boolean { return this.isAuthenticated; }
  get user(): User | null { return this.userProfile; }
  get userPrincipal(): string | null { return this.principal; }
  get token(): string | null { return this.apiToken; }
}

// Create singleton instance
const hederaAuth = new HederaAuth();

export default hederaAuth;