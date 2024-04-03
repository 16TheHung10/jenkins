import PageWithNav from "components/layouts/pageWithNav/PageWithNav";
import { CampaignNavData } from "data/layouts/nav";
import React, { useMemo } from "react";

const CampaignNav = ({ children, isDetails, campaignID }) => {
  const actionLeft = useMemo(() => {
    return CampaignNavData.actiionLeft(isDetails, campaignID);
  }, []);

  return (
    <PageWithNav className="relative" actionLeft={actionLeft}>
      {children}
    </PageWithNav>
  );
};

export default CampaignNav;
