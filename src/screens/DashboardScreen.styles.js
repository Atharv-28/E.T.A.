import { StyleSheet } from 'react-native';
import { borderWidth, opacity, palette, radius, sizing, spacing } from '../ui';

export const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: palette.primary,
    borderWidth: borderWidth.none,
    borderRadius: radius.xxl + spacing.sm,
    padding: spacing.xxl,
  },
  heroLabel: {
    letterSpacing: 2,
  },
  heroBalance: {
    marginTop: spacing.sm,
  },
  heroRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  heroBox: {
    flex: 1,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(255,255,255,0.14)',
    padding: spacing.lg,
  },
  heroBoxAmount: {
    marginTop: spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  categoryBarTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    height: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: '#E5EBF8',
    overflow: 'hidden',
  },
  categoryBarSegment: {
    height: '100%',
  },
  categoryLegend: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  categoryLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryLegendDot: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: radius.full,
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: sizing.nav.barPaddingBottom + spacing.sm,
    width: sizing.control.fab,
    height: sizing.control.fab,
    borderRadius: radius.full,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 9,
    shadowColor: '#0F172A',
    shadowOffset: { width: spacing.none, height: sizing.card.modalFabOffset },
    shadowOpacity: opacity.lg,
    shadowRadius: 14,
  },
});
