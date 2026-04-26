import React from 'react';
import AppHeaderBar from '../modules/common/components/AppHeaderBar';

function Header({ title = 'E.T.A.' }) {
  return <AppHeaderBar title={title} />;
}

export default Header;
