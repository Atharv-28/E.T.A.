/**
 * TransactionContext.js — Redux shim
 *
 * The <TransactionProvider> wrapper is now a no-op passthrough (kept for
 * backwards compatibility in App.js).  All state lives in Redux.
 * The useTransactions() hook returns the same API as before so no screen
 * needs to change.
 */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  syncAddTransaction,
  syncUpdateTransaction,
  syncDeleteTransaction,
} from '../store/slices/transactionsSlice';
import {
  selectAllTransactions,
  selectTransactionsLoading,
  selectTransactionsByAccount,
  selectTransactionsByType,
  selectTransactionsByTypeForAccount,
  selectMonthlySpending,
  selectMonthlySpendingForAccount,
} from '../store/selectors';

// ─── CATEGORIES (unchanged — screens import this directly) ────────────────────
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

// ─── No-op Provider (kept for backwards compat, does nothing) ─────────────────
export function TransactionProvider({ children }) {
  return <>{children}</>;
}

// ─── Hook — same API as before, backed by Redux ───────────────────────────────
export function useTransactions() {
  const dispatch = useDispatch();
  const transactions = useSelector(selectAllTransactions);
  const isLoading = useSelector(selectTransactionsLoading);

  return {
    transactions,
    isLoading,

    addTransaction: (transaction) => dispatch(syncAddTransaction(transaction)),

    updateTransaction: (id, data) => dispatch(syncUpdateTransaction({ id, data })),

    deleteTransaction: (id) => dispatch(syncDeleteTransaction(id)),

    getTransactionsByType: (type) =>
      transactions.filter((t) => t.type === type),

    getTransactionsByAccount: (accountId) =>
      transactions.filter((t) => t.accountId === accountId),

    getTransactionsByTypeForAccount: (type, accountId) =>
      transactions.filter((t) => t.type === type && t.accountId === accountId),

    getMonthlySpending: () => {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return transactions
        .filter((t) => {
          if (!t?.date) return false;
          const d = new Date(t.date);
          const isExpense = t.type === 'expense' || t.type === 'debit';
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear && isExpense;
        })
        .reduce((total, t) => total + Number(t.amount || 0), 0);
    },

    getMonthlySpendingForAccount: (accountId) => {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return transactions
        .filter((t) => {
          if (!t?.date) return false;
          const d = new Date(t.date);
          const isExpense = t.type === 'expense' || t.type === 'debit';
          return (
            d.getMonth() === currentMonth &&
            d.getFullYear() === currentYear &&
            isExpense &&
            t.accountId === accountId
          );
        })
        .reduce((total, t) => total + Number(t.amount || 0), 0);
    },
  };
}
