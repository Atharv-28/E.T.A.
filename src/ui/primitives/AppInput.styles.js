import { StyleSheet } from 'react-native';
import { borderWidth, palette, radius, spacing, sizing, type } from '../theme/tokens';

export const styles = StyleSheet.create({
  label: {
    marginBottom: spacing.sm,
  },
  field: {
    minHeight: sizing.control.input,
    borderRadius: radius.lg,
    borderWidth: borderWidth.sm,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  fieldSingle: {
    alignItems: 'center',
  },
  fieldMultiline: {
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    color: palette.textPrimary,
    fontSize: type.body.fontSize,
    paddingVertical: spacing.md,
  },
  inputSingle: {
    textAlignVertical: 'center',
  },
  inputMultiline: {
    textAlignVertical: 'top',
  },
});
