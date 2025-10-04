import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the Account context
const AccountContext = createContext();

// Account types and colors
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

const STORAGE_KEYS = {
  ACCOUNTS: '@ETA_ACCOUNTS',
  ACTIVE_ACCOUNT: '@ETA_ACTIVE_ACCOUNT',
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
      const storedAccounts = await AsyncStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      const storedActiveAccount = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_ACCOUNT);
      
      if (storedAccounts) {
        const parsedAccounts = JSON.parse(storedAccounts);
        setAccounts(parsedAccounts);
        
        if (storedActiveAccount && parsedAccounts.find(acc => acc.id === storedActiveAccount)) {
          setActiveAccountId(storedActiveAccount);
        } else if (parsedAccounts.length > 0) {
          setActiveAccountId(parsedAccounts[0].id);
        }
      } else {
        // Create default account if none exists
        createDefaultAccount();
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
      createDefaultAccount();
    } finally {
      setIsLoading(false);
    }
  };

  const saveAccountsToStorage = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
      if (activeAccountId) {
        await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_ACCOUNT, activeAccountId);
      }
    } catch (error) {
      console.error('Error saving accounts:', error);
    }
  };

  const createDefaultAccount = () => {
    const defaultAccount = {
      id: 'default-personal',
      name: 'My Personal Account',
      type: 'personal',
      color: ACCOUNT_TYPES.PERSONAL.color,
      icon: ACCOUNT_TYPES.PERSONAL.icon,
      createdAt: new Date().toISOString(),
    };
    
    setAccounts([defaultAccount]);
    setActiveAccountId(defaultAccount.id);
  };

  const createAccount = (accountData) => {
    const newAccount = {
      ...accountData,
      id: `account-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    setAccounts(prev => [...prev, newAccount]);
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
