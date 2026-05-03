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
  spacing,
  borderWidth,
} from '../ui';

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

  const scoped = useMemo(() => {
    const base = Array.isArray(transactions) ? transactions : [];
    const now = new Date();

    return base.filter((item) => {
      if (item.accountId !== activeAccountId) return false;
      const date = new Date(item.date);
      return getPeriodFilter(selectedPeriod, date, now);
    });
  }, [transactions, activeAccountId, selectedPeriod]);

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

    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = date.toLocaleDateString('en-US', { month: 'short' });
      labels.push(label);

      const monthItems = transactions.filter((item) => {
        if (item.accountId !== activeAccountId) return false;
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
  }, [transactions, activeAccountId]);

  const transportExpense = categoryRows[0]?.amount || 0;
  const totalExpense = totals.expense || 1;

  return (
    <AppScreenLayout>
      <AppView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText variant="h2">Expense Analysis</AppText>
        <AppBadge label={new Date().toLocaleDateString('en-US', { month: 'long' }).toUpperCase()} />
      </AppView>

      <AppText variant="body" color={palette.textSecondary}>
        A detailed breakdown of your monthly spending habits.
      </AppText>

      <AppChipTabs value={selectedPeriod} onChange={setSelectedPeriod} tabs={periodTabs} />

      <AppCard>
        <AppView style={{ alignItems: 'center' }}>
          <AppDonutChart total={totals.expense} ratio={transportExpense / totalExpense} />
          <AppView style={{ marginTop: -180, alignItems: 'center' }}>
            <AppText variant="bodyBold" color={palette.textSecondary}>
              Total Spent
            </AppText>
            <AppText variant="h1" color={palette.primary}>
              ₹{totals.expense.toFixed(2)}
            </AppText>
          </AppView>
        </AppView>

        <AppView style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
          <AppCard style={{ flex: 1, backgroundColor: palette.primaryTint, borderWidth: borderWidth.none }}>
            <AppText variant="body">Transportation</AppText>
            <AppText variant="h3" style={{ marginTop: spacing.xs }}>
              {Math.round((transportExpense / totalExpense) * 100)}%
            </AppText>
          </AppCard>
          <AppCard style={{ flex: 1, backgroundColor: palette.primaryTint, borderWidth: borderWidth.none }}>
            <AppText variant="body">Other Categories</AppText>
            <AppText variant="h3" style={{ marginTop: spacing.xs }}>
              {100 - Math.round((transportExpense / totalExpense) * 100)}%
            </AppText>
          </AppCard>
        </AppView>
      </AppCard>

      <AppView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
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

      <AppCard style={{ backgroundColor: palette.primary, borderWidth: borderWidth.none }}>
        <AppText variant="h3" color={palette.surface}>
          Optimize Your Spending
        </AppText>
        <AppText variant="body" color="#DCE7FF" style={{ marginTop: spacing.sm }}>
          Based on your trends, reducing your top category by 10% can improve savings noticeably.
        </AppText>
      </AppCard>

      <AppCard>
        <AppText variant="h3" style={{ marginBottom: spacing.md }}>
          6-Month Trend
        </AppText>
        <AppLineChart labels={trend.labels} incomeData={trend.incomeData} expenseData={trend.expenseData} />
      </AppCard>
    </AppScreenLayout>
  );
}
