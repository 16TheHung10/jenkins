import { Col } from "antd";
import React, { Fragment } from "react";

const FieldList = ({ fields, span = 4 }) => {
  return (
    <Fragment>
      {fields?.map((field, index) => {
        return (
          <Col span={field.span || span} key={`total-bill-main-${index}`}>
            {field.component || field}
          </Col>
        );
      })}
    </Fragment>
  );
};

export default FieldList;
