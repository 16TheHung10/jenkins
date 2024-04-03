import React from "react";
import promotions from "data/json/promotions.json";
import { GoldenTimeTableData } from "data/oldVersion/mockData/GoldenTimeTableData";
import moment from "moment";
import TableContent from "components/common/Table/UI/TableContent";
import "./goldenTimeTableContent.style.scss";
const GoldenTimeTableContent = ({ data, onClickOnRow }) => {
  const formatData = () => {
    return data?.map((item) => {
      return {
        ...item,
        toDate: moment(item.toDate).format("DD-MM-YYYY"),
        fromDate: moment(item.fromDate).format("DD-MM-YYYY"),
        createdDate: moment(item.createdDate).format("DD-MM-YYYY"),
        updatedDate: moment(item.updatedDate).format("DD-MM-YYYY"),
      };
    });
  };

  return (
    <TableContent
      pagination={{
        position: ["bottomLeft"],
      }}
      onRow={(record) => {
        return {
          onClick: (event) => {
            onClickOnRow(record);
          },
        };
      }}
      className="goldenTimeTableContent"
      loading={false}
      dataTable={formatData()}
      th={GoldenTimeTableData.th(promotions)}
      rowKey={GoldenTimeTableData.rowKey}
    />
  );
};

export default GoldenTimeTableContent;
