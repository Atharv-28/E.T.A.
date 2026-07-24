/**
 * FirebaseService — thin wrapper over @react-native-firebase/firestore
 *
 * Collection structure:
 *   users/{uid}/transactions/{txId}
 *   users/{uid}/accounts/{accountId}
 *   users/{uid}/meta/activeAccountId
 *
 * All reads are one-time `get()` calls (no real-time listeners).
 * Offline persistence is enabled by default in @react-native-firebase/firestore.
 */
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const FirebaseService = {
  // ──────────────────────────────────────────────────────────────────────────
  // Auth (Email + Password)
  // ──────────────────────────────────────────────────────────────────────────

  /** Returns the currently signed-in Firebase user, or null. */
  getCurrentUser() {
    return auth().currentUser;
  },

  /** Register a new user with email + password. Returns the uid on success. */
  async signUp(email, password) {
    const credential = await auth().createUserWithEmailAndPassword(email.trim(), password);
    return credential.user.uid;
  },

  /** Sign in an existing user. Returns the uid on success. */
  async signIn(email, password) {
    const credential = await auth().signInWithEmailAndPassword(email.trim(), password);
    return credential.user.uid;
  },

  /** Sign the current user out. */
  async signOut() {
    await auth().signOut();
  },

  /** Send a password reset email to the given address. */
  async sendPasswordResetEmail(email) {
    await auth().sendPasswordResetEmail(email.trim());
  },

  /**
   * Returns the current user's uid if already signed in, otherwise null.
   * Used by bootstrapApp to decide whether to show the auth screen.
   */
  async getAuthenticatedUid() {
    const user = auth().currentUser;
    return user ? user.uid : null;
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Transactions
  // ──────────────────────────────────────────────────────────────────────────

  txCol(uid) {
    return firestore().collection('users').doc(uid).collection('transactions');
  },

  /** One-time fetch of all transactions for a user */
  async fetchTransactions(uid) {
    const snapshot = await this.txCol(uid).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  /** Write a new transaction document (uses tx.id as the doc ID for idempotency) */
  async addTransaction(uid, transaction) {
    const { id, ...data } = transaction;
    await this.txCol(uid).doc(id).set({ id, ...data });
  },

  /** Merge-update a transaction document */
  async updateTransaction(uid, id, data) {
    await this.txCol(uid).doc(id).update(data);
  },

  /** Delete a transaction document */
  async deleteTransaction(uid, id) {
    await this.txCol(uid).doc(id).delete();
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Accounts
  // ──────────────────────────────────────────────────────────────────────────

  accCol(uid) {
    return firestore().collection('users').doc(uid).collection('accounts');
  },

  metaDoc(uid) {
    return firestore().collection('users').doc(uid).collection('meta').doc('userMeta');
  },

  /** One-time fetch of all accounts + activeAccountId for a user */
  async fetchAccounts(uid) {
    const [snapshot, metaSnap] = await Promise.all([
      this.accCol(uid).get(),
      this.metaDoc(uid).get(),
    ]);
    const accounts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const activeAccountId = metaSnap.exists ? metaSnap.data()?.activeAccountId || null : null;
    return { accounts, activeAccountId };
  },

  /** Write a new account document */
  async addAccount(uid, account) {
    const { id, ...data } = account;
    await this.accCol(uid).doc(id).set({ id, ...data });
  },

  /** Merge-update an account document */
  async updateAccount(uid, accountId, data) {
    await this.accCol(uid).doc(accountId).update(data);
  },

  /** Delete an account document */
  async deleteAccount(uid, accountId) {
    await this.accCol(uid).doc(accountId).delete();
  },

  /** Persist the activeAccountId to Firestore meta */
  async saveActiveAccountId(uid, activeAccountId) {
    await this.metaDoc(uid).set({ activeAccountId }, { merge: true });
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Migration helper
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Bulk-write transactions to Firestore using batched writes (max 500 per batch).
   * Used once during first-run migration from AsyncStorage.
   */
  async bulkWriteTransactions(uid, transactions) {
    if (!transactions || transactions.length === 0) return;
    const chunks = [];
    for (let i = 0; i < transactions.length; i += 400) {
      chunks.push(transactions.slice(i, i + 400));
    }
    for (const chunk of chunks) {
      const batch = firestore().batch();
      chunk.forEach((tx) => {
        const { id, ...data } = tx;
        const ref = this.txCol(uid).doc(id || Date.now().toString());
        batch.set(ref, { id: ref.id, ...data });
      });
      await batch.commit();
    }
    console.log(`🔥 Migrated ${transactions.length} transactions to Firestore`);
  },

  /**
   * Bulk-write accounts to Firestore.
   * Used once during first-run migration from AsyncStorage.
   */
  async bulkWriteAccounts(uid, accounts, activeAccountId) {
    if (!accounts || accounts.length === 0) return;
    const batch = firestore().batch();
    accounts.forEach((acc) => {
      const { id, ...data } = acc;
      const ref = this.accCol(uid).doc(id);
      batch.set(ref, { id, ...data });
    });
    await batch.commit();
    if (activeAccountId) {
      await this.saveActiveAccountId(uid, activeAccountId);
    }
    console.log(`🔥 Migrated ${accounts.length} accounts to Firestore`);
  },
};

export default FirebaseService;
