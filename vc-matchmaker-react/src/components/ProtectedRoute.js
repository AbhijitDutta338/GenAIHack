import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Component to protect routes that require authentication
function ProtectedRoute({ children, requiredUserType = null }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '200px' 
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #e5e7eb', 
          borderTop: '4px solid #3b82f6', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }}></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check user type if required
  if (requiredUserType && user.userType !== requiredUserType) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        backgroundColor: '#fef2f2', 
        border: '1px solid #fecaca', 
        borderRadius: '8px', 
        margin: '2rem' 
      }}>
        <h3 style={{ color: '#dc2626', marginBottom: '1rem' }}>Access Denied</h3>
        <p style={{ color: '#7f1d1d' }}>
          This page is only available to {requiredUserType === 'founder' ? 'startup founders' : 'venture capitalists'}.
        </p>
      </div>
    );
  }

  return children;
}

// Component for routes that should redirect authenticated users
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '200px' 
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #e5e7eb', 
          borderTop: '4px solid #3b82f6', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }}></div>
      </div>
    );
  }

  // Redirect to appropriate dashboard if already logged in
  if (user) {
    const redirectTo = user.userType === 'founder' ? '/founder' : '/vc';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

export { ProtectedRoute, PublicRoute };
export default ProtectedRoute;