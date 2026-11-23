import { apiClient } from './api';
import {
  AuthJwtClaims,
  LoginRequest,
  LoginResponseData,
  RegisterRequest,
  User,
} from '../types/auth';
import { Response } from '../types/response';

export const AUTH_TOKEN_KEY = 'cashier_auth_token';

/**
 * Decode JWT token payload safely in the browser without external libraries.
 */
export function decodeJwtClaims(token: string): AuthJwtClaims | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as AuthJwtClaims;
  } catch (error) {
    console.error('Failed to parse JWT claims:', error);
    return null;
  }
}

/**
 * Check if the decoded JWT token is still valid (not expired).
 */
export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  const claims = decodeJwtClaims(token);
  if (!claims) return false;

  if (claims.exp) {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return claims.exp > nowInSeconds;
  }
  return true;
}

/**
 * Extract user object from token claims.
 */
export function extractUserFromToken(token: string): User | null {
  const claims = decodeJwtClaims(token);
  if (!claims) return null;

  return {
    id: claims.user_id || '',
    username: claims.username || '',
    role: claims.role || 'cashier',
  };
}

/**
 * Storage helpers for authentication token.
 */
export const tokenStorage = {
  get: (): string | null => {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token: string): void => {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (e) {
      console.error('Failed to store auth token:', e);
    }
  },
  remove: (): void => {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (e) {
      console.error('Failed to remove auth token:', e);
    }
  },
};

export const authService = {
  /**
   * Login user with username and password
   */
  login: async (credentials: LoginRequest): Promise<Response<LoginResponseData>> => {
    return apiClient<Response<LoginResponseData>>('login', {
      method: 'POST',
      data: credentials,
    });
  },

  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<Response<unknown>> => {
    return apiClient<Response<unknown>>('register', {
      method: 'POST',
      data,
    });
  },
};
