import React from 'react';
import AppView from './AppView';
import { styles } from './AppCard.styles';

export default function AppCard({ children, style, padded = true }) {
  return (
    <AppView
      style={[
        styles.card,
        padded ? styles.padded : styles.unpadded,
        styles.shadow,
        style,
      ]}
    >
      {children}
    </AppView>
  );
}
