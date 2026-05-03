import React from 'react';
import { View as RNView } from 'react-native';

export default function AppView({ children, style, ...rest }) {
  return (
    <RNView style={style} {...rest}>
      {children}
    </RNView>
  );
}
