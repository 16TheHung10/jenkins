import React, { Fragment, useEffect, useState } from "react";
import MainTable from "components/common/Table/UI/MainTable";
import { usePagination } from "hooks";
import { useHistory } from "react-router-dom";
import FormField from "../../../../data/oldVersion/formFieldRender";

const Staff = ({
  items,
  totalStaffs,
  handleClickPaging,
  handleLoadResult,
  handleChangePageSize,
}) => {
  const history = useHistory();
  const {
    Pagination,
    pageSize,
    pageNumber,
    reset: resetPagination,
  } = usePagination({ total: totalStaffs });

  const [staffs, setStaffs] = useState([]);

  useEffect(() => {
    setStaffs(items);
  }, [items]);

  const handleToDetail = (staffCodeId, status, storeCode) => {
    history.push("/staff/" + storeCode + "/" + staffCodeId + "/" + status);
  };
  useEffect(() => {
    handleClickPaging(pageNumber);
  }, [pageNumber]);
  useEffect(() => {
    handleChangePageSize(pageSize);
  }, [pageSize]);
  useEffect(() => {
    handleLoadResult(pageNumber, pageSize);
  }, [pageNumber, pageSize]);
  return (
    <section>
      <MainTable
        onRow={(record) => {
          const { staffCode, status, storeCode } = record;
          return {
            onClick: () => handleToDetail(staffCode, status, storeCode),
          };
        }}
        scroll={{
          y: "calc(100vh - 340px)",
        }}
        className="mt-15"
        columns={FormField.StaffOverview.columns()}
        dataSource={staffs}
      />
      <Pagination className="mt-15 text-center" />
    </section>
  );
};
export default Staff;
