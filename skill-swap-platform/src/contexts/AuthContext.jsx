import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  register,
  login,
  signOut,
  getCurrentUser,
  subscribeToAuthChanges
} from '../firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

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
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);

  // Check if user has completed profile
  const checkProfileCompletion = async (user) => {
    if (!user) return false;
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      return userDoc.exists();
    } catch (error) {
      console.error('Error checking profile completion:', error);
      return false;
    }
  };

  // Register a new user
  const registerUser = async (email, password, displayName) => {
    try {
      setError('');
      setLoading(true);
      console.log('AuthContext: Starting registration');
      const user = await register(email, password, displayName);
      console.log('AuthContext: Registration successful, user:', user);
      setCurrentUser(user);
      setHasCompletedProfile(false);
      return user;
    } catch (error) {
      console.error('AuthContext: Registration error:', error);
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
      setHasCompletedProfile(false);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Subscribe to auth state changes
  useEffect(() => {
    console.log('AuthContext: Setting up auth state listener');
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      console.log('AuthContext: Auth state changed, user:', user);
      setCurrentUser(user);
      if (user) {
        const completed = await checkProfileCompletion(user);
        setHasCompletedProfile(completed);
      } else {
        setHasCompletedProfile(false);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      console.log('AuthContext: Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    hasCompletedProfile,
    setHasCompletedProfile,
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