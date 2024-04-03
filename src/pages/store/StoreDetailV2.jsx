import StoreDetailsComp from "components/mainContent/store/StoreDetailsComp";
import { StringHelper } from "helpers";
import React from "react";
import { useHistory } from "react-router-dom";

const StoreDetailV2 = () => {
  const history = useHistory();
  return (
    <StoreDetailsComp
      initialStoreCode={
        StringHelper.convertSearchParamsToObject(history.location?.search)
          .initStoreCode
      }
    />
  );
};

export default StoreDetailV2;
