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
import { useAccounts, ACCOUNT_TYPES } from '../context/AccountContext';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency } from '../utils/currency';
import { styles } from '../styles/GlobalStyles';

function AccountsScreen() {
  const { 
    accounts, 
    activeAccount, 
    createAccount, 
    updateAccount, 
    deleteAccount, 
    switchAccount 
  } = useAccounts();
  
  const { transactions } = useTransactions();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({
    bankName: '',
    debitMsg: '',
    creditMsg: '',
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
    setEditingAccount(null);
    setFormData({ bankName: '', debitMsg: '', creditMsg: '' });
    setModalVisible(true);
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setFormData({ 
      bankName: account.bankName || account.name, 
      debitMsg: account.debitMsg || '', 
      creditMsg: account.creditMsg || '' 
    });
    setModalVisible(true);
  };

  const handleSaveAccount = () => {
    if (!formData.bankName.trim()) {
      Alert.alert('Error', 'Please enter bank name');
      return;
    }

    if (!formData.debitMsg.trim() && !formData.creditMsg.trim()) {
      Alert.alert('Error', 'Please enter at least one SMS pattern (debit or credit)');
      return;
    }

    const accountData = {
      name: formData.bankName.trim(),
      bankName: formData.bankName.trim(),
      debitMsg: formData.debitMsg.trim(),
      creditMsg: formData.creditMsg.trim(),
      type: 'bank', // Default type for bank accounts
      color: '#3498db', // Default blue color for bank accounts
      icon: 'account-balance', // Bank icon
    };

    if (editingAccount) {
      updateAccount(editingAccount.id, accountData);
    } else {
      createAccount(accountData);
    }

    setModalVisible(false);
    setFormData({ bankName: '', debitMsg: '', creditMsg: '' });
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

  const renderAccountItem = ({ item: account }) => {
    const isActive = activeAccount?.id === account.id;
    const balance = calculateAccountBalance(account.id);

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
            <CustomIcon name={account.icon || 'account-balance'} size={24} color="#ffffff" />
          </View>
          <View style={styles.accountInfo}>
            <Text style={styles.accountName}>{account.bankName || account.name}</Text>
            <Text style={[styles.accountType, { color: account.color }]}>
              Bank Account
            </Text>
            {account.debitMsg && (
              <Text style={styles.smsPattern} numberOfLines={1}>
                Debit: {account.debitMsg.substring(0, 30)}...
              </Text>
            )}
            {account.creditMsg && (
              <Text style={styles.smsPattern} numberOfLines={1}>
                Credit: {account.creditMsg.substring(0, 30)}...
              </Text>
            )}
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

  const renderTypeOption = (typeKey) => {
    const type = ACCOUNT_TYPES[typeKey];
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Accounts</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleCreateAccount}
        >
          <CustomIcon name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Active Account Summary */}
      {activeAccount && (
        <View style={[styles.activeAccountCard, { borderLeftColor: activeAccount.color }]}>
          <View style={styles.activeAccountHeader}>
            <CustomIcon name={activeAccount.icon} size={24} color={activeAccount.color} />
            <Text style={styles.activeAccountName}>{activeAccount.name}</Text>
            <CustomIcon name="check-circle" size={20} color={activeAccount.color} />
          </View>
          <Text style={styles.activeAccountBalance}>
            {formatCurrency(calculateAccountBalance(activeAccount.id))}
          </Text>
          <Text style={styles.activeAccountLabel}>Current Balance</Text>
        </View>
      )}

      {/* Accounts List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Accounts ({accounts.length})</Text>
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.id}
          renderItem={renderAccountItem}
          scrollEnabled={false}
        />
      </View>

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
              {editingAccount ? 'Edit Bank Account' : 'Add Bank Account'}
            </Text>
            <TouchableOpacity onPress={handleSaveAccount}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Bank Name */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bank Name</Text>
              <TextInput
                style={styles.textInput}
                value={formData.bankName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, bankName: text }))}
                placeholder="Enter bank name (e.g., HDFC Bank, SBI, ICICI)"
                placeholderTextColor="#7f8c8d"
              />
            </View>

            {/* Debit SMS Pattern */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Debit SMS Pattern</Text>
              <Text style={styles.sectionDescription}>
                Enter keywords from debit SMS (e.g., "debited", "spent", "withdrawn")
              </Text>
              <TextInput
                style={[styles.textInput, styles.multilineInput]}
                value={formData.debitMsg}
                onChangeText={(text) => setFormData(prev => ({ ...prev, debitMsg: text }))}
                placeholder="e.g., Rs. debited from A/c, spent at, withdrawn from"
                placeholderTextColor="#7f8c8d"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Credit SMS Pattern */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Credit SMS Pattern</Text>
              <Text style={styles.sectionDescription}>
                Enter keywords from credit SMS (e.g., "credited", "received", "deposited")
              </Text>
              <TextInput
                style={[styles.textInput, styles.multilineInput]}
                value={formData.creditMsg}
                onChangeText={(text) => setFormData(prev => ({ ...prev, creditMsg: text }))}
                placeholder="e.g., Rs. credited to A/c, received in, deposited in"
                placeholderTextColor="#7f8c8d"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* SMS Pattern Examples */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💡 SMS Pattern Examples</Text>
              <View style={styles.exampleContainer}>
                <Text style={styles.exampleTitle}>Debit SMS Examples:</Text>
                <Text style={styles.exampleText}>• "Rs.500 debited from A/c XX1234"</Text>
                <Text style={styles.exampleText}>• "You have spent Rs.1200 at AMAZON"</Text>
                <Text style={styles.exampleText}>• "Rs.2000 withdrawn from ATM"</Text>
                
                <Text style={[styles.exampleTitle, { marginTop: 12 }]}>Credit SMS Examples:</Text>
                <Text style={styles.exampleText}>• "Rs.50000 credited to A/c XX1234"</Text>
                <Text style={styles.exampleText}>• "Salary Rs.75000 received in A/c"</Text>
                <Text style={styles.exampleText}>• "Rs.1000 deposited in your account"</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

export default AccountsScreen;
