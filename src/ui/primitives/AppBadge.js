import React from 'react';
import AppText from './AppText';
import AppView from './AppView';
import { palette, radius, spacing } from '../theme/tokens';

const toneMap = {
  info: { bg: '#E8F0FF', fg: palette.primary },
  success: { bg: '#D7F5EF', fg: palette.success },
  danger: { bg: '#FCE6EB', fg: palette.danger },
  neutral: { bg: '#EFF2F8', fg: palette.textSecondary },
};

export default function AppBadge({ label, tone = 'info', style }) {
  const toneStyle = toneMap[tone] || toneMap.info;
  return (
    <AppView
      style={[
        {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          borderRadius: radius.full,
          backgroundColor: toneStyle.bg,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <AppText variant="caption" color={toneStyle.fg}>
        {label}
      </AppText>
    </AppView>
  );
}
