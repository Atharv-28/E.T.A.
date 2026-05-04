import React, { useState } from 'react';
import {
  Modal,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CATEGORIES } from '../context/TransactionContext';
import { useAccounts } from '../context/AccountContext';
import { styles } from './AddTransactionModal.styles';
import {
  AppButton,
  AppCard,
  AppChipTabs,
  AppIcon,
  AppInput,
  AppSnackbar,
  AppText,
  AppView,
  palette,
} from '../ui';

function AddTransactionModal({ visible, onClose, onAddTransaction }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [dateOverride, setDateOverride] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', variant: 'error', icon: 'warning' });
  const { activeAccount } = useAccounts();

  const formatDateInput = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const pickerDate = (() => {
    if (!dateOverride.trim()) return new Date();
    const parsed = new Date(`${dateOverride.trim()}T12:00:00`);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  })();

  const onPickDate = (_event, pickedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (!pickedDate) return;
    setDateOverride(formatDateInput(pickedDate));
  };

  const resetForm = () => {
    setType('expense');
    setAmount('');
    setDescription('');
    setDateOverride('');
    setShowDatePicker(false);
    setSelectedCategory('');
  };

  const showSnackbar = (message, variant = 'error', icon = 'warning') => {
    setSnackbar({ visible: true, message, variant, icon });
  };

  const handleSubmit = () => {
    if (!amount.trim()) {
      showSnackbar('Please enter an amount.', 'error', 'warning');
      return;
    }

    if (!selectedCategory) {
      showSnackbar('Please select a category.', 'error', 'warning');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      showSnackbar('Please enter a valid amount.', 'error', 'warning');
      return;
    }

    let resolvedDate = new Date().toISOString();
    if (dateOverride.trim()) {
      const trimmed = dateOverride.trim();
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(trimmed)) {
        showSnackbar('Use YYYY-MM-DD format for date override.', 'warning', 'warning');
        return;
      }

      const parsedDate = new Date(`${trimmed}T12:00:00`);
      if (Number.isNaN(parsedDate.getTime())) {
        showSnackbar('Please enter a valid calendar date.', 'warning', 'warning');
        return;
      }
      resolvedDate = parsedDate.toISOString();
    }

    const resolvedDescription = description.trim() || 'Manual entry';

    onAddTransaction({
      type,
      amount: numericAmount,
      description: resolvedDescription,
      category: selectedCategory,
      accountId: activeAccount?.id,
      date: resolvedDate,
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
      <AppView style={styles.overlay}>
        <AppView
          style={styles.sheet}
        >
          <AppSnackbar
            visible={snackbar.visible}
            message={snackbar.message}
            variant={snackbar.variant}
            icon={snackbar.icon}
            onDismiss={() => setSnackbar((prev) => ({ ...prev, visible: false }))}
            style={styles.snackbar}
          />

          <AppView style={styles.headerRow}>
            <TouchableOpacity onPress={onClose}>
              <AppIcon name="close" size={22} color={palette.textPrimary} />
            </TouchableOpacity>
            <AppText variant="h3">Add Transaction</AppText>
            <TouchableOpacity onPress={handleSubmit}>
              <AppText variant="button" color={palette.primary}>Save</AppText>
            </TouchableOpacity>
          </AppView>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
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
                style={styles.chipTabs}
              />
            </AppCard>

            <AppCard style={styles.cardSpacing}>
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
                placeholder="Manual entry (optional)"
                style={styles.inputSpacing}
                leftIcon="edit"
              />

              <AppInput
                label="Date Override (Optional)"
                value={dateOverride}
                onChangeText={setDateOverride}
                placeholder="YYYY-MM-DD"
                style={styles.inputSpacing}
                leftIcon="event"
              />

              <AppButton
                title="Pick Date"
                variant="ghost"
                onPress={() => setShowDatePicker(true)}
                style={styles.pickDate}
              />

              {showDatePicker ? (
                <DateTimePicker
                  value={pickerDate}
                  mode="date"
                  display="default"
                  onChange={onPickDate}
                  maximumDate={new Date()}
                />
              ) : null}

              <AppText variant="caption" color={palette.textSecondary} style={styles.caption}>
                Use this for adding older debit/expense entries.
              </AppText>
            </AppCard>

            <AppCard style={styles.cardSpacing}>
              <AppText variant="label" color={palette.textSecondary}>Category</AppText>
              <AppView style={styles.categoryList}>
                {currentCategories.map((category) => {
                  const selected = selectedCategory === category.id;
                  return (
                    <TouchableOpacity
                      key={category.id}
                      onPress={() => setSelectedCategory(category.id)}
                      activeOpacity={0.86}
                      style={[
                        styles.categoryOption,
                        selected ? styles.categoryOptionSelected : styles.categoryOptionDefault,
                      ]}
                    >
                      <AppView style={styles.categoryRow}>
                        <AppView style={styles.categoryRowContent}>
                          <AppIcon name={category.icon} size={20} color={selected ? palette.primary : palette.textPrimary} />
                          <AppText
                            variant="body"
                            color={selected ? palette.primaryDark : palette.textPrimary}
                            style={styles.categoryLabel}
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

            <AppView style={styles.footerRow}>
              <AppButton title="Cancel" variant="ghost" onPress={onClose} style={styles.footerButton} />
              <AppButton title="Save" onPress={handleSubmit} style={styles.footerButton} />
            </AppView>
          </ScrollView>
        </AppView>
      </AppView>
    </Modal>
  );
}

export default AddTransactionModal;
