import React from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import CustomIcon from '../components/CustomIcon';
import { 
  FadeInView, 
  SlideInView, 
  ScaleInView, 
  GradientCard,
  AnimatedButton 
} from '../components/AnimatedComponents';
import { useTransactions, CATEGORIES } from '../context/TransactionContext';
import { useAccounts } from '../context/AccountContext';
import { formatCurrency } from '../utils/currency';
import { styles, colors } from '../styles/GlobalStyles';

function DashboardScreen() {
  const { 
    getTransactionsByAccount, 
    getMonthlySpendingForAccount 
  } = useTransactions();
  const { activeAccount } = useAccounts();
  
  // Use active account data or show empty state
  const activeAccountId = activeAccount?.id;
  const accountTransactions = activeAccountId ? getTransactionsByAccount(activeAccountId) : [];
  const monthlySpending = activeAccountId ? getMonthlySpendingForAccount(activeAccountId) : 0;
  const recentTransactions = accountTransactions.slice(0, 5);

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
      <FadeInView>
        <Text style={styles.screenTitle}>Dashboard</Text>
      </FadeInView>
      
      {/* Quick Stats with Animation */}
      <SlideInView direction="right" delay={200}>
        <View style={styles.statsContainer}>
          <ScaleInView delay={400}>
            <GradientCard 
              colors={[colors.danger, colors.dangerLight]}
              style={styles.statCard}
            >
              <CustomIcon name="trending-down" size={32} color={colors.white} />
              <Text style={[styles.statValue, { color: colors.white }]}>
                -{formatCurrency(monthlySpending)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.white, opacity: 0.9 }]}>
                This Month
              </Text>
            </GradientCard>
          </ScaleInView>
        </View>
      </SlideInView>

      {/* Recent Transactions with Animation */}
      <FadeInView delay={500}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <CustomIcon name="history" size={20} color={colors.primary} />
          </View>
          
          {recentTransactions.length === 0 ? (
            <ScaleInView delay={600}>
              <View style={styles.emptyState}>
                <CustomIcon name="receipt" size={32} color={colors.grayLight} />
                <Text style={styles.emptyStateText}>No transactions yet</Text>
              </View>
            </ScaleInView>
        ) : (
          recentTransactions.map((transaction, index) => {
            const categoryInfo = getCategoryInfo(transaction.category, transaction.type);
            const isIncome = transaction.type === 'income';
            
            return (
              <SlideInView 
                key={transaction.id} 
                direction="left" 
                delay={600 + (index * 100)}
              >
                <AnimatedButton>
                  <View style={[
                    styles.transactionItem,
                    {
                      backgroundColor: colors.white,
                      borderRadius: 12,
                      marginVertical: 4,
                      paddingHorizontal: 16,
                      elevation: 2,
                      shadowColor: colors.black,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 4,
                      borderLeftWidth: 4,
                      borderLeftColor: isIncome ? colors.success : colors.danger,
                    }
                  ]}>
                    <View style={styles.transactionLeft}>
                      <View style={[
                        styles.categoryIconSmall,
                        { 
                          backgroundColor: isIncome 
                            ? colors.success + '20' 
                            : colors.danger + '20' 
                        }
                      ]}>
                        <CustomIcon 
                          name={categoryInfo.icon} 
                          size={16} 
                          color={isIncome ? colors.success : colors.danger} 
                        />
                      </View>
                      <View>
                        <Text style={[styles.transactionDescription, { fontWeight: '600' }]}>
                          {transaction.description}
                        </Text>
                        <Text style={[styles.transactionCategory, { color: colors.gray }]}>
                          {categoryInfo.name} • {formatDate(transaction.date)}
                        </Text>
                      </View>
                    </View>
                    <Text style={[
                      styles.transactionAmount,
                      { 
                        color: isIncome ? colors.success : colors.danger,
                        fontSize: 16,
                        fontWeight: '700'
                      }
                    ]}>
                      {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </Text>
                  </View>
                </AnimatedButton>
              </SlideInView>
            );
          })
        )}
      </View>
      </FadeInView>

      {/* Monthly Summary with Animation */}
      <FadeInView delay={800}>
        <GradientCard 
          colors={[colors.cardGradient2Start, colors.cardGradient2End]}
          style={[styles.section, { borderWidth: 0 }]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.white }]}>
              This Month Summary
            </Text>
            <CustomIcon name="calendar-today" size={20} color={colors.white} />
          </View>
        
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <CustomIcon name="add" size={20} color="#27ae60" />
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={[styles.summaryValue, { color: '#27ae60' }]}>
              +{formatCurrency(accountTransactions
                .filter(t => t.type === 'income' && 
                  new Date(t.date).getMonth() === new Date().getMonth())
                .reduce((sum, t) => sum + t.amount, 0))}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <CustomIcon name="remove" size={20} color="#e74c3c" />
            <Text style={styles.summaryLabel}>Expenses</Text>
            <Text style={[styles.summaryValue, { color: colors.white, opacity: 0.9 }]}>
              -{formatCurrency(monthlySpending)}
            </Text>
          </View>
        </View>
        </GradientCard>
      </FadeInView>

      {/* Quick Chart Preview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Spending Trend</Text>
        </View>
        
        <View style={styles.miniChart}>
          <Text style={styles.miniChartTitle}>Weeks of This Month</Text>
          <View style={styles.miniChartBars}>
            {Array.from({ length: 4 }, (_, index) => {
              // Calculate week ranges for current month
              const now = new Date();
              const currentMonth = now.getMonth();
              const currentYear = now.getFullYear();
              const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
              const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
              
              // Calculate week start and end dates
              const weekStart = new Date(firstDayOfMonth);
              weekStart.setDate(1 + (index * 7));
              const weekEnd = new Date(weekStart);
              weekEnd.setDate(weekStart.getDate() + 6);
              
              // Ensure we don't go beyond the current month
              if (weekEnd > lastDayOfMonth) {
                weekEnd.setTime(lastDayOfMonth.getTime());
              }
              
              const weekExpenses = accountTransactions
                .filter(t => {
                  const transactionDate = new Date(t.date);
                  return t.type === 'expense' && 
                         transactionDate >= weekStart && 
                         transactionDate <= weekEnd &&
                         transactionDate.getMonth() === currentMonth;
                })
                .reduce((sum, t) => sum + t.amount, 0);
              
              // Calculate max expense for scaling
              const maxExpense = Math.max(1, Math.max(...Array.from({ length: 4 }, (_, i) => {
                const wStart = new Date(firstDayOfMonth);
                wStart.setDate(1 + (i * 7));
                const wEnd = new Date(wStart);
                wEnd.setDate(wStart.getDate() + 6);
                if (wEnd > lastDayOfMonth) {
                  wEnd.setTime(lastDayOfMonth.getTime());
                }
                return accountTransactions
                  .filter(t => {
                    const tDate = new Date(t.date);
                    return t.type === 'expense' && 
                           tDate >= wStart && 
                           tDate <= wEnd &&
                           tDate.getMonth() === currentMonth;
                  })
                  .reduce((sum, t) => sum + t.amount, 0);
              })));
              
              const height = Math.max(4, (weekExpenses / maxExpense) * 40);
              
              return (
                <View key={index} style={styles.miniChartBar}>
                  <View style={[styles.miniChartBarFill, { 
                    height: height,
                    backgroundColor: weekExpenses > 0 ? '#e74c3c' : '#ecf0f1'
                  }]} />
                  <Text style={styles.miniChartBarLabel}>
                    W{index + 1}
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
