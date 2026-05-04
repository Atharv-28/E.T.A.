import React from 'react';
import { TouchableOpacity } from 'react-native';
import AppText from './AppText';
import AppView from './AppView';
import { palette } from '../theme/tokens';
import { styles, getButtonToneStyle } from './AppButton.styles';

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  style,
  textStyle,
  disabled = false,
}) {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.86}
      style={[
        styles.container,
        getButtonToneStyle({ isPrimary, isGhost, disabled }),
        isPrimary ? styles.primaryShadow : null,
        style,
      ]}
    >
        {icon ? <AppView>{icon}</AppView> : null}
      <AppText
        variant="button"
        color={isPrimary ? palette.surface : palette.textPrimary}
        style={textStyle}
      >
        {title}
      </AppText>
    </TouchableOpacity>
  );
}
