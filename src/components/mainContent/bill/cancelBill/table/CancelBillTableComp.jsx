import React, { Fragment } from "react";
import MainTable from "components/common/Table/UI/MainTable";
import { TableCancelBillData } from "data/render/table";
const CancelBillTableComp = ({ data, loading, onGetBillDetails }) => {
  return (
    <Fragment>
      <MainTable
        loading={loading}
        className="w-full"
        columns={TableCancelBillData.columns({ onGetBillDetails })}
        scroll={{
          y: "calc(100vh - 268px)",
        }}
        dataSource={data}
      />
    </Fragment>
  );
};

export default CancelBillTableComp;
