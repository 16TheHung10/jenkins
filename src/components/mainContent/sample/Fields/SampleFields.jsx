import React from "react";
import FieldList from "components/common/fieldList/FieldList";
import { Button, Col, Row } from "antd";

const CampaignFields = ({ onSubmit, fields }) => {
  return (
    <form onSubmit={onSubmit} className="section-block mt-15">
      <Row gutter={[16, 0]} className="items-center">
        <FieldList fields={fields} />
        <Col>
          <Button htmlType="submit" className="btn-danger">
            Search
          </Button>
        </Col>
      </Row>
    </form>
  );
};

export default CampaignFields;
