import { StyleSheet } from 'react-native';
import { radius } from '../theme/tokens';

export const styles = StyleSheet.create({
  track: {
    borderRadius: radius.pill,
    backgroundColor: '#E5EBF8',
    overflow: 'hidden',
  },
});

export const getTrackStyle = (height) => ({
  height,
});

export const getFillStyle = (normalized, color) => ({
  width: `${normalized}%`,
  height: '100%',
  backgroundColor: color,
  borderRadius: radius.pill,
});
