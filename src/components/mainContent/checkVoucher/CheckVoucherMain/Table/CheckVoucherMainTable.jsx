import { Col, Row } from "antd";
import Info from "components/mainContent/bill/Info";
import MainTable from "components/common/Table/UI/MainTable";
import FormField from "data/oldVersion/formFieldRender";
import React from "react";

const CheckVoucherMainTable = ({
  data,
  billDetailsData,
  onUnlock,
  ...props
}) => {
  return (
    <div className=" section-block">
      <Row gutter={[16, 16]}>
        <Col span={billDetailsData ? 16 : 24}>
          <MainTable
            {...props}
            className="row_pointer w-fit mt-15 checkinHistoryTable "
            // pagination={false}
            columns={FormField.CheckVoucherOverview.columns({ onUnlock })}
            scroll={{ y: "calc(100vh - 218px)" }}
            dataSource={data}
          />
        </Col>
        {billDetailsData ? (
          <Col span={8}>
            <Info />
          </Col>
        ) : null}
      </Row>
    </div>
  );
};

export default CheckVoucherMainTable;
