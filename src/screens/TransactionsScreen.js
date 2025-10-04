import React, { useState } from 'react';
import { 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  View, 
  FlatList,
  Alert 
} from 'react-native';
import CustomIcon from '../components/CustomIcon';
import { useTransactions, CATEGORIES } from '../context/TransactionContext';
import AddTransactionModal from '../components/AddTransactionModal';
import { formatCurrency } from '../utils/currency';
import { styles } from '../styles/GlobalStyles';

function TransactionsScreen() {
  const { 
    transactions, 
    addTransaction, 
    deleteTransaction 
  } = useTransactions();
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'income', 'expense'

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const getCategoryInfo = (categoryId, type) => {
    const categories = CATEGORIES[type.toUpperCase()];
    return categories.find(cat => cat.id === categoryId) || { name: 'Other', icon: 'help' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDeleteTransaction = (id) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTransaction(id) }
      ]
    );
  };

  const renderTransaction = ({ item }) => {
    const categoryInfo = getCategoryInfo(item.category, item.type);
    const isIncome = item.type === 'income';

    return (
      <View style={styles.transactionCard}>
        <View style={styles.transactionLeft}>
          <View style={[
            styles.categoryIcon,
            { backgroundColor: isIncome ? '#e8f5e8' : '#fdeaea' }
          ]}>
            <CustomIcon 
              name={categoryInfo.icon} 
              size={24} 
              color={isIncome ? '#27ae60' : '#e74c3c'} 
            />
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionDescription}>{item.description}</Text>
            <Text style={styles.transactionCategory}>{categoryInfo.name}</Text>
            <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
          </View>
        </View>
        <View style={styles.transactionRight}>
          <Text style={[
            styles.transactionAmount,
            { color: isIncome ? '#27ae60' : '#e74c3c' }
          ]}>
            {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
          </Text>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteTransaction(item.id)}
          >
            <CustomIcon name="delete" size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>Transactions</Text>
      
      {/* Add Transaction Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <CustomIcon name="add" size={20} color="#ffffff" />
        <Text style={styles.addButtonText}>Add Transaction</Text>
      </TouchableOpacity>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {[
          { key: 'all', label: 'All', icon: 'list' },
          { key: 'income', label: 'Income', icon: 'add' },
          { key: 'expense', label: 'Expense', icon: 'remove' }
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.filterButton,
              filter === item.key && styles.activeFilterButton
            ]}
            onPress={() => setFilter(item.key)}
          >
            <CustomIcon 
              name={item.icon} 
              size={16} 
              color={filter === item.key ? '#ffffff' : '#2c3e50'} 
            />
            <Text style={[
              styles.filterButtonText,
              filter === item.key && styles.activeFilterButtonText
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transaction List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {filter === 'all' ? 'All Transactions' : 
           filter === 'income' ? 'Income Transactions' : 'Expense Transactions'}
          {` (${filteredTransactions.length})`}
        </Text>
        
        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <CustomIcon name="receipt" size={48} color="#bdc3c7" />
            <Text style={styles.emptyStateText}>No transactions found</Text>
            <Text style={styles.emptyStateSubtext}>
              Tap the + button to add your first transaction
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredTransactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddTransaction={addTransaction}
      />
    </View>
  );
}

export default TransactionsScreen;
