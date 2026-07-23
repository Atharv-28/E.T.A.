import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import FirebaseService from '../../services/FirebaseService';

// ─── Async Thunks ────────────────────────────────────────────────────────────

/**
 * Fetch all accounts from Firestore ONCE on app start.
 */
export const fetchAccounts = createAsyncThunk(
  'accounts/fetchFromFirestore',
  async (uid, { rejectWithValue }) => {
    try {
      const result = await FirebaseService.fetchAccounts(uid);
      return result; // { accounts: [], activeAccountId: null }
    } catch (error) {
      console.error('❌ fetchAccounts failed:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Create a new account: update Redux immediately, then write to Firestore.
 */
export const syncCreateAccount = createAsyncThunk(
  'accounts/syncCreate',
  async (accountData, { getState, rejectWithValue }) => {
    try {
      const uid = getState().accounts.uid;
      const newAccount = {
        ...accountData,
        id: `account-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      await FirebaseService.addAccount(uid, newAccount);
      return newAccount;
    } catch (error) {
      console.error('❌ syncCreateAccount failed:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Update an account in Redux and Firestore.
 */
export const syncUpdateAccount = createAsyncThunk(
  'accounts/syncUpdate',
  async ({ accountId, data }, { getState, rejectWithValue }) => {
    try {
      const uid = getState().accounts.uid;
      await FirebaseService.updateAccount(uid, accountId, data);
      return { accountId, data };
    } catch (error) {
      console.error('❌ syncUpdateAccount failed:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Delete an account from Redux and Firestore.
 */
export const syncDeleteAccount = createAsyncThunk(
  'accounts/syncDelete',
  async (accountId, { getState, rejectWithValue }) => {
    try {
      const uid = getState().accounts.uid;
      await FirebaseService.deleteAccount(uid, accountId);
      return accountId;
    } catch (error) {
      console.error('❌ syncDeleteAccount failed:', error);
      return rejectWithValue(error.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const accountsSlice = createSlice({
  name: 'accounts',
  initialState: {
    items: [],
    activeAccountId: null,
    uid: null, // Firebase anonymous auth UID
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    /** Bulk-set accounts after bootstrap */
    setAccounts(state, action) {
      const { accounts, activeAccountId } = action.payload;
      state.items = accounts;
      state.activeAccountId = activeAccountId;
      state.status = 'succeeded';
    },
    /** Store the Firebase anonymous UID for use in all Firestore calls */
    setUid(state, action) {
      state.uid = action.payload;
    },
    /** Switch the active account locally (also persisted to Firestore meta) */
    setActiveAccountId(state, action) {
      state.activeAccountId = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ── fetchAccounts ──────────────────────────────────────────────────────
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.accounts || [];
        state.activeAccountId = action.payload.activeAccountId || null;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // ── syncCreateAccount ──────────────────────────────────────────────────
    builder
      .addCase(syncCreateAccount.fulfilled, (state, action) => {
        state.items = [...state.items, action.payload];
        // Auto-set as active if it's the first account
        if (!state.activeAccountId) {
          state.activeAccountId = action.payload.id;
        }
      });

    // ── syncUpdateAccount ──────────────────────────────────────────────────
    builder
      .addCase(syncUpdateAccount.fulfilled, (state, action) => {
        const { accountId, data } = action.payload;
        const index = state.items.findIndex((a) => a.id === accountId);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...data };
        }
      });

    // ── syncDeleteAccount ──────────────────────────────────────────────────
    builder
      .addCase(syncDeleteAccount.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.items = state.items.filter((a) => a.id !== deletedId);
        if (state.activeAccountId === deletedId) {
          state.activeAccountId = state.items[0]?.id || null;
        }
      });
  },
});

export const { setAccounts, setUid, setActiveAccountId } = accountsSlice.actions;
export default accountsSlice.reducer;
