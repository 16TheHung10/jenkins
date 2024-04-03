import PageWithNav from 'components/layouts/pageWithNav/PageWithNav';
import { DigitalSignageNavData } from 'data/layouts/nav';
import React, { useMemo } from 'react';

const DigitalSignageNav = ({ children }) => {
  const actionLeft = useMemo(() => {
    return DigitalSignageNavData.actiionLeft();
  }, []);
  return (
    <PageWithNav className="relative" actionLeft={actionLeft}>
      {children}
    </PageWithNav>
  );
};

export default DigitalSignageNav;
