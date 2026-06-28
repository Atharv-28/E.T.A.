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
    justifyContent: 'center',
    minHeight: 320,
    position: 'relative',
  },
  donutOverlay: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    transform: [{ translateY: -34 }],
    alignItems: 'center',
    pointerEvents: 'none',
  },
  categoryLegend: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  legendItem: {
    backgroundColor: palette.primaryTint,
    borderWidth: borderWidth.none,
    paddingVertical: spacing.sm,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
  },
  legendTextWrap: {
    flex: 1,
  },
  legendValue: {
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
