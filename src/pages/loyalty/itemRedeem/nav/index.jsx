import PageWithNav from 'components/layouts/pageWithNav/PageWithNav';
import { LoyaltyItemRedeemNavData } from 'data/layouts/nav';
import React, { useMemo } from 'react';

const LoyaltyItemRedeemNav = ({ children, isDetails = false, itemCode }) => {
  const actionLeft = useMemo(() => {
    return LoyaltyItemRedeemNavData.actiionLeft(isDetails, itemCode);
  }, []);
  return (
    <PageWithNav className="relative" actionLeft={actionLeft}>
      {children}
    </PageWithNav>
  );
};

export default LoyaltyItemRedeemNav;

