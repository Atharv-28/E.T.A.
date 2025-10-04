import { Alert } from 'react-native';
import { loadTransactions, loadAccounts, loadSettings, saveTransactions, saveAccounts, saveSettings } from '../utils/storage';

export class BackupService {
  
  // Generate backup data
  static async generateBackupData() {
    try {
      const transactions = await loadTransactions();
      const accounts = await loadAccounts();
      const settings = await loadSettings();
      
      const backupData = {
        version: '1.0',
        generatedAt: new Date().toISOString(),
        appName: 'ETA - Personal Finance Manager',
        data: {
          transactions,
          accounts,
          settings
        }
      };
      
      return backupData;
    } catch (error) {
      console.error('Error generating backup data:', error);
      throw new Error('Failed to generate backup data');
    }
  }

  // Export data to JSON (can be account-specific)
  static async exportToJSON(specificAccounts = null, specificTransactions = null) {
    try {
      let transactions, accounts;
      
      if (specificAccounts && specificTransactions) {
        // Export specific account data
        transactions = specificTransactions;
        accounts = { accounts: specificAccounts, activeAccountId: specificAccounts[0]?.id };
      } else {
        // Export all data
        transactions = await loadTransactions();
        accounts = await loadAccounts();
      }
      
      const settings = await loadSettings();
      
      const backupData = {
        version: '1.0',
        generatedAt: new Date().toISOString(),
        appName: 'ETA - Personal Finance Manager',
        isAccountSpecific: !!(specificAccounts && specificTransactions),
        accountName: specificAccounts ? specificAccounts[0]?.name : null,
        data: {
          transactions,
          accounts,
          settings
        }
      };
      
      const timestamp = new Date().toISOString().split('T')[0];
      const accountSuffix = specificAccounts ? `_${specificAccounts[0]?.name.replace(/\s+/g, '_')}` : '';
      const fileName = `ETA_Backup${accountSuffix}_${timestamp}.json`;
      
      // For now, just show the data in an alert (in production, use file sharing)
      const dataPreview = `Backup generated successfully!\n\nFile: ${fileName}\nTransactions: ${backupData.data.transactions.length}\n${specificAccounts ? `Account: ${specificAccounts[0]?.name}` : `Accounts: ${backupData.data.accounts.accounts?.length || 0}`}\nGenerated: ${new Date(backupData.generatedAt).toLocaleString()}`;
      
      Alert.alert(
        'Backup Generated',
        `${dataPreview}\n\n📎 In a full version, this would save to your device and allow sharing.`,
        [
          { text: 'OK' },
          {
            text: 'Copy Data',
            onPress: () => {
              // In production, copy to clipboard or save file
              console.log('Backup Data:', JSON.stringify(backupData, null, 2));
              Alert.alert('Data Logged', 'Backup data has been logged to console.');
            }
          }
        ]
      );
      
      return { success: true, fileName, data: backupData };
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      throw new Error('Failed to export backup file');
    }
  }

  // Export transactions to CSV (can be account-specific)
  static async exportTransactionsToCSV(specificTransactions = null, accountName = null) {
    try {
      let transactions, accounts;
      
      if (specificTransactions) {
        transactions = specificTransactions;
        accounts = await loadAccounts(); // Still need all accounts for lookup
      } else {
        transactions = await loadTransactions();
        accounts = await loadAccounts();
      }
      
      // Create account lookup
      const accountLookup = {};
      accounts.accounts?.forEach(account => {
        accountLookup[account.id] = account.name || account.bankName || 'Unknown Account';
      });
      
      // CSV headers
      const headers = [
        'Date',
        'Type',
        'Amount',
        'Description',
        'Category',
        'Account',
        'Source'
      ];
      
      // Convert transactions to CSV format
      const csvRows = [headers.join(',')];
      
      transactions.forEach(transaction => {
        const row = [
          new Date(transaction.date).toLocaleDateString(),
          transaction.type,
          transaction.amount,
          `"${transaction.description.replace(/"/g, '""')}"`, // Escape quotes
          transaction.category,
          `"${accountLookup[transaction.accountId] || 'Unknown'}"`,
          transaction.source || 'manual'
        ];
        csvRows.push(row.join(','));
      });
      
      const csvContent = csvRows.join('\n');
      const timestamp = new Date().toISOString().split('T')[0];
      const accountSuffix = accountName ? `_${accountName.replace(/\s+/g, '_')}` : '';
      const fileName = `ETA_Transactions${accountSuffix}_${timestamp}.csv`;
      
      // For demo, show CSV preview
      const csvPreview = csvContent.split('\n').slice(0, 5).join('\n');
      
      Alert.alert(
        'CSV Export Generated',
        `File: ${fileName}\nTransactions: ${transactions.length}\n${accountName ? `Account: ${accountName}` : 'All Accounts'}\n\nPreview:\n${csvPreview}\n${transactions.length > 4 ? '...(and more)' : ''}\n\n📎 In a full version, this would save to your device.`,
        [
          { text: 'OK' },
          {
            text: 'Copy CSV',
            onPress: () => {
              console.log('CSV Data:', csvContent);
              Alert.alert('CSV Logged', 'CSV data has been logged to console.');
            }
          }
        ]
      );
      
      return { success: true, fileName, csvContent };
    } catch (error) {
      console.error('Error exporting CSV:', error);
      throw new Error('Failed to export CSV file');
    }
  }

  // Import backup data
  static async importFromBackup(backupJsonString) {
    try {
      const backupData = JSON.parse(backupJsonString);
      
      // Validate backup format
      if (!backupData.data || !backupData.data.transactions || !backupData.data.accounts) {
        throw new Error('Invalid backup file format');
      }
      
      // Show confirmation dialog
      Alert.alert(
        'Import Backup',
        `This will replace all your current data with the backup from ${new Date(backupData.generatedAt).toLocaleDateString()}. This action cannot be undone.\n\nBackup contains:\n• ${backupData.data.transactions.length} transactions\n• ${backupData.data.accounts.length} accounts\n\nContinue?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Import',
            style: 'destructive',
            onPress: async () => {
              try {
                // Import data
                await saveTransactions(backupData.data.transactions);
                await saveAccounts(backupData.data.accounts);
                if (backupData.data.settings) {
                  await saveSettings(backupData.data.settings);
                }
                
                Alert.alert(
                  'Import Complete',
                  'Your data has been successfully imported. Please restart the app to see all changes.',
                  [{ text: 'OK' }]
                );
              } catch (error) {
                Alert.alert(
                  'Import Failed',
                  'Failed to import backup data. Please try again.',
                  [{ text: 'OK' }]
                );
              }
            }
          }
        ]
      );
      
      return { success: true };
    } catch (error) {
      console.error('Error importing backup:', error);
      throw new Error('Failed to import backup file');
    }
  }

  // Get backup file info
  static async getBackupInfo() {
    try {
      const transactions = await loadTransactions();
      const accounts = await loadAccounts();
      
      const totalTransactions = transactions.length;
      const totalAccounts = accounts.length;
      const lastTransaction = transactions.length > 0 ? 
        new Date(Math.max(...transactions.map(t => new Date(t.date)))).toLocaleDateString() : 
        'No transactions';
      
      return {
        totalTransactions,
        totalAccounts,
        lastTransaction,
        dataSize: JSON.stringify({ transactions, accounts }).length
      };
    } catch (error) {
      console.error('Error getting backup info:', error);
      return {
        totalTransactions: 0,
        totalAccounts: 0,
        lastTransaction: 'Error',
        dataSize: 0
      };
    }
  }

  // Clear all data (with confirmation)
  static async clearAllData() {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your transactions, accounts, and settings. This action cannot be undone.\n\nAre you sure you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await saveTransactions([]);
              await saveAccounts([]);
              await saveSettings({});
              
              Alert.alert(
                'Data Cleared',
                'All data has been cleared. Please restart the app.',
                [{ text: 'OK' }]
              );
            } catch (error) {
              Alert.alert(
                'Error',
                'Failed to clear data. Please try again.',
                [{ text: 'OK' }]
              );
            }
          }
        }
      ]
    );
  }
}

export default BackupService;
