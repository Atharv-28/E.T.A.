import { StyleSheet } from 'react-native';
import { borderWidth, layout, palette, radius, spacing, sizing } from '../ui';

export const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  primaryCard: {
    borderLeftWidth: borderWidth.lg,
    borderLeftColor: palette.danger,
  },
  primaryLabel: {
    letterSpacing: 1,
  },
  primaryRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceLabel: {
    marginTop: spacing.lg,
  },
  primaryMeta: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  primaryIconTile: {
    width: sizing.avatar.lg,
    height: sizing.avatar.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCEEEF',
  },
  switchTitle: {
    marginBottom: spacing.md,
  },
  switchButton: {
    marginBottom: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  sectionHeaderTitle: {
    marginLeft: spacing.sm,
  },
  smsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smsText: {
    flex: 1,
    paddingRight: spacing.md,
  },
  smsDescription: {
    marginTop: spacing.xs,
  },
  smsTipCard: {
    marginTop: spacing.lg,
    backgroundColor: palette.primaryTint,
    borderWidth: borderWidth.none,
  },
  smsTipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  smsTipText: {
    flex: 1,
  },
  smsCheckButton: {
    marginTop: spacing.md,
  },
  backupRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  backupCard: {
    flex: 1,
  },
  backupTitle: {
    marginTop: spacing.md,
  },
  backupBody: {
    marginTop: spacing.xs,
  },
  backupButton: {
    marginTop: spacing.md,
  },
  manageButton: {
    borderStyle: 'dashed',
    borderWidth: borderWidth.md,
    marginTop: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(8,14,28,0.34)',
  },
  modalSheet: {
    backgroundColor: palette.surface,
    borderTopLeftRadius: layout.modalSheetRadius,
    borderTopRightRadius: layout.modalSheetRadius,
    padding: spacing.xl,
  },
  importInput: {
    marginTop: spacing.md,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  modalFooterButton: {
    flex: 1,
  },
});
