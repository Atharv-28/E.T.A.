import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import CustomIcon from './CustomIcon';
import { CATEGORIES } from '../context/TransactionContext';
import { styles } from '../styles/GlobalStyles';

function AddTransactionModal({ visible, onClose, onAddTransaction }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

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
    });

    resetForm();
    onClose();
  };

  const currentCategories = CATEGORIES[type.toUpperCase()];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <CustomIcon name="close" size={24} color="#2c3e50" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add Transaction</Text>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Transaction Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Transaction Type</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'income' && styles.activeTypeButton,
                ]}
                onPress={() => {
                  setType('income');
                  setSelectedCategory('');
                }}
              >
                <CustomIcon 
                  name="add" 
                  size={20} 
                  color={type === 'income' ? '#ffffff' : '#27ae60'} 
                />
                <Text style={[
                  styles.typeButtonText,
                  type === 'income' && styles.activeTypeButtonText,
                ]}>
                  Income
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'expense' && styles.activeTypeButton,
                ]}
                onPress={() => {
                  setType('expense');
                  setSelectedCategory('');
                }}
              >
                <CustomIcon 
                  name="remove" 
                  size={20} 
                  color={type === 'expense' ? '#ffffff' : '#e74c3c'} 
                />
                <Text style={[
                  styles.typeButtonText,
                  type === 'expense' && styles.activeTypeButtonText,
                ]}>
                  Expense
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Amount */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amount</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="numeric"
                placeholderTextColor="#7f8c8d"
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <TextInput
              style={styles.textInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description"
              placeholderTextColor="#7f8c8d"
            />
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.categoryGrid}>
              {currentCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    selectedCategory === category.id && styles.activeCategoryItem,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <CustomIcon
                    name={category.icon}
                    size={24}
                    color={selectedCategory === category.id ? '#ffffff' : '#2c3e50'}
                  />
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.activeCategoryText,
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default AddTransactionModal;
