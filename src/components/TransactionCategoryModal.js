import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
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
import { useAccounts } from '../context/AccountContext';

const TransactionCategoryModal = ({ 
  visible, 
  transaction, 
  onConfirm, 
  onCancel 
}) => {
  const [selectedCategory, setSelectedCategory] = useState(
    transaction?.category || 'other_expense'
  );

  const { accounts } = useAccounts();
  const [selectedAccountId, setSelectedAccountId] = useState(transaction?.accountId || null);

  if (!transaction) return null;

  const categories = transaction.type === 'income' 
    ? CATEGORIES.INCOME 
    : CATEGORIES.EXPENSE;

  const handleConfirm = () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    // If incoming SMS did not include a matched account, require user to choose one
    if (!transaction.accountId && !selectedAccountId) {
      Alert.alert('Choose Account', 'Please select an account to save this transaction under.');
      return;
    }

    const finalTransaction = {
      ...transaction,
      category: selectedCategory,
      accountId: selectedAccountId || transaction.accountId,
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
          <View style={{
            alignItems: 'center',
            marginRight: 12,
          }}>
            <View style={[
              {
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: isSelected ? colors.primary : colors.primaryLight + '30',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 4,
              }
            ]}>
              <CustomIcon 
                name={category.icon} 
                size={20} 
                color={isSelected ? colors.white : colors.primary} 
              />
            </View>
            <Text style={{
              fontSize: 8,
              color: isSelected ? colors.primary : colors.gray,
              textAlign: 'center',
              fontWeight: '500',
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
            >
              {category.name}
            </Text>
          </View>
          <Text style={[
            {
              fontSize: 16,
              fontWeight: '600',
              color: isSelected ? colors.primary : colors.black,
              flex: 1,
            }
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
          >
            {category.name}
          </Text>
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
              <Text style={[styles.sectionTitle, { color: colors.white }] }>
                📱 From SMS
              </Text>

              {/* Account selector when accountId missing */}
              {!transaction.accountId && (
                <View style={{ marginBottom: 12 }}>
                  <Text style={[styles.sectionTitle, { color: colors.white, fontSize: 14 }]}>Select Account</Text>
                  <View style={{ flexDirection: 'row', marginTop: 8, flexWrap: 'wrap' }}>
                    {accounts.length === 0 ? (
                      <Text style={{ color: colors.white }}>No accounts found. Please add an account first.</Text>
                    ) : (
                      accounts.map(acc => (
                        <TouchableOpacity
                          key={acc.id}
                          onPress={() => setSelectedAccountId(acc.id)}
                          style={{
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            borderRadius: 20,
                            marginRight: 8,
                            marginBottom: 8,
                            backgroundColor: selectedAccountId === acc.id ? colors.white : colors.white + '20'
                          }}
                        >
                          <Text style={{ color: selectedAccountId === acc.id ? colors.primary : colors.white }}>
                            {acc.name} (••{acc.accountNumber?.slice(-4)})
                          </Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                </View>
              )}


              {/* Show full SMS content (selectable) */}
              <View style={{ marginTop: 12, padding: 12, backgroundColor: colors.white + '10', borderRadius: 8 }}>
                <Text style={{ color: colors.white, fontWeight: '600', marginBottom: 6 }}>Full SMS</Text>
                <Text selectable={true} style={{ color: colors.white, opacity: 0.95, lineHeight: 20 }}>
                  {transaction.smsData?.rawSMS || transaction.rawSMS || 'No SMS content available.'}
                </Text>
              </View>
            </GradientCard>
          </SlideInView>

          {/* Category Selection */}
          <FadeInView delay={600}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                🏷️ Select Category ({transaction.type === 'income' ? 'Income' : 'Expense'})
              </Text>
              <View style={[styles.categoryGrid, { justifyContent: 'center' }]}>
                {categories.map(renderCategoryOption)}
              </View>
            </View>
          </FadeInView>

          {/* Action Buttons */}
          <ScaleInView delay={800}>
            <View style={styles.section}>
              <GradientButton
                colors={[colors.primary, colors.primaryDark]}
                style={[
                  styles.addButton, 
                  { 
                    marginBottom: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 14,
                  }
                ]}
                onPress={handleConfirm}
              >
                <CustomIcon name="add" size={20} color={colors.white} />
                <Text style={[styles.addButtonText, { color: colors.white, marginLeft: 8 }]}>Add Transaction</Text>
              </GradientButton>
              
              <AnimatedButton 
                style={[
                  styles.backupButton, 
                  { 
                    borderColor: colors.danger,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 14,
                  }
                ]}
                onPress={onCancel}
              >
                <CustomIcon name="close" size={18} color={colors.danger} />
                <Text style={[styles.backupButtonText, { color: colors.danger, marginLeft: 8 }]}>
                  Ignore SMS
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
