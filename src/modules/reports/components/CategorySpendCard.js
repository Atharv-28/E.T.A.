import React from 'react';
import { AppCard, AppIcon, AppProgressBar, AppText, AppView, palette, sizing } from '../../../ui';
import { formatCurrency } from '../../../utils/currency';
import { styles, getIconTileStyle } from './CategorySpendCard.styles';

export default function CategorySpendCard({ icon, name, subtitle, amount, progress = 0, tone = 'primary' }) {
  const color =
    tone === 'danger' ? palette.danger : tone === 'success' ? palette.success : palette.primary;

  return (
    <AppCard style={styles.card}>
      <AppView style={styles.row}>
        <AppView style={styles.rowLeft}>
          <AppView style={[styles.iconTile, getIconTileStyle(color)]}>
            <AppIcon name={icon} size={sizing.icon.md} color={color} />
          </AppView>
          <AppView style={styles.textCol}>
            <AppText variant="h4">{name}</AppText>
            <AppText variant="body" color={palette.textSecondary}>
              {subtitle}
            </AppText>
          </AppView>
        </AppView>
        <AppText variant="h4">{formatCurrency(amount)}</AppText>
      </AppView>
      <AppProgressBar value={progress} color={color} style={styles.progress} />
    </AppCard>
  );
}
