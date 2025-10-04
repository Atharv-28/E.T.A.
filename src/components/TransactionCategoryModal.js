import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import CustomIcon from './CustomIcon';
import { CATEGORIES } from '../context/TransactionContext';
import { formatCurrency } from '../utils/currency';
import { styles } from '../styles/GlobalStyles';

const TransactionCategoryModal = ({ 
  visible, 
  transaction, 
  onConfirm, 
  onCancel 
}) => {
  const [selectedCategory, setSelectedCategory] = useState(
    transaction?.category || 'other_expense'
  );

  if (!transaction) return null;

  const categories = transaction.type === 'income' 
    ? CATEGORIES.INCOME 
    : CATEGORIES.EXPENSE;

  const handleConfirm = () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    const finalTransaction = {
      ...transaction,
      category: selectedCategory,
      id: `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source: 'sms_auto'
    };

    onConfirm(finalTransaction);
  };

  const renderCategoryOption = (category) => {
    const isSelected = selectedCategory === category.id;

    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.categoryItem,
          isSelected && styles.activeCategoryItem
        ]}
        onPress={() => setSelectedCategory(category.id)}
      >
        <CustomIcon 
          name={category.icon} 
          size={24} 
          color={isSelected ? '#ffffff' : '#3498db'} 
        />
        <Text style={[
          styles.categoryText,
          isSelected && styles.activeCategoryText
        ]}>
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onCancel}>
            <CustomIcon name="close" size={24} color="#2c3e50" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>New Transaction Detected</Text>
          <TouchableOpacity onPress={handleConfirm}>
            <Text style={styles.saveButton}>Add</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Transaction Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📱 From SMS</Text>
            <View style={styles.transactionCard}>
              <View style={styles.transactionLeft}>
                <View style={[
                  styles.categoryIcon, 
                  { backgroundColor: transaction.type === 'income' ? '#27ae60' : '#e74c3c' }
                ]}>
                  <CustomIcon 
                    name={transaction.type === 'income' ? 'trending-up' : 'trending-down'} 
                    size={24} 
                    color="#ffffff" 
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionCategory}>
                    {transaction.bank} • {new Date(transaction.date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.transactionDate}>
                    Account: {transaction.accountNumber}
                  </Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text style={[
                  styles.transactionAmount,
                  { color: transaction.type === 'income' ? '#27ae60' : '#e74c3c' }
                ]}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </Text>
              </View>
            </View>
          </View>

          {/* SMS Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📄 SMS Details</Text>
            <View style={styles.exampleContainer}>
              <Text style={styles.exampleText}>
                From: {transaction.smsData?.sender || 'Unknown'}
              </Text>
              <Text style={styles.exampleText}>
                Received: {transaction.smsData?.receivedAt?.toLocaleString() || 'Just now'}
              </Text>
              <Text style={[styles.exampleText, { fontStyle: 'italic', marginTop: 8 }]}>
                "{transaction.smsData?.rawSMS?.substring(0, 100)}..."
              </Text>
            </View>
          </View>

          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              🏷️ Select Category ({transaction.type === 'income' ? 'Income' : 'Expense'})
            </Text>
            <View style={styles.categoryGrid}>
              {categories.map(renderCategoryOption)}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={[styles.addButton, { marginBottom: 12 }]}
              onPress={handleConfirm}
            >
              <CustomIcon name="add" size={20} color="#ffffff" />
              <Text style={styles.addButtonText}>Add Transaction</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.backupButton, { borderColor: '#e74c3c' }]}
              onPress={onCancel}
            >
              <CustomIcon name="close" size={18} color="#e74c3c" />
              <Text style={[styles.backupButtonText, { color: '#e74c3c' }]}>
                Ignore SMS
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default TransactionCategoryModal;
