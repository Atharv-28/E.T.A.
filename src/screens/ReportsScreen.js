import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, TouchableOpacity } from 'react-native';
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
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
  { label: 'All Time', value: 'all' },
];

function getPeriodFilter(period, transactionDate, now) {
  if (period === 'all') return true;
  if (period === 'year') return transactionDate.getFullYear() === now.getFullYear();
  return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthFromKey(key) {
  const [year, month] = key.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

function formatMonthLabel(date) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
}

export default function ReportsScreen() {
  const { transactions } = useTransactions();
  const { activeAccountId } = useAccounts();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMonthKey, setSelectedMonthKey] = useState(getMonthKey(new Date()));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthPickerVisible, setMonthPickerVisible] = useState(false);
  const [yearPickerVisible, setYearPickerVisible] = useState(false);

  const accountTransactions = useMemo(() => {
    const base = Array.isArray(transactions) ? transactions : [];
    return base.filter((item) => item.accountId === activeAccountId);
  }, [transactions, activeAccountId]);

  const availableMonths = useMemo(() => {
    const monthMap = new Map();

    accountTransactions.forEach((item) => {
      if (!item?.date) return;
      const date = new Date(item.date);
      if (Number.isNaN(date.getTime())) return;
      const key = getMonthKey(date);
      if (!monthMap.has(key)) {
        monthMap.set(key, new Date(date.getFullYear(), date.getMonth(), 1));
      }
    });

    return Array.from(monthMap.entries())
      .map(([key, date]) => ({ key, date }))
      .sort((a, b) => b.date - a.date);
  }, [accountTransactions]);

  const availableYears = useMemo(() => {
    const yearSet = new Set();

    accountTransactions.forEach((item) => {
      if (!item?.date) return;
      const date = new Date(item.date);
      if (Number.isNaN(date.getTime())) return;
      yearSet.add(date.getFullYear());
    });

    return Array.from(yearSet).sort((a, b) => b - a);
  }, [accountTransactions]);

  const selectedMonth = useMemo(() => {
    if (!selectedMonthKey) return null;
    return getMonthFromKey(selectedMonthKey);
  }, [selectedMonthKey]);

  useEffect(() => {
    if (selectedPeriod !== 'month') return;
    if (availableMonths.length === 0) return;

    const hasSelectedMonth = availableMonths.some((month) => month.key === selectedMonthKey);
    if (!hasSelectedMonth) {
      setSelectedMonthKey(availableMonths[0].key);
    }
  }, [availableMonths, selectedMonthKey, selectedPeriod]);

  useEffect(() => {
    if (selectedPeriod !== 'year') return;
    if (availableYears.length === 0) return;

    if (!availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedPeriod, selectedYear]);

  const scoped = useMemo(() => {
    const now = new Date();

    return accountTransactions.filter((item) => {
      const date = new Date(item.date);
      if (selectedPeriod === 'month') {
        return selectedMonth ? getMonthKey(date) === getMonthKey(selectedMonth) : false;
      }
      if (selectedPeriod === 'year') {
        return date.getFullYear() === selectedYear;
      }
      return getPeriodFilter(selectedPeriod, date, now);
    });
  }, [accountTransactions, selectedMonth, selectedPeriod, selectedYear]);

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

  const selectorLabel = selectedPeriod === 'year'
    ? String(selectedYear)
    : selectedPeriod === 'month'
      ? (selectedMonth ? formatMonthLabel(selectedMonth) : 'NO MONTHS')
      : null;

  const openPeriodPicker = () => {
    if (selectedPeriod === 'month') setMonthPickerVisible(true);
    if (selectedPeriod === 'year') setYearPickerVisible(true);
  };

  return (
    <AppScreenLayout>
      <AppView style={styles.headerRow}>
        <AppText variant="h2">Expense Analysis</AppText>
        {selectorLabel ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={openPeriodPicker}
            style={styles.monthSelectorTrigger}
          >
            <AppBadge label={selectorLabel} tone="neutral" />
            <AppView style={styles.monthSelectorIconWrap}>
              <AppText variant="caption" color={palette.textSecondary}>
                ▼
              </AppText>
            </AppView>
          </TouchableOpacity>
        ) : null}
      </AppView>

      <AppText variant="body" color={palette.textSecondary}>
        A detailed breakdown of your monthly spending habits.
      </AppText>

      <AppChipTabs value={selectedPeriod} onChange={setSelectedPeriod} tabs={periodTabs} />

      <Modal visible={monthPickerVisible} transparent animationType="fade" onRequestClose={() => setMonthPickerVisible(false)}>
        <Pressable style={styles.monthPickerBackdrop} onPress={() => setMonthPickerVisible(false)}>
          <Pressable style={styles.monthPickerPanel} onPress={() => {}}>
            <AppText variant="h4" style={styles.monthPickerTitle}>
              Select Month
            </AppText>

            {availableMonths.length === 0 ? (
              <AppText variant="body" color={palette.textSecondary}>
                No month data available yet.
              </AppText>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {availableMonths.map((month) => {
                  const isSelected = month.key === selectedMonthKey;
                  return (
                    <TouchableOpacity
                      key={month.key}
                      activeOpacity={0.8}
                      onPress={() => {
                        setSelectedMonthKey(month.key);
                        setMonthPickerVisible(false);
                        setSelectedPeriod('month');
                      }}
                      style={[styles.monthOption, isSelected ? styles.monthOptionSelected : null]}
                    >
                      <AppText
                        variant="bodyBold"
                        color={isSelected ? palette.primary : palette.textPrimary}
                      >
                        {formatMonthLabel(month.date)}
                      </AppText>
                      {isSelected ? <AppText variant="caption" color={palette.primary}>Selected</AppText> : null}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={yearPickerVisible} transparent animationType="fade" onRequestClose={() => setYearPickerVisible(false)}>
        <Pressable style={styles.monthPickerBackdrop} onPress={() => setYearPickerVisible(false)}>
          <Pressable style={styles.monthPickerPanel} onPress={() => {}}>
            <AppText variant="h4" style={styles.monthPickerTitle}>
              Select Year
            </AppText>

            {availableYears.length === 0 ? (
              <AppText variant="body" color={palette.textSecondary}>
                No year data available yet.
              </AppText>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {availableYears.map((year) => {
                  const isSelected = year === selectedYear;
                  return (
                    <TouchableOpacity
                      key={year}
                      activeOpacity={0.8}
                      onPress={() => {
                        setSelectedYear(year);
                        setYearPickerVisible(false);
                        setSelectedPeriod('year');
                      }}
                      style={[styles.monthOption, isSelected ? styles.monthOptionSelected : null]}
                    >
                      <AppText
                        variant="bodyBold"
                        color={isSelected ? palette.primary : palette.textPrimary}
                      >
                        {year}
                      </AppText>
                      {isSelected ? <AppText variant="caption" color={palette.primary}>Selected</AppText> : null}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>

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
