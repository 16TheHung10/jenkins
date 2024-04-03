import React from "react";
import FormField from "data/oldVersion/formFieldRender";
import MainTable from "components/common/Table/UI/MainTable";

const CampaignTable = ({ data }) => {
  return (
    <MainTable
      className="section-block mt-15"
      // pagination={false}
      columns={TableSampleData.columns()}
      dataSource={data}
    />
  );
};

export default CampaignTable;
