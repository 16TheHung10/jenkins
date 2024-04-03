import { Button, Col, Form, Modal, Row, Select, message } from "antd";
import { useForm } from "antd/lib/form/Form";
import PromotionUploadImage from "components/common/Image/PromotionUploadImage";
import MainTable from "components/common/Table/UI/MainTable";
import { useAppContext, useTotalBillContext } from "contexts";
import actionCreator from "contexts/actionCreator";
import { TotalBillActions } from "contexts/actions";
import { OptionsHelper } from "helpers";
import { useImportExcel, useUploadImage } from "hooks";
import React, { useEffect, useMemo, useState } from "react";
import DataRenderFreeItem from "../DataRenderFreeItem";
import PromotionTotalBillUploadImage from "../PromotionTotalBillUploadImage";

const PromotionTotalBillFreeTable = ({ disableEdit }) => {
  const [form] = useForm();
  const { ComponentImport, ComponentExport, dataImported } = useImportExcel();

  const { state: TotalBillStateContext, dispatch: TotalBillDispatchContext } =
    useTotalBillContext();
  const {
    state: AppStateContext,
    dispatch: AppDispatchContext,
    onGetItems,
  } = useAppContext();

  useEffect(() => {
    if (!AppStateContext.items) {
      onGetItems();
    }
  }, [AppStateContext.items]);
  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Image
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

  const uploadedImage = useMemo(() => {
    return listImageUploaded?.[0];
  }, [listImageUploaded]);

  let tableData = useMemo(
    () => TotalBillStateContext.freeTableData || [],
    [TotalBillStateContext.freeTableData],
  );

  const onDelete = (index) => {
    const newValue = [...tableData];
    newValue.splice(index, 1);
    TotalBillDispatchContext(
      actionCreator(TotalBillActions.SET_FREE_TABLE_DATA, newValue),
    );
  };

  // EDIT ITEM
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleSetTableData = (data) => {
    TotalBillDispatchContext(actionCreator("SET_FREE_TABLE_DATA", data));
  };

  const handleOkEditModal = () => {
    const newDataTable = tableData;
    newDataTable[selectedRow.index].image = listImageUploadedEdit?.[0];
    handleSetTableData([...(newDataTable || [])]);
    setIsModalOpen(false);
    handleSetListImageEdit(null);
  };

  const handleCancelEditModal = () => {
    setIsModalOpen(false);
  };

  const handleEditItem = (record, index) => {
    setSelectedRow({ ...record, index });
    if (TotalBillStateContext?.freeTableData?.[index]?.image) {
      handleSetListImageEdit([
        { ...TotalBillStateContext?.freeTableData?.[index]?.image },
      ]);
    } else {
      handleSetListImageEdit(null);
    }
    showModal();
  };
  // END EDIT ITEM

  const onSubmit = (value) => {
    // console.log({uploadedImage})
    const checkExists = tableData?.findIndex(
      (item) => item.itemCode === value.itemCode,
    );
    if (checkExists !== -1) {
      message.error("Item already exists");
      return;
    }
    const items = AppStateContext.items;

    const newValue = [
      ...tableData,
      { ...items?.[value.itemCode], type: "2", image: uploadedImage },
    ];
    TotalBillDispatchContext(
      actionCreator(TotalBillActions.SET_FREE_TABLE_DATA, newValue),
    );
    form.resetFields();
    handleSetListImage([]);
  };

  useEffect(() => {
    if (dataImported && dataImported?.length > 0) {
      TotalBillDispatchContext(
        actionCreator(TotalBillActions.SET_FREE_TABLE_DATA, dataImported),
      );
    }
  }, [dataImported]);

  const TableColumns = DataRenderFreeItem.columns({
    onEdit: handleEditItem,
    onDelete,
    disableEdit,
  });
  return (
    <div className="box-shadow">
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
      <Row gutter={16}>
        <Col span={8}>
          <Form onFinish={onSubmit} layout="vertical" form={form}>
            <Form.Item
              name="itemCode"
              label={<p className="required">Item</p>}
              rules={[
                {
                  required: true,
                  message: "Please select item",
                },
              ]}
            >
              <Select
                disabled={disableEdit}
                showSearch
                placeholder="Select item"
                filterOption={(input, option) => {
                  return (
                    option?.label?.toString().toLowerCase() ?? ""
                  ).includes(input.toString().trim().toLowerCase());
                }}
                options={OptionsHelper.convertDataToOptions(
                  Object.values(AppStateContext.items || {}),
                  "itemCode",
                  "itemCode-itemName",
                )}
              />
            </Form.Item>
            {disableEdit ? null : (
              <>
                <PromotionTotalBillUploadImage
                  onChange={handleUploadSingleImage}
                  onRemove={handleRemoveImage}
                  imageList={listImageUploaded}
                />
              </>
            )}

            <div className="flex items-center gap-10">
              {disableEdit ||
              TotalBillStateContext.freeTableData?.length >= 1 ? null : (
                <>
                  <Button htmlType="submit" className="btn-danger">
                    Add to list
                  </Button>
                  {/* <ComponentImport title="Import" /> */}
                </>
              )}

              {/* <ComponentExport
                title="Export"
                data={TotalBillStateContext?.freeTableData?.map((item) => ({
                  itemCode: item.itemCode,
                  itemName: item.itemName,
                }))}
              /> */}
            </div>
          </Form>
        </Col>
        <Col span={16}>
          <MainTable
            pagination={{
              position: ["bottomCenter"],
              // showSizeChanger: true,
              pageSize: 10,
              style: {
                marginTop: "30px",
                display: `${
                  TotalBillStateContext.freeTableData?.length >= 10
                    ? ""
                    : "none"
                }`,
              },
            }}
            dataSource={TotalBillStateContext.freeTableData?.map(
              (item, index) => ({
                ...item,
                imageUrl: item?.image?.isFromServer
                  ? item?.image?.url + Date.now()
                  : item?.image?.url,
                key: item.itemCode,
              }),
            )}
            columns={
              disableEdit
                ? TableColumns.slice(0, TableColumns?.length - 1)
                : TableColumns
            }
          />
        </Col>
      </Row>
    </div>
  );
};

export default PromotionTotalBillFreeTable;
