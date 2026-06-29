import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppButton,
  AppCard,
  AppChipTabs,
  AppIcon,
  AppInput,
  AppScreenLayout,
  AppView,
  AppText,
  palette,
  sizing,
  spacing,
} from '../ui';
import { styles } from './LoginScreen.styles';

const banks = [
  { id: 'icici', name: 'ICICI Bank' },
  { id: 'hdfc', name: 'HDFC Bank' },
  { id: 'boi', name: 'Bank of India' },
];

export default function LoginScreen({ onAccountSetup, isFirstTime = false, onClose }) {
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  const submit = () => {
    if (!selectedBank) return Alert.alert('Error', 'Please select a bank.');
    if (!/^\d{4}$/.test(accountNumber)) return Alert.alert('Error', 'Enter exactly 4 digits.');
    if (!accountName.trim()) return Alert.alert('Error', 'Please provide an account name.');

    const selected = banks.find((bank) => bank.id === selectedBank);
    onAccountSetup({
      id: `${selectedBank}_${accountNumber}_${Date.now()}`,
      name: accountName.trim(),
      bank: selected.name,
      bankName: selected.name,
      accountNumber,
      balance: 0,
      type: 'savings',
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <AppScreenLayout>
        {!isFirstTime ? (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <AppIcon name="close" size={24} color={palette.textSecondary} />
          </TouchableOpacity>
        ) : null}

        <AppView style={styles.hero}>
          <AppView
            style={styles.heroIcon}
          >
            <AppIcon name="account-balance" size={sizing.avatar.xl - spacing.sm} color={palette.primary} />
          </AppView>
          <AppText variant="h2" style={styles.heroTitle}>
            {isFirstTime ? 'Welcome to E.T.A.' : 'Add Bank Account'}
          </AppText>
          <AppText
            variant="body"
            color={palette.textSecondary}
            style={styles.heroSubtitle}
          >
            {isFirstTime
              ? 'Set up your first account to start automated transaction tracking.'
              : 'Add another account to organize your spending across banks.'}
          </AppText>
        </AppView>

        <AppCard style={styles.formCard}>
          <AppInput
            label="Account Name"
            value={accountName}
            onChangeText={setAccountName}
            placeholder="Salary Account"
            leftIcon="edit"
          />

          <AppText variant="label" color={palette.textSecondary} style={styles.labelSpacing}>
            Select Your Bank
          </AppText>
          <AppChipTabs
            value={selectedBank}
            onChange={setSelectedBank}
            tabs={banks.map((bank) => ({ value: bank.id, label: bank.name }))}
            style={styles.tabsSpacing}
          />

          <AppInput
            label="Last 4 Digits of Account Number"
            value={accountNumber}
            onChangeText={(text) => {
              if (/^\d{0,4}$/.test(text)) setAccountNumber(text);
            }}
            keyboardType="numeric"
            placeholder="1234"
            leftIcon="lock"
            style={styles.inputSpacing}
          />

          <AppText variant="caption" color={palette.textSecondary} style={styles.caption}>
            We only use the last four digits to match SMS notifications.
          </AppText>

          <AppButton
            title={isFirstTime ? 'Get Started' : 'Add Account'}
            onPress={submit}
            disabled={!selectedBank || accountNumber.length !== 4 || !accountName.trim()}
            style={styles.submitButton}
          />
        </AppCard>

        <AppCard>
          <AppView style={styles.infoStack}>
            <AppView style={styles.infoRow}>
              <AppIcon name="security" size={20} color={palette.success} />
              <AppText variant="body" color={palette.textSecondary} style={styles.infoText}>
                Account data is stored securely on-device.
              </AppText>
            </AppView>
            <AppView style={styles.infoRow}>
              <AppIcon name="sms" size={20} color={palette.success} />
              <AppText variant="body" color={palette.textSecondary} style={styles.infoText}>
                Transactions can be auto-detected from SMS alerts.
              </AppText>
            </AppView>
          </AppView>
        </AppCard>
        </AppScreenLayout>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
