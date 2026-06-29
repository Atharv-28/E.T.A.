import React from 'react';
import { TextInput } from 'react-native';
import { palette, sizing } from '../theme/tokens';
import AppText from './AppText';
import AppIcon from './AppIcon';
import AppView from './AppView';
import { styles } from './AppInput.styles';

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
        <AppText variant="label" color={palette.textSecondary} style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <AppView
        style={[
          styles.field,
          multiline ? styles.fieldMultiline : styles.fieldSingle,
        ]}
      >
      {leftIcon ? <AppIcon name={leftIcon} size={sizing.icon.lg} color={palette.textMuted} /> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={palette.textMuted}
          keyboardType={keyboardType}
          multiline={multiline}
          style={[
            styles.input,
            multiline ? styles.inputMultiline : styles.inputSingle,
          ]}
        />
      </AppView>
    </AppView>
  );
}
