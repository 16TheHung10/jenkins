import PageWithNav from 'components/layouts/pageWithNav/PageWithNav';
import { DigitalSignageTVNotifyNavData } from 'data/layouts/nav';
import React, { useMemo } from 'react';

const NotifyDigitalSignageITNav = ({ children }) => {
  const actionLeft = useMemo(() => {
    return DigitalSignageTVNotifyNavData.actiionLeft();
  }, []);
  return (
    <PageWithNav className="relative" actionLeft={actionLeft}>
      {children}
    </PageWithNav>
  );
};

export default NotifyDigitalSignageITNav;
