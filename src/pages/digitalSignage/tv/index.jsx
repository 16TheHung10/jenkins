import DigitalSignageNav from 'pages/digitalSignage/nav';
import React from 'react';
import DigitalSignageTVMainContent from '../tv/content';

const DigitalSignageTV = () => {
  return (
    <DigitalSignageNav>
      <DigitalSignageTVMainContent />;
    </DigitalSignageNav>
  );
};

export default React.memo(DigitalSignageTV);
