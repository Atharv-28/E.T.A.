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
  palette,
} from '../../../ui';
import { styles, getDetectedCardStyle } from './NewTransactionDetectedModal.styles';

function getCategoryList(transactionType) {
  return transactionType === 'income' ? CATEGORIES.INCOME : CATEGORIES.EXPENSE;
}

export default function NewTransactionDetectedModal({ visible, transaction, onConfirm, onCancel }) {
  const { accounts, activeAccountId } = useAccounts();
  const [selectedCategory, setSelectedCategory] = useState('other_expense');
  const [selectedAccountId, setSelectedAccountId] = useState(null);

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
      <AppView style={styles.overlay}>
        <AppView style={styles.sheet}>
          <AppView style={styles.headerRow}>
            <TouchableOpacity onPress={onCancel}>
              <AppIcon name="close" size={22} color={palette.textPrimary} />
            </TouchableOpacity>
            <AppText variant="h3">New Transaction Detected</AppText>
            <TouchableOpacity onPress={handleConfirm}>
              <AppText variant="button" color={palette.primary}>Add</AppText>
            </TouchableOpacity>
          </AppView>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <AppCard
              style={[styles.detectedCard, getDetectedCardStyle(transaction.type === 'income')]}
            >
              <AppText variant="label" color={palette.surface}>TRANSACTION DETECTED</AppText>
              <AppView style={styles.detectedRow}>
                <AppView style={styles.detectedLeft}>
                  <AppText variant="h4" color={palette.surface} numberOfLines={2}>
                    {transaction.description || 'Bank Transaction'}
                  </AppText>
                  <AppText variant="caption" color={palette.surface} style={styles.detectedMeta}>
                    {transaction.bank || 'Unknown Bank'} • {txDate.toLocaleDateString()}
                  </AppText>
                </AppView>
                <AppText variant="h3" color={palette.surface}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount || 0)}
                </AppText>
              </AppView>

            </AppCard>

            {requiresAccountChoice ? (
              <AppCard style={styles.sectionCard}>
                <AppText variant="label" color={palette.textPrimary}>Select Account</AppText>
                <AppView style={styles.gridWrap}>
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
                          style={[
                            styles.gridTile,
                            selected ? styles.gridTileSelected : styles.gridTileDefault,
                            styles.tileShadow,
                          ]}
                        >
                          <AppView style={styles.tileContent}>
                            <AppView
                              style={[styles.tileIconWrap, styles.iconShadow]}
                            >
                              <AppIcon name="account-balance" size={16} color={selected ? palette.primary : palette.textSecondary} />
                            </AppView>
                            <AppText variant="caption" color={selected ? palette.primaryDark : palette.textPrimary} numberOfLines={1} style={styles.tileLabel}>
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

            <AppCard style={styles.sectionCard}>
              <AppText variant="label" color={palette.textPrimary}>
                Select Category ({transaction.type === 'income' ? 'Income' : 'Expense'})
              </AppText>
              <AppView style={styles.gridWrap}>
                {categories.map((category) => {
                  const selected = selectedCategory === category.id;
                  return (
                    <TouchableOpacity
                      key={category.id}
                      onPress={() => setSelectedCategory(category.id)}
                      activeOpacity={0.86}
                      style={[
                        styles.gridTile,
                        selected ? styles.gridTileSelected : styles.gridTileDefault,
                        styles.tileShadow,
                      ]}
                    >
                      <AppView style={styles.tileContent}>
                        <AppView
                          style={[styles.tileIconWrap, styles.iconShadow]}
                        >
                          <AppIcon name={category.icon} size={16} color={selected ? palette.primary : palette.textSecondary} />
                        </AppView>
                        <AppText variant="caption" color={selected ? palette.primaryDark : palette.textSecondary} numberOfLines={2} style={styles.tileLabelCentered}>
                          {category.name}
                        </AppText>
                      </AppView>
                    </TouchableOpacity>
                  );
                })}
              </AppView>
            </AppCard>

            <AppCard style={styles.sectionCard}>
              <AppText variant="label" color={palette.textSecondary}>SMS Content</AppText>
              <AppText variant="body" color={palette.textSecondary} style={styles.smsContent}>
                {transaction.smsData?.rawSMS || transaction.rawSMS || 'No SMS content available.'}
              </AppText>
            </AppCard>

            <AppView style={styles.footerRow}>
              <AppButton title="Ignore" variant="ghost" onPress={onCancel} style={styles.footerButton} />
              <AppButton title="Add Transaction" onPress={handleConfirm} style={styles.footerButton} />
            </AppView>
          </ScrollView>
        </AppView>
      </AppView>
    </Modal>
  );
}
