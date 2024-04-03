import { Col, Row } from "antd";
import MainTable from "components/common/Table/UI/MainTable";
import { useAppContext } from "contexts";
import { TableCampaignManagementData } from "data/render/table";
import React from "react";

const AwardItem = ({ initialData, onDelete, campaignType }) => {
  const { state: AppState } = useAppContext();

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <MainTable
          className="w-fit"
          columns={TableCampaignManagementData.columnAwarditem(
            onDelete,
            AppState.items,
            campaignType,
          )}
          dataSource={initialData || []}
        />
      </Col>
    </Row>
  );
};

export default AwardItem;
