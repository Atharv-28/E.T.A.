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
import { 
  FadeInView, 
  SlideInView, 
  ScaleInView, 
  GradientCard,
  AnimatedButton,
  GradientButton 
} from './AnimatedComponents';
import { CATEGORIES } from '../context/TransactionContext';
import { formatCurrency } from '../utils/currency';
import { styles, colors } from '../styles/GlobalStyles';

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

  const renderCategoryOption = (category, index) => {
    const isSelected = selectedCategory === category.id;

    return (
      <SlideInView key={category.id} direction="left" delay={index * 50}>
        <AnimatedButton
          style={[
            styles.enhancedCategoryOption,
            isSelected && styles.enhancedCategoryOptionSelected
          ]}
          onPress={() => setSelectedCategory(category.id)}
          bounceScale={0.95}
        >
          <View style={[
            {
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: isSelected ? colors.primary : colors.primaryLight + '30',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }
          ]}>
            <CustomIcon 
              name={category.icon} 
              size={20} 
              color={isSelected ? colors.white : colors.primary} 
            />
          </View>
          <Text style={[
            {
              fontSize: 16,
              fontWeight: '600',
              color: isSelected ? colors.primary : colors.black,
              flex: 1,
            }
          ]}>
            {category.name}
          </Text>
          {isSelected && (
            <CustomIcon name="check-circle" size={20} color={colors.primary} />
          )}
        </AnimatedButton>
      </SlideInView>
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
        {/* Header with Animation */}
        <FadeInView>
          <View style={styles.enhancedModalHeader}>
            <AnimatedButton onPress={onCancel} bounceScale={0.9}>
              <CustomIcon name="close" size={24} color={colors.gray} />
            </AnimatedButton>
            <Text style={styles.enhancedModalTitle}>New Transaction Detected</Text>
            <GradientButton
              colors={[colors.primary, colors.primaryDark]}
              onPress={handleConfirm}
              style={{ paddingHorizontal: 16, paddingVertical: 8 }}
            >
              <Text style={styles.gradientButtonText}>Add</Text>
            </GradientButton>
          </View>
        </FadeInView>

        <ScrollView style={styles.modalContent}>
          {/* Transaction Details with Animation */}
          <SlideInView direction="right" delay={200}>
            <GradientCard 
              colors={transaction.type === 'income' 
                ? [colors.incomeGradientStart, colors.incomeGradientEnd]
                : [colors.expenseGradientStart, colors.expenseGradientEnd]
              }
              style={[styles.section, { borderWidth: 0 }]}
            >
              <Text style={[styles.sectionTitle, { color: colors.white }]}>
                📱 From SMS
              </Text>
              <View style={styles.transactionCard}>
                <View style={styles.transactionLeft}>
                  <View style={[
                    styles.categoryIcon, 
                    { backgroundColor: colors.white + '30' }
                  ]}>
                    <CustomIcon 
                      name={transaction.type === 'income' ? 'trending-up' : 'trending-down'} 
                      size={24} 
                      color={colors.white} 
                    />
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={[styles.transactionDescription, { color: colors.white, fontWeight: '600' }]}>
                      {transaction.description}
                    </Text>
                    <Text style={[styles.transactionCategory, { color: colors.white, opacity: 0.8 }]}>
                      {transaction.bank} • {new Date(transaction.date).toLocaleDateString()}
                    </Text>
                    <Text style={[styles.transactionDate, { color: colors.white, opacity: 0.7 }]}>
                      Account: {transaction.accountNumber}
                    </Text>
                  </View>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  { 
                    color: colors.white,
                    fontSize: 20,
                    fontWeight: '800' 
                  }
                ]}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </Text>
              </View>
            </GradientCard>
          </SlideInView>

          {/* SMS Details */}
          <FadeInView delay={400}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📄 SMS Details</Text>
              <View style={styles.exampleContainer}>
                <Text style={styles.exampleText}>
                  From: {transaction.smsData?.sender || 'Unknown'}
                </Text>
                <Text style={styles.exampleText}>
                  Received: {transaction.smsData?.receivedAt?.toLocaleString() || 'Just now'}
                </Text>
                <Text style={[styles.exampleText, { fontStyle: 'italic', marginTop: 8, color: colors.gray }]}>
                  "{transaction.smsData?.rawSMS?.substring(0, 100)}..."
                </Text>
              </View>
            </View>
          </FadeInView>

          {/* Category Selection */}
          <FadeInView delay={600}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                🏷️ Select Category ({transaction.type === 'income' ? 'Income' : 'Expense'})
              </Text>
              <View style={styles.categoryGrid}>
                {categories.map((category, index) => renderCategoryOption(category, index))}
              </View>
            </View>
          </FadeInView>

          {/* Action Buttons */}
          <ScaleInView delay={800}>
            <View style={styles.section}>
              <GradientButton
                colors={[colors.success, colors.successDark]}
                onPress={handleConfirm}
                style={{ marginBottom: 12 }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <CustomIcon name="add" size={20} color={colors.white} />
                  <Text style={[styles.gradientButtonText, { marginLeft: 8 }]}>
                    Add Transaction
                  </Text>
                </View>
              </GradientButton>
              
              <AnimatedButton
                style={[
                  styles.addButton, 
                  { 
                    backgroundColor: colors.grayLight,
                    borderWidth: 1,
                    borderColor: colors.gray,
                  }
                ]}
                onPress={onCancel}
              >
                <CustomIcon name="close" size={20} color={colors.gray} />
                <Text style={[styles.addButtonText, { color: colors.gray }]}>
                  Cancel
                </Text>
              </AnimatedButton>
            </View>
          </ScaleInView>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default TransactionCategoryModal;
