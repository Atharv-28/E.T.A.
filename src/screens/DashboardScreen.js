import React from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTransactions, CATEGORIES } from '../context/TransactionContext';
import { styles } from '../styles/GlobalStyles';

function DashboardScreen() {
  const { transactions, getTotalBalance, getMonthlySpending } = useTransactions();
  
  const totalBalance = getTotalBalance();
  const monthlySpending = getMonthlySpending();
  const recentTransactions = transactions.slice(0, 5);

  const getCategoryInfo = (categoryId, type) => {
    const categories = CATEGORIES[type.toUpperCase()];
    return categories.find(cat => cat.id === categoryId) || { name: 'Other', icon: 'help' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <ScrollView style={styles.screen}>
      <Text style={styles.screenTitle}>Dashboard</Text>
      
      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="account-balance-wallet" size={24} color="#27ae60" />
          <Text style={[styles.statValue, { color: totalBalance >= 0 ? '#27ae60' : '#e74c3c' }]}>
            ${Math.abs(totalBalance).toFixed(2)}
          </Text>
          <Text style={styles.statLabel}>Total Balance</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="trending-down" size={24} color="#e74c3c" />
          <Text style={[styles.statValue, { color: '#e74c3c' }]}>
            -${monthlySpending.toFixed(2)}
          </Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Icon name="history" size={20} color="#2c3e50" />
        </View>
        
        {recentTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="receipt" size={32} color="#bdc3c7" />
            <Text style={styles.emptyStateText}>No transactions yet</Text>
          </View>
        ) : (
          recentTransactions.map((transaction) => {
            const categoryInfo = getCategoryInfo(transaction.category, transaction.type);
            const isIncome = transaction.type === 'income';
            
            return (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View style={[
                    styles.categoryIconSmall,
                    { backgroundColor: isIncome ? '#e8f5e8' : '#fdeaea' }
                  ]}>
                    <Icon 
                      name={categoryInfo.icon} 
                      size={16} 
                      color={isIncome ? '#27ae60' : '#e74c3c'} 
                    />
                  </View>
                  <View>
                    <Text style={styles.transactionDescription}>
                      {transaction.description}
                    </Text>
                    <Text style={styles.transactionCategory}>
                      {categoryInfo.name} • {formatDate(transaction.date)}
                    </Text>
                  </View>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  { color: isIncome ? '#27ae60' : '#e74c3c' }
                ]}>
                  {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
                </Text>
              </View>
            );
          })
        )}
      </View>

      {/* Monthly Summary */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>This Month Summary</Text>
          <Icon name="calendar-today" size={20} color="#2c3e50" />
        </View>
        
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Icon name="add" size={20} color="#27ae60" />
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={[styles.summaryValue, { color: '#27ae60' }]}>
              +${transactions
                .filter(t => t.type === 'income' && 
                  new Date(t.date).getMonth() === new Date().getMonth())
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Icon name="remove" size={20} color="#e74c3c" />
            <Text style={styles.summaryLabel}>Expenses</Text>
            <Text style={[styles.summaryValue, { color: '#e74c3c' }]}>
              -${monthlySpending.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Chart Preview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Spending Trend</Text>
          <TouchableOpacity onPress={() => console.log('Navigate to Reports')}>
            <Text style={styles.viewAllButton}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.miniChart}>
          <Text style={styles.miniChartTitle}>Last 7 Days Expenses</Text>
          <View style={styles.miniChartBars}>
            {Array.from({ length: 7 }, (_, index) => {
              const dayExpenses = transactions
                .filter(t => {
                  const transactionDate = new Date(t.date);
                  const targetDate = new Date();
                  targetDate.setDate(targetDate.getDate() - (6 - index));
                  return t.type === 'expense' && 
                         transactionDate.toDateString() === targetDate.toDateString();
                })
                .reduce((sum, t) => sum + t.amount, 0);
              
              const maxExpense = Math.max(1, Math.max(...Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                return transactions
                  .filter(t => t.type === 'expense' && 
                              new Date(t.date).toDateString() === date.toDateString())
                  .reduce((sum, t) => sum + t.amount, 0);
              })));
              
              const height = Math.max(4, (dayExpenses / maxExpense) * 40);
              
              return (
                <View key={index} style={styles.miniChartBar}>
                  <View style={[styles.miniChartBarFill, { 
                    height: height,
                    backgroundColor: dayExpenses > 0 ? '#e74c3c' : '#ecf0f1'
                  }]} />
                  <Text style={styles.miniChartBarLabel}>
                    {new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000)
                      .toLocaleDateString('en-US', { weekday: 'short' })[0]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default DashboardScreen;
