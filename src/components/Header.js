import React from 'react';
import { View, Text } from 'react-native';
import { useAccounts } from '../context/AccountContext';
import CustomIcon from './CustomIcon';
import LinearGradient from 'react-native-linear-gradient';
import { styles, colors } from '../styles/GlobalStyles';

// Local GradientCard component
const GradientCard = ({ children, colors: gradientColors = [colors.primary, colors.primaryDark], style, ...props }) => (
  <LinearGradient
    colors={gradientColors}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[{ borderRadius: 16 }, style]}
    {...props}
  > 
    {children}
  </LinearGradient>
);

function Header({ title = 'Expense Track & Analyse' }) {
  const { activeAccount } = useAccounts();

  return (
    <GradientCard 
      colors={[colors.primary, colors.primaryDark]}
      style={styles.header}
    >
      <View>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      {activeAccount && (
        <View>
          <View style={styles.headerAccount}>
            <CustomIcon name={activeAccount.icon} size={16} color={colors.white} />
            <Text style={styles.headerAccountText}>{activeAccount.name}</Text>
          </View>
        </View>
      )}
    </GradientCard>
  );
}

export default Header;
