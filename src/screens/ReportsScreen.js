import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { styles } from '../styles/GlobalStyles';

function ReportsScreen() {
  return (
    <ScrollView style={styles.screen}>
      <Text style={styles.screenTitle}>Reports</Text>
      
      {/* Reports Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Reports</Text>
        <Text style={styles.placeholder}>Analytics & reports coming in Phase 4!</Text>
      </View>
    </ScrollView>
  );
}

export default ReportsScreen;
