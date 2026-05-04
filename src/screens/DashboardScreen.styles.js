import { StyleSheet } from 'react-native';
import { borderWidth, layout, opacity, palette, radius, sizing, spacing } from '../ui';

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
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  savingsText: {
    flex: 1,
  },
  savingsValue: {
    marginTop: spacing.sm,
  },
  savingsIcon: {
    width: sizing.avatar.xl,
    height: sizing.avatar.xl,
    borderRadius: radius.full,
    backgroundColor: '#DCE6FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress: {
    marginTop: spacing.lg,
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: layout.screenBottomInset - spacing.sm,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(9,14,28,0.35)',
  },
  modalSheet: {
    backgroundColor: palette.surface,
    borderTopLeftRadius: layout.modalSheetRadius,
    borderTopRightRadius: layout.modalSheetRadius,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
  },
});
