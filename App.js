/**
 * Personal Finance Manager App - ETA
 * Phase 5: Firebase Auth + Firestore (Scalable Architecture)
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StatusBar, useColorScheme, View, Text, Alert, AppState, DeviceEventEmitter } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Provider, useDispatch, useSelector } from 'react-redux';

// Redux
import store from './src/store';
import { bootstrapApp } from './src/store/bootstrap';
import { selectAppReady, selectIsAuthenticated, selectAccountsLoading, selectAccountsStatus } from './src/store/selectors';
import { setAuthUser } from './src/store/slices/accountsSlice';
import auth from '@react-native-firebase/auth';

// Context (shims — kept for backwards compat)
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
import AuthScreen from './src/screens/AuthScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import LoginScreen from './src/screens/LoginScreen';
import AuthScreen from './src/screens/AuthScreen';

// Services
import NativeSMSService from './src/services/NativeSMSService';
import { checkSMSPermissions } from './src/utils/permissions';
import { palette } from './src/ui';

// Styles
import { styles as globalStyles } from './src/styles/GlobalStyles';
import { styles as appStyles, getContainerInsetStyle, getToastContainerStyle } from './App.styles';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const statusBarStyle = isDarkMode ? 'light-content' : 'dark-content';

  return (
    // Redux Provider wraps everything — AccountProvider and TransactionProvider
    // are now no-op shims kept only for backwards-compatible imports.
    <Provider store={store}>
      <AccountProvider>
        <TransactionProvider>
          <SafeAreaProvider>
            <StatusBar barStyle={statusBarStyle} backgroundColor={palette.surface} translucent={false} />
            <AppContent />
          </SafeAreaProvider>
        </TransactionProvider>
      </AccountProvider>
    </Provider>
  );
}

function AppContent() {
  const dispatch = useDispatch();
  const appReady = useSelector(selectAppReady);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const accountsLoading = useSelector(selectAccountsLoading);
  const accountsStatus = useSelector(selectAccountsStatus);

  // ── ALL hooks declared here, before any conditional return (Rules of Hooks) ─
  const safeAreaInsets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pendingTransaction, setPendingTransaction] = useState(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const [loginScreenMode, setLoginScreenMode] = useState('firstTime');
  const [matchedToast, setMatchedToast] = useState(null);

  const { addTransaction } = useTransactions();
  const { accounts, activeAccount, createAccount, switchAccount } = useAccounts();

  // Auto-restore existing Firebase auth session on app mount.
  // NOTE: onAuthStateChanged also fires right after a fresh sign-in (from
  // AuthScreen). Guard against running bootstrapApp a second time when
  // AuthScreen already started it — the accounts slice will be in 'loading'
  // or 'succeeded' state in that case.
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(setAuthUser({ uid: user.uid, email: user.email || '' }));
        // Only bootstrap if not already loading/loaded (prevents double-run
        // when AuthScreen already dispatched bootstrapApp on the same sign-in).
        if (accountsStatus === 'idle') {
          dispatch(bootstrapApp(user.uid));
        }
      }
    });
    return unsubscribe;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show bank-setup screen only AFTER the app has finished loading from
  // Firestore. Without this guard the effect fires while accounts is still
  // [] during the async bootstrap, incorrectly launching the onboarding flow
  // for returning users who have accounts in the database.
  useEffect(() => {
    // Still fetching — don't touch the login screen state yet
    if (!appReady || accountsLoading) return;

    if (!accounts || accounts.length === 0) {
      setShowLoginScreen(true);
      setLoginScreenMode('firstTime');
    } else {
      if (loginScreenMode !== 'addAccount') {
        setShowLoginScreen(false);
      }
    }
  }, [accounts, loginScreenMode, appReady, accountsLoading]);

  // Start SMS monitoring when app loads (must be declared BEFORE any conditional return)
  useEffect(() => {
    let smsListener = null;
    let intentListener = null;

    const initializeSMSMonitoring = async () => {
      try {
        console.log('📱 Initializing SMS monitoring...');

        const hasPermissions = await checkSMSPermissions();

        if (hasPermissions) {
          console.log('✅ SMS permissions granted, starting monitoring');
          smsListener = NativeSMSService.addTransactionListener(handleNativeSMSTransaction);
          await NativeSMSService.startMonitoring();
          console.log('✅ Native SMS monitoring started successfully');
        } else {
          console.log('⚠️ SMS permissions not granted. User needs to enable them manually from AccountsScreen.');
        }
      } catch (error) {
        console.error('❌ Failed to initialize SMS monitoring:', error);
      }
    };

    // Listen for intents forwarded from MainActivity (when app launched/tapped from notification)
    intentListener = DeviceEventEmitter.addListener('NativeSMSReceived', (payload) => {
      try {
        console.log('🔔 Intent payload received from native MainActivity:', payload);
        const raw = payload?.raw || '';
        const sender = payload?.sender || payload?.address || null;
        const timestamp = payload?.timestamp || new Date().toISOString();

        handleNativeSMSTransaction({
          messageBody: raw,
          body: raw,
          message: raw,
          sender: sender,
          address: sender,
          timestamp: timestamp,
          date: timestamp,
        });
      } catch (e) {
        console.error('Error handling intent payload', e);
      }
    });

    initializeSMSMonitoring();

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('🔄 App became active, checking SMS service status');
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      if (smsListener) {
        NativeSMSService.removeListener(smsListener);
      }
      if (intentListener) {
        intentListener.remove();
      }
      NativeSMSService.stopMonitoring();
      subscription?.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Show Firebase Auth screen if user is not logged in ─────────────────
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // ── Show loading screen AFTER all hooks are declared ─────────────────────
  if (!appReady) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.surface, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={{ color: palette.textSecondary, marginTop: 12, fontFamily: 'Inter-Regular' }}>
          Loading your data...
        </Text>
      </View>
    );
  }

  // Handle SMS transaction from native service
  const handleNativeSMSTransaction = async (smsData) => {
    try {
      console.log('📨 Native SMS transaction received:', smsData);

      const SMSParser = require('./src/utils/smsParser').default;
      const rawText = smsData.messageBody || smsData.body || smsData.message || '';
      const parsed = SMSParser.parseAnySMS(rawText);

      if (parsed) {
        parsed.sender = smsData.sender || smsData.address;
        parsed.rawSMS = rawText;
        parsed.timestamp = smsData.timestamp || smsData.date || new Date().toISOString();
        console.log('✅ SMS parsed successfully:', parsed);
        handleNewTransaction(parsed, rawText);
      } else {
        console.log('❌ SMS could not be parsed by specialized parser, using fallback');
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

      let matchedAccountId = null;
      let matchedAccount = null;

      if (!transactionData || !transactionData.accountNumber) {
        const raw = (rawSmsText || transactionData?.rawSMS || '');
        try {
          const smsText = (transactionData && transactionData.rawSMS) || raw || '';
          const amountMatch = smsText.match(/Rs\.?\s*([\d,]+\.?\d*)/i);
          const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null;
          const acc4 = extractLast4FromSMS(smsText);
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
        const smsLast4 = transactionData.accountNumber.toString().replace(/\D/g, '').slice(-4);
        matchedAccount = accounts.find(account =>
          account.accountNumber && account.accountNumber.slice(-4) === smsLast4
        );

        if (matchedAccount) {
          matchedAccountId = matchedAccount.id;
          console.log('✅ Matched account by last4:', matchedAccount.name);
        } else {
          matchedAccountId = null;
          console.log('⚠️ No stored account matched last4:', transactionData.accountNumber);
        }
      } else {
        matchedAccountId = activeAccount?.id || null;
      }

      const transactionWithAccount = {
        ...transactionData,
        accountId: matchedAccountId,
        bank: matchedAccount ? (matchedAccount.bank || matchedAccount.name) : (transactionData.bank || 'Unknown Bank'),
        accountNumber: (matchedAccount && matchedAccount.accountNumber) || (transactionData.accountNumber || null),
      };

      console.log('📋 Transaction with account:', transactionWithAccount);

      if (matchedAccount) {
        setMatchedToast({
          title: 'Transaction Detected',
          message: `Matched to ${matchedAccount.name} (••${matchedAccount.accountNumber.slice(-4)})`,
        });
        setTimeout(() => setMatchedToast(null), 3000);
        setPendingTransaction(transactionWithAccount);
        setCategoryModalVisible(true);
      } else {
        if (transactionData.accountNumber) {
          setMatchedToast({
            title: 'Unmatched Account',
            message: `No saved account found for ••${transactionData.accountNumber.toString().replace(/\D/g,'').slice(-4)}. Please choose an account.`,
          });
          setTimeout(() => setMatchedToast(null), 4000);
          setPendingTransaction(transactionWithAccount);
          setCategoryModalVisible(true);
        } else {
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
  // createAccount now dispatches an async Redux thunk which auto-sets the new
  // account as active, so no explicit switchAccount call is needed.
  const handleAccountSetup = (accountData) => {
    try {
      createAccount(accountData);
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
        return (
          <DashboardScreen
            onViewAll={() => setActiveTab('transactions')}
            onDetails={() => setActiveTab('reports')}
            onManualTransaction={(transaction) => {
              setPendingTransaction(transaction);
              setCategoryModalVisible(true);
            }}
          />
        );
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
        return <ReportsScreen onSeeAll={() => setActiveTab('transactions')} />;
      default:
        return (
          <DashboardScreen
            onViewAll={() => setActiveTab('transactions')}
            onDetails={() => setActiveTab('reports')}
            onManualTransaction={(transaction) => {
              setPendingTransaction(transaction);
              setCategoryModalVisible(true);
            }}
          />
        );
    }
  };

  // Show LoginScreen modal if needed (bank account setup, not auth)
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
    <View style={[globalStyles.container, getContainerInsetStyle(safeAreaInsets.top)]}>
      {matchedToast && (
        <View style={getToastContainerStyle(safeAreaInsets.top)}>
          <View style={appStyles.toastBox}>
            <Text style={appStyles.toastTitle}>{matchedToast.title}</Text>
            <Text style={appStyles.toastMessage}>{matchedToast.message}</Text>
          </View>
        </View>
      )}
      <Header />
      <View style={globalStyles.content}>
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
