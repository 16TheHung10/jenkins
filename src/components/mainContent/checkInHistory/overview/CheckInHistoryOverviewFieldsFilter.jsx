import { Col, Row } from "antd";
import BaseButton from "components/common/buttons/baseButton/BaseButton";
import FieldList from "components/common/fieldList/FieldList";
import React from "react";
const CheckInHistoryOverviewFieldsFilter = ({
  formInputs,
  onSubmit,
  ...props
}) => {
  return (
    <form {...props} onSubmit={onSubmit}>
      <Row gutter={[16, 0]} className="items-center">
        <FieldList fields={formInputs} />
        {/* <Col span={6} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BaseButton iconName="search" className="btn-danger" htmlType="submit">
            Filter
          </BaseButton>
        </Col> */}
      </Row>
    </form>
  );
};

export default CheckInHistoryOverviewFieldsFilter;
