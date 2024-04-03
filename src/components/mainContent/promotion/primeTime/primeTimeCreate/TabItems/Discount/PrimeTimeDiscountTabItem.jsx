import { Button, Col, InputNumber, Modal, Row, message } from "antd";
import PromotionUploadImage from "components/common/Image/PromotionUploadImage";
import MainTable from "components/common/Table/UI/MainTable";
import { useAppContext, useGoldenTimeContext } from "contexts";
import actionCreator from "contexts/actionCreator";
import PrimeTimeDiscountItem from "data/oldVersion/formFieldRender/PrimeTimeDiscountItem";
import { useHeaderActions, useUploadImage } from "hooks";
import React, { useEffect, useMemo, useState } from "react";

const PrimeTimeDiscountTabItem = ({ disabled }) => {
  const [stateGoldenTime, dispatchGoldenTime] = useGoldenTimeContext();
  const tableData = useMemo(() => {
    return stateGoldenTime.discountTableData;
  }, [stateGoldenTime.discountTableData]);
  const {
    renderInputField,
    renderSelectField,
    fieldsState,
    clearFieldState,
    handleSetState,
  } = useHeaderActions();

  const {
    handleRemoveImage,
    handleUploadSingleImage,
    handleSetListImage,
    listImageUploaded,
  } = useUploadImage();
  const {
    handleRemoveImage: handleRemoveImageEdit,
    handleUploadSingleImage: handleUploadSingleImageEdit,
    handleSetListImage: handleSetListImageEdit,
    listImageUploaded: listImageUploadedEdit,
  } = useUploadImage();

  const { state, onGetItems } = useAppContext();
  const [statePrimeTime, dispatchPrimeTime] = useGoldenTimeContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalError, setModalError] = useState("");

  const handleSetTableData = (data) => {
    dispatchPrimeTime(actionCreator("SET_DISCOUNT_TABLE_DATA", data));
  };
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
    newDataTable[selectedRow.index].image = listImageUploadedEdit?.[0];
    handleSetTableData([...(newDataTable || [])]);

    clearFieldState();
    setIsModalOpen(false);
    handleSetListImageEdit([]);
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
    const image = listImageUploaded?.[0];

    const isItemExists = tableData?.findIndex(
      (el) => el.itemCode === item.itemCode,
    );
    if (isItemExists !== undefined && isItemExists !== -1) {
      setSelectedRow({ ...tableData?.[isItemExists], index: isItemExists });
      showModal();
      setModalError(
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
      image,
    };

    const tableDataClone = [...(tableData || [])];
    tableDataClone.push(rowData);
    handleSetTableData(tableDataClone);
    clearFieldState();
    handleSetListImage([]);
  };

  const handleEditItem = (record, index) => {
    setSelectedRow({ ...record, index });
    handleSetListImageEdit([
      { ...statePrimeTime?.discountTableData?.[index]?.image },
    ]);
    showModal();
  };

  const handleRemoveItemFromTable = (index) => {
    const cloneTableData = [...tableData];
    cloneTableData.splice(index, 1);
    handleSetTableData([...(cloneTableData || [])]);
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

  useEffect(() => {
    handleSetState({ ...fieldsState, discountAmount: 1000 });
  }, [fieldsState?.itemCode]);
  return (
    <div className="w-full" style={{ marginTop: 20 }}>
      <Modal
        title={`Edit #${selectedRow?.itemCode} - ${selectedRow?.itemName}`}
        open={isModalOpen}
        onOk={handleOkEditModal}
        onCancel={handleCancelEditModal}
      >
        <div className="flex flex-col">
          <div className="">
            <p className="error-text">{modalError}</p>
            <label htmlFor="discount">Discount (VNĐ)</label>
            <InputNumber
              id="discount"
              className="w-full"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              value={selectedRow?.discountAmount}
              min={1000}
              max={selectedRow?.salePrice || 1000}
              onChange={handleChangeEditDiscount}
            />
          </div>

          <PromotionUploadImage
            disabledDelete
            className="mt-10"
            onChange={handleUploadSingleImageEdit}
            onRemove={handleRemoveImageEdit}
            imageList={listImageUploadedEdit}
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
                  disabled,
                },
              )}
            </Col>
            <Col span={24}>
              {renderInputField("discountAmount", "Discount", "number", {
                disabled: !fieldsState?.itemCode,
                placeholder: `${
                  !fieldsState?.storeCode
                    ? "Select item bofore set discount value"
                    : "Enter discount value"
                }`,
                max: state.items?.[fieldsState?.itemCode]?.salePrice || 1000,
                min: 1000,
                step: 1000,
              })}
            </Col>
            <Col span={24} className="mt-10">
              {disabled ? null : (
                <PromotionUploadImage
                  onChange={handleUploadSingleImage}
                  onRemove={handleRemoveImage}
                  imageList={listImageUploaded}
                />
              )}
            </Col>
            <Col span={24}>
              {disabled ? null : (
                <>
                  <Button
                    className="btn-danger w-fit"
                    onClick={handleAddItemToTable}
                  >
                    Add List
                  </Button>
                  {/* <ComponentImport title="Import" /> */}
                </>
              )}
              {/* <ComponentExport
                  title="Export"
                  data={statePrimeTime?.discountTableData?.map((item) => ({
                    itemCode: item.itemCode,
                    discount: item.discountAmount,
                  }))}
                /> */}
            </Col>
          </Row>
        </Col>

        <Col span={18}>
          <MainTable
            loading={false}
            dataSource={tableData?.map((item, index) => ({
              ...item,
              imageUrl: item?.image?.isFromServer
                ? item?.image?.url + Date.now()
                : item?.image?.url,
              key: item.itemCode,
            }))}
            pagination={{
              position: ["bottomLeft"],
            }}
            columns={
              disabled
                ? PrimeTimeDiscountItem.columns({
                    onRemove: handleRemoveItemFromTable,
                    onEdit: handleEditItem,
                  })?.slice(
                    0,
                    PrimeTimeDiscountItem.columns({
                      onRemove: handleRemoveItemFromTable,
                      onEdit: handleEditItem,
                    })?.length - 1,
                  )
                : PrimeTimeDiscountItem.columns({
                    onRemove: handleRemoveItemFromTable,
                    onEdit: handleEditItem,
                  })
            }
          />
        </Col>
      </Row>
    </div>
  );
};

export default PrimeTimeDiscountTabItem;
