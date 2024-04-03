import { Col, Row } from "antd";
import React, { forwardRef, useEffect } from "react";

const FCManagementDetails = ({ hookFields, initialData }) => {
  const { formInputs, formValues, onSubmitHandler, reset, getValues } =
    hookFields;

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData]);

  return (
    <form onSubmit={onSubmitHandler} className="mt-15">
      <Row gutter={[16, 16]}>
        {formInputs?.slice(0, 2)?.map((item, index) => {
          return (
            <Col key={`fcManagementDetail-${index}`} span={6}>
              {item}
            </Col>
          );
        })}
      </Row>
      <Row gutter={[16, 16]} className="mt-15">
        {formInputs?.slice(2, formInputs?.length)?.map((item, index) => {
          return (
            <Col key={`fcManagementDetail-${index}`} span={6}>
              {item}
            </Col>
          );
        })}
      </Row>
    </form>
  );
};

export default FCManagementDetails;
