import React, { useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useTransactions, CATEGORIES } from '../context/TransactionContext';
import { useAccounts } from '../context/AccountContext';
import TransactionRow from '../modules/transactions/components/TransactionRow';
import AddTransactionModal from '../components/AddTransactionModal';
import {
  AppButton,
  AppCard,
  AppIcon,
  AppProgressBar,
  AppScreenLayout,
  AppView,
  AppText,
  palette,
  sizing,
  spacing,
} from '../ui';
import { formatCurrency } from '../utils/currency';
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

export default function DashboardScreen({ onManualTransaction, onViewAll, onDetails }) {
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
    .filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === month && date.getFullYear() === year && t.type === 'income';
    })
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const monthlyExpenseItems = useMemo(() => (
    accountTransactions.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === month
        && date.getFullYear() === year
        && (t.type === 'expense' || t.type === 'debit');
    })
  ), [accountTransactions, month, year]);

  const monthlyExpense = monthlyExpenseItems.reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const categoryColors = [
    '#0D6EFD',
    '#0D9488',
    '#F59E0B',
    '#C20E37',
    '#64748B',
  ];

  const monthlyExpenseSummary = useMemo(() => {
    const totals = {};
    monthlyExpenseItems.forEach((item) => {
      const key = item.category || 'other_expense';
      totals[key] = (totals[key] || 0) + Number(item.amount || 0);
    });

    const total = Object.values(totals).reduce((sum, value) => sum + value, 0);
    const rows = Object.keys(totals)
      .map((categoryId, index) => {
        const category = CATEGORIES.EXPENSE.find((c) => c.id === categoryId) || {
          name: 'Other',
          icon: 'receipt-long',
        };
        const amount = totals[categoryId];
        return {
          id: categoryId,
          name: category.name,
          icon: category.icon,
          amount,
          percent: total ? (amount / total) * 100 : 0,
          color: categoryColors[index % categoryColors.length],
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return { total, rows };
  }, [monthlyExpenseItems]);
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
        <AppCard style={styles.heroCard}>
          <AppText variant="label" color="#BFD6FF" style={styles.heroLabel}>
            THIS MONTH
          </AppText>
          <AppView style={styles.heroRow}>
            <AppView style={styles.heroBox}>
              <AppText variant="h4" color="#91F1E7">
                INCOME
              </AppText>
              <AppText variant="h4" color={palette.surface} style={styles.heroBoxAmount}>
                +₹{monthlyIncome.toFixed(2)}
              </AppText>
            </AppView>
            <AppView style={styles.heroBox}>
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
          <AppButton title="Details" variant="ghost" onPress={onDetails} />
        </AppView>

        <AppCard>
          <AppView style={styles.summaryHeader}>
            <AppText variant="h3">This Month Categories</AppText>
            <AppText variant="body" color={palette.textSecondary}>
              {formatCurrency(monthlyExpenseSummary.total || 0)} total
            </AppText>
          </AppView>

          {monthlyExpenseSummary.rows.length === 0 ? (
            <AppText variant="body" color={palette.textSecondary}>
              No expense data for this month.
            </AppText>
          ) : (
            <AppView>
              <AppView style={styles.categoryBarTrack}>
                {monthlyExpenseSummary.rows.map((row) => (
                  <AppView
                    key={row.id}
                    style={[
                      styles.categoryBarSegment,
                      { backgroundColor: row.color, flexGrow: row.percent || 0, flexBasis: 0 },
                    ]}
                  />
                ))}
              </AppView>
              <AppView style={styles.categoryLegend}>
                {monthlyExpenseSummary.rows.map((row) => (
                  <AppView key={row.id} style={styles.categoryLegendRow}>
                    <AppView style={[styles.categoryLegendDot, { backgroundColor: row.color }]} />
                    <AppText variant="bodyBold" style={{ flex: 1 }}>
                      {row.name}
                    </AppText>
                    <AppText variant="body" color={palette.textSecondary}>
                      {formatCurrency(row.amount)}
                    </AppText>
                  </AppView>
                ))}
              </AppView>
            </AppView>
          )}
        </AppCard>

        <AppView style={styles.sectionHeader}>
          <AppText variant="h3">Recent Transactions</AppText>
          <AppButton title="View all" variant="secondary" onPress={onViewAll} />
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
