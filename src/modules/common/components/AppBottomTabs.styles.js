import { StyleSheet } from 'react-native';
import { borderWidth, palette, radius, spacing, sizing } from '../../../ui';

export const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.md,
    paddingTop: sizing.nav.barPaddingTop,
    paddingBottom: sizing.nav.barPaddingBottom,
    backgroundColor: palette.surface,
    borderTopWidth: borderWidth.sm,
    borderTopColor: '#EEF2FB',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  tabItem: {
    alignItems: 'center',
    width: sizing.nav.itemWidth,
    gap: spacing.xs,
  },
  capsule: {
    width: sizing.nav.capsuleWidth,
    height: sizing.nav.capsuleHeight,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capsuleActive: {
    backgroundColor: '#EEF4FF',
  },
  capsuleInactive: {
    backgroundColor: 'transparent',
  },
});
