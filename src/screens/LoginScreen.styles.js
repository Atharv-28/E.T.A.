import { StyleSheet } from 'react-native';
import { palette, radius, spacing, sizing } from '../ui';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  hero: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  heroIcon: {
    width: sizing.avatar.xxl,
    height: sizing.avatar.xxl,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F0FF',
  },
  heroTitle: {
    marginTop: spacing.lg,
  },
  heroSubtitle: {
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  formCard: {
    marginTop: spacing.md,
  },
  labelSpacing: {
    marginTop: spacing.lg,
  },
  tabsSpacing: {
    marginTop: spacing.sm,
  },
  inputSpacing: {
    marginTop: spacing.lg,
  },
  caption: {
    marginTop: spacing.sm,
  },
  submitButton: {
    marginTop: spacing.xl,
  },
  infoStack: {
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  infoText: {
    flex: 1,
  },
});
