import React from 'react';
import { AppCard, AppIcon, AppProgressBar, AppText, AppView, palette, spacing, sizing, radius } from '../../../ui';
import { formatCurrency } from '../../../utils/currency';

export default function CategorySpendCard({ icon, name, subtitle, amount, progress = 0, tone = 'primary' }) {
  const color =
    tone === 'danger' ? palette.danger : tone === 'success' ? palette.success : palette.primary;

  return (
    <AppCard style={{ marginBottom: spacing.md }}>
      <AppView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <AppView style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <AppView
            style={{
              width: sizing.card.tile,
              height: sizing.card.tile,
              borderRadius: radius.lg,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: spacing.md,
              backgroundColor: `${color}1A`,
            }}
          >
            <AppIcon name={icon} size={sizing.icon.md} color={color} />
          </AppView>
          <AppView style={{ flex: 1 }}>
            <AppText variant="h4">{name}</AppText>
            <AppText variant="body" color={palette.textSecondary}>
              {subtitle}
            </AppText>
          </AppView>
        </AppView>
        <AppText variant="h4">{formatCurrency(amount)}</AppText>
      </AppView>
      <AppProgressBar value={progress} color={color} style={{ marginTop: spacing.md }} />
    </AppCard>
  );
}
