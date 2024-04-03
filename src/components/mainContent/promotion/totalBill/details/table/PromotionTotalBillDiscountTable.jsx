import {
  Button,
  Col,
  Form,
  InputNumber,
  Modal,
  Row,
  Select,
  message,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import MainTable from "components/common/Table/UI/MainTable";
import { useAppContext, useTotalBillContext } from "contexts";
import actionCreator from "contexts/actionCreator";
import { TotalBillActions } from "contexts/actions";
import { OptionsHelper, StringHelper } from "helpers";
import { useFormFields, useImportExcel, useUploadImage } from "hooks";
import React, { useEffect, useState } from "react";
import DataRenderDiscountItem from "../DataRenderDiscountItem";
import DataRenderEditDiscountItem from "../DataRenderEditDiscountItem";
import PromotionTotalBillUploadImage from "../PromotionTotalBillUploadImage";

const PromotionTotalBillDiscountTable = ({ disableEdit }) => {
  const { state: TotalBillStateContext, dispatch: TotalBillDispatchContext } =
    useTotalBillContext();
  const {
    state: AppStateContext,
    dispatch: AppDispatchContext,
    onGetItems,
  } = useAppContext();
  const { dataImported } = useImportExcel();

  const validKeysTable = ["itemCode", "itemName", "discountAmount"];

  useEffect(() => {
    if (!AppStateContext.items) {
      onGetItems();
    }
  }, [AppStateContext.items]);

  useEffect(() => {
    if (dataImported && dataImported.length > 0) {
      for (let key of Object.keys(dataImported)) {
        if (!validKeysTable[key]) {
          message.error("Invalid field" + key);
          return;
        }
      }
      TotalBillDispatchContext(
        actionCreator(TotalBillActions.SET_DISCOUNT_TABLE_DATA, dataImported),
      );
    }
  }, [dataImported]);

  // State
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [selectedItemEdit, setSelectedItemEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // End State

  // Hooks
  const [form] = useForm();
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

  // End Hooks

  const onSubmit = (value) => {
    const currentValue = TotalBillStateContext.discountTableData || [];
    const newValue = [
      ...currentValue,
      {
        ...value,
        type: "1",
        image: listImageUploaded?.[0],
        ...(AppStateContext.items?.[value.itemCode] || {}),
      },
    ];
    TotalBillDispatchContext(
      actionCreator(TotalBillActions.SET_DISCOUNT_TABLE_DATA, newValue),
    );
    setSelectedItem(null);
    form.resetFields();
    handleSetListImage([]);
  };

  const handleEditItem = (record, index) => {
    setSelectedItemEdit(record);
    setIsModalOpen(true);
    setSelectedItemIndex(index);
  };

  const handleDeleteItem = (index) => {
    let currentValue = [...(TotalBillStateContext?.discountTableData || [])];
    const deletedItem = currentValue?.splice(index, 1);
    TotalBillDispatchContext(
      actionCreator(TotalBillActions.SET_DISCOUNT_TABLE_DATA, currentValue),
    );
  };

  const handleCancelEditModal = () => {
    setIsModalOpen(false);
  };

  const handleOkEditModal = async (value) => {
    try {
      let currentValue = [...(TotalBillStateContext?.discountTableData || [])];
      // Upload image when edit

      const newItem = {
        ...currentValue?.[selectedItemIndex],
        discountAmount: value.discountAmount,
      };
      if (selectedItemIndex !== -1) {
        const newValue = currentValue?.splice(selectedItemIndex, 1, {
          ...newItem,
          image: listImageUploadedEdit?.[0],
        });
      }
      TotalBillDispatchContext(
        actionCreator(TotalBillActions.SET_DISCOUNT_TABLE_DATA, currentValue),
      );
      setIsModalOpen(false);
    } catch (err) {
      message.error(err.message);
    }
  };
  const formFieldsEditItem = useFormFields({
    fieldInputs: DataRenderEditDiscountItem.fieldInputs(
      OptionsHelper.convertDataToOptions(
        Object.values(AppStateContext.items || {}),
        "itemCode",
        "itemCode-itemName",
      ),
      TotalBillStateContext?.discountTableData?.[selectedItemIndex],
    ),
    onSubmit: handleOkEditModal,
  });
  useEffect(() => {
    formFieldsEditItem.reset({
      ...TotalBillStateContext?.discountTableData?.[selectedItemIndex],
    });
    if (TotalBillStateContext?.discountTableData?.[selectedItemIndex]?.image) {
      handleSetListImageEdit([
        {
          ...TotalBillStateContext?.discountTableData?.[selectedItemIndex]
            ?.image,
        },
      ]);
    } else {
      handleSetListImageEdit([]);
    }
  }, [TotalBillStateContext?.discountTableData?.[selectedItemIndex]]);

  // Table props
  const TableColumns = DataRenderDiscountItem.columns({
    onDelete: handleDeleteItem,
    onEdit: handleEditItem,
  });

  const TableDataSource = TotalBillStateContext.discountTableData?.map(
    (item, index) => ({
      ...item,
      imageUrl: item?.image?.isFromServer
        ? item?.image?.url + Date.now()
        : item?.image?.url,
      key: item.itemCode,
    }),
  );

  const TablePagination = {
    position: ["bottomLeft"],
    // showSizeChanger: true,
    pageSize: 10,
    style: {
      marginTop: "30px",
      display: `${
        TotalBillStateContext?.discountTableData?.length >= 10 ? "" : "none"
      }`,
    },
  };

  const TableProps = {
    columns: disableEdit
      ? TableColumns?.slice(0, TableColumns.length - 1)
      : TableColumns,
    dataSource: TableDataSource,
    pagination: TablePagination,
  };
  // End Table props

  const ModalTitle = `Edit ${
    TotalBillStateContext?.discountTableData?.[selectedItemIndex]?.itemCode
  } - Max price ${
    StringHelper.formatPrice(
      TotalBillStateContext?.discountTableData?.[selectedItemIndex]?.salePrice,
    ) || 1000
  } VND`;

  return (
    <div className="box-shadow">
      <Modal
        title={ModalTitle}
        open={isModalOpen}
        onOk={formFieldsEditItem.onSubmitHandler}
        onCancel={handleCancelEditModal}
      >
        <div className="flex flex-col">
          <FormFields fields={formFieldsEditItem} />
          <label className="mt-10">Image</label>
          <PromotionTotalBillUploadImage
            onChange={handleUploadSingleImageEdit}
            onRemove={handleRemoveImageEdit}
            imageList={listImageUploadedEdit}
            buttonLabel={
              <>
                Change image of promotion{" "}
                <span className="ml-10 cl-red"> (Limit 1 image)</span>
              </>
            }
            disabledDelete
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
                showSearch
                onChange={(e) => {
                  setSelectedItem(AppStateContext?.items?.[e]);
                }}
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

            <Form.Item
              initialValue={1000}
              name="discountAmount"
              label={<p className="m-0">Discount Amount</p>}
            >
              <InputNumber
                disabled={selectedItem ? false : true}
                formatter={(value) => StringHelper.formatPrice(value)}
                min={1000}
                max={selectedItem?.salePrice || 1000}
                className="w-full"
                step={1000}
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
              {disableEdit ? null : (
                <>
                  {TotalBillStateContext.discountTableData?.length >=
                  1 ? null : (
                    <>
                      <Button htmlType="submit" className="btn-danger">
                        Add to list
                      </Button>
                      {/* <ComponentImport title="Import" /> */}
                    </>
                  )}
                </>
              )}

              {/* <ComponentExport
                title="Export"
                data={TotalBillStateContext?.discountTableData?.map((item) => ({
                  itemCode: item.itemCode,
                  itemName: item.itemName,
                  discountAmount: item.discountAmount,
                }))}
              /> */}
            </div>
          </Form>
        </Col>
        <Col span={16}>
          <MainTable {...TableProps} />
        </Col>
      </Row>
    </div>
  );
};

export default PromotionTotalBillDiscountTable;

const FormFields = ({ fields }) => {
  return fields.formInputs?.map((field, index) => {
    return (
      <div className="mt-10" key={`edit-item-${index}`}>
        {field}
      </div>
    );
  });
};
