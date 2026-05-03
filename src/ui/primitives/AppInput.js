import React from 'react';
import { TextInput } from 'react-native';
import { palette, radius, spacing, sizing, borderWidth, type } from '../theme/tokens';
import AppText from './AppText';
import AppIcon from './AppIcon';
import AppView from './AppView';

export default function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  leftIcon,
  style,
  multiline = false,
}) {
  return (
    <AppView style={style}>
      {label ? (
        <AppText variant="label" color={palette.textSecondary} style={{ marginBottom: spacing.sm }}>
          {label}
        </AppText>
      ) : null}
      <AppView
        style={{
          minHeight: sizing.control.input,
          borderRadius: radius.lg,
          borderWidth: borderWidth.sm,
          borderColor: palette.border,
          backgroundColor: palette.surface,
          paddingHorizontal: spacing.md,
          flexDirection: 'row',
          alignItems: multiline ? 'flex-start' : 'center',
          gap: spacing.sm,
        }}
      >
      {leftIcon ? <AppIcon name={leftIcon} size={sizing.icon.lg} color={palette.textMuted} /> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={palette.textMuted}
          keyboardType={keyboardType}
          multiline={multiline}
          style={{
            flex: 1,
            color: palette.textPrimary,
            fontSize: type.body.fontSize,
            paddingVertical: spacing.md,
            textAlignVertical: multiline ? 'top' : 'center',
          }}
        />
      </AppView>
    </AppView>
  );
}
