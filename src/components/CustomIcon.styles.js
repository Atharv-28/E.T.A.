import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  fallbackIcon: {},
});

export const getFallbackIconStyle = (size, color) => ({
  fontSize: size - 4,
  color,
});
