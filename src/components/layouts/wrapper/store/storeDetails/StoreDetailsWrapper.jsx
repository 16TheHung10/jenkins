import { usePageWithNavContext } from "contexts";
import { StoreNavData } from "data/layouts/nav";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import PageWithNav from "../../../pageWithNav/PageWithNav";
const StoreDetailsWrapper = ({ children, type }) => {
  const params = useParams();
  const { state: PageNavState, dispatch } = usePageWithNavContext();

  const actionLeft = useMemo(() => {
    return StoreNavData.actiionLeft({
      storeCode: params.storeCode,
      type: "Create",
    });
  }, []);

  return (
    <PageWithNav className="relative" actionLeft={actionLeft}>
      {children}
    </PageWithNav>
  );
};

export default StoreDetailsWrapper;
