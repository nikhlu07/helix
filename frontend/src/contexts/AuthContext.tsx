// frontend/src/contexts/AuthContext.tsx - ENHANCED
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import hederaAuth from '../auth/hederaWallet';
import { User } from '../auth/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (method: 'hedera' | 'demo', role?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  canManageBudgets: () => boolean;
  canAllocateBudgets: () => boolean;
  canSubmitClaims: () => boolean;
  canReportCorruption: () => boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      await hederaAuth.init();

      const currentUser = hederaAuth.user;
      setUser(currentUser);

      // If user exists, validate token and refresh profile
      if (currentUser) {
        try {
          await hederaAuth.getUserProfile();
          setUser(hederaAuth.user);
        } catch (profileError) {
          // Silently ignore profile fetch errors (backend not running)
          // console.warn('Failed to refresh profile:', profileError);
        }
      }
    } catch (initError) {
      console.error('Auth initialization failed:', initError);
      setError('Authentication service failed to initialize');
    } finally {
      setLoading(false);
    }
  };

  const login = async (method: 'hedera' | 'demo', role?: string) => {
    try {
      console.log(`Attempting login with method: ${method}, role: ${role}`);
      setLoading(true);
      setError(null);

      let loggedInUser: User;

      if (method === 'hedera') {
        console.log('Starting Hedera Wallet login...');
        loggedInUser = await hederaAuth.login();
      } else {
        // Enable demo login path using backend demo endpoint
        const demoRole = role || 'vendor';
        console.log('Starting Demo login...', demoRole);
        // Cast role to UserRole if needed, or let hederaAuth handle validation
        loggedInUser = await hederaAuth.loginDemo('demo-principal', demoRole as any);
      }

      setUser(loggedInUser);

      // Analytics/logging
      console.log(`User logged in: ${loggedInUser.principal} as ${loggedInUser.role}`);

    } catch (loginError: unknown) {
      console.error('Login failed:', loginError);
      setError((loginError as Error).message || 'Login failed');
      throw loginError;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      await hederaAuth.logout();
      setUser(null);

      console.log('User logged out successfully');

    } catch (logoutError: unknown) {
      console.error('Logout failed:', logoutError);
      setError((logoutError as Error).message || 'Logout failed');
      // Clear user state anyway
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const updatedUser = await hederaAuth.getUserProfile();
      setUser(updatedUser);
    } catch (refreshError: unknown) {
      console.error('Profile refresh failed:', refreshError);
      setError((refreshError as Error).message || 'Failed to refresh profile');
    }
  };

  const hasRole = (role: string): boolean => {
    return hederaAuth.hasRole(role as any);
  };

  const hasPermission = (permission: string): boolean => {
    return hederaAuth.hasPermission(permission);
  };

  const canManageBudgets = (): boolean => {
    // Implement based on permissions or role
    return hederaAuth.hasPermission('budget_control');
  };

  const canAllocateBudgets = (): boolean => {
    return hederaAuth.hasPermission('budget_allocation');
  };

  const canSubmitClaims = (): boolean => {
    return hederaAuth.hasPermission('claim_submission');
  };

  const canReportCorruption = (): boolean => {
    return hederaAuth.hasPermission('corruption_reporting');
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    isAuthenticated: hederaAuth.authenticated,
    login,
    logout,
    refreshProfile,
    hasRole,
    hasPermission,
    canManageBudgets,
    canAllocateBudgets,
    canSubmitClaims,
    canReportCorruption,
    error
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: string | string[]
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated || !user) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600">Please log in to access this page.</p>
          </div>
        </div>
      );
    }

    // Check role requirements
    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (!roles.includes(user.role)) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
              <p className="text-gray-600">
                You don't have permission to access this page.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Required role: {roles.join(' or ')}, Your role: {user.role}
              </p>
            </div>
          </div>
        );
      }
    }

    return <Component {...props} />;
  };
}

// Hook for role-based rendering
export function useRoleAccess() {
  const { user, hasRole, hasPermission } = useAuth();

  return {
    user,
    isMainGovernment: hasRole('main_government'),
    isStateHead: hasRole('state_head'),
    isDeputy: hasRole('deputy'),
    isVendor: hasRole('vendor'),
    isCitizen: hasRole('citizen'),
    isGovernmentOfficial: hasRole('main_government') || hasRole('state_head') || hasRole('deputy'),

    // Permission-based checks
    canManageBudgets: hasPermission('budget_control'),
    canAllocateBudgets: hasPermission('budget_allocation'),
    canManageRoles: hasPermission('role_management'),
    canOverseeRegion: hasPermission('regional_oversight'),
    canSubmitClaims: hasPermission('claim_submission'),
    canReportCorruption: hasPermission('corruption_reporting'),
    canAccessTransparency: hasPermission('transparency_access'),

    // Convenience methods
    showAdminFeatures: hasRole('main_government'),
    showRegionalFeatures: hasRole('main_government') || hasRole('state_head'),
    showLocalFeatures: hasRole('main_government') || hasRole('state_head') || hasRole('deputy'),
    showVendorFeatures: hasRole('vendor'),
    showPublicFeatures: true // Everyone can see public features
  };
}