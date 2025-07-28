import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

interface GuestRouteProps {
  children: React.ReactNode;
}

const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // If the user IS logged in, redirect them away from the guest page.
  if (user) {
    // Get the page they were trying to access before being redirected here, or default to home.
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  // If the user is NOT logged in, render the children (e.g., the Login page).
  return <>{children}</>;
};

export default GuestRoute;