/**
 * bootstrapApp — dispatched once when the app mounts.
 *
 * Execution order:
 *  1. Sign in to Firebase anonymously → get UID
 *  2. Fetch accounts + transactions from Firestore in parallel
 *  3. If Firestore is empty (first run), migrate existing AsyncStorage data
 *  4. Dispatch setUid so all future thunks can access it
 *
 * After this thunk resolves, the Redux store is fully hydrated and the app
 * makes ZERO additional Firestore reads — all UI reads are from memory.
 */
import { loadAccounts, loadTransactions } from '../utils/storage';
import FirebaseService from '../services/FirebaseService';
import { setTransactions } from './slices/transactionsSlice';
import { setAccounts, setUid } from './slices/accountsSlice';

export const bootstrapApp = () => async (dispatch) => {
  try {
    console.log('🚀 bootstrapApp: starting...');

    // Step 1: Authenticate anonymously → get UID
    const uid = await FirebaseService.initFirebase();
    dispatch(setUid(uid));

    // Step 2: Fetch Firestore data in parallel
    const [firestoreAccounts, firestoreTransactions] = await Promise.all([
      FirebaseService.fetchAccounts(uid),
      FirebaseService.fetchTransactions(uid),
    ]);

    const isFirstRun =
      firestoreAccounts.accounts.length === 0 &&
      firestoreTransactions.length === 0;

    if (isFirstRun) {
      // Step 3: First run — migrate AsyncStorage data to Firestore
      console.log('📦 bootstrapApp: first run detected, migrating AsyncStorage → Firestore...');

      const [storedAccountsData, storedTransactions] = await Promise.all([
        loadAccounts(),
        loadTransactions(),
      ]);

      const storedAccounts = Array.isArray(storedAccountsData.accounts)
        ? storedAccountsData.accounts
        : [];
      const activeAccountId = storedAccountsData.activeAccountId || null;

      // Push to Firestore
      await Promise.all([
        FirebaseService.bulkWriteAccounts(uid, storedAccounts, activeAccountId),
        FirebaseService.bulkWriteTransactions(uid, storedTransactions),
      ]);

      // Hydrate Redux with migrated data
      dispatch(setAccounts({ accounts: storedAccounts, activeAccountId }));
      dispatch(setTransactions(storedTransactions));

      console.log('✅ bootstrapApp: migration complete');
    } else {
      // Step 4: Hydrate Redux with Firestore data
      dispatch(setAccounts(firestoreAccounts));
      dispatch(setTransactions(firestoreTransactions));
      console.log(
        `✅ bootstrapApp: loaded ${firestoreTransactions.length} transactions, ${firestoreAccounts.accounts.length} accounts from Firestore`
      );
    }
  } catch (error) {
    console.error('❌ bootstrapApp failed:', error);
    // Graceful fallback: load from AsyncStorage so app still works offline
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
      console.log('✅ bootstrapApp: fallback complete, app running on local data');
    } catch (fallbackError) {
      console.error('❌ bootstrapApp: fallback also failed:', fallbackError);
      // Dispatch empty state so app at least renders
      dispatch(setAccounts({ accounts: [], activeAccountId: null }));
      dispatch(setTransactions([]));
    }
  }
};
