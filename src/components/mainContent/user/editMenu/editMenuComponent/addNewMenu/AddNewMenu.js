import { Button, Modal, Row, Tabs, message } from "antd";
import FieldList from "components/common/fieldList/FieldList";
import { useAddIconMenu, useFormFields } from "hooks";
import MenuModel from "models/MenuModel";
import React, { useEffect, useMemo, useState } from "react";
import SettingModel from "models/SettingModel";
import { APIHelper, ArrayHelper, DateHelper, UrlHelper } from "helpers";
import * as yup from "yup";
import "./style.scss";

const AddNewMenu = ({ initialMenu, initialAppPermission }) => {
  const [parentOptions, setParentOptions] = useState([]);
  const [treeData, setTreeData] = useState([]);

  const [isModalClearCacheOpen, setIsModalClearCacheOpen] = useState(false);

  const onToggleModalClearCache = () => {
    setIsModalClearCacheOpen((prev) => !prev);
  };

  // Request status
  const [isAddNewParentMenuSuccess, setIsAddNewParentMenuSuccess] =
    useState(false);
  const [isAddNewChildMenuSuccess, setIsAddNewChildMenuSuccess] =
    useState(false);

  const initialAddChildFields = useMemo(() => {
    return [
      {
        name: "ParentID",
        label: "Select menu",
        type: "select-tree",
        labelClass: "required",
        treeData: parentOptions,
        placeholder: "--Parent node--",
        rules: yup.string().required("Parent is required"),
        span: 24,
      },
    ];
  }, [parentOptions]);

  const { Component, selectedIcon, onSetSelectedIcon } = useAddIconMenu();
  const {
    Component: ComponentChild,
    selectedIcon: selectedIconChild,
    onSetSelectedIcon: onSetSelectedIconChild,
  } = useAddIconMenu();

  const [addChildFields, setAddChildFields] = useState(initialAddChildFields);

  const handleAddParent = async (value) => {
    setIsAddNewParentMenuSuccess(false);
    if (!selectedIcon.iconClass) {
      message.error("Please select menu icon");
      return;
    }
    const lastIndex = parentOptions?.length || 0;
    setParentOptions((prev) => [
      ...prev,
      { value: lastIndex, label: value.parentTitle },
    ]);
    setTreeData((prev) => [
      ...prev,
      { key: `${lastIndex.toString()}`, title: value.parentTitle },
    ]);
    const payload = {
      ...value,
      Icon: selectedIcon?.iconClass,
      ParentID: 0,
      AppPermission: initialAppPermission.toString(),
    };
    const model = new MenuModel();
    const res = await model.createMenu(payload);

    if (res.status) {
      onSetSelectedIcon(null);
      setIsAddNewParentMenuSuccess(true);
      message.success("Create menu successfully");
      onToggleModalClearCache();
    } else {
      message.error(res.message);
    }
    return res;
  };
  const handleAddChild = async (value) => {
    setIsAddNewChildMenuSuccess(false);
    if (!selectedIconChild?.iconClass) {
      message.error("Please select menu icon");
      return;
    }
    const payload = {
      ...value,
      Icon: selectedIconChild?.iconClass,
      AppPermission: initialAppPermission.toString(),
    };
    const model = new MenuModel();
    const res = await model.createMenu(payload);
    if (res.status) {
      onSetSelectedIconChild(null);
      setIsAddNewChildMenuSuccess(true);
      message.success("Create menu successfully");
      onToggleModalClearCache();
    } else {
      message.error(res.message);
    }
  };

  //   Childrend
  const {
    formInputsWithSpan: childFields,
    onSubmitHandler: onAddChild,
    getValues: getValuesChild,
    setValue: setValueChild,
    reset: resetChild,
  } = useFormFields({
    fieldInputs: addChildFields,
    onSubmit: handleAddChild,
    watches: ["ParentID"],
  });

  //   Add parent
  const { formInputsWithSpan, onSubmitHandler, reset, getValues } =
    useFormFields({
      fieldInputs: [
        {
          name: "Name",
          label: "Menu name",
          labelClass: "required",
          type: "text",
          placeholder: "Enter menu name",
          rules: yup.string().required("Please enter new menu name"),
          span: 24,
        },
        {
          name: "Url",
          label: "Url",
          labelClass: "required",
          type: "text",
          placeholder: "Enter menu url",
          rules: yup.string().required("Please enter url"),
          span: 24,
        },
      ],
      onSubmit: handleAddParent,
      // watches: ['parentTitle'],
    });

  const handleFormatTreeDataToOptions = (treeData) => {
    if (!treeData || treeData.length === 0) return;
    return treeData.map((item) => ({
      ...item,
      title: item.originTitle,
      value: item.key,
      children: handleFormatTreeDataToOptions(item.children),
    }));
  };

  const handleClearCacheByName = async () => {
    let settModel = new SettingModel();
    settModel
      .clearCacheByName("setting", DateHelper.displayDateFormat(Date.now()))
      .then((response) => {
        message.config("Clear cache sccessfully");
      });
  };

  useEffect(() => {
    const selectedParent = getValuesChild("ParentID");
    if (selectedParent) {
      setAddChildFields((prev) => [
        ...initialAddChildFields,
        {
          name: "Name",
          label: "Menu name",
          labelClass: "required",
          type: "text",
          placeholder: "Enter menu name",
          rules: yup.string().required("Please enter new menu name"),
          span: 24,
        },
        {
          name: "Url",
          label: "Url",
          labelClass: "required",
          type: "text",
          placeholder: "Enter menu url",
          rules: yup.string().required("Please enter new menu name"),
          span: 24,
        },
      ]);
    } else {
      setAddChildFields(initialAddChildFields);
    }
  }, [getValuesChild("ParentID"), initialAddChildFields]);

  useEffect(() => {
    setParentOptions(handleFormatTreeDataToOptions(initialMenu));
  }, [initialMenu]);

  useEffect(() => {
    if (isAddNewParentMenuSuccess) reset({});
  }, [isAddNewParentMenuSuccess]);

  useEffect(() => {
    if (isAddNewChildMenuSuccess) resetChild({});
  }, [isAddNewChildMenuSuccess]);

  const items = [
    {
      key: "1",
      label: `Menu`,
      children: (
        <div className="">
          <form
            onSubmit={async (e) => {
              await onSubmitHandler(e);
              // reset({})
            }}
          >
            <Row gutter={[16, 0]}>
              <FieldList fields={formInputsWithSpan} />
            </Row>
            <Component />

            <Button
              className="mt-10 btn-danger"
              htmlType="submit"
              style={{ minWidth: "120px" }}
            >
              Add new menu
            </Button>
          </form>
        </div>
      ),
    },
    {
      key: "2",
      label: `Sub-menu`,
      children: (
        <>
          <form
            onSubmit={async (e) => {
              await onAddChild(e);
              // resetChild({});
            }}
          >
            <Row gutter={[16, 0]}>
              <FieldList fields={childFields} />
            </Row>
            <ComponentChild />
            <Button
              className="mt-10 btn-danger"
              htmlType="submit"
              style={{ minWidth: "120px" }}
            >
              Add new sub-menu
            </Button>
          </form>
        </>
      ),
    },
  ];
  return (
    <div id="add_new_menu">
      <Tabs defaultActiveKey="1" items={items} />
      <Modal
        title="Clear cache"
        open={isModalClearCacheOpen}
        footer={false}
        onCancel={onToggleModalClearCache}
      >
        <div className="section-block mt-15 flex items-center gap-10 tag_warning">
          <p className="m-0">Do you want to clear cache ? </p>
          <Button
            onClick={async () => {
              await handleClearCacheByName();
              onToggleModalClearCache();
            }}
            className="btn-danger"
          >
            Clear
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AddNewMenu;
