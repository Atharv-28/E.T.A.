import React from 'react';
import AppHeaderBar from '../modules/common/components/AppHeaderBar';

function Header({ title = 'Financier' }) {
  return <AppHeaderBar title={title} />;
}

export default Header;
