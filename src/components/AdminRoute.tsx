import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Spinner } from './Spinner';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const [authStatus, setAuthStatus] = useState<'checking' | 'isAdmin' | 'isNotAdmin'>('checking');

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          
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
        setAuthStatus('isNotAdmin');
      }
    };
    
    checkAdminStatus();
  }, [user]);

  if (authStatus === 'checking') {
    return <Spinner fullScreen />;
  }

  if (authStatus === 'isAdmin') {
    return <>{children}</>;
  }
  
  return <Navigate to="/" replace />;
};

export default AdminRoute;