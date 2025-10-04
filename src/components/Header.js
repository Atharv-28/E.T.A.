import React from 'react';
import { View, Text } from 'react-native';
import { useAccounts } from '../context/AccountContext';
import CustomIcon from './CustomIcon';
import { styles } from '../styles/GlobalStyles';

function Header({ title = 'ETA' }) {
  const { activeAccount } = useAccounts();

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      {activeAccount && (
        <View style={styles.headerAccount}>
          <CustomIcon name={activeAccount.icon} size={16} color="#ffffff" />
          <Text style={styles.headerAccountText}>{activeAccount.name}</Text>
        </View>
      )}
    </View>
  );
}

export default Header;
