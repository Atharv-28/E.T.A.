import { StyleSheet } from 'react-native';
import { borderWidth, layout, palette, radius, spacing, type as typeScale } from '../ui';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(8,14,28,0.34)',
  },
  sheet: {
    maxHeight: '92%',
    backgroundColor: palette.surface,
    borderTopLeftRadius: layout.modalSheetRadius,
    borderTopRightRadius: layout.modalSheetRadius,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  snackbar: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.xl,
    right: spacing.xl,
    bottom: 'auto',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scroll: {
    marginTop: spacing.lg,
  },
  chipTabs: {
    marginTop: spacing.sm,
  },
  cardSpacing: {
    marginTop: spacing.md,
  },
  inputSpacing: {
    marginTop: spacing.md,
  },
  pickDate: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  caption: {
    marginTop: spacing.xs,
  },
  categoryList: {
    marginTop: spacing.sm,
    gap: spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: spacing.sm,
    borderRadius: radius.lg,
  },
  categoryOption: {
    width: '25%',
    borderRadius: radius.lg,
    borderWidth: borderWidth.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryOptionSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.primarySoft,
  },
  categoryOptionDefault: {
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  categoryLabel: {
    fontSize: typeScale.body.fontSize,
  },
  footerRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  footerButton: {
    flex: 1,
  },
});
