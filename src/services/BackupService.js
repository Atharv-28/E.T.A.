import { Alert, Share, Platform } from 'react-native';
import RNFS from 'react-native-fs';
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
      // Guard: Ensure RNFS is available (native module linked)
      if (!RNFS || !RNFS.DocumentDirectoryPath) {
        console.warn('react-native-fs not available or not linked. Falling back to sharing raw JSON.');
        const transactions = specificTransactions || await loadTransactions();
        const accounts = specificAccounts ? { accounts: specificAccounts, activeAccountId: specificAccounts[0]?.id } : await loadAccounts();
        const settings = await loadSettings();
        const backupData = {
          version: '1.0',
          generatedAt: new Date().toISOString(),
          appName: 'ETA - Personal Finance Manager',
          isAccountSpecific: !!(specificAccounts && specificTransactions),
          accountName: specificAccounts ? specificAccounts[0]?.name : null,
          data: { transactions, accounts, settings }
        };

        try {
          await Share.share({
            title: 'ETA Backup (raw JSON)',
            message: JSON.stringify(backupData, null, 2)
          });
          Alert.alert('Backup Shared', 'react-native-fs not available; backup JSON was shared as raw text. Please install and rebuild the app to enable file export.');
          return { success: true, fallback: true, data: backupData };
        } catch (shareErr) {
          console.error('Fallback share failed', shareErr);
          Alert.alert('Export Failed', 'Unable to create backup file or share raw JSON. Ensure react-native-fs is installed and the app rebuilt.');
          return { success: false };
        }
      }

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

      // Prepare JSON
      const backupJson = JSON.stringify(backupData, null, 2);

      // Helper to write and share a file
      const writeAndShare = async (targetPath) => {
        try {
          await RNFS.writeFile(targetPath, backupJson, 'utf8');

          const shareOptions = {
            title: fileName,
            message: backupJson, // include raw JSON as fallback for apps that only accept text
            url: Platform.OS === 'android' ? `file://${targetPath}` : targetPath
          };

          await Share.share(shareOptions);
          Alert.alert('Backup Saved', `Backup saved and share dialog opened for ${fileName}\n\nSaved to: ${targetPath}`);
          return { success: true, fileName, path: targetPath };
        } catch (err) {
          console.error('Write or share failed:', err);
          throw err;
        }
      };

      // Ask the user where to save / share
      const options = [
        { text: 'Save to Downloads and Share', onPress: async () => {
          try {
            if (!RNFS.DownloadDirectoryPath) throw new Error('Downloads directory not available');
            const downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
            const res = await writeAndShare(downloadPath);
            return res;
          } catch (err) {
            console.warn('Failed to save to Downloads, falling back to app files:', err);
            try {
              const appPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
              const res2 = await writeAndShare(appPath);
              return res2;
            } catch (err2) {
              console.error('Failed to save to app path as well', err2);
              Alert.alert('Export Failed', 'Failed to save backup file. Sharing raw JSON instead.');
              try {
                await Share.share({ title: fileName, message: backupJson });
                return { success: true, fallback: true };
              } catch (shareErr) {
                console.error('Fallback share failed', shareErr);
                Alert.alert('Export Failed', 'Unable to create backup file or share raw JSON.');
                return { success: false };
              }
            }
          }
        }},
        { text: 'Save to App Files and Share', onPress: async () => {
          try {
            const appPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
            const res = await writeAndShare(appPath);
            return res;
          } catch (err) {
            console.error('Failed to write to app files', err);
            Alert.alert('Export Failed', 'Could not write backup file to device storage.');
            return { success: false };
          }
        }},
        { text: 'Share Raw JSON', onPress: async () => {
          try {
            await Share.share({ title: fileName, message: backupJson });
            Alert.alert('Shared', 'Backup JSON shared as raw text.');
            return { success: true, fallback: true };
          } catch (err) {
            console.error('Raw share failed', err);
            Alert.alert('Export Failed', 'Unable to share backup JSON.');
            return { success: false };
          }
        }},
        { text: 'Cancel', style: 'cancel' }
      ];

      // Convert options into Alert buttons (Android supports up to 3 actions nicely)
      Alert.alert(
        'Export Backup',
        `Choose where to save the backup file "${fileName}". Select "Downloads" to save it to your device's Downloads folder (visible in file manager).`,
        options
      );

      return { success: true, fileName, data: backupData };
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      throw new Error('Failed to export backup file');
    }
  }

  // Import backup data (accepts raw JSON string, parsed object, or a file path to a .json file)
  static async importFromBackup(backupInput) {
    try {
      let backupData = null;

      // If input is an object, assume it's already parsed
      if (typeof backupInput === 'object' && backupInput !== null) {
        backupData = backupInput;
      } else if (typeof backupInput === 'string') {
        // First, try to parse as JSON string
        try {
          backupData = JSON.parse(backupInput);
        } catch (jsonErr) {
          // If parse fails, treat the string as a file path (e.g., returned by a file picker)
          if (RNFS && RNFS.exists) {
            try {
              let path = backupInput;
              if (path.startsWith('file://')) {
                path = path.replace('file://', '');
              }

              const exists = await RNFS.exists(path);
              if (!exists) {
                throw new Error('Backup file not found at provided path');
              }

              const fileContent = await RNFS.readFile(path, 'utf8');
              backupData = JSON.parse(fileContent);
            } catch (fsErr) {
              console.error('Failed to read/parse backup file:', fsErr);
              throw new Error('Failed to read or parse backup file. Make sure you selected a valid .json file.');
            }
          } else {
            throw new Error('Invalid JSON and react-native-fs is not available to read a file path');
          }
        }
      } else {
        throw new Error('Unsupported backup input type');
      }

      // Validate and normalize backup format
      const hasTransactions = backupData?.data?.transactions;
      const rawAccounts = backupData?.data?.accounts;
      const normalizedAccounts = Array.isArray(rawAccounts)
        ? rawAccounts
        : (rawAccounts?.accounts || []);

      if (!hasTransactions || !Array.isArray(normalizedAccounts)) {
        throw new Error('Invalid backup file format');
      }

      const txCount = backupData.data.transactions.length;
      const accCount = normalizedAccounts.length;

      // Show confirmation dialog
      Alert.alert(
        'Import Backup',
        `This will replace all your current data with the backup from ${new Date(backupData.generatedAt).toLocaleDateString()}. This action cannot be undone.\n\nBackup contains:\n• ${txCount} transactions\n• ${accCount} accounts\n\nContinue?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Import',
            style: 'destructive',
            onPress: async () => {
              try {
                // Import data (normalize accounts to array)
                await saveTransactions(backupData.data.transactions);
                await saveAccounts(normalizedAccounts);
                if (backupData.data.settings) {
                  await saveSettings(backupData.data.settings);
                }

                Alert.alert(
                  'Import Complete',
                  'Your data has been successfully imported. Please restart the app to see all changes.',
                  [{ text: 'OK' }]
                );
              } catch (error) {
                console.error('Import operation failed:', error);
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
      throw new Error(error.message || 'Failed to import backup file');
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
