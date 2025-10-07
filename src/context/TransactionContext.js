import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadTransactions, saveTransactions } from '../utils/storage';

// Create the context
const TransactionContext = createContext();

// Transaction categories
export const CATEGORIES = {
  INCOME: [
    { id: 'salary', name: 'Salary', icon: 'work' },
    { id: 'business', name: 'Business', icon: 'business' },
    { id: 'freelance', name: 'Freelance', icon: 'computer' },
    { id: 'other_income', name: 'Other Income', icon: 'monetization-on' },
  ],
  EXPENSE: [
    { id: 'food', name: 'Food & Dining', icon: 'restaurant' },
    { id: 'grocery', name: 'Grocery', icon: 'shopping-basket' },
    { id: 'snacks', name: 'Snacks', icon: 'fastfood' },
    { id: 'flowers', name: 'Flowers', icon: 'local-florist' },
    { id: 'transport', name: 'Transportation', icon: 'directions-car' },
    { id: 'shopping', name: 'Shopping', icon: 'shopping-cart' },
    { id: 'entertainment', name: 'Entertainment', icon: 'movie' },
    { id: 'bills', name: 'Bills & Utilities', icon: 'receipt' },
    { id: 'health', name: 'Healthcare', icon: 'local-hospital' },
    { id: 'education', name: 'Education/Stationary', icon: 'school' },
    { id: 'other_expense', name: 'Other Expense', icon: 'payment' },
  ],
};

// Context Provider Component
export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load transactions from AsyncStorage on app start
  useEffect(() => {
    const loadStoredTransactions = async () => {
      try {
        setIsLoading(true);
        const storedTransactions = await loadTransactions();
        setTransactions(storedTransactions);
      } catch (error) {
        console.error('Error loading transactions:', error);
        // If loading fails, start with empty array
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredTransactions();
  }, []);

  // Save transactions to AsyncStorage whenever transactions change
  useEffect(() => {
    if (!isLoading && transactions.length >= 0) {
      const saveData = async () => {
        try {
          await saveTransactions(transactions);
        } catch (error) {
          console.error('Error saving transactions:', error);
        }
      };
      saveData();
    }
  }, [transactions, isLoading]);

  // Add new transaction
  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  // Update transaction
  const updateTransaction = (id, updatedTransaction) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === id ? { ...transaction, ...updatedTransaction } : transaction
      )
    );
  };

  // Delete transaction
  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  // Get transactions by type
  const getTransactionsByType = (type) => {
    return transactions.filter(transaction => transaction.type === type);
  };

  // Get transactions by account
  const getTransactionsByAccount = (accountId) => {
    return transactions.filter(transaction => transaction.accountId === accountId);
  };

  // Get transactions by type for specific account
  const getTransactionsByTypeForAccount = (type, accountId) => {
    return transactions.filter(transaction => 
      transaction.type === type && transaction.accountId === accountId
    );
  };

  // Calculate monthly spending for specific account
  const getMonthlySpendingForAccount = (accountId) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(transaction => {
        if (!transaction || !transaction.date) return false;
        const transactionDate = new Date(transaction.date);
        // Treat 'debit' as expense as some flows use that label
        const isExpenseType = transaction.type === 'expense' || transaction.type === 'debit';
        return transactionDate.getMonth() === currentMonth &&
               transactionDate.getFullYear() === currentYear &&
               isExpenseType &&
               transaction.accountId === accountId;
      })
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  // Calculate monthly spending (all accounts)
  const getMonthlySpending = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(transaction => {
        if (!transaction || !transaction.date) return false;
        const transactionDate = new Date(transaction.date);
        const isExpenseType = transaction.type === 'expense' || transaction.type === 'debit';
        return transactionDate.getMonth() === currentMonth &&
               transactionDate.getFullYear() === currentYear &&
               isExpenseType;
      })
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const value = {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByType,
    getTransactionsByAccount,
    getTransactionsByTypeForAccount,
    getMonthlySpending,
    getMonthlySpendingForAccount,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

// Custom hook to use the transaction context
export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}
