import React, { createContext, useContext, useState } from 'react';

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
    { id: 'snacks', name: 'Snacks', icon: 'fastfood' },
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
  const [transactions, setTransactions] = useState([
    {
      id: '1',
      type: 'expense',
      amount: 350.00,
      description: 'Coffee Shop',
      category: 'food',
      date: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'income',
      amount: 75000.00,
      description: 'Monthly Salary',
      category: 'salary',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      type: 'expense',
      amount: 2500.00,
      description: 'Grocery Store',
      category: 'food',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

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

  // Calculate total balance
  const getTotalBalance = () => {
    return transactions.reduce((total, transaction) => {
      return transaction.type === 'income' 
        ? total + transaction.amount 
        : total - transaction.amount;
    }, 0);
  };

  // Calculate monthly spending
  const getMonthlySpending = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === currentMonth &&
               transactionDate.getFullYear() === currentYear &&
               transaction.type === 'expense';
      })
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const value = {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByType,
    getTotalBalance,
    getMonthlySpending,
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
