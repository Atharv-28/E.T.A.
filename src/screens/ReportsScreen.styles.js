import { StyleSheet } from 'react-native';
import { borderWidth, palette, spacing } from '../ui';

export const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  donutWrap: {
    alignItems: 'center',
  },
  donutOverlay: {
    marginTop: -180,
    alignItems: 'center',
  },
  statRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: palette.primaryTint,
    borderWidth: borderWidth.none,
  },
  statValue: {
    marginTop: spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optimizeCard: {
    backgroundColor: palette.primary,
    borderWidth: borderWidth.none,
  },
  optimizeText: {
    marginTop: spacing.sm,
  },
  trendTitle: {
    marginBottom: spacing.md,
  },
});
