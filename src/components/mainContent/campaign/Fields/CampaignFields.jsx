import { Col, Row } from 'antd';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import FieldList from 'components/common/fieldList/FieldList';
import React from 'react';

const CampaignFields = ({ onSubmit, fields }) => {
  return (
    <form onSubmit={onSubmit} className="section-block mt-15">
      <Row gutter={[16, 0]} className="items-center">
        <FieldList fields={fields} />
        <Col span={24}>
          <BaseButton
            iconName="search"
            htmlType="submit"
            className="btn-danger"
          >
            Search
          </BaseButton>
        </Col>
      </Row>
    </form>
  );
};

export default CampaignFields;

