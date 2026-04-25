import React from 'react';
import { View } from 'react-native';
import { useAccounts } from '../../../context/AccountContext';
import { AppText, AppIcon, AppCard, palette, spacing } from '../../../ui';

export default function AppHeaderBar({ title = 'Financier' }) {
  const { activeAccount } = useAccounts();

  return (
    <View
      style={{
        backgroundColor: palette.surface,
        borderBottomWidth: 1,
        borderBottomColor: '#EDF1FA',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
        paddingTop: spacing.sm,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <AppCard
            padded={false}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0A1A2F',
              borderWidth: 0,
            }}
          >
            <AppIcon name={(activeAccount && activeAccount.icon) || 'account-balance'} size={20} color="#7EE6DD" />
          </AppCard>
          <View>
            <AppText variant="h4">{title}</AppText>
            {activeAccount ? (
              <AppText variant="caption" color={palette.textSecondary}>
                {activeAccount.name}
              </AppText>
            ) : null}
          </View>
        </View>
        <AppIcon name="notifications-none" size={24} color={palette.textMuted} />
      </View>
    </View>
  );
}
