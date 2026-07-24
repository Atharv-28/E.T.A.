import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import FirebaseService from '../../services/FirebaseService';

// ─── Async Thunks ────────────────────────────────────────────────────────────

/**
 * Fetch all transactions from Firestore ONCE on app start.
 * After this, all reads come from the Redux store in memory.
 */
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchFromFirestore',
  async (uid, { rejectWithValue }) => {
    try {
      const transactions = await FirebaseService.fetchTransactions(uid);
      return transactions;
    } catch (error) {
      console.error('❌ fetchTransactions failed:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Add a transaction: update Redux immediately, then write to Firestore.
 */
export const syncAddTransaction = createAsyncThunk(
  'transactions/syncAdd',
  async (transaction, { getState, rejectWithValue }) => {
    try {
      const uid = getState().accounts.uid;
      const newTransaction = {
        ...transaction,
        id: transaction.id || Date.now().toString(),
        date: transaction.date || new Date().toISOString(),
      };
      await FirebaseService.addTransaction(uid, newTransaction);
      return newTransaction;
    } catch (error) {
      console.error('❌ syncAddTransaction failed:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Update a transaction in Redux and Firestore.
 */
export const syncUpdateTransaction = createAsyncThunk(
  'transactions/syncUpdate',
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const uid = getState().accounts.uid;
      await FirebaseService.updateTransaction(uid, id, data);
      return { id, data };
    } catch (error) {
      console.error('❌ syncUpdateTransaction failed:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Delete a transaction from Redux and Firestore.
 */
export const syncDeleteTransaction = createAsyncThunk(
  'transactions/syncDelete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const uid = getState().accounts.uid;
      await FirebaseService.deleteTransaction(uid, id);
      return id;
    } catch (error) {
      console.error('❌ syncDeleteTransaction failed:', error);
      return rejectWithValue(error.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    /** Used by bootstrapApp to bulk-set transactions without a thunk */
    setTransactions(state, action) {
      state.items = action.payload;
      state.status = 'succeeded';
    },
  },
  extraReducers: (builder) => {
    // ── fetchTransactions ──────────────────────────────────────────────────
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // ── syncAddTransaction ─────────────────────────────────────────────────
    builder
      .addCase(syncAddTransaction.fulfilled, (state, action) => {
        // Optimistic: prepend the new transaction (already written to Firestore)
        state.items = [action.payload, ...state.items];
      });

    // ── syncUpdateTransaction ──────────────────────────────────────────────
    builder
      .addCase(syncUpdateTransaction.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        const index = state.items.findIndex((t) => t.id === id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...data };
        }
      });

    // ── syncDeleteTransaction ──────────────────────────────────────────────
    builder
      .addCase(syncDeleteTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  },
});

export const { setTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;
