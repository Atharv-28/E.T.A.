import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './slices/transactionsSlice';
import accountsReducer from './slices/accountsSlice';

const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    accounts: accountsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Firestore objects are non-serializable; suppress warnings for known paths
      serializableCheck: {
        ignoredActions: ['transactions/setTransactions', 'accounts/setAccounts'],
      },
    }),
});

export default store;
