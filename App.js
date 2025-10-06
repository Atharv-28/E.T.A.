/**
 * Personal Finance Manager App - ETA
 * Phase 4: Analytics & Reports (Modular Architecture)
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { StatusBar, useColorScheme, View, Alert, AppState } from 'react-native';
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
      
      // Parse the SMS using existing parser
      const { parseSMS } = require('./src/utils/smsParser');
      const transactionData = parseSMS(smsData.sender, smsData.messageBody, smsData.timestamp);
      
      if (transactionData) {
        console.log('✅ SMS parsed successfully:', transactionData);
        handleNewTransaction(transactionData);
      } else {
        console.log('❌ SMS could not be parsed as transaction');
      }
    } catch (error) {
      console.error('❌ Error handling native SMS transaction:', error);
    }
  };

  // Handle new transaction detected from SMS
  const handleNewTransaction = (transactionData) => {
    try {
      console.log('🚀 New transaction detected in App.js:', transactionData);
      
      // Try to match with active account or find account by account number
      let matchedAccountId = activeAccount?.id;
      
      if (transactionData.accountNumber) {
        const matchedAccount = accounts.find(account => 
          account.accountNumber && 
          transactionData.accountNumber.includes(account.accountNumber.slice(-4))
        );
        if (matchedAccount) {
          matchedAccountId = matchedAccount.id;
          console.log('✅ Matched account:', matchedAccount.name);
        }
      }

      // Add account ID to transaction
      const transactionWithAccount = {
        ...transactionData,
        accountId: matchedAccountId || activeAccount?.id || accounts[0]?.id
      };

      console.log('📋 Transaction with account:', transactionWithAccount);

      // Show category selection modal
      setPendingTransaction(transactionWithAccount);
      setCategoryModalVisible(true);
      
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
