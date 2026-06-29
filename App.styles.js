import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  toastBox: {
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 8,
    elevation: 6,
  },
  toastTitle: {
    color: '#fff',
    fontWeight: '700',
  },
  toastMessage: {
    color: '#fff',
    opacity: 0.9,
  },
});

export const getContainerInsetStyle = (topInset) => ({
  paddingTop: topInset,
});

export const getToastContainerStyle = (topInset) => ({
  position: 'absolute',
  top: topInset + 8,
  left: 16,
  right: 16,
  zIndex: 9999,
});
