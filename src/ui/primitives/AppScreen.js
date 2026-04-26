import React from 'react';
import { ScrollView } from 'react-native';
import { palette, layout } from '../theme/tokens';
import AppView from './AppView';

export function AppScreen({ children, padded = true, style }) {
  return (
    <AppView style={[{ flex: 1, backgroundColor: palette.background, paddingHorizontal: padded ? layout.screenHorizontal : 0 }, style]}>
      {children}
    </AppView>
  );
}

export function AppScrollScreen({ children, contentStyle }) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: palette.background }}
      contentContainerStyle={[
        {
          padding: layout.screenHorizontal,
          paddingBottom: layout.screenBottomInset,
          gap: layout.sectionGap,
        },
        contentStyle,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}
