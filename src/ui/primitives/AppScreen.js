import React from 'react';
import { ScrollView, View } from 'react-native';
import { palette, spacing } from '../theme/tokens';

export function AppScreen({ children, padded = true, style }) {
  return (
    <View style={[{ flex: 1, backgroundColor: palette.background, paddingHorizontal: padded ? spacing.lg : 0 }, style]}>
      {children}
    </View>
  );
}

export function AppScrollScreen({ children, contentStyle }) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: palette.background }}
      contentContainerStyle={[{ padding: spacing.lg, paddingBottom: 110, gap: spacing.lg }, contentStyle]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}
