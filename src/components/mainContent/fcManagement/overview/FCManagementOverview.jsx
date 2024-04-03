import React, { Fragment, memo } from "react";
import FCManagementOverviewFields from "./FCManagementOverviewFields";
import FCManagementOverviewTable from "./FCManagementOverviewTable";

const FCManagementOverview = ({ hookFields }) => {
  return (
    <Fragment>
      <FCManagementOverviewFields hookFields={hookFields} />
      <FCManagementOverviewTable dataSource={[]} />
    </Fragment>
  );
};

export default memo(FCManagementOverview);
