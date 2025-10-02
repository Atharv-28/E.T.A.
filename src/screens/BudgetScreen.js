import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { styles } from '../styles/GlobalStyles';

function BudgetScreen() {
  return (
    <ScrollView style={styles.screen}>
      <Text style={styles.screenTitle}>Budget</Text>
      
      {/* Budget Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monthly Budget</Text>
        <Text style={styles.placeholder}>Budget planning coming in Phase 3!</Text>
      </View>
    </ScrollView>
  );
}

export default BudgetScreen;
