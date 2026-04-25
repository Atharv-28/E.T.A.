import React from 'react';
import AppBottomTabs from '../modules/common/components/AppBottomTabs';

function BottomNavigation({ activeTab, setActiveTab }) {
  return <AppBottomTabs activeTab={activeTab} setActiveTab={setActiveTab} />;
}

export default BottomNavigation;
