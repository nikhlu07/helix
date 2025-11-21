// User role types
export type UserRole = 'main_government' | 'state_head' | 'deputy' | 'vendor' | 'sub_supplier' | 'citizen';

// User interface
export interface User {
  principal: string;
  role: UserRole;
  name: string;
  permissions: string[];
  user_info?: Record<string, unknown>;
}

// Auth response from backend
export interface AuthResponse {
  access_token: string;
  token_type: string;
  role: string;
  user_info: {
    name?: string;
    permissions?: string[];
    [key: string]: unknown;
  };
  expires_in?: number;
  demo_mode?: boolean;
}

// Session data for localStorage
export interface SessionData {
  token: string;
  sessionId: string;
  user: User;
  demoMode: boolean;
}

// API request options
export interface ApiRequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

// Demo user for development
export interface DemoUser {
  principal_id: string;
  role: UserRole;
  name: string;
  title: string;
  permissions: string[];
  available: boolean;
}
