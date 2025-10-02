import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/GlobalStyles';

function Header({ title = 'Personal Finance Manager' }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
}

export default Header;
