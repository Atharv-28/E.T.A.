/**
 * Redux selectors for transactions and accounts.
 * Use these in components instead of writing inline state access.
 */

// ─── Transaction Selectors ────────────────────────────────────────────────────

export const selectAllTransactions = (state) => state.transactions.items;
export const selectTransactionsStatus = (state) => state.transactions.status;
export const selectTransactionsLoading = (state) =>
  state.transactions.status === 'loading' || state.transactions.status === 'idle';

export const selectTransactionsByAccount = (accountId) => (state) =>
  state.transactions.items.filter((t) => t.accountId === accountId);

export const selectTransactionsByType = (type) => (state) =>
  state.transactions.items.filter((t) => t.type === type);

export const selectTransactionsByTypeForAccount = (type, accountId) => (state) =>
  state.transactions.items.filter(
    (t) => t.type === type && t.accountId === accountId
  );

export const selectMonthlySpendingForAccount = (accountId) => (state) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  return state.transactions.items
    .filter((t) => {
      if (!t || !t.date) return false;
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
};

export const selectMonthlySpending = (state) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  return state.transactions.items
    .filter((t) => {
      if (!t || !t.date) return false;
      const d = new Date(t.date);
      const isExpense = t.type === 'expense' || t.type === 'debit';
      return (
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear &&
        isExpense
      );
    })
    .reduce((total, t) => total + Number(t.amount || 0), 0);
};

// ─── Account Selectors ────────────────────────────────────────────────────────

export const selectAllAccounts = (state) => state.accounts.items;
export const selectActiveAccountId = (state) => state.accounts.activeAccountId;
export const selectAccountsStatus = (state) => state.accounts.status;
export const selectAccountsLoading = (state) =>
  state.accounts.status === 'loading' || state.accounts.status === 'idle';
export const selectUid = (state) => state.accounts.uid;

export const selectActiveAccount = (state) => {
  const { items, activeAccountId } = state.accounts;
  return items.find((a) => a.id === activeAccountId) || null;
};

export const selectAccountById = (accountId) => (state) =>
  state.accounts.items.find((a) => a.id === accountId) || null;

/** True when both slices have finished their initial load */
export const selectAppReady = (state) =>
  state.transactions.status === 'succeeded' &&
  state.accounts.status === 'succeeded';
