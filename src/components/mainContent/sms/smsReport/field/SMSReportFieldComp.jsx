import React from "react";
import FieldList from "components/common/fieldList/FieldList";
import { Col, Row } from "antd";
import BaseButton from "components/common/buttons/baseButton/BaseButton";
const SMSReportFieldComp = ({ fieldsProps }) => {
  const { formInputsWithSpan: fields, onSubmitHandler: onSearch } = fieldsProps;
  return (
    <form onSubmit={onSearch} className="">
      <Row gutter={[16, 0]} className="items-center">
        <FieldList fields={fields} />
        <Col span={6}>
          <div className="flex items-center gap-10">
            <BaseButton iconName="search" htmlType="submit">
              Search
            </BaseButton>
          </div>
        </Col>
      </Row>
    </form>
  );
};

export default SMSReportFieldComp;
