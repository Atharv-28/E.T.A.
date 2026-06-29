import React from 'react';
import AppView from './AppView';
import { palette, spacing } from '../theme/tokens';
import { styles, getTrackStyle, getFillStyle } from './AppProgressBar.styles';

export default function AppProgressBar({ value = 0, color = palette.primary, height = spacing.sm, style }) {
  const normalized = Math.max(0, Math.min(100, value));

  return (
    <AppView
      style={[
        styles.track,
        getTrackStyle(height),
        style,
      ]}
    >
      <AppView
        style={getFillStyle(normalized, color)}
      />
    </AppView>
  );
}
