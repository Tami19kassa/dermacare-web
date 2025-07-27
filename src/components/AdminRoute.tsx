import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Spinner } from './Spinner';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user } = useAuth();
  
  // Use a more descriptive state: 'checking', 'isAdmin', 'isNotAdmin'
  const [authStatus, setAuthStatus] = useState<'checking' | 'isAdmin' | 'isNotAdmin'>('checking');

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          // Force a refresh of the token to get the latest custom claims
          const idTokenResult = await user.getIdTokenResult(true); 
          
          if (idTokenResult.claims.admin === true) {
            setAuthStatus('isAdmin');
          } else {
            setAuthStatus('isNotAdmin');
          }
        } catch (error) {
          console.error("Error verifying admin token:", error);
          setAuthStatus('isNotAdmin');
        }
      } else {
        // If there's no user, they are definitely not an admin
        setAuthStatus('isNotAdmin');
      }
    };
    
    checkAdminStatus();
  }, [user]);

  // --- RENDER LOGIC ---

  // 1. While we are checking the token, show a full screen spinner.
  // This prevents the child components from mounting and trying to fetch data too early.
  if (authStatus === 'checking') {
    return <Spinner fullScreen />;
  }

  // 2. If the user is confirmed to be an admin, render the children (the AdminPage).
  if (authStatus === 'isAdmin') {
    return <>{children}</>;
  }
  
  // 3. If the check is complete and the user is NOT an admin, redirect them.
  return <Navigate to="/" replace />;
};

export default AdminRoute;