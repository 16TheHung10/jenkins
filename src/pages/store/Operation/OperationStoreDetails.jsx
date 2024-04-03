import React from "react";
import OperationStoreDetailsComp from "components/mainContent/store/operationStore/OperationStoreDetailsComp";
import { useHistory, useParams } from "react-router-dom";
import { StringHelper } from "helpers";

const OperationStoreDetails = () => {
  const history = useHistory();
  const params = useParams();
  return <OperationStoreDetailsComp initialStoreCode={params.id} />;
};

export default OperationStoreDetails;
