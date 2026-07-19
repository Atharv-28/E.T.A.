/**
 * FirebaseService.js
 * Centralized Firebase Authentication helper for ETA Finance App.
 * Wraps @react-native-firebase/auth methods.
 */

import auth from '@react-native-firebase/auth';

const FirebaseService = {
  /**
   * Create a new user account with email/password.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<FirebaseAuthTypes.UserCredential>}
   */
  signUp: async (email, password) => {
    const credential = await auth().createUserWithEmailAndPassword(email, password);
    return credential;
  },

  /**
   * Sign in with email/password. Firebase SDK auto-persists the session.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<FirebaseAuthTypes.UserCredential>}
   */
  signIn: async (email, password) => {
    const credential = await auth().signInWithEmailAndPassword(email, password);
    return credential;
  },

  /**
   * Sign out the current user.
   * @returns {Promise<void>}
   */
  signOut: async () => {
    await auth().signOut();
  },

  /**
   * Get the currently signed-in user (null if not signed in).
   * @returns {FirebaseAuthTypes.User | null}
   */
  getCurrentUser: () => {
    return auth().currentUser;
  },

  /**
   * Subscribe to auth state changes.
   * @param {function} callback - Receives user object (or null).
   * @returns {function} Unsubscribe function.
   */
  onAuthStateChanged: (callback) => {
    return auth().onAuthStateChanged(callback);
  },

  /**
   * Send a password reset email.
   * @param {string} email
   * @returns {Promise<void>}
   */
  sendPasswordResetEmail: async (email) => {
    await auth().sendPasswordResetEmail(email);
  },

  /**
   * Map Firebase error codes to user-friendly messages.
   * @param {string} code
   * @returns {string}
   */
  getErrorMessage: (code) => {
    const messages = {
      'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
    };
    return messages[code] || 'An unexpected error occurred. Please try again.';
  },
};

export default FirebaseService;
