import React, { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useTransactions, CATEGORIES } from '../context/TransactionContext';
import { useAccounts } from '../context/AccountContext';
import AddTransactionModal from '../components/AddTransactionModal';
import TransactionRow from '../modules/transactions/components/TransactionRow';
import {
  AppButton,
  AppCard,
  AppChipTabs,
  AppInput,
  AppScreenLayout,
  AppView,
  AppText,
  palette,
} from '../ui';
import { styles } from './TransactionsScreen.styles';

function findCategory(categoryId, type) {
  const list = type === 'income' ? CATEGORIES.INCOME : CATEGORIES.EXPENSE;
  return list.find((item) => item.id === categoryId) || { icon: 'receipt-long', name: 'Other' };
}

function dateGroupLabel(dateValue) {
  const date = new Date(dateValue);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'TODAY';
  if (date.toDateString() === yesterday.toDateString()) return 'YESTERDAY';
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();
}

export default function TransactionsScreen() {
  const { getTransactionsByAccount, addTransaction, deleteTransaction } = useTransactions();
  const { activeAccount } = useAccounts();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);

  const accountTransactions = useMemo(() => {
    if (!activeAccount) return [];
    return getTransactionsByAccount(activeAccount.id);
  }, [activeAccount, getTransactionsByAccount]);

  const filtered = useMemo(() => {
    return accountTransactions.filter((item) => {
      const matchFilter = filter === 'all' ? true : item.type === filter;
      const sourceText = `${item.description || ''} ${item.bank || ''} ${item.category || ''}`.toLowerCase();
      const matchQuery = !query.trim() || sourceText.includes(query.toLowerCase());
      return matchFilter && matchQuery;
    });
  }, [accountTransactions, filter, query]);

  const grouped = useMemo(() => {
    return filtered.reduce((acc, item) => {
      const key = dateGroupLabel(item.date);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [filtered]);

  const removeItem = (id) => {
    Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteTransaction(id),
      },
    ]);
  };

  return (
    <>
      <AppScreenLayout>
        <AppInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search transactions..."
          leftIcon="search"
        />

        <AppChipTabs
          value={filter}
          onChange={setFilter}
          tabs={[
            { label: 'All', value: 'all' },
            { label: 'Income', value: 'income' },
            { label: 'Expense', value: 'expense' },
          ]}
        />

        <AppView style={styles.summaryRow}>
          <AppCard style={styles.summaryCardIncome}>
            <AppText variant="label" color={palette.textSecondary}>
              Income
            </AppText>
            <AppText variant="h3" color={palette.success} style={styles.summaryValue}>
              ₹{filtered.filter((x) => x.type === 'income').reduce((s, x) => s + Number(x.amount || 0), 0).toFixed(2)}
            </AppText>
          </AppCard>

          <AppCard style={styles.summaryCardExpense}>
            <AppText variant="label" color={palette.textSecondary}>
              Expenses
            </AppText>
            <AppText variant="h3" color={palette.danger} style={styles.summaryValue}>
              ₹{filtered
                .filter((x) => x.type === 'expense' || x.type === 'debit')
                .reduce((s, x) => s + Number(x.amount || 0), 0)
                .toFixed(2)}
            </AppText>
          </AppCard>
        </AppView>

        {Object.keys(grouped).length === 0 ? (
          <AppCard>
            <AppText variant="body" color={palette.textSecondary}>
              No transactions found for this filter.
            </AppText>
          </AppCard>
        ) : (
          Object.keys(grouped).map((section) => (
            <AppView key={section}>
              <AppView style={styles.sectionHeader}>
                <AppText variant="label" color={palette.textSecondary} style={styles.sectionLabel}>
                  {section}
                </AppText>
                <AppView style={styles.sectionRule} />
              </AppView>
              {grouped[section].map((item) => {
                const income = item.type === 'income';
                const category = findCategory(item.category, income ? 'income' : 'expense');
                return (
                  <TransactionRow
                    key={item.id}
                    title={item.description || (income ? 'Salary' : 'Expense')}
                    subtitle={item.bank || category.name}
                    amount={item.amount}
                    icon={category.icon}
                    income={income}
                    dateLabel={new Date(item.date).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    onRight={
                      <AppButton
                        title="Delete"
                        variant="ghost"
                        onPress={() => removeItem(item.id)}
                        style={styles.deleteButton}
                        textStyle={styles.deleteButtonText}
                      />
                    }
                  />
                );
              })}
            </AppView>
          ))
        )}
      </AppScreenLayout>

      <AppView style={styles.fabWrap}>
        <AppButton
          title="+"
          onPress={() => setModalVisible(true)}
          style={styles.fabButton}
          textStyle={styles.fabButtonText}
        />
      </AppView>

      <AddTransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddTransaction={addTransaction}
      />
    </>
  );
}
