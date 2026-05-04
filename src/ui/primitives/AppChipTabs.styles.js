import { StyleSheet } from 'react-native';
import { palette, radius, spacing, sizing } from '../theme/tokens';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E9EEFA',
    borderRadius: radius.pill,
    padding: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tabButton: {
    flex: 1,
    minHeight: sizing.control.chip,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: palette.surface,
  },
  tabButtonInactive: {
    backgroundColor: 'transparent',
  },
});
