import React, { useMemo, useState } from 'react';
import { useTransactions, CATEGORIES } from '../context/TransactionContext';
import { useAccounts } from '../context/AccountContext';
import CategorySpendCard from '../modules/reports/components/CategorySpendCard';
import {
  AppBadge,
  AppButton,
  AppCard,
  AppChipTabs,
  AppDonutChart,
  AppLineChart,
  AppScreenLayout,
  AppView,
  AppText,
  palette,
} from '../ui';
import { styles } from './ReportsScreen.styles';

const periodTabs = [
  { label: 'This Month', value: 'month' },
  { label: 'This Year', value: 'year' },
  { label: 'All Time', value: 'all' },
];

function getPeriodFilter(period, transactionDate, now) {
  if (period === 'all') return true;
  if (period === 'year') return transactionDate.getFullYear() === now.getFullYear();
  return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
}

export default function ReportsScreen() {
  const { transactions } = useTransactions();
  const { activeAccountId } = useAccounts();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const accountTransactions = useMemo(() => {
    const base = Array.isArray(transactions) ? transactions : [];
    return base.filter((item) => item.accountId === activeAccountId);
  }, [transactions, activeAccountId]);

  const scoped = useMemo(() => {
    const now = new Date();

    return accountTransactions.filter((item) => {
      const date = new Date(item.date);
      return getPeriodFilter(selectedPeriod, date, now);
    });
  }, [accountTransactions, selectedPeriod]);

  const totals = useMemo(() => {
    const income = scoped.filter((x) => x.type === 'income').reduce((sum, x) => sum + Number(x.amount || 0), 0);
    const expense = scoped
      .filter((x) => x.type === 'expense' || x.type === 'debit')
      .reduce((sum, x) => sum + Number(x.amount || 0), 0);
    return {
      income,
      expense,
      net: income - expense,
    };
  }, [scoped]);

  const categoryRows = useMemo(() => {
    const map = {};
    scoped
      .filter((x) => x.type === 'expense' || x.type === 'debit')
      .forEach((item) => {
        map[item.category] = (map[item.category] || 0) + Number(item.amount || 0);
      });

    const totalExpense = Object.values(map).reduce((a, b) => a + b, 0) || 1;

    return Object.keys(map)
      .map((categoryId) => {
        const category = CATEGORIES.EXPENSE.find((x) => x.id === categoryId) || {
          name: 'Other',
          icon: 'receipt-long',
        };
        const amount = map[categoryId];
        return {
          id: categoryId,
          name: category.name,
          icon: category.icon,
          amount,
          progress: (amount / totalExpense) * 100,
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [scoped]);

  const trend = useMemo(() => {
    const now = new Date();
    const labels = [];
    const incomeData = [];
    const expenseData = [];

    if (accountTransactions.length === 0) {
      return { labels, incomeData, expenseData, chartWidth: 0 };
    }

    const ordered = accountTransactions
      .slice()
      .sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
    const earliest = new Date(ordered[0].date || now);
    const start = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 1);

    for (let cursor = new Date(start); cursor <= end; cursor.setMonth(cursor.getMonth() + 1)) {
      const date = new Date(cursor);
      const label = date.toLocaleDateString('en-US', { month: 'short' });
      labels.push(label);

      const monthItems = accountTransactions.filter((item) => {
        const d = new Date(item.date);
        return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth();
      });

      incomeData.push(monthItems.filter((x) => x.type === 'income').reduce((s, x) => s + Number(x.amount || 0), 0));
      expenseData.push(
        monthItems
          .filter((x) => x.type === 'expense' || x.type === 'debit')
          .reduce((s, x) => s + Number(x.amount || 0), 0)
      );
    }

    return { labels, incomeData, expenseData };
  }, [accountTransactions]);

  const totalExpense = totals.expense || 1;
  const pieSegments = categoryRows.map((row, index) => ({
    id: row.id,
    name: row.name,
    amount: row.amount,
    color: [palette.primary, '#7EE6DD', '#F59E0B', '#8B5CF6', '#10B981'][index] || palette.textMuted,
  }));

  return (
    <AppScreenLayout>
      <AppView style={styles.headerRow}>
        <AppText variant="h2">Expense Analysis</AppText>
        <AppBadge label={new Date().toLocaleDateString('en-US', { month: 'long' }).toUpperCase()} />
      </AppView>

      <AppText variant="body" color={palette.textSecondary}>
        A detailed breakdown of your monthly spending habits.
      </AppText>

      <AppChipTabs value={selectedPeriod} onChange={setSelectedPeriod} tabs={periodTabs} />

      <AppCard>
        <AppView style={styles.donutWrap}>
          <AppDonutChart total={totals.expense} segments={pieSegments} />
          <AppView style={styles.donutOverlay}>
            <AppText variant="bodyBold" color={palette.textSecondary}>
              Total Spent
            </AppText>
            <AppText variant="h1" color={palette.primary}>
              ₹{totals.expense.toFixed(2)}
            </AppText>
          </AppView>
        </AppView>

        <AppView style={styles.categoryLegend}>
          {pieSegments.map((segment) => (
            <AppView key={segment.id} style={styles.legendItem}>
              <AppView style={styles.legendRow}>
                <AppView style={[styles.legendDot, { backgroundColor: segment.color }]} />
                <AppView style={styles.legendTextWrap}>
                  <AppText variant="body">{segment.name}</AppText>
                  <AppText variant="caption" color={palette.textSecondary}>
                    ₹{segment.amount.toFixed(2)}
                  </AppText>
                  <AppText variant="caption" style={styles.legendValue}>
                    {Math.round((segment.amount / totalExpense) * 100)}%
                  </AppText>
                </AppView>
              </AppView>
            </AppView>
          ))}
        </AppView>
      </AppCard>

      <AppView style={styles.sectionHeader}>
        <AppText variant="h3">Top Expense Categories</AppText>
        <AppButton title="See All" variant="ghost" />
      </AppView>

      {categoryRows.length === 0 ? (
        <AppCard>
          <AppText variant="body" color={palette.textSecondary}>
            No expense data for the selected period.
          </AppText>
        </AppCard>
      ) : (
        categoryRows.map((row, index) => (
          <CategorySpendCard
            key={row.id}
            icon={row.icon}
            name={row.name}
            subtitle={index === 0 ? 'Highest category this period' : 'Tracked expense category'}
            amount={row.amount}
            progress={row.progress}
            tone={index === 1 ? 'danger' : index === 2 ? 'success' : 'primary'}
          />
        ))
      )}

      <AppCard>
        <AppText variant="h3" style={styles.trendTitle}>
          Spending Trend
        </AppText>
        <AppLineChart labels={trend.labels} incomeData={trend.incomeData} expenseData={trend.expenseData} />
      </AppCard>
    </AppScreenLayout>
  );
}
