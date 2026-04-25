import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import AppText from './AppText';
import { palette, radius, spacing, shadows } from '../theme/tokens';

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  style,
  textStyle,
  disabled = false,
}) {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.86}
      style={[
        {
          minHeight: 46,
          borderRadius: radius.lg,
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.md,
          backgroundColor: isPrimary ? palette.primary : isGhost ? 'transparent' : palette.primarySoft,
          borderWidth: isGhost ? 1 : 0,
          borderColor: isGhost ? palette.border : 'transparent',
          opacity: disabled ? 0.5 : 1,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: spacing.sm,
        },
        isPrimary ? shadows.card : null,
        style,
      ]}
    >
      {icon ? <View>{icon}</View> : null}
      <AppText
        variant="bodyBold"
        color={isPrimary ? palette.surface : palette.textPrimary}
        style={textStyle}
      >
        {title}
      </AppText>
    </TouchableOpacity>
  );
}
