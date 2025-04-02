import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  register,
  login,
  signOut,
  getCurrentUser,
  subscribeToAuthChanges
} from '../firebase/auth';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Register a new user
  const registerUser = async (email, password, displayName) => {
    try {
      setError('');
      setLoading(true);
      await register(email, password, displayName);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login a user
  const loginUser = async (email, password) => {
    try {
      setError('');
      setLoading(true);
      await login(email, password);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out a user
  const logout = async () => {
    try {
      setError('');
      await signOut();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    registerUser,
    loginUser,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 