import React from 'react';
import { ScrollView, Text, View, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import CustomIcon from '../components/CustomIcon';
import { 
  FadeInView, 
  SlideInView, 
  ScaleInView, 
  GradientCard,
  AnimatedButton,
  GradientButton
} from '../components/AnimatedComponents';
import { useTransactions, CATEGORIES } from '../context/TransactionContext';
import { useAccounts } from '../context/AccountContext';
import { formatCurrency } from '../utils/currency';
import { styles, colors } from '../styles/GlobalStyles';

function DashboardScreen({ onManualTransaction }) {
  const { 
    getTransactionsByAccount, 
    getMonthlySpendingForAccount 
  } = useTransactions();
  const { activeAccount } = useAccounts();
  
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [transactionType, setTransactionType] = React.useState('expense'); // 'expense' or 'income'
  const [amount, setAmount] = React.useState('');
  
  // Normalize transaction type labels to 'income' or 'expense'
  const normalizeType = (type) => {
    if (!type) return 'expense';
    const t = type.toString().toLowerCase();
    if (t === 'income' || t === 'credit') return 'income';
    return 'expense';
  };
   
  // Use active account data or show empty state
  const activeAccountId = activeAccount?.id;
  const accountTransactions = activeAccountId ? getTransactionsByAccount(activeAccountId) : [];
  const monthlySpending = activeAccountId ? getMonthlySpendingForAccount(activeAccountId) : 0;
  const recentTransactions = accountTransactions.slice(0, 5);

  const getCategoryInfo = (categoryId, type) => {
    // Ensure we map alternative labels like 'debit'/'credit' to EXPENSE/INCOME
    const normalized = normalizeType(type);
    const categories = CATEGORIES[normalized.toUpperCase()] || CATEGORIES.EXPENSE;
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

  const handleAddTransaction = () => {
    if (!amount || parseFloat(amount) <= 0) {
      return Alert.alert('Validation', 'Please enter a valid amount');
    }
    
    // Create a transaction payload similar to SMS-detected transactions
    const transactionData = {
      amount: parseFloat(amount),
      type: transactionType, // 'expense' or 'income'
      description: `Manual ${transactionType === 'income' ? 'Credit' : 'Debit'}`,
      date: new Date().toISOString(),
      accountId: null, // Let user pick in modal
      accountNumber: null,
      bank: 'Manual Entry',
      rawSMS: `Manual ${transactionType === 'income' ? 'Credit' : 'Debit'} entry for amount Rs.${parseFloat(amount).toFixed(2)}`,
      smsData: {
        sender: 'Manual',
        date: new Date().toISOString(),
        rawSMS: `Manual entry`
      }
    };
    
    // Close amount modal and trigger category modal via parent
    setShowAddModal(false);
    setAmount('');
    
    if (onManualTransaction) {
      onManualTransaction(transactionData);
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

          {/* Add Transaction Button */}
          <ScaleInView delay={500}>
            <TouchableOpacity 
              style={{
                flex: 0.45,
                backgroundColor: colors.primary,
                borderRadius: 16,
                padding: 20,
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 140,
                elevation: 4,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              }}
              onPress={() => setShowAddModal(true)}
            >
              <CustomIcon name="add-circle" size={40} color={colors.white} />
              <Text style={[styles.statLabel, { color: colors.white, opacity: 0.9, marginTop: 8 }]}>
                Add Transaction
              </Text>
            </TouchableOpacity>
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
            const isIncome = normalizeType(transaction.type) === 'income';
            
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
                          {isIncome ? 'Credit' : 'Debit'}
                        </Text>
                        <Text style={[styles.transactionCategory, { color: colors.gray }]}>
                          {(transaction.bank || categoryInfo.name)} • {formatDate(transaction.date)}
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
                .filter(t => normalizeType(t.type) === 'income' && 
                  new Date(t.date).getMonth() === new Date().getMonth())
                .reduce((sum, t) => sum + t.amount, 0))}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <CustomIcon name="remove" size={20} color="#e74c3c" />
            <Text style={styles.summaryLabel}>Expenses</Text>
            <Text style={[styles.summaryValue, { color: colors.dangerDark, opacity: 0.9 }]}>
              -{formatCurrency(monthlySpending)}
            </Text>
          </View>
        </View>
        </GradientCard>
      </FadeInView>

      {/* Add Transaction Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <CustomIcon name="close" size={24} color="#2c3e50" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Transaction</Text>
            <TouchableOpacity onPress={handleAddTransaction}>
              <Text style={styles.saveButton}>Add</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Transaction Type Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Transaction Type</Text>
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    transactionType === 'expense' && styles.typeButtonActive,
                    { backgroundColor: transactionType === 'expense' ? colors.danger : colors.grayLight }
                  ]}
                  onPress={() => setTransactionType('expense')}
                >
                  <CustomIcon 
                    name="trending-down" 
                    size={20} 
                    color={transactionType === 'expense' ? colors.white : colors.gray} 
                  />
                  <Text style={[
                    styles.typeButtonText,
                    { color: transactionType === 'expense' ? colors.white : colors.gray }
                  ]}>
                    Debit
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    transactionType === 'income' && styles.typeButtonActive,
                    { backgroundColor: transactionType === 'income' ? colors.success : colors.grayLight }
                  ]}
                  onPress={() => setTransactionType('income')}
                >
                  <CustomIcon 
                    name="trending-up" 
                    size={20} 
                    color={transactionType === 'income' ? colors.white : colors.gray} 
                  />
                  <Text style={[
                    styles.typeButtonText,
                    { color: transactionType === 'income' ? colors.white : colors.gray }
                  ]}>
                    Credit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Amount Input */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amount (₹)</Text>
              <TextInput
                style={[styles.textInput, { fontSize: 24, fontWeight: '600' }]}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor="#95a5a6"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={{ padding: 16 }}>
              <Text style={styles.helpText}>
                💡 After clicking "Add", you'll be able to select the category and account for this transaction.
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

export default DashboardScreen;
