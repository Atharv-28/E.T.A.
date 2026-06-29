import React from 'react';
import { TouchableOpacity } from 'react-native';
import { palette } from '../theme/tokens';
import AppText from './AppText';
import AppView from './AppView';
import { styles } from './AppChipTabs.styles';

export default function AppChipTabs({ tabs, value, onChange, style }) {
  return (
    <AppView
      style={[
        styles.container,
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
            style={[
              styles.tabButton,
              active ? styles.tabButtonActive : styles.tabButtonInactive,
            ]}
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
