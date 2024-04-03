import { Button, Col, Row } from "antd";
import React from "react";

const FCManagementOverviewFields = ({ hookFields }) => {
  const { formInputs, formValues, onSubmitHandler, reset, getValues } =
    hookFields;
  return (
    <form onSubmit={onSubmitHandler} className="section-block mt-15">
      <Row gutter={[16, 0]} className="items-center">
        {formInputs?.map((item, index) => {
          return (
            <Col key={`fcManagementOvervieFields-${index}`} span={6}>
              {item}
            </Col>
          );
        })}
        <Col span={6}>
          <Button htmlType="submit" className="btn-danger">
            Search
          </Button>
        </Col>
      </Row>
    </form>
  );
};

export default FCManagementOverviewFields;
