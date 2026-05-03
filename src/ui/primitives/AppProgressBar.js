import React from 'react';
import AppView from './AppView';
import { palette, radius, spacing } from '../theme/tokens';

export default function AppProgressBar({ value = 0, color = palette.primary, height = spacing.sm, style }) {
  const normalized = Math.max(0, Math.min(100, value));

  return (
    <AppView
      style={[
        {
          height,
          borderRadius: radius.pill,
          backgroundColor: '#E5EBF8',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <AppView
        style={{
          width: `${normalized}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: radius.pill,
        }}
      />
    </AppView>
  );
}
