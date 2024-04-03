import React from "react";
import MainTable from "components/common/Table/UI/MainTable";
import { TableCancelAccountData } from "data/render/table";
const CancelAccountTableComp = ({ data, loading, onApproveCancelAccount }) => {
  return (
    <MainTable
      loading={loading}
      className="w-full"
      columns={TableCancelAccountData.columns({ onApproveCancelAccount })}
      dataSource={data}
    />
  );
};

export default CancelAccountTableComp;
