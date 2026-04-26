import React from 'react';
import { AppCard, AppText, AppIcon, AppView, palette, spacing, sizing, radius } from '../../../ui';
import { formatCurrency } from '../../../utils/currency';

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
    <AppCard style={{ marginBottom: spacing.md }}>
      <AppView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <AppView style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <AppView
            style={{
              width: sizing.control.input + spacing.xxs,
              height: sizing.control.input + spacing.xxs,
              borderRadius: radius.lg,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: income ? '#DFF6F2' : '#FDECEF',
              marginRight: spacing.md,
            }}
          >
            <AppIcon name={icon} size={sizing.icon.lg} color={income ? palette.success : palette.danger} />
          </AppView>
          <AppView style={{ flex: 1, paddingRight: spacing.sm }}>
            <AppText variant="h4" numberOfLines={1}>
              {title}
            </AppText>
            <AppText variant="body" color={palette.textSecondary} numberOfLines={1}>
              {subtitle}
            </AppText>
          </AppView>
        </AppView>
        <AppView style={{ alignItems: 'flex-end', minWidth: sizing.card.transactionMetaWidth }}>
          <AppText variant="h4" color={income ? palette.success : palette.danger}>
            {income ? '+' : '-'}{formatCurrency(amount)}
          </AppText>
          <AppText variant="body" color={palette.textSecondary}>
            {dateLabel}
          </AppText>
          {onRight}
        </AppView>
      </AppView>
    </AppCard>
  );
}
