import { Drawer, Row, message } from "antd";
import ItemsMasterApi from "api/ItemsMasterApi";
import MainTable from "components/common/Table/UI/MainTable";
import BaseButton from "components/common/buttons/baseButton/BaseButton";
import FieldList from "components/common/fieldList/FieldList";
import FormField from "data/oldVersion/formFieldRender";
import { useFormFields } from "hooks";
import React, { useEffect, useState } from "react";

const ItemDetailsInfo = ({ itemCode }) => {
  const [itemInfo, setItemInfo] = useState([]);
  const [isOpenDrawerEdit, setIsOpenDrawerEdit] = useState(false);
  const [payloadEdits, setPayloadEdits] = useState(null);
  const handleGetItemInfo = async () => {
    const res = await ItemsMasterApi.getItemInfo(itemCode);
    if (res.status) {
      setItemInfo(res.data.infor);
    } else {
      message.error(res.message);
    }
  };

  const handleEditItem = (value) => {};
  const handleCloseModal = () => {
    setIsOpenDrawerEdit(false);
  };
  const handleOpenModal = () => {
    setIsOpenDrawerEdit(true);
  };

  const { formInputsWithSpan: fields, onSubmitHandler: onEdit } = useFormFields(
    {
      fieldInputs: FormField.ItemMastereOverview.fieldInputs(),
      onSubmit: handleEditItem,
    },
  );
  const handleChange = (key, value) => {
    setPayloadEdits((prev) => ({ ...prev, [key]: value }));
  };
  useEffect(() => {
    if (itemCode) handleGetItemInfo();
  }, [itemCode]);
  const handleUpdateInfo = async () => {
    const keys = Object.keys(payloadEdits || {});
    const payload = keys.map((key, index) => {
      return {
        AttributeID: key,
        Value: payloadEdits?.[key],
      };
    });
    const res = await ItemsMasterApi.updateItemInfo(itemCode, {
      ItemInfors: payload,
    });
    if (res.status) {
      message.success("Update successfully");
    } else {
      message.error(res.message);
    }
  };
  return (
    <div className="">
      <BaseButton onClick={handleUpdateInfo}>Update</BaseButton>
      <MainTable
        className="mt-15"
        pagination={null}
        dataSource={itemInfo}
        columns={FormField.ItemMastereOverview.columns({
          onChange: handleChange,
        })}
      />
      <Drawer
        className=""
        placement="right"
        onClose={handleCloseModal}
        open={isOpenDrawerEdit}
        title="Feedback images"
      >
        <form className="section-block mt-15" onSubmit={onEdit}>
          <Row gutter={[16, 16]}>
            <FieldList fields={fields} />
            <BaseButton htmlType="submit" iconName="edit">
              Edit
            </BaseButton>
          </Row>
        </form>
      </Drawer>
    </div>
  );
};

export default ItemDetailsInfo;
