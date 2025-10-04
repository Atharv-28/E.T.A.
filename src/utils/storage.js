import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  TRANSACTIONS: 'finance_app_transactions',
  ACCOUNTS: 'finance_app_accounts',
  SETTINGS: 'finance_app_settings',
  USER_PREFERENCES: 'finance_app_user_preferences',
  BACKUP_INFO: 'finance_app_backup_info'
};

// Generic storage methods
const saveData = async (key, data) => {
  try {
    const jsonData = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonData);
    return true;
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
    return false;
  }
};

const loadData = async (key, defaultValue = null) => {
  try {
    const jsonData = await AsyncStorage.getItem(key);
    if (jsonData !== null) {
      return JSON.parse(jsonData);
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error loading data for key ${key}:`, error);
    return defaultValue;
  }
};

const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
    return false;
  }
};

// Specific data methods
export const saveTransactions = async (transactions) => {
  return await saveData(STORAGE_KEYS.TRANSACTIONS, { transactions });
};

export const loadTransactions = async () => {
  const data = await loadData(STORAGE_KEYS.TRANSACTIONS, { transactions: [] });
  return data.transactions;
};

export const saveAccounts = async (accounts, activeAccountId) => {
  return await saveData(STORAGE_KEYS.ACCOUNTS, { 
    accounts, 
    activeAccountId 
  });
};

export const loadAccounts = async () => {
  const data = await loadData(STORAGE_KEYS.ACCOUNTS, { 
    accounts: [], 
    activeAccountId: null 
  });
  return data;
};

export const saveSettings = async (settings) => {
  return await saveData(STORAGE_KEYS.SETTINGS, settings);
};

export const loadSettings = async () => {
  return await loadData(STORAGE_KEYS.SETTINGS, {
    appVersion: '1.0.0',
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    theme: 'light',
    notifications: { enabled: true },
    security: { appLockEnabled: false }
  });
};

// Clear all app data
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};

// Export all data for backup
export const exportAllData = async () => {
  try {
    const transactions = await loadTransactions();
    const accounts = await loadAccounts();
    const settings = await loadSettings();
    
    return {
      transactions,
      accounts,
      settings,
      exportDate: new Date().toISOString(),
      appVersion: '1.0.0'
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
};

// Import data from backup
export const importAllData = async (backupData) => {
  try {
    if (backupData.transactions) {
      await saveTransactions(backupData.transactions);
    }
    if (backupData.accounts) {
      await saveAccounts(backupData.accounts.accounts, backupData.accounts.activeAccountId);
    }
    if (backupData.settings) {
      await saveSettings(backupData.settings);
    }
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};
