import { PermissionsAndroid, Alert } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import { parseBOISMS } from '../utils/smsParser';

export class SMSService {
  static async requestSMSPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'SMS Permission',
          message: 'This app needs access to your SMS messages to automatically detect bank transactions.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error('Error requesting SMS permission:', error);
      return false;
    }
  }

  static async checkSMSPermission() {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_SMS
      );
      return granted;
    } catch (error) {
      console.error('Error checking SMS permission:', error);
      return false;
    }
  }

  static async scanRecentSMS(daysBack = 7) {
    try {
      const hasPermission = await this.checkSMSPermission();
      if (!hasPermission) {
        const permissionGranted = await this.requestSMSPermission();
        if (!permissionGranted) {
          throw new Error('SMS permission not granted');
        }
      }

      const filter = {
        box: 'inbox',
        maxCount: 100,
        indexFrom: 0,
      };

      return new Promise((resolve, reject) => {
        SmsAndroid.list(
          JSON.stringify(filter),
          (fail) => {
            console.error('Failed to get SMS messages:', fail);
            reject(new Error('Failed to read SMS messages'));
          },
          (count, smsList) => {
            try {
              const messages = JSON.parse(smsList);
              const cutoffDate = new Date();
              cutoffDate.setDate(cutoffDate.getDate() - daysBack);

              // Filter messages from the last specified days
              const recentMessages = messages.filter(msg => {
                const msgDate = new Date(parseInt(msg.date));
                return msgDate >= cutoffDate;
              });

              resolve(recentMessages);
            } catch (error) {
              console.error('Error parsing SMS messages:', error);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('Error scanning SMS:', error);
      throw error;
    }
  }

  static async parseTransactionsFromSMS(messages) {
    const transactions = [];
    
    for (const message of messages) {
      try {
        const parsedTransaction = parseBOISMS(message.body, message.address);
        if (parsedTransaction) {
          // Add SMS metadata
          parsedTransaction.source = 'sms';
          parsedTransaction.smsDate = new Date(parseInt(message.date));
          parsedTransaction.senderAddress = message.address;
          parsedTransaction.originalSMS = message.body;
          
          transactions.push(parsedTransaction);
        }
      } catch (error) {
        console.error('Error parsing SMS message:', error);
        // Continue processing other messages
      }
    }
    
    return transactions;
  }

  static async importTransactionsFromSMS(activeAccountId, addTransaction, daysBack = 7) {
    try {
      // Show loading state
      Alert.alert(
        'Scanning SMS',
        'Scanning your messages for bank transactions...',
        [],
        { cancelable: false }
      );

      const messages = await this.scanRecentSMS(daysBack);
      const transactions = await this.parseTransactionsFromSMS(messages);

      if (transactions.length === 0) {
        Alert.alert(
          'No Transactions Found',
          `No bank transactions found in SMS messages from the last ${daysBack} days.`
        );
        return { success: true, count: 0 };
      }

      // Add each transaction to the active account
      const addedTransactions = [];
      for (const transaction of transactions) {
        try {
          const transactionWithAccount = {
            ...transaction,
            accountId: activeAccountId,
          };
          
          addTransaction(transactionWithAccount);
          addedTransactions.push(transactionWithAccount);
        } catch (error) {
          console.error('Error adding transaction:', error);
        }
      }

      Alert.alert(
        'Import Complete',
        `Successfully imported ${addedTransactions.length} transaction(s) from your SMS messages.`,
        [{ text: 'OK' }]
      );

      return { 
        success: true, 
        count: addedTransactions.length,
        transactions: addedTransactions 
      };
    } catch (error) {
      console.error('Error importing transactions from SMS:', error);
      
      Alert.alert(
        'Import Failed',
        error.message || 'Failed to import transactions from SMS. Please try again.',
        [{ text: 'OK' }]
      );

      return { success: false, error: error.message };
    }
  }

  static async getTransactionSuggestions(activeAccountId, daysBack = 1) {
    try {
      const messages = await this.scanRecentSMS(daysBack);
      const transactions = await this.parseTransactionsFromSMS(messages);

      return transactions.map(transaction => ({
        ...transaction,
        accountId: activeAccountId,
        suggested: true,
      }));
    } catch (error) {
      console.error('Error getting transaction suggestions:', error);
      return [];
    }
  }
}

export default SMSService;
