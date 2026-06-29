import { StyleSheet } from 'react-native';
import { borderWidth, layout, palette, radius, sizing, spacing, type } from '../ui';

export const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  summaryCardIncome: {
    flex: 1,
    borderLeftWidth: borderWidth.lg,
    borderLeftColor: palette.success,
  },
  summaryCardExpense: {
    flex: 1,
    borderLeftWidth: borderWidth.lg,
    borderLeftColor: palette.danger,
  },
  summaryValue: {
    marginTop: spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  sectionLabel: {
    letterSpacing: 1,
  },
  sectionRule: {
    height: sizing.rule.thin,
    backgroundColor: '#E7ECF7',
    flex: 1,
    marginLeft: spacing.sm,
  },
  deleteButton: {
    marginTop: spacing.xs,
    minHeight: sizing.control.smallButton,
    paddingHorizontal: spacing.sm,
  },
  deleteButtonText: {
    fontSize: type.caption.fontSize,
  },
  fabWrap: {
    position: 'absolute',
    right: layout.screenHorizontal,
    top: spacing.xl,
  },
  fabButton: {
    minWidth: sizing.control.button,
    minHeight: sizing.control.button,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.none,
    paddingVertical: spacing.none,
  },
  fabButtonText: {
    fontSize: type.h4.fontSize,
    lineHeight: type.h4.lineHeight,
  },
});
