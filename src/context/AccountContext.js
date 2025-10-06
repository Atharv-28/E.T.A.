import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadAccounts, saveAccounts, loadSettings, saveSettings } from '../utils/storage';

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
export function AccountProvider({ children }) {
  const [accounts, setAccounts] = useState([]);
  const [activeAccountId, setActiveAccountId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load accounts from storage on app start
  useEffect(() => {
    loadAccountsFromStorage();
  }, []);

  // Save accounts to storage whenever accounts change
  useEffect(() => {
    if (!isLoading) {
      saveAccountsToStorage();
    }
  }, [accounts, activeAccountId, isLoading]);

  const loadAccountsFromStorage = async () => {
    try {
      // loadAccounts returns an object { accounts, activeAccountId }
      const stored = await loadAccounts();
      const storedAccounts = Array.isArray(stored.accounts) ? stored.accounts : [];
      const storedActiveId = stored.activeAccountId || null;

      if (storedAccounts.length > 0) {
        setAccounts(storedAccounts);

        if (storedActiveId && storedAccounts.find(acc => acc.id === storedActiveId)) {
          setActiveAccountId(storedActiveId);
        } else {
          setActiveAccountId(storedAccounts[0].id);
        }
      } else {
        // No stored accounts - leave empty so onboarding/login can run
        setAccounts([]);
        setActiveAccountId(null);
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
      // On error, do not create a default account; keep accounts empty and allow onboarding
      setAccounts([]);
      setActiveAccountId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAccountsToStorage = async () => {
    try {
      // save both accounts and activeAccountId
      await saveAccounts(accounts, activeAccountId);
      // Also persist activeAccountId in settings for backward compatibility
      const settings = await loadSettings();
      await saveSettings({ ...settings, activeAccountId });
    } catch (error) {
      console.error('Error saving accounts:', error);
    }
  };

  const createAccount = (accountData) => {
    const newAccount = {
      ...accountData,
      id: `account-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    setAccounts(prev => [...prev, newAccount]);
    // Set the newly created account as active immediately
    setActiveAccountId(newAccount.id);
    return newAccount;
  };

  const updateAccount = (accountId, updatedData) => {
    setAccounts(prev => 
      prev.map(account => 
        account.id === accountId ? { ...account, ...updatedData } : account
      )
    );
  };

  const deleteAccount = (accountId) => {
    if (accounts.length <= 1) {
      throw new Error('Cannot delete the last account');
    }
    
    setAccounts(prev => prev.filter(account => account.id !== accountId));
    
    // If deleting active account, switch to first remaining account
    if (activeAccountId === accountId) {
      const remainingAccounts = accounts.filter(account => account.id !== accountId);
      setActiveAccountId(remainingAccounts[0]?.id || null);
    }
  };

  const switchAccount = (accountId) => {
    if (accounts.find(account => account.id === accountId)) {
      setActiveAccountId(accountId);
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
