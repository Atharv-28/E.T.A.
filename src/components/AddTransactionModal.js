import React, { useState } from 'react';
import {
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { CATEGORIES } from '../context/TransactionContext';
import { useAccounts } from '../context/AccountContext';
import {
  AppButton,
  AppCard,
  AppChipTabs,
  AppIcon,
  AppInput,
  AppText,
  AppView,
  borderWidth,
  layout,
  palette,
  radius,
  spacing,
  type as typeScale,
} from '../ui';

function AddTransactionModal({ visible, onClose, onAddTransaction }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { activeAccount } = useAccounts();

  const resetForm = () => {
    setType('expense');
    setAmount('');
    setDescription('');
    setSelectedCategory('');
  };

  const handleSubmit = () => {
    if (!amount || !description || !selectedCategory) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    onAddTransaction({
      type,
      amount: numericAmount,
      description,
      category: selectedCategory,
      accountId: activeAccount?.id,
    });

    resetForm();
    onClose();
  };

  const currentCategories = CATEGORIES[type.toUpperCase()];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <AppView style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(8,14,28,0.34)' }}>
        <AppView
          style={{
            maxHeight: '86%',
            backgroundColor: palette.surface,
            borderTopLeftRadius: layout.modalSheetRadius,
            borderTopRightRadius: layout.modalSheetRadius,
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.xl,
            paddingBottom: spacing.xxl,
          }}
        >
          <AppView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={onClose}>
              <AppIcon name="close" size={22} color={palette.textPrimary} />
            </TouchableOpacity>
            <AppText variant="h3">Add Transaction</AppText>
            <TouchableOpacity onPress={handleSubmit}>
              <AppText variant="button" color={palette.primary}>Save</AppText>
            </TouchableOpacity>
          </AppView>

          <ScrollView style={{ marginTop: spacing.lg }} showsVerticalScrollIndicator={false}>
            <AppCard>
              <AppText variant="label" color={palette.textSecondary}>Transaction Type</AppText>
              <AppChipTabs
                value={type}
                onChange={(nextType) => {
                  setType(nextType);
                  setSelectedCategory('');
                }}
                tabs={[
                  { label: 'Income', value: 'income' },
                  { label: 'Expense', value: 'expense' },
                ]}
                style={{ marginTop: spacing.sm }}
              />
            </AppCard>

            <AppCard style={{ marginTop: spacing.md }}>
              <AppInput
                label="Amount"
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="numeric"
                leftIcon="currency-rupee"
              />

              <AppInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description"
                style={{ marginTop: spacing.md }}
                leftIcon="edit"
              />
            </AppCard>

            <AppCard style={{ marginTop: spacing.md }}>
              <AppText variant="label" color={palette.textSecondary}>Category</AppText>
              <AppView style={{ marginTop: spacing.sm, gap: spacing.sm }}>
                {currentCategories.map((category) => {
                  const selected = selectedCategory === category.id;
                  return (
                    <TouchableOpacity
                      key={category.id}
                      onPress={() => setSelectedCategory(category.id)}
                      activeOpacity={0.86}
                      style={{
                        width: '100%',
                        borderRadius: radius.lg,
                        borderWidth: borderWidth.sm,
                        borderColor: selected ? palette.primary : palette.border,
                        backgroundColor: selected ? palette.primarySoft : palette.surface,
                        paddingVertical: spacing.md,
                        paddingHorizontal: spacing.md,
                      }}
                    >
                      <AppView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <AppView style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 }}>
                          <AppIcon name={category.icon} size={20} color={selected ? palette.primary : palette.textPrimary} />
                          <AppText
                            variant="body"
                            color={selected ? palette.primaryDark : palette.textPrimary}
                            style={{ fontSize: typeScale.body.fontSize }}
                          >
                            {category.name}
                          </AppText>
                        </AppView>
                        {selected ? <AppIcon name="check-circle" size={18} color={palette.primary} /> : null}
                      </AppView>
                    </TouchableOpacity>
                  );
                })}
              </AppView>
            </AppCard>

            <AppView style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg, marginBottom: spacing.md }}>
              <AppButton title="Cancel" variant="ghost" onPress={onClose} style={{ flex: 1 }} />
              <AppButton title="Save" onPress={handleSubmit} style={{ flex: 1 }} />
            </AppView>
          </ScrollView>
        </AppView>
      </AppView>
    </Modal>
  );
}

export default AddTransactionModal;
