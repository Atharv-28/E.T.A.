import { StyleSheet } from 'react-native';
import { borderWidth, palette, radius, spacing, sizing } from '../../../ui';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.surface,
    borderBottomWidth: borderWidth.sm,
    borderBottomColor: '#EDF1FA',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconCard: {
    width: sizing.avatar.sm,
    height: sizing.avatar.sm,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A1A2F',
    borderWidth: borderWidth.none,
  },
});
