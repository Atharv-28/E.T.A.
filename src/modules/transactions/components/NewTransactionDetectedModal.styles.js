import { StyleSheet } from 'react-native';
import { borderWidth, layout, palette, radius, spacing, type } from '../../../ui';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(8,14,28,0.34)',
  },
  sheet: {
    maxHeight: '90%',
    backgroundColor: palette.surface,
    borderTopLeftRadius: layout.modalSheetRadius,
    borderTopRightRadius: layout.modalSheetRadius,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scroll: {
    marginTop: spacing.lg,
  },
  detectedCard: {
    borderWidth: borderWidth.none,
  },
  detectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  detectedLeft: {
    flex: 1,
    paddingRight: spacing.md,
  },
  detectedMeta: {
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  sectionCard: {
    marginTop: spacing.md,
  },
  gridWrap: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridTile: {
    width: '31.5%',
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  gridTileSelected: {
    borderWidth: borderWidth.sm,
    borderColor: palette.primary,
    backgroundColor: palette.primarySoft,
  },
  gridTileDefault: {
    borderWidth: borderWidth.none,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  tileContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileIconWrap: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
  },
  tileLabel: {
    marginTop: spacing.xs,
  },
  tileLabelCentered: {
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  smsContent: {
    marginTop: spacing.sm,
    lineHeight: type.body.lineHeight,
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
  tileShadow: {
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  iconShadow: {
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1.5,
  },
});

export const getDetectedCardStyle = (isIncome) => ({
  backgroundColor: isIncome ? palette.success : palette.danger,
});
