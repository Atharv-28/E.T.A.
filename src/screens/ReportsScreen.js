import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import CustomIcon from '../components/CustomIcon';
import { useTransactions, CATEGORIES } from '../context/TransactionContext';
import { formatCurrency } from '../utils/currency';
import { styles } from '../styles/GlobalStyles';

const screenWidth = Dimensions.get('window').width;

function ReportsScreen() {
  const { transactions } = useTransactions();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Get current date info
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filter transactions based on selected period
  const getFilteredTransactions = () => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      if (selectedPeriod === 'month') {
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      } else if (selectedPeriod === 'year') {
        return transactionDate.getFullYear() === currentYear;
      }
      return true; // 'all' period
    });
  };

  const filteredTransactions = getFilteredTransactions();

  // Calculate analytics data
  const calculateCategoryData = () => {
    const categoryTotals = {};
    const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
    
    expenseTransactions.forEach(transaction => {
      const categoryInfo = CATEGORIES.EXPENSE.find(cat => cat.id === transaction.category);
      const categoryName = categoryInfo ? categoryInfo.name : 'Other';
      categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + transaction.amount;
    });

    return Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6); // Top 6 categories
  };

  const calculateMonthlyTrend = () => {
    const monthlyData = {};
    
    // Last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      monthlyData[monthKey] = { income: 0, expense: 0 };
    }

    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      if (transactionDate.getFullYear() === currentYear && 
          transactionDate.getMonth() >= currentMonth - 5) {
        const monthKey = transactionDate.toLocaleDateString('en-US', { month: 'short' });
        if (monthlyData[monthKey]) {
          monthlyData[monthKey][transaction.type] += transaction.amount;
        }
      }
    });

    return monthlyData;
  };

  const categoryData = calculateCategoryData();
  const monthlyData = calculateMonthlyTrend();

  // Calculate summary statistics
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((netIncome / totalIncome) * 100) : 0;

  // Prepare chart data
  const pieChartData = categoryData.map(([category, amount], index) => ({
    name: category,
    population: amount,
    color: [
      '#e74c3c', '#3498db', '#f39c12', '#9b59b6', 
      '#1abc9c', '#e67e22', '#34495e'
    ][index % 7],
    legendFontColor: '#2c3e50',
    legendFontSize: 12,
  }));

  const lineChartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        data: Object.values(monthlyData).map(data => data.expense),
        strokeWidth: 3,
        color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
      },
      {
        data: Object.values(monthlyData).map(data => data.income),
        strokeWidth: 3,
        color: (opacity = 1) => `rgba(39, 174, 96, ${opacity})`,
      },
    ],
    legend: ['Expenses', 'Income'],
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    formatYLabel: (value) => `₹${Math.round(value)}`,
  };

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>Financial Reports</Text>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {[
          { key: 'month', label: 'This Month', icon: 'calendar-today' },
          { key: 'year', label: 'This Year', icon: 'date-range' },
          { key: 'all', label: 'All Time', icon: 'history' }
        ].map((period) => (
          <TouchableOpacity
            key={period.key}
            style={[
              styles.periodButton,
              selectedPeriod === period.key && styles.activePeriodButton
            ]}
            onPress={() => setSelectedPeriod(period.key)}
          >
            <CustomIcon 
              name={period.icon} 
              size={16} 
              color={selectedPeriod === period.key ? '#ffffff' : '#2c3e50'} 
            />
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === period.key && styles.activePeriodButtonText
            ]}>
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryCardsContainer}>
        <View style={[styles.summaryCard, { backgroundColor: '#e8f5e8' }]}>
          <CustomIcon name="trending-up" size={28} color="#27ae60" />
          <Text style={styles.summaryValue}>
            {formatCurrency(totalIncome)}
          </Text>
          <Text style={styles.summaryLabel}>Total Income</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: '#fdeaea' }]}>
          <CustomIcon name="trending-down" size={28} color="#e74c3c" />
          <Text style={styles.summaryValue}>
            {formatCurrency(totalExpense)}
          </Text>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
        </View>

        <View style={[styles.summaryCard, { 
          backgroundColor: netIncome >= 0 ? '#e8f5e8' : '#fdeaea' 
        }]}>
          <CustomIcon 
            name={netIncome >= 0 ? 'savings' : 'money-off'} 
            size={28} 
            color={netIncome >= 0 ? '#27ae60' : '#e74c3c'} 
          />
          <Text style={[styles.summaryValue, {
            color: netIncome >= 0 ? '#27ae60' : '#e74c3c'
          }]}>
            {formatCurrency(Math.abs(netIncome))}
          </Text>
          <Text style={styles.summaryLabel}>
            {netIncome >= 0 ? 'Net Savings' : 'Net Loss'}
          </Text>
        </View>
      </View>

      {/* Savings Rate Card */}
      <View style={styles.section}>
        <View style={styles.savingsRateCard}>
          <View style={styles.savingsRateHeader}>
            <CustomIcon name="pie-chart" size={24} color="#3498db" />
            <Text style={styles.savingsRateTitle}>Savings Rate</Text>
          </View>
          <Text style={[styles.savingsRateValue, {
            color: savingsRate >= 20 ? '#27ae60' : savingsRate >= 10 ? '#f39c12' : '#e74c3c'
          }]}>
            {savingsRate.toFixed(1)}%
          </Text>
          <Text style={styles.savingsRateSubtext}>
            {savingsRate >= 20 ? 'Excellent!' : 
             savingsRate >= 10 ? 'Good progress' : 'Needs improvement'}
          </Text>
        </View>
      </View>

      {/* Monthly Trend Chart */}
      {Object.keys(monthlyData).length > 0 && (
        <View style={styles.section}>
          <View style={styles.chartHeader}>
            <CustomIcon name="show-chart" size={20} color="#2c3e50" />
            <Text style={styles.sectionTitle}>6-Month Trend</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={lineChartData}
              width={screenWidth - 20}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              withDots={true}
              withShadow={false}
              yAxisInterval={1}
            />
          </ScrollView>
        </View>
      )}

      {/* Expense Categories Pie Chart */}
      {pieChartData.length > 0 && (
        <View style={styles.section}>
          <View style={styles.chartHeader}>
            <CustomIcon name="donut-large" size={20} color="#2c3e50" />
            <Text style={styles.sectionTitle}>Expense Breakdown</Text>
          </View>
          <PieChart
            data={pieChartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 10]}
            style={styles.chart}
          />
        </View>
      )}

      {/* Category Details */}
      <View style={styles.section}>
        <View style={styles.chartHeader}>
          <CustomIcon name="list" size={20} color="#2c3e50" />
          <Text style={styles.sectionTitle}>Top Expense Categories</Text>
        </View>
        {categoryData.length > 0 ? (
          categoryData.map(([category, amount], index) => {
            const percentage = totalExpense > 0 ? (amount / totalExpense * 100) : 0;
            return (
              <View key={category} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryColorDot, {
                    backgroundColor: [
                      '#e74c3c', '#3498db', '#f39c12', '#9b59b6', 
                      '#1abc9c', '#e67e22'
                    ][index % 6]
                  }]} />
                  <Text style={styles.categoryName}>{category}</Text>
                </View>
                <View style={styles.categoryAmountContainer}>
                  <Text style={styles.categoryAmount}>{formatCurrency(amount)}</Text>
                  <Text style={styles.categoryPercentage}>{percentage.toFixed(1)}%</Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <CustomIcon name="pie-chart" size={48} color="#bdc3c7" />
            <Text style={styles.emptyStateText}>No expense data available</Text>
          </View>
        )}
      </View>

      {/* Financial Insights */}
      <View style={styles.section}>
        <View style={styles.chartHeader}>
          <CustomIcon name="lightbulb-outline" size={20} color="#2c3e50" />
          <Text style={styles.sectionTitle}>Financial Insights</Text>
        </View>
        <View style={styles.insightContainer}>
          {savingsRate < 10 && (
            <View style={styles.insightCard}>
              <CustomIcon name="warning" size={20} color="#f39c12" />
              <Text style={styles.insightText}>
                Consider reducing expenses to improve your savings rate
              </Text>
            </View>
          )}
          {categoryData.length > 0 && categoryData[0][1] > totalIncome * 0.3 && (
            <View style={styles.insightCard}>
              <CustomIcon name="info" size={20} color="#3498db" />
              <Text style={styles.insightText}>
                Your top expense category ({categoryData[0][0]}) takes up a large portion of your income
              </Text>
            </View>
          )}
          {netIncome > 0 && (
            <View style={styles.insightCard}>
              <CustomIcon name="check-circle" size={20} color="#27ae60" />
              <Text style={styles.insightText}>
                Great job! You're saving money this period
              </Text>
            </View>
          )}
          {filteredTransactions.length === 0 && (
            <View style={styles.insightCard}>
              <CustomIcon name="info" size={20} color="#95a5a6" />
              <Text style={styles.insightText}>
                No data available for the selected period
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

export default ReportsScreen;
