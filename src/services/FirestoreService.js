/**
 * FirestoreService.js
 * Firestore CRUD wrapper for ETA Finance App.
 * All data is scoped per user: users/{uid}/transactions & users/{uid}/accounts
 */

import firestore from '@react-native-firebase/firestore';

// Enable offline persistence (data cached locally when offline)
firestore().settings({
  persistence: true,
  cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
});

const FirestoreService = {
  // ─────────────────────────────────────────
  // TRANSACTIONS
  // ─────────────────────────────────────────

  /**
   * Get a real-time listener for a user's transactions.
   * @param {string} uid
   * @param {function} onData - Receives transactions array.
   * @param {function} onError
   * @returns {function} Unsubscribe function.
   */
  listenToTransactions: (uid, onData, onError) => {
    return firestore()
      .collection('users')
      .doc(uid)
      .collection('transactions')
      .orderBy('date', 'desc')
      .onSnapshot(
        (snapshot) => {
          const transactions = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          onData(transactions);
        },
        (error) => {
          console.error('Firestore transactions listener error:', error);
          if (onError) onError(error);
        }
      );
  },

  /**
   * Add a new transaction document for a user.
   * @param {string} uid
   * @param {object} transaction - Transaction data (id will be the Firestore doc ID).
   * @returns {Promise<string>} The new document ID.
   */
  addTransaction: async (uid, transaction) => {
    const { id, ...data } = transaction;
    // Use the client-generated id as the Firestore doc ID for consistency
    const docRef = firestore()
      .collection('users')
      .doc(uid)
      .collection('transactions')
      .doc(id || firestore().collection('_').doc().id);

    await docRef.set({
      ...data,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  },

  /**
   * Update an existing transaction.
   * @param {string} uid
   * @param {string} transactionId
   * @param {object} updatedData
   * @returns {Promise<void>}
   */
  updateTransaction: async (uid, transactionId, updatedData) => {
    await firestore()
      .collection('users')
      .doc(uid)
      .collection('transactions')
      .doc(transactionId)
      .update({
        ...updatedData,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
  },

  /**
   * Delete a transaction.
   * @param {string} uid
   * @param {string} transactionId
   * @returns {Promise<void>}
   */
  deleteTransaction: async (uid, transactionId) => {
    await firestore()
      .collection('users')
      .doc(uid)
      .collection('transactions')
      .doc(transactionId)
      .delete();
  },

  // ─────────────────────────────────────────
  // ACCOUNTS
  // ─────────────────────────────────────────

  /**
   * Get a real-time listener for a user's accounts + metadata.
   * @param {string} uid
   * @param {function} onData - Receives { accounts, activeAccountId }.
   * @param {function} onError
   * @returns {function} Unsubscribe function.
   */
  listenToAccounts: (uid, onData, onError) => {
    return firestore()
      .collection('users')
      .doc(uid)
      .collection('accounts')
      .onSnapshot(
        (snapshot) => {
          // Separate metadata doc from actual account docs
          const metadataDoc = snapshot.docs.find((doc) => doc.id === '__metadata__');
          const accounts = snapshot.docs
            .filter((doc) => doc.id !== '__metadata__')
            .map((doc) => ({ ...doc.data(), id: doc.id }));

          const activeAccountId = metadataDoc?.data()?.activeAccountId || null;
          onData({ accounts, activeAccountId });
        },
        (error) => {
          console.error('Firestore accounts listener error:', error);
          if (onError) onError(error);
        }
      );
  },

  /**
   * Add a new account for a user.
   * @param {string} uid
   * @param {object} account
   * @returns {Promise<string>} The document ID used.
   */
  addAccount: async (uid, account) => {
    const { id, ...data } = account;
    const docRef = firestore()
      .collection('users')
      .doc(uid)
      .collection('accounts')
      .doc(id);

    await docRef.set({
      ...data,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  },

  /**
   * Update an existing account.
   * @param {string} uid
   * @param {string} accountId
   * @param {object} updatedData
   * @returns {Promise<void>}
   */
  updateAccount: async (uid, accountId, updatedData) => {
    await firestore()
      .collection('users')
      .doc(uid)
      .collection('accounts')
      .doc(accountId)
      .update({
        ...updatedData,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
  },

  /**
   * Delete an account.
   * @param {string} uid
   * @param {string} accountId
   * @returns {Promise<void>}
   */
  deleteAccount: async (uid, accountId) => {
    await firestore()
      .collection('users')
      .doc(uid)
      .collection('accounts')
      .doc(accountId)
      .delete();
  },

  /**
   * Save the active account ID to the metadata document.
   * @param {string} uid
   * @param {string} activeAccountId
   * @returns {Promise<void>}
   */
  setActiveAccountId: async (uid, activeAccountId) => {
    await firestore()
      .collection('users')
      .doc(uid)
      .collection('accounts')
      .doc('__metadata__')
      .set({ activeAccountId }, { merge: true });
  },
};

export default FirestoreService;
