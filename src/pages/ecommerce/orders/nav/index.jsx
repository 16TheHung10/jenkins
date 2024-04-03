import PageWithNav from 'components/layouts/pageWithNav/PageWithNav';
import { EcommerceOrderNavData } from 'data/layouts/nav';
import React, { useMemo } from 'react';

const EcommerceOrderNav = ({ children, isDetails, taxCode }) => {
  const actionLeft = useMemo(() => {
    return EcommerceOrderNavData.actiionLeft(isDetails, taxCode);
  }, []);
  return (
    <PageWithNav className="relative" actionLeft={actionLeft}>
      {children}
    </PageWithNav>
  );
};

export default EcommerceOrderNav;

