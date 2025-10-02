import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../styles/GlobalStyles';

function BottomNavigation({ activeTab, setActiveTab }) {
  const navItems = [
    { key: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { key: 'transactions', icon: 'account-balance-wallet', label: 'Transactions' },
    { key: 'budget', icon: 'assignment', label: 'Budget' },
    { key: 'reports', icon: 'trending-up', label: 'Reports' },
  ];

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={[styles.navItem, activeTab === item.key && styles.activeNavItem]}
          onPress={() => setActiveTab(item.key)}
        >
          <Icon 
            name={item.icon} 
            size={20} 
            color={activeTab === item.key ? '#2c3e50' : '#7f8c8d'} 
          />
          <Text style={[styles.navText, activeTab === item.key && styles.activeNavText]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default BottomNavigation;
