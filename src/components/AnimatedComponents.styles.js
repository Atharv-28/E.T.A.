import { StyleSheet } from 'react-native';
import { colors } from '../styles/GlobalStyles';

export const styles = StyleSheet.create({
  gradientCard: {
    borderRadius: 16,
  },
  gradientButton: {
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shimmerContainer: {
    backgroundColor: colors.grayLight + '30',
    borderRadius: 8,
    overflow: 'hidden',
  },
  shimmerHighlight: {
    backgroundColor: colors.white + '60',
  },
  fabCard: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export const getShimmerContainerSizeStyle = (width, height) => ({
  width,
  height,
});

export const getShimmerHighlightSizeStyle = (width, height) => ({
  width: width * 0.5,
  height,
});
