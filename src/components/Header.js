import React from 'react';
import { View, Text } from 'react-native';
import { useAccounts } from '../context/AccountContext';
import CustomIcon from './CustomIcon';
import { FadeInView, SlideInView, GradientCard } from './AnimatedComponents';
import { styles, colors } from '../styles/GlobalStyles';

function Header({ title = 'Expense Track & Analyse' }) {
  const { activeAccount } = useAccounts();

  return (
    <GradientCard 
      colors={[colors.primary, colors.primaryDark]}
      style={styles.header}
    >
      <FadeInView>
        <Text style={styles.headerTitle}>{title}</Text>
      </FadeInView>
      {activeAccount && (
        <SlideInView direction="right" delay={300}>
          <View style={styles.headerAccount}>
            <CustomIcon name={activeAccount.icon} size={16} color={colors.white} />
            <Text style={styles.headerAccountText}>{activeAccount.name}</Text>
          </View>
        </SlideInView>
      )}
    </GradientCard>
  );
}

export default Header;
