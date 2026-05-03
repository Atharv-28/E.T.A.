import React from 'react';
import { AppScreen, AppScrollScreen } from './AppScreen';

export default function AppScreenLayout({ children, scroll = true, contentStyle, style }) {
  if (scroll) {
    return <AppScrollScreen contentStyle={contentStyle}>{children}</AppScrollScreen>;
  }

  return <AppScreen style={style}>{children}</AppScreen>;
}
