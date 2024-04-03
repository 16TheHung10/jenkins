import { Button, Col, Row } from "antd";
import FieldList from "components/common/fieldList/FieldList";
import React from "react";

const CheckVoucherMainSearch = ({ onSubmit, fields }) => {
  return (
    <form onSubmit={onSubmit} className="section-block mt-15 mb-15 ">
      <Row gutter={[16, 16]} className="items-center">
        <FieldList fields={fields} />
        <Col span={6}>
          <Button htmlType="submit" className="btn-danger">
            Search
          </Button>
        </Col>
      </Row>
    </form>
  );
};

export default CheckVoucherMainSearch;
