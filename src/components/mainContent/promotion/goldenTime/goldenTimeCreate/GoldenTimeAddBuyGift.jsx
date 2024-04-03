import { Button, Col, InputNumber, Modal, Row, message } from "antd";
import { useAppContext } from "contexts";
import { useHeaderActions } from "hooks";
import { useEffect, useMemo, useState } from "react";
import GoldenTimeAddItemTableContent from "./GoldenTimeAddItemTableContent";
import React from "react";
const GoldenTimeAddBuyGift = ({
  onSetTableData,
  tableData,
  componentImport,
  componentExport,
}) => {
  const {
    renderInputField,
    renderSelectField,
    renderDatePickerField,
    renderTimePickerField,
    fieldsState,
    clearFieldState,
  } = useHeaderActions();

  const { state, dispatch, onGetItems } = useAppContext();

  const [selectedRow, setSelectedRow] = useState(null);
  useEffect(() => {
    if (!state.items) {
      onGetItems();
    }
  }, [state.items]);
  const handleAddItemToTable = () => {
    const item = state.items?.[fieldsState?.itemCode];
    const isItemExists = tableData?.findIndex(
      (el) => el.itemCode === item.itemCode,
    );
    if (isItemExists !== undefined && isItemExists !== -1) {
      setSelectedRow({ ...tableData?.[isItemExists], index: isItemExists });
      message.error("Item already exists !!!");
      return;
    }
    if (!fieldsState?.itemCode) {
      message.error("Please insert Barcode");
      return;
    }
    const rowData = {
      ...item,
      qty: 1,
      group: 1,
      type: "0",
    };
    const tableDataClone = [...(tableData || [])];
    tableDataClone.push(rowData);
    onSetTableData(tableDataClone);
    clearFieldState();
  };

  const handleRemoveItemFromTable = (index) => {
    const cloneTableData = [...tableData];
    cloneTableData.splice(index, 1);
    onSetTableData([...(cloneTableData || [])]);
  };

  const handleChangeEditDiscount = (value) => {
    setSelectedRow((prev) => ({ ...prev, discount: value }));
  };

  const allItemArray = useMemo(() => {
    if (state.items) {
      return Object.keys(state.items)?.map((item) => {
        return state.items?.[item];
      });
    }
    return [];
  }, [state.items]);

  return (
    <div className="w-full box-shadow" style={{ marginTop: 20 }}>
      <Row className="w-full" gutter={[16, 16]}>
        <Col span={6}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              {renderSelectField(
                allItemArray,
                "itemCode",
                "itemCode-itemName",
                "Barcode",
                {
                  placeholder: "Enter the Barcode",
                },
              )}
            </Col>
            <Col span={24}>
              <Row>
                <Col span={6}>
                  <Button className="btn-danger" onClick={handleAddItemToTable}>
                    Add List
                  </Button>
                </Col>
                <Col span={6}>{componentImport}</Col>
                <Col span={6}>{componentExport}</Col>
              </Row>
            </Col>
          </Row>
        </Col>

        <Col span={18}>
          <GoldenTimeAddItemTableContent
            data={tableData}
            onRemoveItem={handleRemoveItemFromTable}
          />
        </Col>
      </Row>
    </div>
  );
};

export default GoldenTimeAddBuyGift;
