import MainTable from "components/common/Table/UI/MainTable";
import { useFCManagementContext } from "contexts";
import FCManagementOverview from "data/oldVersion/formFieldRender/FCManagement/FCManagementOverview";
import { usePagination } from "hooks";
import React, { Fragment } from "react";

const FCManagementOverviewTable = ({ dataSource, disableEdit }) => {
  const {
    Pagination,
    pageSize,
    pageNumber,
    handleSetPageSize,
    handleSetPageNumber,
    reset,
  } = usePagination({
    total: 1000,
    context: useFCManagementContext(),
  });
  return (
    <Fragment>
      <MainTable
        className="mt-15"
        pagination={null}
        dataSource={dataSource?.map((item, index) => ({
          ...item,
          key: item.itemCode,
        }))}
        columns={disableEdit ? FCManagementOverview.columns() : null}
      />
      <Pagination />
    </Fragment>
  );
};

export default FCManagementOverviewTable;
