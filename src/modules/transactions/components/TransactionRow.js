import React from 'react';
import { AppCard, AppText, AppIcon, AppView, palette, sizing } from '../../../ui';
import { formatCurrency } from '../../../utils/currency';
import { styles, getIconTileToneStyle } from './TransactionRow.styles';

export default function TransactionRow({
  title,
  subtitle,
  amount,
  dateLabel,
  icon,
  income,
  onRight,
}) {
  return (
    <AppCard style={styles.card}>
      <AppView style={styles.row}>
        <AppView style={styles.rowLeft}>
          <AppView style={[styles.iconTile, getIconTileToneStyle(income)]}>
            <AppIcon name={icon} size={sizing.icon.lg} color={income ? palette.success : palette.danger} />
          </AppView>
          <AppView style={styles.textCol}>
            <AppText variant="h4" numberOfLines={1}>
              {title}
            </AppText>
            <AppText variant="body" color={palette.textSecondary} numberOfLines={1}>
              {subtitle}
            </AppText>
            <AppText variant="body" color={palette.textSecondary}>
              {dateLabel}
            </AppText>
          </AppView>
        </AppView>
        <AppView style={styles.metaCol}>
          <AppText variant="h4" color={income ? palette.success : palette.danger}>
            {income ? '+' : '-'}{formatCurrency(amount)}
          </AppText>
          {onRight}
        </AppView>
      </AppView>
    </AppCard>
  );
}
