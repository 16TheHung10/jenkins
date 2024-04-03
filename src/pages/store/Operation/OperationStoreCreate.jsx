import React, { useEffect, useMemo } from "react";
import StoreDetailsComp from "components/mainContent/store/StoreDetailsComp";
import { StringHelper } from "helpers";
import { useLocation, useParams } from "react-router-dom";

const OperationStoreDetails = () => {
  const params = useParams();
  const location = useLocation();

  const storeCode = useMemo(() => {
    const search = new URLSearchParams(location.search);
    const object = StringHelper.convertSearchParamsToObject(search);
    return object?.initStoreCode;
  }, [location.search]);

  return <StoreDetailsComp initialStoreCode={storeCode} />;
};

export default OperationStoreDetails;
