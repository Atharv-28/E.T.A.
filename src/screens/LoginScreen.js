import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import {
  AppButton,
  AppCard,
  AppChipTabs,
  AppIcon,
  AppInput,
  AppScrollScreen,
  AppText,
  palette,
  spacing,
} from '../ui';

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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: palette.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppScrollScreen>
        {!isFirstTime ? (
          <TouchableOpacity onPress={onClose} style={{ alignSelf: 'flex-end' }}>
            <AppIcon name="close" size={24} color={palette.textSecondary} />
          </TouchableOpacity>
        ) : null}

        <View style={{ alignItems: 'center', marginTop: spacing.md }}>
          <View
            style={{
              width: 84,
              height: 84,
              borderRadius: 42,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#E8F0FF',
            }}
          >
            <AppIcon name="account-balance" size={42} color={palette.primary} />
          </View>
          <AppText variant="h2" style={{ marginTop: spacing.lg }}>
            {isFirstTime ? 'Welcome to Financier' : 'Add Bank Account'}
          </AppText>
          <AppText
            variant="body"
            color={palette.textSecondary}
            style={{ textAlign: 'center', marginTop: spacing.sm }}
          >
            {isFirstTime
              ? 'Set up your first account to start automated transaction tracking.'
              : 'Add another account to organize your spending across banks.'}
          </AppText>
        </View>

        <AppCard style={{ marginTop: spacing.md }}>
          <AppInput
            label="Account Name"
            value={accountName}
            onChangeText={setAccountName}
            placeholder="Salary Account"
            leftIcon="edit"
          />

          <AppText variant="label" color={palette.textSecondary} style={{ marginTop: spacing.lg }}>
            Select Your Bank
          </AppText>
          <AppChipTabs
            value={selectedBank}
            onChange={setSelectedBank}
            tabs={banks.map((bank) => ({ value: bank.id, label: bank.name }))}
            style={{ marginTop: spacing.sm }}
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
            style={{ marginTop: spacing.lg }}
          />

          <AppText variant="caption" color={palette.textSecondary} style={{ marginTop: spacing.sm }}>
            We only use the last four digits to match SMS notifications.
          </AppText>

          <AppButton
            title={isFirstTime ? 'Get Started' : 'Add Account'}
            onPress={submit}
            disabled={!selectedBank || accountNumber.length !== 4 || !accountName.trim()}
            style={{ marginTop: spacing.xl }}
          />
        </AppCard>

        <AppCard>
          <View style={{ gap: spacing.md }}>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <AppIcon name="security" size={20} color={palette.success} />
              <AppText variant="body" color={palette.textSecondary} style={{ flex: 1 }}>
                Account data is stored securely on-device.
              </AppText>
            </View>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <AppIcon name="sms" size={20} color={palette.success} />
              <AppText variant="body" color={palette.textSecondary} style={{ flex: 1 }}>
                Transactions can be auto-detected from SMS alerts.
              </AppText>
            </View>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <AppIcon name="offline-bolt" size={20} color={palette.success} />
              <AppText variant="body" color={palette.textSecondary} style={{ flex: 1 }}>
                Works offline with local-only processing.
              </AppText>
            </View>
          </View>
        </AppCard>
      </AppScrollScreen>
    </KeyboardAvoidingView>
  );
}
