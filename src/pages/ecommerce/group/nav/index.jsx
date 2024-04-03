import PageWithNav from 'components/layouts/pageWithNav/PageWithNav';
import { EcommerceGroupNavData } from 'data/layouts/nav';
import React, { useMemo } from 'react';

const EcommerceGroupNav = ({ children, isDetails = false, groupID }) => {
  const actionLeft = useMemo(() => {
    return EcommerceGroupNavData.actiionLeft(isDetails, groupID);
  }, []);
  return (
    <PageWithNav className="relative" actionLeft={actionLeft}>
      {children}
    </PageWithNav>
  );
};

export default EcommerceGroupNav;

