import { StyleSheet } from 'react-native';
import { radius, shadows, spacing } from '../theme/tokens';

export const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    zIndex: 9999,
    ...shadows.floating,
  },
  message: {
    flex: 1,
  },
});

export const getSnackbarToneStyle = (backgroundColor) => ({
  backgroundColor,
});
