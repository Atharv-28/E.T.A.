import React from 'react';
import { TouchableOpacity } from 'react-native';
import { AppIcon, AppText, AppView, palette, shadows, sizing } from '../../../ui';
import { styles } from './AppBottomTabs.styles';

const tabItems = [
  { key: 'dashboard', label: 'Overview', icon: 'grid-view' },
  { key: 'transactions', label: 'Activity', icon: 'receipt-long' },
  { key: 'reports', label: 'Reports', icon: 'bar-chart' },
  { key: 'accounts', label: 'Vault', icon: 'account-balance' },
];

export default function AppBottomTabs({ activeTab, setActiveTab }) {
  return (
    <AppView
      style={[
        styles.bar,
        shadows.card,
      ]}
    >
      {tabItems.map((item) => {
        const active = activeTab === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            activeOpacity={0.85}
            onPress={() => setActiveTab(item.key)}
            style={styles.tabItem}
          >
            <AppView
              style={[
                styles.capsule,
                active ? styles.capsuleActive : styles.capsuleInactive,
              ]}
            >
              <AppIcon
                name={item.icon}
                size={sizing.icon.md}
                color={active ? palette.primary : '#94A3B8'}
              />
            </AppView>
            <AppText variant="caption" color={active ? palette.primary : '#94A3B8'}>
              {item.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </AppView>
  );
}
