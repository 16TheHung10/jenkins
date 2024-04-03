import { Row } from "antd";
import FieldList from "components/common/fieldList/FieldList";
import SectionWithTitle from "components/common/section/SectionWithTitle";
import React from "react";
const CancelAccountFieldCompFilter = ({ fieldsProps }) => {
  const { formInputsWithSpan: fields, onSubmitHandler: onSearch } = fieldsProps;
  return (
    <SectionWithTitle title="Filter">
      <form onSubmit={onSearch} className="">
        <Row gutter={[16, 0]} className="items-center">
          <FieldList fields={fields} />
        </Row>
      </form>
    </SectionWithTitle>
  );
};

export default CancelAccountFieldCompFilter;
