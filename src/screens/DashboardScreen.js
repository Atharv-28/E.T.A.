import React, { useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useTransactions, CATEGORIES } from '../context/TransactionContext';
import { useAccounts } from '../context/AccountContext';
import TransactionRow from '../modules/transactions/components/TransactionRow';
import AddTransactionModal from '../components/AddTransactionModal';
import {
  AppButton,
  AppCard,
  AppChipTabs,
  AppIcon,
  AppInput,
  AppProgressBar,
  AppScreenLayout,
  AppView,
  AppText,
  palette,
  sizing,
} from '../ui';
import { styles } from './DashboardScreen.styles';

function getCategoryIcon(categoryId, type) {
  const categories = type === 'income' ? CATEGORIES.INCOME : CATEGORIES.EXPENSE;
  const found = categories.find((item) => item.id === categoryId);
  return found ? found.icon : 'receipt-long';
}

function formatDateLabel(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === now.toDateString()) return 'TODAY';
  if (date.toDateString() === yesterday.toDateString()) return 'YESTERDAY';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
}

export default function DashboardScreen({ onManualTransaction }) {
  const { getTransactionsByAccount } = useTransactions();
  const { activeAccount } = useAccounts();

  const [addVisible, setAddVisible] = useState(false);

  const accountTransactions = useMemo(() => {
    if (!activeAccount) return [];
    return getTransactionsByAccount(activeAccount.id);
  }, [activeAccount, getTransactionsByAccount]);

  const month = new Date().getMonth();
  const year = new Date().getFullYear();

  const monthlyIncome = accountTransactions
    .filter((t) => new Date(t.date).getMonth() === month && new Date(t.date).getFullYear() === year && t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const monthlyExpense = accountTransactions
    .filter((t) => new Date(t.date).getMonth() === month && new Date(t.date).getFullYear() === year && (t.type === 'expense' || t.type === 'debit'))
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const balance = monthlyIncome - monthlyExpense;
  const savingsRate = monthlyIncome > 0 ? Math.max(0, Math.min(100, ((balance / monthlyIncome) * 100))) : 0;
  const recent = accountTransactions.slice(0, 6);

  const handleAddTransaction = (transaction) => {
    const payload = {
      ...transaction,
      accountId: activeAccount?.id || null,
      accountNumber: null,
      bank: 'Manual Entry',
      rawSMS: `Manual ${transaction.type} entry`,
      smsData: {
        sender: 'Manual',
        date: transaction.date,
        rawSMS: 'Manual entry',
      },
    };

    setAddVisible(false);
    if (onManualTransaction) onManualTransaction(payload);
  };

  return (
    <>
      <AppScreenLayout>
        <AppCard
          style={styles.heroCard}
        >
          <AppText variant="label" color="#BFD6FF" style={styles.heroLabel}>
            THIS MONTH BALANCE
          </AppText>
          <AppText variant="h2" color={palette.surface} style={styles.heroBalance}>
            {balance < 0 ? '-' : ''}₹{Math.abs(balance).toFixed(2)}
          </AppText>

          <AppView style={styles.heroRow}>
            <AppView
              style={styles.heroBox}
            >
              <AppText variant="h4" color="#91F1E7">
                INCOME
              </AppText>
              <AppText variant="h4" color={palette.surface} style={styles.heroBoxAmount}>
                +₹{monthlyIncome.toFixed(2)}
              </AppText>
            </AppView>
            <AppView
              style={styles.heroBox}
            >
              <AppText variant="h4" color="#FFCAD7">
                EXPENSES
              </AppText>
              <AppText variant="h4" color={palette.surface} style={styles.heroBoxAmount}>
                -₹{monthlyExpense.toFixed(2)}
              </AppText>
            </AppView>
          </AppView>
        </AppCard>

        <AppView style={styles.sectionHeader}>
          <AppText variant="h3">Monthly Summary</AppText>
          <AppButton title="Details" variant="ghost" />
        </AppView>

        <AppCard>
          <AppView style={styles.savingsRow}>
            <AppView style={styles.savingsText}>
              <AppText variant="h3">Savings Rate</AppText>
              <AppText variant="h3" color={palette.primary} style={styles.savingsValue}>
                {savingsRate.toFixed(1)}%
              </AppText>
            </AppView>
            <AppView
              style={styles.savingsIcon}
            >
                <AppIcon name="bar-chart" size={sizing.icon.xl} color={palette.primary} />
            </AppView>
          </AppView>
          <AppProgressBar value={savingsRate} color={palette.primary} style={styles.progress} />
        </AppCard>

        <AppView style={styles.sectionHeader}>
          <AppText variant="h3">Recent Transactions</AppText>
          <AppButton title="View all" variant="secondary" />
        </AppView>

        {recent.length === 0 ? (
          <AppCard>
            <AppText variant="body" color={palette.textSecondary}>
              No transactions available for the selected account.
            </AppText>
          </AppCard>
        ) : (
          recent.map((item) => {
            const income = item.type === 'income';
            return (
              <TransactionRow
                key={item.id}
                title={item.description || (income ? 'Income' : 'Expense')}
                subtitle={item.bank || 'Transaction'}
                amount={item.amount}
                dateLabel={formatDateLabel(item.date)}
                icon={getCategoryIcon(item.category, income ? 'income' : 'expense')}
                income={income}
              />
            );
          })
        )}
      </AppScreenLayout>

      <TouchableOpacity
        activeOpacity={0.86}
        onPress={() => setAddVisible(true)}
        style={styles.fab}
      >
        <AppIcon name="add" size={sizing.icon.xxl} color={palette.surface} />
      </TouchableOpacity>

      <AddTransactionModal
        visible={addVisible}
        onClose={() => setAddVisible(false)}
        onAddTransaction={handleAddTransaction}
      />
    </>
  );
}
