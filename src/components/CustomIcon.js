import React from 'react';
import { Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { styles, getFallbackIconStyle } from './CustomIcon.styles';

// Fallback icon mappings for when vector icons don't work
const ICON_FALLBACKS = {
  'dashboard': '📊',
  'account-balance-wallet': '💰',
  'assignment': '📋',
  'trending-up': '📈',
  'add': '➕',
  'remove': '➖',
  'close': '✖️',
  'delete': '🗑️',
  'list': '📋',
  'help': '❓',
  'work': '💼',
  'business': '🏢',
  'computer': '💻',
  'monetization-on': '💰',
  'restaurant': '🍽️',
  'fastfood': '🍟', 
  'directions-car': '🚗',
  'shopping-cart': '🛒',
  'shopping-basket': '🧺',
  'local-florist': '🌸',
  'local-grocery-store': '🏪',
  'eco': '🥬',
  'movie': '🎬',
  'receipt': '🧾',
  'local-hospital': '🏥',
  'school': '🎓',
  'payment': '💳',
  'trending-down': '📉',
  'history': '🕐',
  'pie-chart': '🥧',
  'savings': '💰',
  'money-off': '💸',
  'show-chart': '📊',
  'donut-large': '🍩',
  'lightbulb-outline': '💡',
  'warning': '⚠️',
  'info': 'ℹ️',
  'check-circle': '✅',
  'calendar-today': '📅',
  'date-range': '📆',
  'person': '👤',
  'people': '👥',
  'account-circle': '👤',
  'switch-account': '🔄',
  'edit': '✏️',
  'folder': '📁',
  'savings': '🏦',
  'credit-card': '💳',
  'account-balance': '🏦',
  'notifications-none': '🔔',
  'grid-view': '🧩',
  'receipt-long': '🧾',
  'bar-chart': '📊',
  'search': '🔎',
  'currency-rupee': '₹',
  'wifi-tethering': '📶',
  'verified-user': '🛡️',
  'cloud-upload': '☁️',
  'download': '⬇️',
  'lock': '🔒',
  'notifications': '🔔',
};

function CustomIcon({ name, size = 24, color = '#000', style, fallbackOnly = false }) {
  // If fallbackOnly is true, always use emoji fallback
  if (fallbackOnly) {
    return (
      <Text style={[styles.fallbackIcon, getFallbackIconStyle(size, color), style]}>
        {ICON_FALLBACKS[name] || '❓'}
      </Text>
    );
  }

  // Try to render MaterialIcon first, fallback to emoji if it fails
  try {
    return <MaterialIcons name={name} size={size} color={color} style={style} />;
  } catch (error) {
    console.warn(`Icon "${name}" not found, using fallback`);
    return (
      <Text style={[styles.fallbackIcon, getFallbackIconStyle(size, color), style]}>
        {ICON_FALLBACKS[name] || '❓'}
      </Text>
    );
  }
}

export default CustomIcon;
