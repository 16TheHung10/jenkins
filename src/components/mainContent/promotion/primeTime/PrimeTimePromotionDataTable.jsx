import { Row } from "antd";
import TableContent from "components/common/Table/UI/TableContent";
import { GoldenTimeTableData } from "data/oldVersion/mockData/GoldenTimeTableData";
import moment from "moment";
import React, { useMemo } from "react";
const PrimeTimePromotionDataTable = ({ data, onClickOnRow }) => {
  const formatData = useMemo(() => {
    return data
      ?.map((item) => {
        return {
          ...item,
          toDate: moment(item.toDate).format("DD-MM-YYYY"),
          fromDate: moment(item.fromDate).format("DD-MM-YYYY"),
          createdDate: moment(item.createdDate).format("DD-MM-YYYY"),
          updatedDate: moment(item.updatedDate).format("DD-MM-YYYY - HH:mm:ss"),
        };
      })
      ?.sort((a, b) => b.updatedDate?.localeCompare(a.updatedDate));
  }, [data]);

  return (
    <Row className=" mb-15">
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
        rowClassName="prime_time_row_table cursor_pointer"
        loading={false}
        dataTable={formatData}
        th={GoldenTimeTableData.th(formatData)}
        rowKey={GoldenTimeTableData.rowKey}
      />
    </Row>
  );
};

export default PrimeTimePromotionDataTable;
