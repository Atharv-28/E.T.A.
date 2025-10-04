import { PermissionsAndroid, Alert, Platform } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import SMSParser from '../utils/smsParser';

export class SMSService {
  static async requestSMSPermission() {
    if (Platform.OS !== 'android') {
      throw new Error('SMS reading is only supported on Android');
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'SMS Permission Required',
          message: 'This app needs access to your SMS messages to automatically detect bank transactions and help you track your finances.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'Allow',
        }
      );
      
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error('Error requesting SMS permission:', error);
      return false;
    }
  }

  static async checkSMSPermission() {
    if (Platform.OS !== 'android') {
      return false;
    }

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

  static async scanRecentSMS(daysBack = 30) {
    try {
      const hasPermission = await this.checkSMSPermission();
      if (!hasPermission) {
        const permissionGranted = await this.requestSMSPermission();
        if (!permissionGranted) {
          throw new Error('SMS permission not granted. Please allow SMS access in settings to automatically import transactions.');
        }
      }

      const filter = {
        box: 'inbox',
        maxCount: 200, // Scan more messages for 30 days
        indexFrom: 0,
      };

      return new Promise((resolve, reject) => {
        SmsAndroid.list(
          JSON.stringify(filter),
          (fail) => {
            console.error('Failed to get SMS messages:', fail);
            reject(new Error('Failed to read SMS messages. Please check your permissions.'));
          },
          (count, smsList) => {
            try {
              const messages = JSON.parse(smsList);
              const cutoffDate = new Date();
              cutoffDate.setDate(cutoffDate.getDate() - daysBack);

              // Filter messages from the last specified days and from bank-like senders
              const recentMessages = messages.filter(msg => {
                const msgDate = new Date(parseInt(msg.date));
                const isRecent = msgDate >= cutoffDate;
                
                // Filter for bank-like messages
                const senderLower = (msg.address || '').toLowerCase();
                const bodyLower = (msg.body || '').toLowerCase();
                
                const isBankMessage = 
                  senderLower.includes('boi') ||
                  senderLower.includes('bank') ||
                  bodyLower.includes('credited') ||
                  bodyLower.includes('debited') ||
                  bodyLower.includes('withdrawn') ||
                  bodyLower.includes('deposited') ||
                  bodyLower.includes('upi') ||
                  bodyLower.includes('neft') ||
                  bodyLower.includes('rtgs') ||
                  bodyLower.includes('account balance') ||
                  bodyLower.includes('a/c') ||
                  bodyLower.includes('rs.');

                return isRecent && isBankMessage;
              });

              resolve(recentMessages);
            } catch (error) {
              console.error('Error parsing SMS messages:', error);
              reject(new Error('Failed to process SMS messages.'));
            }
          }
        );
      });
    } catch (error) {
      console.error('Error scanning SMS:', error);
      throw error;
    }
  }

  static async parseTransactionsFromSMS(messages, accounts = []) {
    const transactions = [];
    const duplicateRefs = new Set(); // Track reference numbers to avoid duplicates
    
    for (const message of messages) {
      try {
        const parsedTransaction = SMSParser.parseAnySMS(message.body);
        if (parsedTransaction) {
          // Create a unique identifier from SMS
          const refId = `sms_${parsedTransaction.accountNumber}_${parsedTransaction.amount}_${parsedTransaction.date.split('T')[0]}`;
          
          if (!duplicateRefs.has(refId)) {
            duplicateRefs.add(refId);
            
            // Try to match with existing accounts
            let matchedAccountId = null;
            for (const account of accounts) {
              if (account.accountNumber && 
                  parsedTransaction.accountNumber.includes(account.accountNumber.slice(-4))) {
                matchedAccountId = account.id;
                break;
              }
            }
            
            // Create transaction object
            const transaction = {
              id: `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              type: parsedTransaction.type,
              amount: parsedTransaction.amount,
              description: parsedTransaction.description,
              category: SMSParser.categorizeTransaction(parsedTransaction.description, parsedTransaction.type),
              accountId: matchedAccountId || accounts[0]?.id, // Default to first account if no match
              date: parsedTransaction.date,
              source: 'sms',
              smsData: {
                sender: message.address,
                date: new Date(parseInt(message.date)),
                accountNumber: parsedTransaction.accountNumber,
                bank: parsedTransaction.bank,
                rawSMS: parsedTransaction.rawSMS
              }
            };
            
            transactions.push(transaction);
          }
        }
      } catch (error) {
        console.error('Error parsing SMS message:', error);
        // Continue processing other messages
      }
    }
    
    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return transactions;
  }

  static async importTransactionsFromSMS(accounts, addTransaction, daysBack = 30) {
    try {
      // Show scanning progress
      const scanningAlert = Alert.alert(
        'Scanning SMS Messages',
        `Searching your messages for bank transactions from the last ${daysBack} days...`,
        [],
        { cancelable: false }
      );

      const messages = await this.scanRecentSMS(daysBack);
      const transactions = await this.parseTransactionsFromSMS(messages, accounts);

      // Close scanning alert
      if (scanningAlert) {
        Alert.dismiss?.();
      }

      if (transactions.length === 0) {
        Alert.alert(
          'No Transactions Found',
          `No bank transactions detected in SMS messages from the last ${daysBack} days.\n\nTip: Make sure your bank sends SMS notifications for transactions.`,
          [{ text: 'OK' }]
        );
        return { success: true, count: 0, transactions: [] };
      }

      // Show confirmation dialog with transaction details
      const transactionSummary = transactions.slice(0, 5).map(t => 
        `• ${t.type === 'income' ? '+' : '-'}₹${t.amount} - ${t.description}`
      ).join('\n');

      const moreText = transactions.length > 5 ? `\n...and ${transactions.length - 5} more` : '';

      Alert.alert(
        'Transactions Found',
        `Found ${transactions.length} transaction(s):\n\n${transactionSummary}${moreText}\n\nWould you like to import these transactions?`,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Import All',
            onPress: async () => {
              try {
                let addedCount = 0;
                for (const transaction of transactions) {
                  try {
                    await addTransaction(transaction);
                    addedCount++;
                  } catch (error) {
                    console.error('Error adding transaction:', error);
                  }
                }

                Alert.alert(
                  'Import Complete',
                  `Successfully imported ${addedCount} out of ${transactions.length} transaction(s) from your SMS messages.`,
                  [{ text: 'Great!' }]
                );
              } catch (error) {
                Alert.alert(
                  'Import Error',
                  'Some transactions could not be imported. Please try again.',
                  [{ text: 'OK' }]
                );
              }
            }
          }
        ]
      );

      return { 
        success: true, 
        count: transactions.length,
        transactions: transactions 
      };

    } catch (error) {
      console.error('Error importing transactions from SMS:', error);
      
      Alert.alert(
        'Import Failed',
        error.message || 'Failed to import transactions from SMS. Please check your permissions and try again.',
        [{ text: 'OK' }]
      );

      return { success: false, error: error.message };
    }
  }

  static async getTransactionSuggestions(accounts, daysBack = 1) {
    try {
      const messages = await this.scanRecentSMS(daysBack);
      const transactions = await this.parseTransactionsFromSMS(messages, accounts);

      return transactions.map(transaction => ({
        ...transaction,
        suggested: true,
      }));
    } catch (error) {
      console.error('Error getting transaction suggestions:', error);
      return [];
    }
  }
}

export default SMSService;
