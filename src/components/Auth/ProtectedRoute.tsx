import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ROUTE } from '../../constants/route';
import { LoadingPage } from '../Loading';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (isLoading) {
    return <LoadingPage />;
  }

  // Redirect to login if user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTE.LOGIN} state={{ from: location }} replace />;
  }

  // Check role authorization if restricted
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTE.CASHIER} replace />;
  }

  return children;
};
