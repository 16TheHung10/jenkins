import { Button, Col, Input, InputNumber, Modal, Row, message } from "antd";
import { useHeaderActions } from "hooks";
import { useAppContext } from "contexts";
import { useMemo, useState } from "react";
import React from "react";
import GoldenTimeAddItemTableContent from "./GoldenTimeAddItemTableContent";
import { DateOfWeekData } from "data/oldVersion/mockData/DateOfWeek";
import GoldenTimeAddDiscountItemTableContent from "./GoldenTimeAddDiscountItemTableContent";
const GoldenTimeAddDiscountGift = ({
  onSetTableData,
  tableData,
  componentImport,
  componentExport,
}) => {
  const { renderInputField, renderSelectField, fieldsState, clearFieldState } =
    useHeaderActions();
  const { state, onGetItems } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOkEditModal = () => {
    if (!selectedRow.discountAmount) {
      message.error("Please insert discount amount");
      return;
    }
    if (+selectedRow.discountAmount < 1000) {
      message.error("Please insert discount amount more than 1000 VND");
      return;
    }
    const newDataTable = tableData;
    newDataTable[selectedRow.index].discountAmount = selectedRow.discountAmount;
    onSetTableData([...(newDataTable || [])]);
    clearFieldState();
    setIsModalOpen(false);
  };

  const handleCancelEditModal = () => {
    setIsModalOpen(false);
  };
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
      showModal();
      message.error(
        "Item already exists !!!, Please edit it instead of create new one",
      );
      return;
    }
    if (!fieldsState?.itemCode) {
      message.error("Please insert Barcode");
      return;
    }
    if (!fieldsState?.discountAmount) {
      message.error("Please insert discount amount");
      return;
    }
    if (+fieldsState?.discountAmount < 1000) {
      message.error("Please insert discount amount more than 1000 VND");
      return;
    }

    const rowData = {
      ...item,
      discountAmount: fieldsState?.discountAmount,
    };

    const tableDataClone = [...(tableData || [])];
    tableDataClone.push(rowData);
    onSetTableData(tableDataClone);
    clearFieldState();
  };

  const handleEditItem = (record, index) => {
    setSelectedRow({ ...record, index });
    showModal();
  };

  const handleRemoveItemFromTable = (index) => {
    const cloneTableData = [...tableData];
    cloneTableData.splice(index, 1);
    onSetTableData([...(cloneTableData || [])]);
  };

  const handleChangeEditDiscount = (value) => {
    setSelectedRow((prev) => ({ ...prev, discountAmount: value }));
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
      <Modal
        title={`Edit #${selectedRow?.itemCode} - ${selectedRow?.itemName}`}
        open={isModalOpen}
        onOk={handleOkEditModal}
        onCancel={handleCancelEditModal}
      >
        <div className="flex flex-col">
          <label htmlFor="discount">Discount (VNĐ)</label>
          <InputNumber
            id="discount"
            className="w-full"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            value={selectedRow?.discountAmount}
            onChange={handleChangeEditDiscount}
          />
        </div>
      </Modal>
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
              {renderInputField("discountAmount", "Discount", "number")}
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
          <GoldenTimeAddDiscountItemTableContent
            data={tableData}
            onRemoveItem={handleRemoveItemFromTable}
            onEditItem={handleEditItem}
          />
        </Col>
      </Row>
    </div>
  );
};

export default GoldenTimeAddDiscountGift;
