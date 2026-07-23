/**
 * AccountContext.js — Redux shim
 *
 * The <AccountProvider> wrapper is now a no-op passthrough (kept for
 * backwards compatibility in App.js).  All state lives in Redux.
 * The useAccounts() hook returns the same API as before so no screen
 * needs to change.
 */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  syncCreateAccount,
  syncUpdateAccount,
  syncDeleteAccount,
  setActiveAccountId,
} from '../store/slices/accountsSlice';
import FirebaseService from '../services/FirebaseService';
import {
  selectAllAccounts,
  selectActiveAccountId,
  selectActiveAccount,
  selectAccountById,
  selectAccountsLoading,
  selectUid,
} from '../store/selectors';

// ─── ACCOUNT_TYPES (unchanged) ────────────────────────────────────────────────
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

// ─── No-op Provider (kept for backwards compat, does nothing) ─────────────────
export function AccountProvider({ children }) {
  return <>{children}</>;
}

// ─── Hook — same API as before, backed by Redux ───────────────────────────────
export function useAccounts() {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAllAccounts);
  const activeAccountId = useSelector(selectActiveAccountId);
  const activeAccount = useSelector(selectActiveAccount);
  const isLoading = useSelector(selectAccountsLoading);
  const uid = useSelector(selectUid);

  return {
    accounts,
    activeAccountId,
    activeAccount,
    isLoading,

    createAccount: (accountData) => {
      dispatch(syncCreateAccount(accountData));
    },

    updateAccount: (accountId, data) => {
      dispatch(syncUpdateAccount({ accountId, data }));
    },

    deleteAccount: (accountId) => {
      if (accounts.length <= 1) {
        throw new Error('Cannot delete the last account');
      }
      dispatch(syncDeleteAccount(accountId));
    },

    switchAccount: (accountId) => {
      if (accounts.find((a) => a.id === accountId)) {
        dispatch(setActiveAccountId(accountId));
        // Persist the new active account to Firestore (fire-and-forget)
        if (uid) {
          FirebaseService.saveActiveAccountId(uid, accountId).catch((err) =>
            console.warn('switchAccount: failed to persist to Firestore', err)
          );
        }
      }
    },

    getAccountById: (accountId) =>
      accounts.find((a) => a.id === accountId) || null,
  };
}
