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
import { styles as localStyles } from './TransactionCategoryModal_Enhanced.styles';

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
          <View
            style={[
              localStyles.categoryOptionIcon,
              isSelected
                ? localStyles.categoryOptionIconSelected
                : localStyles.categoryOptionIconDefault,
            ]}
          >
            <CustomIcon 
              name={category.icon} 
              size={20} 
              color={isSelected ? colors.white : colors.primary} 
            />
          </View>
          <Text
            style={[
              localStyles.categoryOptionText,
              isSelected
                ? localStyles.categoryOptionTextSelected
                : localStyles.categoryOptionTextDefault,
            ]}
          >
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
              style={localStyles.headerActionButton}
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
              style={[styles.section, localStyles.sectionBorderless]}
            >
              <Text style={[styles.sectionTitle, localStyles.sectionTitleInverse]}>
                📱 From SMS
              </Text>
              <View style={styles.transactionCard}>
                <View style={styles.transactionLeft}>
                  <View style={[
                    styles.categoryIcon,
                    localStyles.transactionIconAccent
                  ]}>
                    <CustomIcon 
                      name={transaction.type === 'income' ? 'trending-up' : 'trending-down'} 
                      size={24} 
                      color={colors.white} 
                    />
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={[styles.transactionDescription, localStyles.transactionDescriptionEmphasis]}>
                      {transaction.description}
                    </Text>
                    <Text style={[styles.transactionCategory, localStyles.transactionCategoryEmphasis]}>
                      {transaction.bank} • {new Date(transaction.date).toLocaleDateString()}
                    </Text>
                    <Text style={[styles.transactionDate, localStyles.transactionDateEmphasis]}>
                      Account: {transaction.accountNumber}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.transactionAmount, localStyles.transactionAmountEmphasis]}>
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
                <Text style={[styles.exampleText, localStyles.exampleMuted]}>
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
                style={localStyles.actionPrimary}
              >
                <View style={localStyles.actionRow}>
                  <CustomIcon name="add" size={20} color={colors.white} />
                  <Text style={[styles.gradientButtonText, localStyles.actionLabel]}>
                    Add Transaction
                  </Text>
                </View>
              </GradientButton>
              
              <AnimatedButton
                style={[
                  styles.addButton,
                  localStyles.addButtonMuted
                ]}
                onPress={onCancel}
              >
                <CustomIcon name="close" size={20} color={colors.gray} />
                <Text style={[styles.addButtonText, localStyles.addButtonMutedText]}>
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
