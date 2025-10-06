import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, spacing, typography } from '../styles/GlobalStyles';

const LoginScreen = ({ onAccountSetup, isFirstTime = false, onClose }) => {
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  const banks = [
    { id: 'icici', name: 'ICICI Bank', fullName: 'ICICI Bank Limited' },
    { id: 'hdfc', name: 'HDFC Bank', fullName: 'HDFC Bank Limited' },
    { id: 'boi', name: 'Bank of India', fullName: 'Bank of India' },
  ];

  const validateForm = () => {
    if (!selectedBank) {
      Alert.alert('Error', 'Please select your bank');
      return false;
    }
    
    if (!accountNumber || accountNumber.length !== 4) {
      Alert.alert('Error', 'Please enter the last 4 digits of your account number');
      return false;
    }
    
    if (!/^\d{4}$/.test(accountNumber)) {
      Alert.alert('Error', 'Account number should contain only digits');
      return false;
    }

    if (!accountName.trim()) {
      Alert.alert('Error', 'Please enter an account name');
      return false;
    }

    return true;
  };

  const handleSetupAccount = () => {
    if (!validateForm()) return;

    const selectedBankData = banks.find(bank => bank.id === selectedBank);
    
    const accountData = {
      id: `${selectedBank}_${accountNumber}_${Date.now()}`,
      name: accountName.trim(),
      bank: selectedBankData.name,
      accountNumber: accountNumber,
      balance: 0,
      type: 'savings',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    console.log('🏦 Setting up account:', accountData);
    onAccountSetup(accountData);
  };

  const renderBankChips = () => {
    return (
      <View style={styles.chipsContainer}>
        {banks.map((bank) => (
          <TouchableOpacity
            key={bank.id}
            style={[
              styles.chip,
              selectedBank === bank.id && styles.chipSelected
            ]}
            onPress={() => setSelectedBank(bank.id)}
          >
            <Icon 
              name="account-balance" 
              size={16} 
              color={selectedBank === bank.id ? colors.white : colors.primary} 
              style={styles.chipIcon}
            />
            <Text style={[
              styles.chipText,
              selectedBank === bank.id && styles.chipTextSelected
            ]}>
              {bank.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          {!isFirstTime && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
          
          <View style={styles.logoContainer}>
            <Icon name="account-balance" size={60} color={colors.primary} />
            <Text style={styles.title}>
              {isFirstTime ? 'Welcome to ETA' : 'Add Bank Account'}
            </Text>
            <Text style={styles.subtitle}>
              {isFirstTime 
                ? 'Let\'s set up your first bank account to get started with automatic transaction tracking'
                : 'Add another bank account to track more transactions'
              }
            </Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Account Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Account Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., My Salary Account, Business Account"
              value={accountName}
              onChangeText={setAccountName}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Bank Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Your Bank</Text>
            {renderBankChips()}
          </View>

          {/* Account Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last 4 Digits of Account Number</Text>
            <TextInput
              style={styles.input}
              placeholder="1234"
              value={accountNumber}
              onChangeText={(text) => {
                // Only allow digits and max 4 characters
                if (/^\d{0,4}$/.test(text)) {
                  setAccountNumber(text);
                }
              }}
              keyboardType="numeric"
              maxLength={4}
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={styles.helpText}>
              We only need the last 4 digits to match with SMS notifications
            </Text>
          </View>

          {/* Setup Button */}
          <TouchableOpacity
            style={[styles.setupButton, (!selectedBank || !accountNumber || !accountName) && styles.setupButtonDisabled]}
            onPress={handleSetupAccount}
            disabled={!selectedBank || !accountNumber || !accountName}
          >
            <Icon name="add" size={20} color={colors.white} style={styles.buttonIcon} />
            <Text style={styles.setupButtonText}>
              {isFirstTime ? 'Get Started' : 'Add Account'}
            </Text>
          </TouchableOpacity>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Icon name="security" size={20} color={colors.success} />
              <Text style={styles.infoText}>Your account details are stored securely on your device</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="sms" size={20} color={colors.success} />
              <Text style={styles.infoText}>We'll automatically detect transactions from SMS</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="offline-bolt" size={20} color={colors.success} />
              <Text style={styles.infoText}>Works completely offline - no data sent to servers</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    zIndex: 1,
    padding: spacing.sm,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
  form: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  helpText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    minWidth: 120,
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipIcon: {
    marginRight: spacing.xs,
  },
  chipText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.primary,
  },
  chipTextSelected: {
    color: colors.white,
  },
  setupButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  setupButtonDisabled: {
    backgroundColor: colors.textSecondary,
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonIcon: {
    marginRight: spacing.sm,
  },
  setupButtonText: {
    color: colors.white,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
  },
  infoSection: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  infoText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 20,
  },
});

export default LoginScreen;
