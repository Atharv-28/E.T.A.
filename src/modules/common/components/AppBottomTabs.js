import React from 'react';
import { TouchableOpacity } from 'react-native';
import { AppIcon, AppText, AppView, palette, spacing, radius, shadows, sizing, borderWidth } from '../../../ui';

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
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingHorizontal: spacing.md,
          paddingTop: sizing.nav.barPaddingTop,
          paddingBottom: sizing.nav.barPaddingBottom,
          backgroundColor: palette.surface,
          borderTopWidth: borderWidth.sm,
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
            style={{ alignItems: 'center', width: sizing.nav.itemWidth, gap: spacing.xs }}
          >
            <AppView
              style={{
                width: sizing.nav.capsuleWidth,
                height: sizing.nav.capsuleHeight,
                borderRadius: radius.lg,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: active ? '#EEF4FF' : 'transparent',
              }}
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
