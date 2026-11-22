import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTE } from '../../constants/route';
import { LoadingPage } from '../Loading';

interface GuestRouteProps {
  children: React.ReactElement;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isAuthenticated) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || ROUTE.CASHIER;
    return <Navigate to={from} replace />;
  }

  return children;
};
