import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import FirestoreService from '../services/FirestoreService';

// Create the Account context
const AccountContext = createContext();

export const ACCOUNT_TYPES = {
  PERSONAL: {
    id: 'personal',
    name: 'Personal',
    icon: 'person',
    color: '#3498db',
  },
  BUSINESS: {
    id: 'business',
    name: 'Business',
    icon: 'business',
    color: '#e67e22',
  },
  SAVINGS: {
    id: 'savings',
    name: 'Savings',
    icon: 'savings',
    color: '#27ae60',
  },
  CREDIT: {
    id: 'credit',
    name: 'Credit Card',
    icon: 'credit-card',
    color: '#e74c3c',
  },
  JOINT: {
    id: 'joint',
    name: 'Joint Account',
    icon: 'people',
    color: '#9b59b6',
  },
};

// Account Provider Component
// uid: The Firebase user ID — all Firestore reads/writes are scoped to this user.
export function AccountProvider({ children, uid }) {
  const [accounts, setAccounts] = useState([]);
  const [activeAccountId, setActiveAccountId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    // If no uid, clear state and don't subscribe
    if (!uid) {
      setAccounts([]);
      setActiveAccountId(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Subscribe to Firestore real-time listener
    const unsubscribe = FirestoreService.listenToAccounts(
      uid,
      ({ accounts: firestoreAccounts, activeAccountId: firestoreActiveId }) => {
        setAccounts(firestoreAccounts);

        // Resolve active account ID
        if (firestoreActiveId && firestoreAccounts.find(a => a.id === firestoreActiveId)) {
          setActiveAccountId(firestoreActiveId);
        } else if (firestoreAccounts.length > 0) {
          setActiveAccountId(firestoreAccounts[0].id);
        } else {
          setActiveAccountId(null);
        }

        setIsLoading(false);
      },
      (error) => {
        console.error('Error loading accounts from Firestore:', error);
        setAccounts([]);
        setActiveAccountId(null);
        setIsLoading(false);
      }
    );

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [uid]);

  const createAccount = async (accountData) => {
    if (!uid) throw new Error('User not authenticated');

    // Destructure out any client-side id so we control the Firestore doc ID
    const { id: _ignored, createdAt: _createdAt, ...rest } = accountData;
    const accountId = `account-${Date.now()}`;

    const newAccount = {
      ...rest,
      id: accountId,
      createdAt: new Date().toISOString(),
    };

    await FirestoreService.addAccount(uid, newAccount);

    // Set as active account in Firestore metadata
    await FirestoreService.setActiveAccountId(uid, accountId);

    // Local state updated automatically by onSnapshot listener
    return newAccount;
  };

  const updateAccount = async (accountId, updatedData) => {
    if (!uid) throw new Error('User not authenticated');
    await FirestoreService.updateAccount(uid, accountId, updatedData);
  };

  const deleteAccount = async (accountId) => {
    if (!uid) throw new Error('User not authenticated');
    if (accounts.length <= 1) {
      throw new Error('Cannot delete the last account');
    }

    await FirestoreService.deleteAccount(uid, accountId);

    // If deleting active account, switch to first remaining
    if (activeAccountId === accountId) {
      const remaining = accounts.filter(a => a.id !== accountId);
      if (remaining.length > 0) {
        await FirestoreService.setActiveAccountId(uid, remaining[0].id);
      }
    }
  };

  const switchAccount = async (accountId) => {
    if (!uid) return;
    if (accounts.find(a => a.id === accountId)) {
      setActiveAccountId(accountId); // Optimistic local update
      await FirestoreService.setActiveAccountId(uid, accountId);
    }
  };

  const getActiveAccount = () => {
    return accounts.find(account => account.id === activeAccountId) || null;
  };

  const getAccountById = (accountId) => {
    return accounts.find(account => account.id === accountId) || null;
  };

  const value = {
    accounts,
    activeAccountId,
    activeAccount: getActiveAccount(),
    isLoading,
    createAccount,
    updateAccount,
    deleteAccount,
    switchAccount,
    getAccountById,
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
}

// Custom hook to use the account context
export function useAccounts() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccounts must be used within an AccountProvider');
  }
  return context;
}
