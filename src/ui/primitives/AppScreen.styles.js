import { StyleSheet } from 'react-native';
import { layout, palette } from '../theme/tokens';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },
  screenPadded: {
    paddingHorizontal: layout.screenHorizontal,
  },
  screenUnpadded: {
    paddingHorizontal: 0,
  },
  scroll: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scrollContent: {
    padding: layout.screenHorizontal,
    paddingBottom: layout.screenBottomInset,
    gap: layout.sectionGap,
  },
});
