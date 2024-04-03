import React, { useMemo } from "react";
import MainTable from "components/common/Table/UI/MainTable";
import { TablePosData } from "data/render/table";
import "./style.scss";
import { Col, Row, Select } from "antd";
const FormatData = ({ constData, data, onFilter }) => {
  const options = useMemo(() => {
    const optionsMap = new Map();
    for (let item of constData) {
      if (!optionsMap.has(item.invoiceID)) {
        optionsMap.set(item.invoiceID, item.invoiceID);
      }
    }
    return Array.from(optionsMap, ([key, value]) => ({ value, label: value }));
  }, [constData]);
  return (
    <div id="pos_trace_log_wrapper">
      <Row>
        <Col span={8}>
          {data ? (
            <Select
              className="w-full mb-10"
              style={{ marginBottom: "10px" }}
              onChange={(value) => {
                onFilter(value);
              }}
              showSearch
              allowClear
              placeholder="-- All --"
              options={options}
            />
          ) : null}
        </Col>
      </Row>
      <MainTable
        scroll={{ y: "calc(100vh - 218px)" }}
        className="w-full pos_trace_log_table"
        columns={TablePosData.columns()}
        dataSource={data}
      />
    </div>
  );
};

export default FormatData;
