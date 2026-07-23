/**
 * bootstrapApp — dispatched once the user is authenticated (after login).
 *
 * Execution order:
 *  1. Get UID from the already-signed-in Firebase user
 *  2. Fetch accounts + transactions from Firestore in parallel
 *  3. If Firestore is empty (new account), initialize with empty state
 *  4. Dispatch setUid so all future thunks can access it
 *
 * After this thunk resolves, the Redux store is fully hydrated and the app
 * makes ZERO additional Firestore reads — all UI reads are from memory.
 */
import { loadAccounts, loadTransactions } from '../utils/storage';
import FirebaseService from '../services/FirebaseService';
import { setTransactions } from './slices/transactionsSlice';
import { setAccounts, setUid } from './slices/accountsSlice';

export const bootstrapApp = (uid) => async (dispatch) => {
  try {
    console.log('🚀 bootstrapApp: starting with uid =', uid);

    // Store the uid so all future thunks (add/delete) can access it
    dispatch(setUid(uid));

    // Fetch Firestore data in parallel
    const [firestoreAccounts, firestoreTransactions] = await Promise.all([
      FirebaseService.fetchAccounts(uid),
      FirebaseService.fetchTransactions(uid),
    ]);

    const isFirstRun =
      firestoreAccounts.accounts.length === 0 &&
      firestoreTransactions.length === 0;

    if (isFirstRun) {
      console.log('✨ bootstrapApp: new account detected, initializing empty state...');

      // Clean fresh start for new accounts
      dispatch(setAccounts({ accounts: [], activeAccountId: null }));
      dispatch(setTransactions([]));

      console.log('✅ bootstrapApp: fresh initialization complete');
    } else {
      // Hydrate Redux with Firestore data
      dispatch(setAccounts(firestoreAccounts));
      dispatch(setTransactions(firestoreTransactions));
      console.log(
        `✅ bootstrapApp: loaded ${firestoreTransactions.length} transactions, ${firestoreAccounts.accounts.length} accounts`
      );
    }
  } catch (error) {
    console.error('❌ bootstrapApp failed:', error);
    // Graceful fallback: load from AsyncStorage
    try {
      console.log('⚠️ bootstrapApp: falling back to AsyncStorage...');
      const [storedAccountsData, storedTransactions] = await Promise.all([
        loadAccounts(),
        loadTransactions(),
      ]);
      const storedAccounts = Array.isArray(storedAccountsData.accounts)
        ? storedAccountsData.accounts
        : [];
      dispatch(
        setAccounts({
          accounts: storedAccounts,
          activeAccountId: storedAccountsData.activeAccountId || null,
        })
      );
      dispatch(setTransactions(storedTransactions));
    } catch (fallbackError) {
      console.error('❌ bootstrapApp: fallback failed:', fallbackError);
      dispatch(setAccounts({ accounts: [], activeAccountId: null }));
      dispatch(setTransactions([]));
    }
  }
};
