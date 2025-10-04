import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import CustomIcon from './CustomIcon';
import { AnimatedButton, ScaleInView } from './AnimatedComponents';
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
        <ScaleInView key={item.key} delay={index * 100}>
          <AnimatedButton
            style={[
              styles.navItem, 
              activeTab === item.key && styles.activeNavItem
            ]}
            onPress={() => setActiveTab(item.key)}
            bounceScale={0.9}
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
          </AnimatedButton>
        </ScaleInView>
      ))}
    </View>
  );
}

export default BottomNavigation;
