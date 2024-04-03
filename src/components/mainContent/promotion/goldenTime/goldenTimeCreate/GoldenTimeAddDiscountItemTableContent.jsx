import TableContent from "components/common/Table/UI/TableContent";
import { GoldenTimeAddNewDiscountItemTableData } from "data/oldVersion/mockData/GoldenTimeAddNewDiscountItemTableData";
import React from "react";

const GoldenTimeAddDiscountItemTableContent = ({
  data,
  onRemoveItem,
  onEditItem,
  disabled,
}) => {
  return (
    <div className="prime_time">
      <TableContent
        disabled={disabled}
        loading={false}
        pagination={{
          position: ["bottomLeft"],
        }}
        dataTable={data}
        th={GoldenTimeAddNewDiscountItemTableData.th({
          onRemoveItem,
          onEditItem,
          disabledEdit: disabled,
        })}
        rowKey={GoldenTimeAddNewDiscountItemTableData.rowKey}
      />
    </div>
  );
};

export default GoldenTimeAddDiscountItemTableContent;
