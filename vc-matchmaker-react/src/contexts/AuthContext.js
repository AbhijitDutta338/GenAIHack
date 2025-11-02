import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin } from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('demoUser');
    const authToken = localStorage.getItem('authToken');
    
    if (savedUser && authToken) {
      setUser(JSON.parse(savedUser));
    }
    
    setLoading(false);
  }, []);

  // Sign up - Not implemented for demo
  const signUp = async (email, password, userData = {}) => {
    setError('Sign up is not available in demo mode');
    throw new Error('Sign up is not available in demo mode');
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await apiLogin(email, password);
      
      if (response && response.user) {
        const userData = {
          uid: response.user.uid,
          email: response.user.email,
          displayName: response.user.displayName || response.user.username,
          userType: response.user.userType,
          role: response.user.role,
          profile: response.user.profile,
          isDemo: true
        };
        
        setUser(userData);
        
        // Store in localStorage for persistence
        localStorage.setItem('demoUser', JSON.stringify(userData));
        localStorage.setItem('authToken', response.token);
        
        return userData;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google - Not implemented for demo
  const signInWithGoogle = async () => {
    setError('Google sign-in is not available in demo mode');
    throw new Error('Google sign-in is not available in demo mode');
  };

  // Sign out
  const logout = async () => {
    try {
      setError(null);
      
      // Clear demo user and auth token
      localStorage.removeItem('demoUser');
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear user state
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update user profile - Updates local state only for demo
  const updateUserProfile = async (updates) => {
    try {
      setError(null);
      
      if (user) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('demoUser', JSON.stringify(updatedUser));
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    updateUserProfile,
    isAuthenticated: !!user,
    isFounder: user?.userType === 'founder',
    isVC: user?.userType === 'vc'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};