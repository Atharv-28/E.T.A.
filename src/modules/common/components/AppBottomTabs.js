import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppIcon, AppText, palette, spacing, radius, shadows } from '../../../ui';

const tabItems = [
  { key: 'dashboard', label: 'Overview', icon: 'grid-view' },
  { key: 'transactions', label: 'Activity', icon: 'receipt-long' },
  { key: 'reports', label: 'Reports', icon: 'bar-chart' },
  { key: 'accounts', label: 'Vault', icon: 'account-balance' },
];

export default function AppBottomTabs({ activeTab, setActiveTab }) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingHorizontal: spacing.md,
          paddingTop: spacing.sm,
          paddingBottom: spacing.lg,
          backgroundColor: palette.surface,
          borderTopWidth: 1,
          borderTopColor: '#EEF2FB',
          borderTopLeftRadius: radius.xl,
          borderTopRightRadius: radius.xl,
        },
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
            style={{ alignItems: 'center', width: 74, gap: 4 }}
          >
            <View
              style={{
                width: 48,
                height: 40,
                borderRadius: radius.lg,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: active ? '#EEF4FF' : 'transparent',
              }}
            >
              <AppIcon
                name={item.icon}
                size={21}
                color={active ? palette.primary : '#94A3B8'}
              />
            </View>
            <AppText variant="caption" color={active ? palette.primary : '#94A3B8'}>
              {item.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
