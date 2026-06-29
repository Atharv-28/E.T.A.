import { StyleSheet } from 'react-native';
import { borderWidth, opacity, palette, radius, shadows, sizing, spacing } from '../theme/tokens';

export const styles = StyleSheet.create({
  container: {
    minHeight: sizing.control.button,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  primaryShadow: shadows.card,
});

export const getButtonToneStyle = ({ isPrimary, isGhost, disabled }) => ({
  backgroundColor: isPrimary ? palette.primary : isGhost ? 'transparent' : palette.primarySoft,
  borderWidth: isGhost ? borderWidth.sm : borderWidth.none,
  borderColor: isGhost ? palette.border : 'transparent',
  opacity: disabled ? opacity.disabled : opacity.solid,
});
