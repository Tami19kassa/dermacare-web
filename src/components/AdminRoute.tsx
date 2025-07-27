import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Spinner } from './Spinner';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        // The custom claim is on the token object
        if (idTokenResult.claims.admin === true) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };
    checkAdminStatus();
  }, [user]);

  // Show a loading spinner while we verify the token
  if (isAdmin === null) {
    return <Spinner fullScreen />;
  }

  // If the user is not an admin, redirect them to the home page
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If the user is an admin, render the children (the admin page)
  return <>{children}</>;
};

export default AdminRoute;