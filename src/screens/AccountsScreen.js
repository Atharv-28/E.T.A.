import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import CustomIcon from '../components/CustomIcon';
import { 
  FadeInView, 
  SlideInView, 
  ScaleInView, 
  GradientCard,
  AnimatedButton,
  GradientButton 
} from '../components/AnimatedComponents';
import { useAccounts, ACCOUNT_TYPES } from '../context/AccountContext';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency } from '../utils/currency';
import BackupService from '../services/BackupService';
import NativeSMSService from '../services/NativeSMSService';
import { requestSMSPermissionsWithDialog, checkSMSPermissions } from '../utils/permissions';
import { styles, colors } from '../styles/GlobalStyles';

function AccountsScreen({ onSimulateTransaction, onAddAccount }) {
  const { 
    accounts, 
    activeAccount, 
    createAccount, 
    updateAccount, 
    deleteAccount, 
    switchAccount 
  } = useAccounts();
  
  const { transactions, addTransaction } = useTransactions();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({
    bankName: '',
    type: 'personal',
  });

  // Calculate account balance
  const calculateAccountBalance = (accountId) => {
    const accountTransactions = transactions.filter(t => t.accountId === accountId);
    return accountTransactions.reduce((total, transaction) => {
      return transaction.type === 'income' 
        ? total + transaction.amount 
        : total - transaction.amount;
    }, 0);
  };

  const handleCreateAccount = () => {
    // If parent provided an onAddAccount handler (App opens LoginScreen), use it.
    if (typeof onAddAccount === 'function') {
      onAddAccount();
      return;
    }

    // Fallback to in-place modal if no handler provided
    setEditingAccount(null);
    setFormData({ bankName: '', type: 'personal' });
    setModalVisible(true);
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setFormData({ 
      bankName: account.bankName || account.name,
      type: account.type || 'personal'
    });
    setModalVisible(true);
  };

  const handleSaveAccount = () => {
    if (!formData.bankName.trim()) {
      Alert.alert('Error', 'Please enter bank name');
      return;
    }

    const accountType = ACCOUNT_TYPES[formData.type.toUpperCase()] || ACCOUNT_TYPES.PERSONAL;

    const accountData = {
      name: formData.bankName.trim(),
      bankName: formData.bankName.trim(),
      type: accountType.id,
      color: accountType.color,
      icon: accountType.icon,
    };

    if (editingAccount) {
      updateAccount(editingAccount.id, accountData);
    } else {
      createAccount(accountData);
    }

    setModalVisible(false);
    setFormData({ bankName: '', type: 'personal' });
    setEditingAccount(null);
  };

  const handleDeleteAccount = (account) => {
    if (accounts.length <= 1) {
      Alert.alert('Cannot Delete', 'You must have at least one account');
      return;
    }

    Alert.alert(
      'Delete Account',
      `Are you sure you want to delete "${account.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteAccount(account.id)
        },
      ]
    );
  };

  const handleExportJSON = async () => {
    if (!activeAccount) {
      Alert.alert('No Active Account', 'Please select an account first before exporting data.');
      return;
    }
    
    try {
      // Filter transactions for active account only
      const activeAccountTransactions = transactions.filter(t => t.accountId === activeAccount.id);
      await BackupService.exportToJSON([activeAccount], activeAccountTransactions);
    } catch (error) {
      console.error('Export JSON error:', error);
      Alert.alert(
        'Export Failed',
        'Failed to export backup file. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleExportCSV = async () => {
    if (!activeAccount) {
      Alert.alert('No Active Account', 'Please select an account first before exporting data.');
      return;
    }
    
    try {
      // Filter transactions for active account only
      const activeAccountTransactions = transactions.filter(t => t.accountId === activeAccount.id);
      await BackupService.exportTransactionsToCSV(activeAccountTransactions, activeAccount.name);
    } catch (error) {
      console.error('Export CSV error:', error);
      Alert.alert(
        'Export Failed',
        'Failed to export CSV file. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleNativeSMSStatus = async () => {
    try {
      // Check current permissions
      const hasPermissions = await checkSMSPermissions();
      const serviceStatus = NativeSMSService.getMonitoringStatus();
      
      if (!hasPermissions) {
        Alert.alert(
          'SMS Permissions Required',
          `📱 SMS Service Status:
• Permissions: ❌ Not Granted
• Service: ❌ Cannot Start
• Real-time Detection: ❌ Disabled

To enable automatic transaction detection, this app needs permission to read SMS messages from your bank. 

Your SMS data is processed locally and never shared.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Grant Permissions', 
              onPress: async () => {
                const granted = await requestSMSPermissionsWithDialog();
                if (granted) {
                  try {
                    await NativeSMSService.startMonitoring();
                    Alert.alert(
                      'SMS Service Started',
                      '✅ SMS monitoring is now active!\n\nBank transaction SMS will be automatically detected and categorized.',
                      [{ text: 'OK' }]
                    );
                  } catch (error) {
                    Alert.alert('Error', 'Failed to start SMS monitoring service');
                  }
                }
              }
            }
          ]
        );
        return;
      }

      // If permissions are granted, show current status
      Alert.alert(
        'SMS Service Status',
        `📱 SMS Service Status:
• Permissions: ✅ Granted
• Service: ${serviceStatus.isMonitoring ? '✅ Running' : '⚠️ Stopped'}
• Real-time Detection: ${serviceStatus.isMonitoring ? '✅ Active' : '❌ Inactive'}
• Background Support: ✅ Enabled

${serviceStatus.isMonitoring 
  ? 'The SMS service is actively monitoring for bank transaction messages.' 
  : 'The SMS service is available but not currently running.'
}`,
        [
          ...(serviceStatus.isMonitoring ? [] : [
            { 
              text: 'Start Service', 
              onPress: async () => {
                try {
                  await NativeSMSService.startMonitoring();
                  Alert.alert('Success', 'SMS monitoring started successfully');
                } catch (error) {
                  Alert.alert('Error', 'Failed to start SMS service');
                }
              }
            }
          ]),
          { text: 'OK' }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to check SMS service status');
    }
  };

  const handleTransactionMessageExample = () => {
    if (!onSimulateTransaction) {
      Alert.alert('Error', 'Simulation function not available');
      return;
    }

    Alert.alert(
      'Simulate Transaction',
      'Choose simulation type',
      [
        // only provide 'Use another saved account' if there is another account besides active
        ...(accounts.find(a => a.id !== activeAccount?.id) ? [{ text: 'Use another saved account', onPress: () => {
            const targetAccount = accounts.find(a => a.id !== activeAccount?.id);

            const simulatedTransaction = {
              type: 'expense',
              amount: 500.00,
              description: `ATM Withdrawal - ${targetAccount?.bank || targetAccount?.name}`,
              date: new Date().toISOString(),
              accountId: targetAccount?.id,
              accountNumber: targetAccount?.accountNumber || null,
              bank: targetAccount?.bank || targetAccount?.name || 'Unknown Bank',
              id: Date.now().toString()
            };
            onSimulateTransaction(simulatedTransaction);
          } }] : []),
         { text: 'Simulate custom last-4 (1234)', onPress: () => {
             // Simulate an SMS from a bank with last-4 = 1234 regardless of saved accounts
             const simulatedTransaction = {
               type: 'expense',
               amount: 500.00,
               description: 'ATM Withdrawal - ICICI',
               date: new Date().toISOString(),
               accountId: null, // intentionally null to test unmatched behavior
               accountNumber: '1234',
               bank: 'ICICI Bank',
               id: Date.now().toString()
             };
             onSimulateTransaction(simulatedTransaction);
           }
         },
         { text: 'Cancel', style: 'cancel' }
       ]
     );
   };

  const renderAccountItem = ({ item: account }) => {
    const isActive = activeAccount?.id === account.id;
    const balance = calculateAccountBalance(account.id);
    const accountType = Object.values(ACCOUNT_TYPES).find(type => type.id === account.type) || ACCOUNT_TYPES.PERSONAL;

    return (
      <TouchableOpacity
        style={[
          styles.accountItem,
          isActive && { backgroundColor: account.color + '20', borderColor: account.color }
        ]}
        onPress={() => switchAccount(account.id)}
      >
        <View style={styles.accountLeft}>
          <View style={[styles.accountIcon, { backgroundColor: account.color }]}>
            <CustomIcon name={account.icon || accountType.icon} size={24} color="#ffffff" />
          </View>
          <View style={styles.accountInfo}>
            <Text style={styles.accountName}>{account.bankName || account.name}</Text>
            <Text style={[styles.accountType, { color: account.color }]}>
              {accountType.name}
            </Text>
          </View>
        </View>
        
        <View style={styles.accountRight}>
          <Text style={[
            styles.accountBalance,
            { color: balance >= 0 ? '#27ae60' : '#e74c3c' }
          ]}>
            {formatCurrency(balance)}
          </Text>
          {isActive && (
            <View style={styles.activeIndicator}>
              <CustomIcon name="check-circle" size={16} color={account.color} />
            </View>
          )}
        </View>

        {/* Account Actions */}
        <View style={styles.accountActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditAccount(account)}
          >
            <CustomIcon name="edit" size={16} color="#7f8c8d" />
          </TouchableOpacity>
          
          {accounts.length > 1 && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteAccount(account)}
            >
              <CustomIcon name="delete" size={16} color="#e74c3c" />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderTypeOption = (type) => {
    const isSelected = formData.type === type.id;

    return (
      <TouchableOpacity
        key={type.id}
        style={[
          styles.typeOption,
          isSelected && { backgroundColor: type.color, borderColor: type.color }
        ]}
        onPress={() => setFormData(prev => ({ ...prev, type: type.id }))}
      >
        <CustomIcon 
          name={type.icon} 
          size={20} 
          color={isSelected ? '#ffffff' : type.color} 
        />
        <Text style={[
          styles.typeOptionText,
          isSelected && { color: '#ffffff' }
        ]}>
          {type.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with Animation */}
      <FadeInView>
        <View style={styles.screenHeader}>
          <Text style={styles.screenTitle}>Accounts</Text>
          <GradientButton 
            colors={[colors.primary, colors.primaryDark]}
            onPress={handleCreateAccount}
            style={styles.addButton}
          >
            <CustomIcon name="add" size={20} color={colors.white} />
            <Text style={styles.addButtonText}>Add Account</Text>
          </GradientButton>
        </View>
      </FadeInView>

      {/* Active Account Summary with Animation */}
      {activeAccount && (
        <SlideInView direction="right" delay={200}>
          <GradientCard 
            colors={[colors.cardGradient3Start, colors.cardGradient3End]}
            style={[styles.activeAccountCard, { borderLeftWidth: 0, borderWidth: 0 }]}
          >
            <View style={styles.activeAccountHeader}>
              <CustomIcon name={activeAccount.icon} size={24} color={colors.white} />
              <Text style={[styles.activeAccountName, { color: colors.white }]}>{activeAccount.name}</Text>
              <CustomIcon name="check-circle" size={20} color={colors.white} />
            </View>
            <Text style={[styles.activeAccountBalance, { color: colors.white }]}>
              {formatCurrency(calculateAccountBalance(activeAccount.id))}
            </Text>
            <Text style={[styles.activeAccountLabel, { color: colors.white, opacity: 0.9 }]}>Current Balance</Text>
          </GradientCard>
        </SlideInView>
      )}

      {/* Backup & Export Section with Animation */}
      <FadeInView delay={400}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💾 Backup & Export</Text>
          <Text style={styles.sectionDescription}>
            Export data for the currently active account ({activeAccount?.name || 'No account selected'})
          </Text>
          
          <View style={styles.backupButtonsContainer}>
            <ScaleInView delay={500}>
              <GradientButton 
                colors={[colors.info, colors.infoDark]}
                style={[styles.backupButton, !activeAccount && styles.smsImportButtonDisabled]}
                onPress={handleExportJSON}
                disabled={!activeAccount}
              >
                <CustomIcon name="save" size={18} color={colors.white} />
                <Text style={[styles.backupButtonText, { color: colors.white }]}>
                  Export Backup
                </Text>
              </GradientButton>
            </ScaleInView>
            
            <ScaleInView delay={600}>
              <GradientButton 
                colors={[colors.success, colors.successDark]}
                style={[styles.backupButton, !activeAccount && styles.smsImportButtonDisabled]}
                onPress={handleExportCSV}
                disabled={!activeAccount}
              >
                <CustomIcon name="table-chart" size={18} color={colors.white} />
                <Text style={[styles.backupButtonText, { color: colors.white }]}>
                  Export CSV
                </Text>
              </GradientButton>
            </ScaleInView>
          </View>
          
          <Text style={styles.backupHint}>
            💡 Will export transactions for "{activeAccount?.name || 'the selected account'}" only
          </Text>
        </View>
      </FadeInView>

      {/* Native SMS Status Section with Animation */}
      <FadeInView delay={600}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📡 Native SMS Monitoring</Text>
          <Text style={[styles.sectionDescription, { color: colors.danger, fontWeight: '600' }]}>
            🚨For development testing only. Don't use below buttons 🚨
          </Text>
          
          <View style={{ flexDirection: 'column' }}>
            <ScaleInView delay={700}>
              <GradientButton 
                colors={[colors.primary, colors.primaryDark]}
                style={[styles.smsImportButton, { marginBottom: 12 }]}
                onPress={handleNativeSMSStatus}
              >
                <CustomIcon name="settings-remote" size={20} color={colors.white} />
                <Text style={[styles.smsImportButtonText, { color: colors.white }]}>Check SMS Service Status</Text>
              </GradientButton>
            </ScaleInView>
            
            <ScaleInView delay={750}>
              <GradientButton 
                colors={[colors.warning, colors.warningDark]}
                style={[styles.smsImportButton]}
                onPress={handleTransactionMessageExample}
              >
                <CustomIcon name="play-circle" size={20} color={colors.white} />
                <Text style={[styles.smsImportButtonText, { color: colors.white }]}>Simulate Transaction</Text>
              </GradientButton>
            </ScaleInView>
          </View>
          
          <Text style={styles.smsImportHint}>
            💡 Native service works even when the app is closed or in background
          </Text>
        </View>
      </FadeInView>

      {/* Accounts List with Animation */}
      <FadeInView delay={800}>
        <View style={[styles.section, { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0, borderWidth: 0, padding: 0 }]}>
          <Text style={[styles.sectionTitle, { paddingHorizontal: 20, marginBottom: 16 }]}>All Accounts ({accounts.length})</Text>
          <FlatList
            data={accounts}
            keyExtractor={(item) => item.id}
            renderItem={renderAccountItem}
            scrollEnabled={false}
          />
        </View>
      </FadeInView>

      {/* Account Form Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <CustomIcon name="close" size={24} color="#2c3e50" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingAccount ? 'Edit Account' : 'Add Account'}
            </Text>
            <TouchableOpacity onPress={handleSaveAccount}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Account Name */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Name</Text>
              <TextInput
                style={styles.textInput}
                value={formData.bankName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, bankName: text }))}
                placeholder="Enter account name (e.g., HDFC Bank, SBI, Personal Savings)"
                placeholderTextColor="#7f8c8d"
              />
            </View>

            {/* Account Type */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Type</Text>
              <View style={styles.typeGrid}>
                {Object.values(ACCOUNT_TYPES).map((type) => renderTypeOption(type))}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

export default AccountsScreen;
