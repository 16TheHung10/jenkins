import React from "react";
import FieldList from "components/common/fieldList/FieldList";
import { Col, Row } from "antd";
import BaseButton from "components/common/buttons/baseButton/BaseButton";
const SMSReportFieldCompFilter = ({ fieldsProps }) => {
  const { formInputsWithSpan: fields, onSubmitHandler: onSearch } = fieldsProps;
  return (
    <form onSubmit={onSearch} className="">
      <Row gutter={[16, 0]} className="items-center">
        <FieldList fields={fields} />
      </Row>
    </form>
  );
};

export default React.memo(SMSReportFieldCompFilter);
