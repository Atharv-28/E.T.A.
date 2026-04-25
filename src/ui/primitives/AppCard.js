import React from 'react';
import { View } from 'react-native';
import { palette, radius, shadows, spacing } from '../theme/tokens';

export default function AppCard({ children, style, padded = true }) {
  return (
    <View
      style={[
        {
          backgroundColor: palette.surface,
          borderRadius: radius.xl,
          borderWidth: 1,
          borderColor: palette.border,
          padding: padded ? spacing.xl : 0,
        },
        shadows.card,
        style,
      ]}
    >
      {children}
    </View>
  );
}
