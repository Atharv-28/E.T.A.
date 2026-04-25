import React from 'react';
import { View } from 'react-native';
import { palette, radius } from '../theme/tokens';

export default function AppProgressBar({ value = 0, color = palette.primary, height = 8, style }) {
  const normalized = Math.max(0, Math.min(100, value));

  return (
    <View
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
      <View
        style={{
          width: `${normalized}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: radius.pill,
        }}
      />
    </View>
  );
}
