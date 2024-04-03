import React from "react";
import MainTable from "components/common/Table/UI/MainTable";
import { TablePosManagementData } from "data/render/table";
const POSManagementTable = ({
  data,
  loading,
  onChangeAllowPromotion,
  onChangeAllowSysCall,
  onClickEdit,
}) => {
  return (
    <MainTable
      loading={loading}
      className="w-fit"
      // pagination={false}
      columns={TablePosManagementData.columns({
        onChangeAllowPromotion,
        onChangeAllowSysCall,
        onClickEdit,
      })}
      dataSource={data}
    />
  );
};

export default POSManagementTable;
