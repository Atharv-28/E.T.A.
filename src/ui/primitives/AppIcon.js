import React from 'react';
import CustomIcon from '../../components/CustomIcon';
import { sizing, palette } from '../theme/tokens';
import AppView from './AppView';

export default function AppIcon({ name, size = sizing.icon.md, color = palette.textPrimary, style }) {
  return (
    <AppView style={style}>
      <CustomIcon name={name} size={size} color={color} />
    </AppView>
  );
}
