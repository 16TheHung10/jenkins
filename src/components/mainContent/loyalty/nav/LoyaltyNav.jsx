import PageWithNav from "components/layouts/pageWithNav/PageWithNav";
import { LoyaltyNavData } from "data/layouts/nav";
import React, { useMemo } from "react";

const LoyaltyNav = ({ children }) => {
  const actionLeft = useMemo(() => {
    return LoyaltyNavData.actiionLeft();
  }, []);

  return (
    <PageWithNav className="relative" actionLeft={actionLeft}>
      {children}
    </PageWithNav>
  );
};

export default LoyaltyNav;
