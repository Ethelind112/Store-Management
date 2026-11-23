import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export { useAuthStore, useAuth } from '../store/useAuthStore';
export type { AuthState } from '../store/useAuthStore';

/**
 * AuthProvider component to run store validation effects and provide
 * compatibility with standard React Context patterns.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const checkTokenValidity = useAuthStore((state) => state.checkTokenValidity);

  useEffect(() => {
    checkTokenValidity();
  }, [checkTokenValidity]);

  return <>{children}</>;
};
