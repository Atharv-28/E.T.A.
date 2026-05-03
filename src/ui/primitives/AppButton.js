import React from 'react';
import { TouchableOpacity } from 'react-native';
import AppText from './AppText';
import AppView from './AppView';
import { palette, radius, spacing, shadows, sizing, borderWidth, opacity } from '../theme/tokens';

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
          minHeight: sizing.control.button,
          borderRadius: radius.lg,
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.md,
          backgroundColor: isPrimary ? palette.primary : isGhost ? 'transparent' : palette.primarySoft,
          borderWidth: isGhost ? borderWidth.sm : borderWidth.none,
          borderColor: isGhost ? palette.border : 'transparent',
          opacity: disabled ? opacity.disabled : opacity.solid,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: spacing.sm,
        },
        isPrimary ? shadows.card : null,
        style,
      ]}
    >
        {icon ? <AppView>{icon}</AppView> : null}
      <AppText
        variant="button"
        color={isPrimary ? palette.surface : palette.textPrimary}
        style={textStyle}
      >
        {title}
      </AppText>
    </TouchableOpacity>
  );
}
