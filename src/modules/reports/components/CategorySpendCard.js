import React from 'react';
import { View } from 'react-native';
import { AppCard, AppIcon, AppProgressBar, AppText, palette } from '../../../ui';
import { formatCurrency } from '../../../utils/currency';

export default function CategorySpendCard({ icon, name, subtitle, amount, progress = 0, tone = 'primary' }) {
  const color =
    tone === 'danger' ? palette.danger : tone === 'success' ? palette.success : palette.primary;

  return (
    <AppCard style={{ marginBottom: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 14,
              backgroundColor: `${color}1A`,
            }}
          >
            <AppIcon name={icon} size={20} color={color} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="h4">{name}</AppText>
            <AppText variant="body" color={palette.textSecondary}>
              {subtitle}
            </AppText>
          </View>
        </View>
        <AppText variant="h4">{formatCurrency(amount)}</AppText>
      </View>
      <AppProgressBar value={progress} color={color} style={{ marginTop: 14 }} />
    </AppCard>
  );
}
