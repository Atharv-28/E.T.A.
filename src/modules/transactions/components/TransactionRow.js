import React from 'react';
import { View } from 'react-native';
import { AppCard, AppText, AppIcon, palette, spacing } from '../../../ui';
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
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View
            style={{
              width: 54,
              height: 54,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: income ? '#DFF6F2' : '#FDECEF',
              marginRight: spacing.md,
            }}
          >
            <AppIcon name={icon} size={22} color={income ? palette.success : palette.danger} />
          </View>
          <View style={{ flex: 1, paddingRight: spacing.sm }}>
            <AppText variant="h4" numberOfLines={1}>
              {title}
            </AppText>
            <AppText variant="body" color={palette.textSecondary} numberOfLines={1}>
              {subtitle}
            </AppText>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end', minWidth: 98 }}>
          <AppText variant="h4" color={income ? palette.success : palette.danger}>
            {income ? '+' : '-'}{formatCurrency(amount)}
          </AppText>
          <AppText variant="body" color={palette.textSecondary}>
            {dateLabel}
          </AppText>
          {onRight}
        </View>
      </View>
    </AppCard>
  );
}
