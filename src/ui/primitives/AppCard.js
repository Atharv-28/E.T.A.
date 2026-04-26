import React from 'react';
import AppView from './AppView';
import { palette, radius, shadows, spacing, borderWidth } from '../theme/tokens';

export default function AppCard({ children, style, padded = true }) {
  return (
    <AppView
      style={[
        {
          backgroundColor: palette.surface,
          borderRadius: radius.xl,
          borderWidth: borderWidth.sm,
          borderColor: palette.border,
          padding: padded ? spacing.xl : 0,
        },
        shadows.card,
        style,
      ]}
    >
      {children}
    </AppView>
  );
}
