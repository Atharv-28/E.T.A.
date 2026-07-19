/**
 * AuthContext.js
 * Provides Firebase authentication state to the entire app.
 * Listens to onAuthStateChanged so the session persists across app restarts.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import FirebaseService from '../services/FirebaseService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // true while Firebase restores session

  useEffect(() => {
    // Subscribe to auth state — fires immediately with current session or null
    const unsubscribe = FirebaseService.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthLoading(false);
    });

    // Cleanup listener on unmount
    return unsubscribe;
  }, []);

  /**
   * Sign up with email and password.
   * @param {string} email
   * @param {string} password
   * @throws {Error} with user-friendly message on failure
   */
  const signUp = async (email, password) => {
    try {
      const credential = await FirebaseService.signUp(email, password);
      return credential.user;
    } catch (error) {
      throw new Error(FirebaseService.getErrorMessage(error.code));
    }
  };

  /**
   * Sign in with email and password.
   * @param {string} email
   * @param {string} password
   * @throws {Error} with user-friendly message on failure
   */
  const signIn = async (email, password) => {
    try {
      const credential = await FirebaseService.signIn(email, password);
      return credential.user;
    } catch (error) {
      throw new Error(FirebaseService.getErrorMessage(error.code));
    }
  };

  /**
   * Sign out the current user.
   */
  const signOut = async () => {
    try {
      await FirebaseService.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out. Please try again.');
    }
  };

  /**
   * Send a password reset email.
   * @param {string} email
   */
  const resetPassword = async (email) => {
    try {
      await FirebaseService.sendPasswordResetEmail(email);
    } catch (error) {
      throw new Error(FirebaseService.getErrorMessage(error.code));
    }
  };

  const value = {
    user,
    isAuthLoading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
