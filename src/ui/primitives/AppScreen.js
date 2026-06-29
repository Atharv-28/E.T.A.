import React from 'react';
import { ScrollView } from 'react-native';
import AppView from './AppView';
import { styles } from './AppScreen.styles';

export function AppScreen({ children, padded = true, style }) {
  return (
    <AppView
      style={[
        styles.screen,
        padded ? styles.screenPadded : styles.screenUnpadded,
        style,
      ]}
    >
      {children}
    </AppView>
  );
}

export function AppScrollScreen({ children, contentStyle }) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.scrollContent,
        contentStyle,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}
