import React from 'react';
import { Text } from 'react-native';
import { palette, type } from '../theme/tokens';

const variantStyleMap = {
  title: type.title,
  h1: type.h1,
  h2: type.h2,
  h3: type.h3,
  h4: type.h4,
  body: type.body,
  bodyBold: type.bodyBold,
  label: type.label,
  caption: type.caption,
};

export default function AppText({
  children,
  variant = 'body',
  color = palette.textPrimary,
  style,
  numberOfLines,
}) {
  return (
    <Text numberOfLines={numberOfLines} style={[variantStyleMap[variant] || type.body, { color }, style]}>
      {children}
    </Text>
  );
}
