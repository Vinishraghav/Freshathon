import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserRole } from '../services/FirebaseServices';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ user, requiredRole, children }) => {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        // If no specific role is required, just being logged in is enough
        if (!requiredRole) {
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // Check if user has the required role
        const userRole = await getUserRole(user.uid);
        setHasAccess(userRole === requiredRole);
        setLoading(false);
      } catch (error) {
        console.error('Error checking user role:', error);
        setHasAccess(false);
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, requiredRole]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!hasAccess) {
    // Redirect to login if not authenticated
    if (!user) {
      return <Navigate to="/college-login" replace />;
    }
    
    // Redirect to home if authenticated but doesn't have the required role
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
