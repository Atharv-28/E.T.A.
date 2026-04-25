import React from 'react';
import { View } from 'react-native';
import CustomIcon from '../../components/CustomIcon';

export default function AppIcon({ name, size = 20, color = '#0F172A', style }) {
  return (
    <View style={style}>
      <CustomIcon name={name} size={size} color={color} />
    </View>
  );
}
