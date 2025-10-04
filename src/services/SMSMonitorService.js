import { PermissionsAndroid, Platform, AppState } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import BackgroundJob from 'react-native-background-job';
import SMSParser from '../utils/smsParser';

class SMSMonitorService {
  constructor() {
    this.isMonitoring = false;
    this.smsListener = null;
    this.onNewTransactionCallback = null;
    this.lastSMSTimestamp = 0;
    this.backgroundJobStarted = false;
    this.appState = AppState.currentState;
    this.pendingTransactions = [];
    
    // Listen to app state changes
    AppState.addEventListener('change', this.handleAppStateChange.bind(this));
  }

  // Request SMS permission
  async requestSMSPermission() {
    if (Platform.OS !== 'android') {
      throw new Error('SMS monitoring is only supported on Android');
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'SMS Permission Required',
          message: 'This app needs access to your SMS messages to automatically detect new bank transactions.',
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

  // Check if SMS permission is granted
  async checkSMSPermission() {
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

  // Start monitoring for new SMS messages
  async startMonitoring(onNewTransactionCallback) {
    if (this.isMonitoring) {
      console.log('SMS monitoring already active');
      return true;
    }

    try {
      // Check permission first
      const hasPermission = await this.checkSMSPermission();
      if (!hasPermission) {
        const permissionGranted = await this.requestSMSPermission();
        if (!permissionGranted) {
          throw new Error('SMS permission not granted');
        }
      }

      this.onNewTransactionCallback = onNewTransactionCallback;

      // Start background job for continuous monitoring
      this.startBackgroundMonitoring();

      // Since react-native-get-sms-android doesn't support real-time monitoring,
      // we'll implement a polling mechanism to check for new SMS
      this.startPolling();

      this.isMonitoring = true;
      console.log('📱 SMS monitoring started with background job support');
      return true;

    } catch (error) {
      console.error('Error starting SMS monitoring:', error);
      return false;
    }
  }

  // Start polling for new SMS messages
  startPolling() {
    this.lastSMSTimestamp = Date.now();
    
    // Poll every 10 seconds for new SMS
    this.smsListener = setInterval(async () => {
      try {
        await this.checkForNewSMS();
      } catch (error) {
        console.error('Error checking for new SMS:', error);
      }
    }, 10000); // Check every 10 seconds
  }

  // Check for new SMS messages since last check
  async checkForNewSMS() {
    try {
      const filter = {
        box: 'inbox',
        maxCount: 10, // Check last 10 messages
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
              
              // Filter messages newer than last check
              const newMessages = messages.filter(msg => {
                const msgDate = parseInt(msg.date);
                return msgDate > this.lastSMSTimestamp;
              });

              // Update timestamp
              if (newMessages.length > 0) {
                this.lastSMSTimestamp = Math.max(...newMessages.map(msg => parseInt(msg.date)));
                
                // Process new messages
                newMessages.forEach(message => {
                  this.handleNewSMS(message);
                });
              }

              resolve(newMessages);
            } catch (error) {
              console.error('Error parsing SMS messages:', error);
              reject(new Error('Failed to process SMS messages'));
            }
          }
        );
      });
    } catch (error) {
      console.error('Error checking for new SMS:', error);
      throw error;
    }
  }

  // Stop monitoring SMS messages
  stopMonitoring() {
    if (!this.isMonitoring) {
      return;
    }

    try {
      // Stop foreground polling
      if (this.smsListener) {
        clearInterval(this.smsListener);
        this.smsListener = null;
      }

      // Stop background monitoring
      this.stopBackgroundMonitoring();

      this.isMonitoring = false;
      this.onNewTransactionCallback = null;
      console.log('🛑 SMS monitoring stopped (foreground + background)');

    } catch (error) {
      console.error('Error stopping SMS monitoring:', error);
    }
  }

  // Handle new incoming SMS
  handleNewSMS(message) {
    try {
      console.log('📨 Processing SMS message:', message);
      
      if (!message || !message.body) {
        console.log('❌ No message body found');
        return;
      }

      // Check if SMS looks like a bank transaction
      if (!this.isBankSMS(message.body)) {
        console.log('❌ SMS does not look like a bank transaction');
        return;
      }

      console.log('🏦 Bank SMS detected:', message.body);

      // Try to parse the transaction
      const parsedTransaction = SMSParser.parseAnySMS(message.body);
      console.log('📊 Parsed transaction:', parsedTransaction);
      
      if (parsedTransaction && this.onNewTransactionCallback) {
        // Add SMS metadata
        const transactionData = {
          ...parsedTransaction,
          smsData: {
            sender: message.address,
            receivedAt: new Date(parseInt(message.date)),
            rawSMS: message.body
          }
        };

        console.log('🚀 Calling transaction callback with data:', transactionData);
        
        // Call the callback to show category selection popup
        this.onNewTransactionCallback(transactionData);
        
        console.log('✅ Transaction callback completed');
      } else {
        if (!parsedTransaction) {
          console.log('❌ Failed to parse transaction from SMS');
        }
        if (!this.onNewTransactionCallback) {
          console.log('❌ No callback function available');
        }
      }

    } catch (error) {
      console.error('Error handling new SMS:', error);
    }
  }

  // Check if SMS is from a bank
  isBankSMS(smsBody) {
    const text = smsBody.toLowerCase();
    
    // Bank keywords
    const bankKeywords = [
      'boi', 'bank of india', 'hdfc', 'sbi', 'icici', 'axis',
      'kotak', 'yes bank', 'pnb', 'canara', 'union bank'
    ];

    // Transaction keywords
    const transactionKeywords = [
      'credited', 'debited', 'withdrawn', 'deposited',
      'upi', 'neft', 'rtgs', 'balance', 'a/c', 'rs.'
    ];

    // Check if SMS contains bank and transaction keywords
    const hasBankKeyword = bankKeywords.some(keyword => text.includes(keyword));
    const hasTransactionKeyword = transactionKeywords.some(keyword => text.includes(keyword));

    return hasBankKeyword && hasTransactionKeyword;
  }

  // Get monitoring status
  getStatus() {
    return {
      isMonitoring: this.isMonitoring,
      hasListener: !!this.smsListener,
      hasCallback: !!this.onNewTransactionCallback,
      backgroundJobStarted: this.backgroundJobStarted,
      appState: this.appState,
      pendingTransactions: this.pendingTransactions ? this.pendingTransactions.length : 0
    };
  }

  // Test the SMS monitoring with demo data
  testSMSMonitoring() {
    console.log('🧪 Testing SMS monitoring...');
    
    if (!this.onNewTransactionCallback) {
      console.error('❌ No callback registered! SMS monitoring may not be started properly.');
      return;
    }
    
    // Simulate a bank SMS
    const testSMS = {
      address: 'BOI',
      body: 'BOI - Rs.1500.00 Credited to your Ac XX9326 on 04-10-25 by UPI ref No.112115898277.Avl Bal 25580.15',
      date: Date.now().toString()
    };

    console.log('📱 Processing test SMS:', testSMS.body);
    console.log('📞 Callback available:', !!this.onNewTransactionCallback);
    
    this.handleNewSMS(testSMS);
    
    console.log('✅ Test SMS processing completed');
  }

  // Handle app state changes
  handleAppStateChange(nextAppState) {
    console.log('📱 App state changed from', this.appState, 'to', nextAppState);
    
    if (this.appState.match(/inactive|background/) && nextAppState === 'active') {
      // App came to foreground
      console.log('🔄 App came to foreground, ensuring SMS monitoring is active');
      if (this.isMonitoring && !this.smsListener) {
        this.startPolling();
      }
    }
    
    this.appState = nextAppState;
  }

  // Start background monitoring
  startBackgroundMonitoring() {
    if (this.backgroundJobStarted) {
      console.log('🔄 Background job already running');
      return;
    }

    try {
      // Configure background job
      BackgroundJob.configure({
        jobKey: 'SMSMonitoringJob',
        period: 15000, // Check every 15 seconds in background (slightly longer than foreground)
        requiredNetworkType: 'any',
        requiresCharging: false,
        requiresDeviceIdle: false,
      });

      // Define the background job
      BackgroundJob.on('SMSMonitoringJob', () => {
        console.log('🔍 Background job: Checking for new SMS...');
        
        // Run SMS check in background
        this.checkForNewSMSInBackground()
          .then((newMessages) => {
            if (newMessages && newMessages.length > 0) {
              console.log(`📨 Background job found ${newMessages.length} new messages`);
              
              // If app is in background and we found transaction SMS,
              // bring app to foreground to show popup
              if (this.appState !== 'active') {
                console.log('🚀 Bringing app to foreground for transaction popup');
                this.bringAppToForeground();
              }
            }
          })
          .catch((error) => {
            console.error('❌ Background SMS check error:', error);
          });
      });

      // Start the background job
      BackgroundJob.start();
      this.backgroundJobStarted = true;
      
      console.log('✅ Background SMS monitoring job started');

    } catch (error) {
      console.error('❌ Error starting background job:', error);
    }
  }

  // Check for new SMS in background (simplified version)
  async checkForNewSMSInBackground() {
    try {
      const filter = {
        box: 'inbox',
        maxCount: 5, // Check fewer messages in background for performance
        indexFrom: 0,
      };

      return new Promise((resolve, reject) => {
        SmsAndroid.list(
          JSON.stringify(filter),
          (fail) => {
            console.error('❌ Background SMS check failed:', fail);
            reject(new Error('Failed to read SMS messages in background'));
          },
          (count, smsList) => {
            try {
              const messages = JSON.parse(smsList);
              
              // Filter messages newer than last check
              const newMessages = messages.filter(msg => {
                const msgDate = parseInt(msg.date);
                return msgDate > this.lastSMSTimestamp;
              });

              // Update timestamp
              if (newMessages.length > 0) {
                this.lastSMSTimestamp = Math.max(...newMessages.map(msg => parseInt(msg.date)));
                
                // Process new messages but store them for when app comes to foreground
                const transactionMessages = [];
                newMessages.forEach(message => {
                  if (this.isBankSMS(message.body)) {
                    console.log('🏦 Background: Bank SMS detected:', message.body.substring(0, 50) + '...');
                    transactionMessages.push(message);
                  }
                });
                
                // Store transaction messages for foreground processing
                if (transactionMessages.length > 0) {
                  this.storePendingTransactions(transactionMessages);
                }
                
                resolve(transactionMessages);
              } else {
                resolve([]);
              }

            } catch (error) {
              console.error('❌ Error parsing SMS in background:', error);
              reject(new Error('Failed to process SMS messages in background'));
            }
          }
        );
      });
    } catch (error) {
      console.error('❌ Background SMS check error:', error);
      throw error;
    }
  }

  // Store pending transactions for foreground processing
  storePendingTransactions(messages) {
    if (!this.pendingTransactions) {
      this.pendingTransactions = [];
    }
    
    messages.forEach(message => {
      const parsedTransaction = SMSParser.parseAnySMS(message.body);
      if (parsedTransaction) {
        const transactionData = {
          ...parsedTransaction,
          smsData: {
            sender: message.address,
            receivedAt: new Date(parseInt(message.date)),
            rawSMS: message.body
          }
        };
        
        this.pendingTransactions.push(transactionData);
        console.log('💾 Stored pending transaction:', transactionData.amount, transactionData.type);
      }
    });
  }

  // Process pending transactions when app comes to foreground
  processPendingTransactions() {
    if (!this.pendingTransactions || this.pendingTransactions.length === 0) {
      return;
    }

    console.log(`🔄 Processing ${this.pendingTransactions.length} pending transactions`);
    
    // Process each pending transaction
    this.pendingTransactions.forEach(transactionData => {
      if (this.onNewTransactionCallback) {
        console.log('🚀 Processing pending transaction:', transactionData.amount, transactionData.type);
        this.onNewTransactionCallback(transactionData);
      }
    });

    // Clear pending transactions
    this.pendingTransactions = [];
  }

  // Bring app to foreground (attempts to activate the app)
  bringAppToForeground() {
    try {
      // This will attempt to bring the React Native app to foreground
      // Note: This might not work on all Android versions due to restrictions
      console.log('🔄 Attempting to bring app to foreground...');
      
      // Process pending transactions after a short delay to ensure app is active
      setTimeout(() => {
        this.processPendingTransactions();
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error bringing app to foreground:', error);
    }
  }

  // Stop background monitoring
  stopBackgroundMonitoring() {
    if (!this.backgroundJobStarted) {
      return;
    }

    try {
      BackgroundJob.stop();
      this.backgroundJobStarted = false;
      console.log('🛑 Background SMS monitoring stopped');
    } catch (error) {
      console.error('❌ Error stopping background job:', error);
    }
  }
}

export default new SMSMonitorService();
