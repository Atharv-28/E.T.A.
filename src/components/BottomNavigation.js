import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import CustomIcon from './CustomIcon';
import { styles, colors } from '../styles/GlobalStyles';

function BottomNavigation({ activeTab, setActiveTab }) {
  const navItems = [
    { key: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { key: 'transactions', icon: 'account-balance-wallet', label: 'Transactions' },
    { key: 'reports', icon: 'trending-up', label: 'Reports' },
    { key: 'accounts', icon: 'people', label: 'Accounts' },
  ];

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item, index) => (
        <TouchableOpacity
          key={item.key}
          style={[
            styles.navItem, 
            activeTab === item.key && styles.activeNavItem
          ]}
          onPress={() => setActiveTab(item.key)}
          activeOpacity={0.7}
        >
          <CustomIcon 
            name={item.icon} 
            size={22} 
            color={activeTab === item.key ? colors.primary : colors.gray} 
          />
          <Text style={[
            styles.navText, 
            activeTab === item.key && styles.activeNavText
          ]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default BottomNavigation;
