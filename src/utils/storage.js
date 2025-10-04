import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  TRANSACTIONS: 'finance_app_transactions',
  ACCOUNTS: 'finance_app_accounts',
  SETTINGS: 'finance_app_settings',
  USER_PREFERENCES: 'finance_app_user_preferences',
  BACKUP_INFO: 'finance_app_backup_info'
};

class StorageService {
  // Generic storage methods
  async saveData(key, data) {
    try {
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonData);
      return true;
    } catch (error) {
      console.error(`Error saving data for key ${key}:`, error);
      return false;
    }
  }

  async loadData(key, defaultValue = null) {
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
  }

  async removeData(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
      return false;
    }
  }

  // Specific data methods
  async saveTransactions(transactions) {
    return await this.saveData(STORAGE_KEYS.TRANSACTIONS, { transactions });
  }

  async loadTransactions() {
    const data = await this.loadData(STORAGE_KEYS.TRANSACTIONS, { transactions: [] });
    return data.transactions;
  }

  async saveAccounts(accounts, activeAccountId) {
    return await this.saveData(STORAGE_KEYS.ACCOUNTS, { 
      accounts, 
      activeAccountId 
    });
  }

  async loadAccounts() {
    const data = await this.loadData(STORAGE_KEYS.ACCOUNTS, { 
      accounts: [], 
      activeAccountId: null 
    });
    return data;
  }

  async saveSettings(settings) {
    return await this.saveData(STORAGE_KEYS.SETTINGS, settings);
  }

  async loadSettings() {
    return await this.loadData(STORAGE_KEYS.SETTINGS, {
      appVersion: '1.0.0',
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      theme: 'light',
      notifications: { enabled: true },
      security: { appLockEnabled: false }
    });
  }

  // Clear all app data
  async clearAllData() {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      return false;
    }
  }

  // Export all data for backup
  async exportAllData() {
    try {
      const transactions = await this.loadTransactions();
      const accounts = await this.loadAccounts();
      const settings = await this.loadSettings();
      
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
  }

  // Import data from backup
  async importAllData(backupData) {
    try {
      if (backupData.transactions) {
        await this.saveTransactions(backupData.transactions);
      }
      if (backupData.accounts) {
        await this.saveAccounts(backupData.accounts.accounts, backupData.accounts.activeAccountId);
      }
      if (backupData.settings) {
        await this.saveSettings(backupData.settings);
      }
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

export default new StorageService();
