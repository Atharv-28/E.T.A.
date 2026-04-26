import React from 'react';
import { useAccounts } from '../../../context/AccountContext';
import { AppText, AppIcon, AppCard, AppView, palette, spacing, borderWidth, sizing, radius } from '../../../ui';

export default function AppHeaderBar({ title = 'E.T.A.' }) {
  const { activeAccount } = useAccounts();

  return (
    <AppView
      style={{
        backgroundColor: palette.surface,
        borderBottomWidth: borderWidth.sm,
        borderBottomColor: '#EDF1FA',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
        paddingTop: spacing.sm,
      }}
    >
      <AppView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <AppView style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <AppCard
            padded={false}
            style={{
              width: sizing.avatar.sm,
              height: sizing.avatar.sm,
              borderRadius: radius.full,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0A1A2F',
              borderWidth: borderWidth.none,
            }}
          >
            <AppIcon name={(activeAccount && activeAccount.icon) || 'account-balance'} size={sizing.icon.md} color="#7EE6DD" />
          </AppCard>
          <AppView>
            <AppText variant="h4">{title}</AppText>
            {activeAccount ? (
              <AppText variant="caption" color={palette.textSecondary}>
                {activeAccount.name}
              </AppText>
            ) : null}
          </AppView>
        </AppView>
        <AppIcon name="notifications-none" size={sizing.icon.lg} color={palette.textMuted} />
      </AppView>
    </AppView>
  );
}
