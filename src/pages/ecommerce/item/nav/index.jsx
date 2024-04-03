import PageWithNav from 'components/layouts/pageWithNav/PageWithNav';
import { EcommerceItemNavData } from 'data/layouts/nav';
import React, { useMemo } from 'react';

const EcommerceItemNav = ({ children, isDetails, taxCode }) => {
  const actionLeft = useMemo(() => {
    return EcommerceItemNavData.actiionLeft(isDetails, taxCode);
  }, []);
  return (
    <PageWithNav className="relative" actionLeft={actionLeft}>
      {children}
    </PageWithNav>
  );
};

export default EcommerceItemNav;

