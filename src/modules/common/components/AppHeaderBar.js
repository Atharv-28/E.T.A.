import React from 'react';
import { useAccounts } from '../../../context/AccountContext';
import { AppText, AppIcon, AppCard, AppView, palette, sizing } from '../../../ui';
import { styles } from './AppHeaderBar.styles';

export default function AppHeaderBar({ title = 'E.T.A.' }) {
  const { activeAccount } = useAccounts();

  return (
    <AppView
      style={styles.container}
    >
      <AppView style={styles.row}>
        <AppView style={styles.leftRow}>
          <AppCard
            padded={false}
            style={styles.iconCard}
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
