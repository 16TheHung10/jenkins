import React from "react";
import Icons from "images/icons";
import { Row, Col } from "antd";
import { MergeMemberTableData } from "data/render/table";
import MainTable from "components/common/Table/UI/MainTable";

const ConfirmMergeMember = ({ memberData1, memberData2 }) => {
  return (
    <Row gutter={[16, 16]} className="mt-15">
      <Col span={24}>
        <MainTable
          rowClassName={`${memberData1?.active === 0 ? "disabled_row" : ""}`}
          className="mb-15"
          columns={MergeMemberTableData.columns()}
          dataSource={memberData1 ? [memberData1] : null}
        />
      </Col>
      <Col span={24} className="center" style={{ fontSize: 40 }}>
        <Icons.Merge style={{ color: "var(--primary-color)" }} />
      </Col>

      <Col span={24}>
        <MainTable
          rowClassName={`${memberData2?.locked === 0 ? "disabled_row" : ""}`}
          className="mb-15"
          columns={MergeMemberTableData.columns()}
          dataSource={memberData2 ? [memberData2] : null}
        />
      </Col>
    </Row>
  );
};

export default ConfirmMergeMember;
