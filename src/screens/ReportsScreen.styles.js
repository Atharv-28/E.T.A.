import { StyleSheet } from 'react-native';
import { borderWidth, palette, radius, spacing, sizing } from '../ui';

export const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthSelectorTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  monthSelectorIconWrap: {
    marginTop: 2,
  },
  monthPickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.28)',
    justifyContent: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: 96,
  },
  monthPickerPanel: {
    backgroundColor: palette.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    maxHeight: 360,
    ...{
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 18,
      elevation: 8,
    },
  },
  monthPickerTitle: {
    marginBottom: spacing.md,
  },
  monthOption: {
    minHeight: sizing.control.button,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  monthOptionSelected: {
    backgroundColor: palette.primarySoft,
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
    transform: [{ translateY: -14 }],
    alignItems: 'flex-end',
    pointerEvents: 'none',
  },
  categoryLegend: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  legendItem: {
    width: '48%',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendValue: {
    // marginTop: spacing.xs,
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
