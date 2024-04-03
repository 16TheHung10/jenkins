import PageWithNav from "components/layouts/pageWithNav/PageWithNav";
import { FcMasterNavData } from "data/layouts/nav";
import React, { useMemo } from "react";

const FcMasterNav = ({ children, isDetails, taxCode, storeCode }) => {
  const actionLeft = useMemo(() => {
    return FcMasterNavData.actiionLeft(isDetails, taxCode, storeCode);
  }, []);
  return (
    <PageWithNav className="relative" actionLeft={actionLeft}>
      {children}
    </PageWithNav>
  );
};

export default FcMasterNav;
