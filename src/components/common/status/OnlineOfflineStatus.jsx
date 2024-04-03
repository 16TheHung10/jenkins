import React from 'react';

import Icons from 'images/icons';
const OnlineOfflineStatus = ({ type = 'offline' }) => {
  if (type === 'online') {
    return <Icons.Dot color="#5eff5e" style={{ fontSize: 20 }} />;
  }
  return <Icons.Dot color="gray" style={{ fontSize: 20 }} />;
};

export default OnlineOfflineStatus;
