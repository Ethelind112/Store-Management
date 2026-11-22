import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LoginRequest, RegisterRequest, User } from '../types/auth';
import {
  authService,
  extractUserFromToken,
  isTokenValid,
  tokenStorage,
} from '../services/authService';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state from local storage
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = tokenStorage.get();

      if (storedToken && isTokenValid(storedToken)) {
        const decodedUser = extractUserFromToken(storedToken);
        setToken(storedToken);
        setUser(decodedUser);
      } else if (storedToken) {
        // Token is expired or invalid
        tokenStorage.remove();
        setToken(null);
        setUser(null);
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    const receivedToken = response?.data?.token;

    if (!receivedToken) {
      throw new Error('Token otentikasi tidak ditemukan dalam respon.');
    }

    tokenStorage.set(receivedToken);
    const decodedUser = extractUserFromToken(receivedToken);
    setToken(receivedToken);
    setUser(decodedUser);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    await authService.register(data);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.remove();
    setToken(null);
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
