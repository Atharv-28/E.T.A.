import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import FirestoreService from '../services/FirestoreService';

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
// uid: The Firebase user ID — all Firestore reads/writes are scoped to this user.
export function TransactionProvider({ children, uid }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    // If no uid, clear state and don't subscribe
    if (!uid) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Subscribe to Firestore real-time listener
    const unsubscribe = FirestoreService.listenToTransactions(
      uid,
      (firestoreTransactions) => {
        setTransactions(firestoreTransactions);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error loading transactions from Firestore:', error);
        setTransactions([]);
        setIsLoading(false);
      }
    );

    unsubscribeRef.current = unsubscribe;

    // Cleanup listener when uid changes or component unmounts
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [uid]);

  // Add new transaction — write to Firestore, real-time listener updates local state
  const addTransaction = async (transaction) => {
    if (!uid) throw new Error('User not authenticated');

    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: transaction?.date || new Date().toISOString(),
    };

    await FirestoreService.addTransaction(uid, newTransaction);
    // Local state will be updated automatically by the onSnapshot listener
  };

  // Update transaction
  const updateTransaction = async (id, updatedTransaction) => {
    if (!uid) throw new Error('User not authenticated');
    await FirestoreService.updateTransaction(uid, id, updatedTransaction);
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    if (!uid) throw new Error('User not authenticated');
    await FirestoreService.deleteTransaction(uid, id);
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
