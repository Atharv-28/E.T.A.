import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { CATEGORIES } from '../../../context/TransactionContext';
import { useAccounts } from '../../../context/AccountContext';
import { formatCurrency } from '../../../utils/currency';
import {
  AppButton,
  AppCard,
  AppIcon,
  AppText,
  AppView,
  borderWidth,
  layout,
  palette,
  radius,
  spacing,
  type,
} from '../../../ui';

function getCategoryList(transactionType) {
  return transactionType === 'income' ? CATEGORIES.INCOME : CATEGORIES.EXPENSE;
}

export default function NewTransactionDetectedModal({ visible, transaction, onConfirm, onCancel }) {
  const { accounts, activeAccountId } = useAccounts();
  const [selectedCategory, setSelectedCategory] = useState('other_expense');
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const gridItemWidth = '31.5%';
  const subtleTileShadow = {
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  };
  const subtleIconShadow = {
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1.5,
  };

  useEffect(() => {
    const defaultAccountId = transaction?.accountId || activeAccountId || accounts[0]?.id || null;
    setSelectedCategory(transaction?.category || (transaction?.type === 'income' ? 'other_income' : 'other_expense'));
    setSelectedAccountId(defaultAccountId);
  }, [transaction, activeAccountId, accounts]);

  const categories = useMemo(() => getCategoryList(transaction?.type), [transaction?.type]);

  if (!transaction) return null;

  const txDate = transaction.date ? new Date(transaction.date) : new Date();
  const requiresAccountChoice = !transaction.accountId;

  const handleConfirm = () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category.');
      return;
    }

    if (requiresAccountChoice && !selectedAccountId) {
      Alert.alert('Choose Account', 'Please select an account to save this transaction under.');
      return;
    }

    onConfirm({
      ...transaction,
      category: selectedCategory,
      accountId: selectedAccountId || transaction.accountId,
      id: `sms_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      source: 'sms_auto',
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
      <AppView style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(8,14,28,0.34)' }}>
        <AppView
          style={{
            maxHeight: '90%',
            backgroundColor: palette.surface,
            borderTopLeftRadius: layout.modalSheetRadius,
            borderTopRightRadius: layout.modalSheetRadius,
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.xl,
            paddingBottom: spacing.xxl,
          }}
        >
          <AppView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={onCancel}>
              <AppIcon name="close" size={22} color={palette.textPrimary} />
            </TouchableOpacity>
            <AppText variant="h3">New Transaction Detected</AppText>
            <TouchableOpacity onPress={handleConfirm}>
              <AppText variant="button" color={palette.primary}>Add</AppText>
            </TouchableOpacity>
          </AppView>

          <ScrollView style={{ marginTop: spacing.lg }} showsVerticalScrollIndicator={false}>
            <AppCard
              style={{
                backgroundColor: transaction.type === 'income' ? palette.success : palette.danger,
                borderWidth: borderWidth.none,
              }}
            >
              <AppText variant="label" color={palette.surface}>TRANSACTION DETECTED</AppText>
              <AppView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm }}>
                <AppView style={{ flex: 1, paddingRight: spacing.md }}>
                  <AppText variant="h4" color={palette.surface} numberOfLines={2}>
                    {transaction.description || 'Bank Transaction'}
                  </AppText>
                  <AppText variant="caption" color={palette.surface} style={{ opacity: 0.9, marginTop: spacing.xs }}>
                    {transaction.bank || 'Unknown Bank'} • {txDate.toLocaleDateString()}
                  </AppText>
                </AppView>
                <AppText variant="h3" color={palette.surface}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount || 0)}
                </AppText>
              </AppView>

            </AppCard>

            {requiresAccountChoice ? (
              <AppCard style={{ marginTop: spacing.md }}>
                <AppText variant="label" color={palette.textPrimary}>Select Account</AppText>
                <AppView style={{ marginTop: spacing.sm, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  {accounts.length === 0 ? (
                    <AppText variant="body" color={palette.textSecondary}>
                      No accounts found. Add an account first to save this transaction.
                    </AppText>
                  ) : (
                    accounts.map((account) => {
                      const selected = selectedAccountId === account.id;
                      return (
                        <TouchableOpacity
                          key={account.id}
                          onPress={() => setSelectedAccountId(account.id)}
                          activeOpacity={0.86}
                          style={{
                            width: gridItemWidth,
                            borderRadius: radius.lg,
                            borderWidth: selected ? borderWidth.sm : borderWidth.none,
                            borderColor: selected ? palette.primary : palette.border,
                            backgroundColor: selected ? palette.primarySoft : palette.surface,
                            paddingVertical: spacing.sm,
                            paddingHorizontal: spacing.sm,
                            marginBottom: spacing.sm,
                            ...subtleTileShadow,
                          }}
                        >
                          <AppView style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <AppView
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: radius.full,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: palette.surface,
                                ...subtleIconShadow,
                              }}
                            >
                              <AppIcon name="account-balance" size={16} color={selected ? palette.primary : palette.textSecondary} />
                            </AppView>
                            <AppText variant="caption" color={selected ? palette.primaryDark : palette.textPrimary} numberOfLines={1} style={{ marginTop: spacing.xs }}>
                              {account.name}
                            </AppText>
                            <AppText variant="caption" color={selected ? palette.primaryDark : palette.textSecondary} numberOfLines={1}>
                              ••{account.accountNumber?.slice(-4) || 'N/A'}
                            </AppText>
                          </AppView>
                        </TouchableOpacity>
                      );
                    })
                  )}
                </AppView>
              </AppCard>
            ) : null}

            <AppCard style={{ marginTop: spacing.md }}>
              <AppText variant="label" color={palette.textPrimary}>
                Select Category ({transaction.type === 'income' ? 'Income' : 'Expense'})
              </AppText>
              <AppView style={{ marginTop: spacing.sm, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {categories.map((category) => {
                  const selected = selectedCategory === category.id;
                  return (
                    <TouchableOpacity
                      key={category.id}
                      onPress={() => setSelectedCategory(category.id)}
                      activeOpacity={0.86}
                      style={{
                        width: gridItemWidth,
                        borderRadius: radius.lg,
                        borderWidth: selected ? borderWidth.sm : borderWidth.none,
                        borderColor: selected ? palette.primary : palette.border,
                        backgroundColor: selected ? palette.primarySoft : palette.surface,
                        paddingVertical: spacing.sm,
                        paddingHorizontal: spacing.sm,
                        marginBottom: spacing.sm,
                        ...subtleTileShadow,
                      }}
                    >
                      <AppView style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <AppView
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: radius.full,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: palette.surface,
                            ...subtleIconShadow,
                          }}
                        >
                          <AppIcon name={category.icon} size={16} color={selected ? palette.primary : palette.textSecondary} />
                        </AppView>
                        <AppText variant="caption" color={selected ? palette.primaryDark : palette.textSecondary} numberOfLines={2} style={{ textAlign: 'center', marginTop: spacing.xs }}>
                          {category.name}
                        </AppText>
                      </AppView>
                    </TouchableOpacity>
                  );
                })}
              </AppView>
            </AppCard>

            <AppCard style={{ marginTop: spacing.md }}>
              <AppText variant="label" color={palette.textSecondary}>SMS Content</AppText>
              <AppText variant="body" color={palette.textSecondary} style={{ marginTop: spacing.sm, lineHeight: type.body.lineHeight }}>
                {transaction.smsData?.rawSMS || transaction.rawSMS || 'No SMS content available.'}
              </AppText>
            </AppCard>

            <AppView style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg, marginBottom: spacing.md }}>
              <AppButton title="Ignore" variant="ghost" onPress={onCancel} style={{ flex: 1 }} />
              <AppButton title="Add Transaction" onPress={handleConfirm} style={{ flex: 1 }} />
            </AppView>
          </ScrollView>
        </AppView>
      </AppView>
    </Modal>
  );
}
