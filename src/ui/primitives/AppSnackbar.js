import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import AppIcon from './AppIcon';
import AppText from './AppText';
import AppView from './AppView';
import { palette, radius, shadows, spacing, sizing } from '../theme/tokens';

const variantConfig = {
  success: { background: palette.success, icon: 'check-circle' },
  error: { background: palette.danger, icon: 'warning' },
  warning: { background: palette.warning, icon: 'warning' },
};

export default function AppSnackbar({
  visible,
  message,
  icon,
  variant = 'success',
  duration = 2200,
  onDismiss,
  style,
}) {
  const tone = variantConfig[variant] || variantConfig.success;
  const opacity = useRef(new Animated.Value(0)).current;
  const dismissTimer = useRef(null);

  useEffect(() => {
    if (!visible) {
      opacity.setValue(0);
      if (dismissTimer.current) {
        clearTimeout(dismissTimer.current);
      }
      return undefined;
    }

    Animated.timing(opacity, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();

    dismissTimer.current = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(() => {
        if (onDismiss) onDismiss();
      });
    }, duration);

    return () => {
      if (dismissTimer.current) {
        clearTimeout(dismissTimer.current);
      }
    };
  }, [visible, duration, onDismiss, opacity]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        {
          backgroundColor: tone.background,
          borderRadius: radius.lg,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          opacity,
          ...shadows.floating,
          zIndex: 9999,
        },
        style,
      ]}
    >
      <AppIcon name={icon || tone.icon} size={sizing.icon.md} color={palette.surface} />
      <AppText variant="bodyBold" color={palette.surface} style={{ flex: 1 }}>
        {message}
      </AppText>
    </Animated.View>
  );
}
