import { StyleSheet } from 'react-native';
import { borderWidth, palette, radius, shadows, spacing } from '../theme/tokens';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.xl,
    borderWidth: borderWidth.sm,
    borderColor: palette.border,
  },
  padded: {
    padding: spacing.xl,
  },
  unpadded: {
    padding: 0,
  },
  shadow: shadows.card,
});
