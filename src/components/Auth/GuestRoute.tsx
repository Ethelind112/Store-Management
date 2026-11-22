import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ROUTE } from '../../constants/route';
import { LoadingPage } from '../Loading';

interface GuestRouteProps {
  children: React.ReactElement;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const location = useLocation();

  if (isLoading) {
    return <LoadingPage />;
  }

  // If already logged in, redirect to origin page or cashier
  if (isAuthenticated) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || ROUTE.CASHIER;
    return <Navigate to={from} replace />;
  }

  return children;
};
