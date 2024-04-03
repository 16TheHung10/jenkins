import { Button, Col, Modal, Row, message } from "antd";
import PromotionUploadImage from "components/common/Image/PromotionUploadImage";
import MainTable from "components/common/Table/UI/MainTable";
import { useAppContext, useGoldenTimeContext } from "contexts";
import actionCreator from "contexts/actionCreator";
import PrimeTimeFreeItem from "data/oldVersion/formFieldRender/PrimeTimeFreeItem";
import { useHeaderActions, useUploadImage } from "hooks";
import React, { useEffect, useMemo, useState } from "react";

const PrimeTimeFreeTabItem = ({ disabled }) => {
  const [stateGoldenTime, dispatchGoldenTime] = useGoldenTimeContext();
  const tableData = useMemo(() => {
    return stateGoldenTime.freeTableData;
  }, [stateGoldenTime.freeTableData]);
  const { renderSelectField, fieldsState, clearFieldState } =
    useHeaderActions();
  const { state, onGetItems } = useAppContext();
  const [statePrimeTime, dispatchPrimeTime] = useGoldenTimeContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalError, setModalError] = useState("");

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

  const handleSetTableData = (data) => {
    dispatchPrimeTime(actionCreator("SET_FREE_TABLE_DATA", data));
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOkEditModal = () => {
    const newDataTable = tableData;
    newDataTable[selectedRow.index].image = listImageUploadedEdit?.[0];
    handleSetTableData([...(newDataTable || [])]);
    clearFieldState();
    setIsModalOpen(false);
    handleSetListImageEdit([]);
  };

  const handleCancelEditModal = () => {
    setIsModalOpen(false);
  };

  const handleEditItem = (record, index) => {
    setSelectedRow({ ...record, index });
    if (statePrimeTime?.freeTableData?.[index]?.image) {
      handleSetListImageEdit([
        { ...statePrimeTime?.freeTableData?.[index]?.image },
      ]);
    } else {
      handleSetListImageEdit(null);
    }
    showModal();
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
      image,
    };
    const tableDataClone = [...(tableData || [])];
    tableDataClone.push(rowData);
    handleSetTableData(tableDataClone);
    clearFieldState();
    handleSetListImage([]);
  };

  const handleRemoveItemFromTable = (index) => {
    const cloneTableData = [...tableData];
    cloneTableData.splice(index, 1);
    handleSetTableData([...(cloneTableData || [])]);
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
    <div className="w-full" style={{ marginTop: 20 }}>
      <Modal
        title={`Edit #${selectedRow?.itemCode} - ${selectedRow?.itemName}`}
        open={isModalOpen}
        onOk={handleOkEditModal}
        onCancel={handleCancelEditModal}
      >
        <div className="flex flex-col">
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
                <p className="required">Barcode</p>,
                {
                  placeholder: "Enter the Barcode",
                  disabled,
                },
              )}
            </Col>
            <Col span={24}>
              {disabled ? null : (
                <PromotionUploadImage
                  disabledDelete
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
                  data={statePrimeTime?.freeTableData?.map((item) => ({
                    itemCode: item.itemCode,
                    itemName: item.itemName,
                    quantity: item.qty,
                    type: item.type,
                    image: item.image?.isFromServer ? item.image.url : 'Not available in server',
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
                ? PrimeTimeFreeItem.columns({
                    onEdit: handleEditItem,
                    onRemove: handleRemoveItemFromTable,
                  })?.slice(
                    0,
                    PrimeTimeFreeItem.columns({
                      onEdit: handleEditItem,
                      onRemove: handleRemoveItemFromTable,
                    })?.length - 1,
                  )
                : PrimeTimeFreeItem.columns({
                    onEdit: handleEditItem,
                    onRemove: handleRemoveItemFromTable,
                  })
            }
          />
        </Col>
      </Row>
    </div>
  );
};

export default PrimeTimeFreeTabItem;
