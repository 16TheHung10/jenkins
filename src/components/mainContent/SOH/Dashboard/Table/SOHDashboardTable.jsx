import TableContent from "components/common/Table/UI/TableContent";
import React, { useEffect, useMemo } from "react";
import { SOHDashboardTableData } from "../../Data/SOHDashboardData";
import { Table } from "antd";

const SOHDashboardTable = ({ dataTable, summary }) => {
  return (
    <div className="box-shadow" style={{ marginTop: 20, flex: 1 }}>
      <TableContent
        style={{ minHeight: "100%" }}
        dataTable={dataTable}
        th={SOHDashboardTableData.th()}
        rowKey={SOHDashboardTableData.rowKey}
        scroll={{
          y: "calc(100vh - 350px)",
        }}
        summary={(e) => {
          return (
            <Table.Summary className="summary" fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  {summary?.rcvQty || 0}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  {summary?.saleQty || 0}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  {summary?.deliveryQty || 0}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}></Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  {summary?.soh?.toFixed(2) || 0}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />
    </div>
  );
};

export default SOHDashboardTable;
