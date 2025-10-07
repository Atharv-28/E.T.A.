/**
 * Personal Finance Manager App - ETA
 * Phase 4: Analytics & Reports (Modular Architecture)
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { StatusBar, useColorScheme, View, Text, Alert, AppState } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Context
import { TransactionProvider, useTransactions } from './src/context/TransactionContext';
import { AccountProvider, useAccounts } from './src/context/AccountContext';

// Components
import Header from './src/components/Header';
import BottomNavigation from './src/components/BottomNavigation';
import TransactionCategoryModal from './src/components/TransactionCategoryModal';

// Screens
import DashboardScreen from './src/screens/DashboardScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import AccountsScreen from './src/screens/AccountsScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import LoginScreen from './src/screens/LoginScreen';

// Services
import NativeSMSService from './src/services/NativeSMSService';
import { checkSMSPermissions } from './src/utils/permissions';

// Styles
import { styles } from './src/styles/GlobalStyles';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <AccountProvider>
      <TransactionProvider>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <AppContent />
        </SafeAreaProvider>
      </TransactionProvider>
    </AccountProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pendingTransaction, setPendingTransaction] = useState(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const [loginScreenMode, setLoginScreenMode] = useState('firstTime'); // 'firstTime' or 'addAccount'
  const [matchedToast, setMatchedToast] = useState(null);

  const { addTransaction } = useTransactions();
  const { accounts, activeAccount, createAccount, switchAccount } = useAccounts();

  // Show login screen if no accounts exist
  useEffect(() => {
    if (accounts.length === 0) {
      setShowLoginScreen(true);
      setLoginScreenMode('firstTime');
    }
  }, [accounts]);

  // Start SMS monitoring when app loads
  useEffect(() => {
    let smsListener = null;

    const initializeSMSMonitoring = async () => {
      try {
        console.log('📱 Initializing SMS monitoring...');
        
        // Check if permissions are granted
        const hasPermissions = await checkSMSPermissions();
        
        if (hasPermissions) {
          console.log('✅ SMS permissions granted, starting monitoring');
          
          // Add listener for SMS transaction events
          smsListener = NativeSMSService.addTransactionListener(handleNativeSMSTransaction);
          
          // Start the native monitoring service
          await NativeSMSService.startMonitoring();
          
          console.log('✅ Native SMS monitoring started successfully');
        } else {
          console.log('⚠️ SMS permissions not granted. User needs to enable them manually from AccountsScreen.');
        }
      } catch (error) {
        console.error('❌ Failed to initialize SMS monitoring:', error);
      }
    };

    initializeSMSMonitoring();

    // Listen for app state changes
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('🔄 App became active, checking SMS service status');
        // Could re-check permissions here if needed
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup when component unmounts
    return () => {
      if (smsListener) {
        NativeSMSService.removeListener(smsListener);
      }
      NativeSMSService.stopMonitoring();
      subscription?.remove();
    };
  }, []);

  // Handle SMS transaction from native service
  const handleNativeSMSTransaction = async (smsData) => {
    try {
      console.log('📨 Native SMS transaction received:', smsData);

      // Use the SMSParser default export
      const SMSParser = require('./src/utils/smsParser').default;
      const rawText = smsData.messageBody || smsData.body || smsData.message || '';
      const parsed = SMSParser.parseAnySMS(rawText);

      if (parsed) {
        // Attach sender/raw info and pass to the unified handler
        parsed.sender = smsData.sender || smsData.address;
        parsed.rawSMS = rawText;
        parsed.timestamp = smsData.timestamp || smsData.date || new Date().toISOString();
        console.log('✅ SMS parsed successfully:', parsed);
        handleNewTransaction(parsed, rawText);
      } else {
        console.log('❌ SMS could not be parsed by specialized parser, using fallback');
        // Pass minimal data so fallback logic can try to extract last-4/amount
        handleNewTransaction({ rawSMS: rawText, sender: smsData.sender || smsData.address, date: smsData.timestamp || new Date().toISOString() }, rawText);
      }
    } catch (error) {
      console.error('❌ Error handling native SMS transaction:', error);
    }
  };

  // Handle new transaction detected from SMS
  const handleNewTransaction = (transactionData, rawSmsText = '') => {
    try {
      console.log('🚀 New transaction detected in App.js:', transactionData);
      
      // Try to match with active account or find account by account number
      let matchedAccountId = null;
      let matchedAccount = null;

      // If parser returned null or incomplete info, attempt a lightweight fallback parsing
      if (!transactionData || !transactionData.accountNumber) {
        const raw = (rawSmsText || transactionData?.rawSMS || '');
         // Note: some native service provides smsData.messageBody; if not available here, transactionData may be null
         // We'll attempt to extract amount and last 4 digits heuristically if transactionData missing
         try {
           const smsText = (transactionData && transactionData.rawSMS) || raw || '';
           const amountMatch = smsText.match(/Rs\.?\s*([\d,]+\.?\d*)/i);
           const accMatch = smsText.match(/A\/?c\s*X{0,2}(\d{4})|Acct(?:ount)?\s*.*?(\d{4})|(?:\b|\D)(\d{4})\b/);
           const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null;
           const acc4 = accMatch ? (accMatch[1] || accMatch[2] || accMatch[3]) : null;

           if (!transactionData) transactionData = {};
           if (amount && !transactionData.amount) transactionData.amount = amount;
           if (acc4 && !transactionData.accountNumber) transactionData.accountNumber = acc4;
           if (!transactionData.date) transactionData.date = new Date().toISOString();
           if (!transactionData.description) transactionData.description = (smsText || '').slice(0, 120);
           if (!transactionData.type) transactionData.type = 'expense';
         } catch (e) {
           console.warn('Fallback SMS parse failed:', e);
         }
       }

       if (transactionData.accountNumber) {
         matchedAccount = accounts.find(account => 
           account.accountNumber &&
           transactionData.accountNumber.toString().includes(account.accountNumber.slice(-4))
         );

         if (matchedAccount) {
           matchedAccountId = matchedAccount.id;
           console.log('✅ Matched account by last4:', matchedAccount.name);
         } else {
           // We explicitly do NOT assign to activeAccount here when a last-4 is present but doesn't match any stored account.
           // This makes the modal show Account: N/A and forces the user to pick where to save the transaction.
           matchedAccountId = null;
           console.log('⚠️ No stored account matched last4:', transactionData.accountNumber);
         }
       } else {
         // No last-4 in SMS -> default to active account if available
         matchedAccountId = activeAccount?.id || null;
       }

       // Add account ID to transaction and include matched bank/account info for UI
       const transactionWithAccount = {
         ...transactionData,
         // accountId may be null when SMS includes an unmatched last-4; modal will show Account: N/A
         accountId: matchedAccountId,
         // do not override id here to let addTransaction generate id in context
         // supply a friendly bank/account label for modal UI
         bank: matchedAccount ? (matchedAccount.bank || matchedAccount.name) : (transactionData.bank || 'Unknown Bank'),
         accountNumber: (matchedAccount && matchedAccount.accountNumber) || (transactionData.accountNumber || null),
       };

       console.log('📋 Transaction with account:', transactionWithAccount);

       // Show a quick alert mentioning which bank/account was matched (if any)
       if (matchedAccount) {
         // show in-app toast
         setMatchedToast({
           title: 'Transaction Detected',
           message: `Matched to ${matchedAccount.name} (••${matchedAccount.accountNumber.slice(-4)})`,
         });
         // auto-hide after 3s
         setTimeout(() => setMatchedToast(null), 3000);
         // also open modal when user taps View — for now, auto-open
         setPendingTransaction(transactionWithAccount);
         setCategoryModalVisible(true);
       } else {
         // No exact account match
         if (transactionData.accountNumber) {
           // SMS had a last-4 but no stored account matched it — show explicit toast and open modal without assigning an account
           setMatchedToast({
             title: 'Unmatched Account',
             message: `No saved account found for ••${transactionData.accountNumber.slice(-4)}. Please choose an account.`,
           });
           setTimeout(() => setMatchedToast(null), 4000);
           setPendingTransaction(transactionWithAccount);
           setCategoryModalVisible(true);
         } else {
           // No account info in SMS -> default behavior: open modal with active account assigned
           const defaultAssigned = { ...transactionWithAccount, accountId: activeAccount?.id || accounts[0]?.id };
           setPendingTransaction(defaultAssigned);
           setCategoryModalVisible(true);
         }
       }
      
      console.log('🎯 Category modal should now be visible');

    } catch (error) {
      console.error('Error handling new transaction:', error);
      Alert.alert(
        'Error',
        'Failed to process the new transaction from SMS.',
        [{ text: 'OK' }]
      );
    }
  };

  // Confirm and add the transaction
  const handleConfirmTransaction = async (finalTransaction) => {
    try {
      console.log('Attempting to add transaction:', finalTransaction);
      if (!finalTransaction.accountId) {
        Alert.alert('Choose Account', 'Please select an account to save this transaction under before adding.');
        return;
      }

      await addTransaction(finalTransaction);
      setCategoryModalVisible(false);
      setPendingTransaction(null);
      
      Alert.alert(
        'Transaction Added! 💳',
        `${finalTransaction.type === 'income' ? 'Income' : 'Expense'} of ₹${finalTransaction.amount} has been automatically added from your SMS.`,
        [{ text: 'Great!' }]
      );
    } catch (error) {
      console.error('Error adding transaction:', error);
      Alert.alert(
        'Error',
        'Failed to add the transaction. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  // Cancel transaction addition
  const handleCancelTransaction = () => {
    setCategoryModalVisible(false);
    setPendingTransaction(null);
  };

  // Handler for account setup from LoginScreen - create account and switch to it
  const handleAccountSetup = (accountData) => {
    try {
      const newAccount = createAccount(accountData);
      // switch to new account if possible
      if (newAccount && newAccount.id) {
        switchAccount(newAccount.id);
      }
      setShowLoginScreen(false);
      setLoginScreenMode('firstTime');
    } catch (error) {
      console.error('Failed to create account from onboarding:', error);
      setShowLoginScreen(false);
    }
  };

  // Handler for opening add account modal from AccountsScreen
  const handleAddAccount = () => {
    setShowLoginScreen(true);
    setLoginScreenMode('addAccount');
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'transactions':
        return <TransactionsScreen />;
      case 'accounts':
        return (
          <AccountsScreen
            onAddAccount={handleAddAccount}
            onSimulateTransaction={(transaction) => {
              setPendingTransaction(transaction);
              setCategoryModalVisible(true);
            }}
          />
        );
      case 'reports':
        return <ReportsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  // Show LoginScreen modal if needed
  if (showLoginScreen) {
    return (
      <LoginScreen
        isFirstTime={loginScreenMode === 'firstTime'}
        onAccountSetup={handleAccountSetup}
        onClose={() => setShowLoginScreen(false)}
      />
    );
  }

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}> 
      {matchedToast && (
        <View style={{ position: 'absolute', top: safeAreaInsets.top + 8, left: 16, right: 16, zIndex: 9999 }}>
          <View style={{ backgroundColor: '#222', padding: 12, borderRadius: 8, elevation: 6 }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>{matchedToast.title}</Text>
            <Text style={{ color: '#fff', opacity: 0.9 }}>{matchedToast.message}</Text>
          </View>
        </View>
      )}
      <Header />
      <View style={styles.content}>
        {renderScreen()}
      </View>
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <TransactionCategoryModal
        visible={categoryModalVisible}
        transaction={pendingTransaction}
        onConfirm={handleConfirmTransaction}
        onCancel={handleCancelTransaction}
      />
    </View>
  );
}

export default App;
