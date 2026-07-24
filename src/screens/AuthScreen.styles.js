import { StyleSheet } from 'react-native';
import { palette, radius, spacing, sizing } from '../ui';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.primarySoft,
  },
  hero: {
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  heroIcon: {
    width: sizing.avatar.xxl,
    height: sizing.avatar.xxl,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.primarySoft,
  },
  heroTitle: {
    marginTop: spacing.md,
    textAlign: 'center',
  },
  heroSubtitle: {
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  tabsSpacing: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  formCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  cardSubtitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  inputSpacing: {
    marginTop: spacing.md,
  },
  forgotLink: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  submitButton: {
    marginTop: spacing.xl,
  },
  switchButton: {
    marginTop: spacing.md,
  },
});
