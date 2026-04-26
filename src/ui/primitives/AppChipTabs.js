import React from 'react';
import { TouchableOpacity } from 'react-native';
import { palette, radius, spacing, sizing } from '../theme/tokens';
import AppText from './AppText';
import AppView from './AppView';

export default function AppChipTabs({ tabs, value, onChange, style }) {
  return (
    <AppView
      style={[
        {
          backgroundColor: '#E9EEFA',
          borderRadius: radius.pill,
          padding: spacing.xs,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
        },
        style,
      ]}
    >
      {tabs.map((tab) => {
        const active = value === tab.value;
        return (
          <TouchableOpacity
            key={tab.value}
            onPress={() => onChange(tab.value)}
            activeOpacity={0.85}
            style={{
              flex: 1,
              minHeight: sizing.control.chip,
              borderRadius: radius.pill,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: active ? palette.surface : 'transparent',
            }}
          >
            <AppText variant="bodyBold" color={active ? palette.primary : palette.textPrimary}>
              {tab.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </AppView>
  );
}
