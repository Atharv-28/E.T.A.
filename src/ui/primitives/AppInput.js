import React from 'react';
import { View, TextInput } from 'react-native';
import { palette, radius, spacing } from '../theme/tokens';
import AppText from './AppText';
import AppIcon from './AppIcon';

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
    <View style={style}>
      {label ? (
        <AppText variant="label" color={palette.textSecondary} style={{ marginBottom: spacing.sm }}>
          {label}
        </AppText>
      ) : null}
      <View
        style={{
          minHeight: 52,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: palette.border,
          backgroundColor: palette.surface,
          paddingHorizontal: spacing.md,
          flexDirection: 'row',
          alignItems: multiline ? 'flex-start' : 'center',
          gap: spacing.sm,
        }}
      >
        {leftIcon ? <AppIcon name={leftIcon} size={22} color={palette.textMuted} /> : null}
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
            fontSize: 18,
            paddingVertical: spacing.md,
            textAlignVertical: multiline ? 'top' : 'center',
          }}
        />
      </View>
    </View>
  );
}
