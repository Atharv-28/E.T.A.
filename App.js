/**
 * Personal Finance Manager App - ETA
 * Phase 4: Analytics & Reports (Modular Architecture)
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, useColorScheme, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Context
import { TransactionProvider } from './src/context/TransactionContext';

// Components
import Header from './src/components/Header';
import BottomNavigation from './src/components/BottomNavigation';

// Screens
import DashboardScreen from './src/screens/DashboardScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import BudgetScreen from './src/screens/BudgetScreen';
import ReportsScreen from './src/screens/ReportsScreen';

// Styles
import { styles } from './src/styles/GlobalStyles';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <TransactionProvider>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppContent />
      </SafeAreaProvider>
    </TransactionProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'transactions':
        return <TransactionsScreen />;
      case 'budget':
        return <BudgetScreen />;
      case 'reports':
        return <ReportsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <Header />
      <View style={styles.content}>
        {renderScreen()}
      </View>
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </View>
  );
}

export default App;
