import {
  Button,
  Checkbox,
  Col,
  Drawer,
  Row,
  Tabs,
  TreeSelect,
  message,
} from "antd";
import FieldList from "components/common/fieldList/FieldList";
import { useAddIconMenu, useFormFields } from "hooks";
import MenuModel from "models/MenuModel";
import React, { useEffect, useState } from "react";
import * as yup from "yup";

const DrawerAdd = ({
  selectedNode,
  allTreeData,
  title,
  onToggleModalClearCache,
  ...props
}) => {
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [movedCheckedKeys, setMovedCheckedKeys] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [fieldInputs, setFieldInputs] = useState();
  const [selectedMoveParent, setSelectedMoveParent] = useState();
  const [isUseAsParent, setIsUseAsParent] = useState(false);

  const {
    Component: SelectIcons,
    selectedIcon: selectedIcon,
    onSetSelectedIcon,
  } = useAddIconMenu();
  const {
    Component: SelectIconsChild,
    selectedIcon: selectedIconChild,
    onSetSelectedIcon: onSetSelectedIconChild,
  } = useAddIconMenu();

  const onChangeSelectMoveParent = (newValue) => {
    setSelectedMoveParent(newValue);
  };

  const renderNode = (selectedNode) => {
    if (selectedNode.children) {
    }
  };

  const formatTreeData = (data) => {
    if (!data || data.length === 0) return;
    return data.map((item) => {
      return {
        ...item,
        title: item.originTitle,
        key: `${item.key.toString()}`,
        value: `${item.key.toString()}`,
        children: formatTreeData(item.children),
      };
    });
  };

  useEffect(() => {
    if (selectedNode) {
      setTreeData(formatTreeData([selectedNode]));
    }
    if (selectedNode?.originTitle) {
      resetChangeNodeName({
        Name: selectedNode.originTitle,
        Url: selectedNode.url,
      });
      setFieldInputs([
        {
          name: "Name",
          label: "New menu name",
          labelClass: "required",
          type: "text",
          rules: yup.string().required("Please enter new menu name"),
          span: 24,
        },
        {
          name: "Url",
          label: "New menu url",
          labelClass: "required",
          type: "text",
          rules: yup.string().required("Please enter new menu url"),
          span: 24,
        },
      ]);
    }
  }, [selectedNode, selectedNode?.originTitle, selectedNode?.key]);
  const handleEditMenu = async (menuID, payload) => {
    const model = new MenuModel();
    const res = await model.editMenu(menuID, payload);
    return res;
  };

  const handleChangeMenuName = async (value) => {
    const payload = {
      ...value,
      Url: value.Url || selectedNode.url,
      Icon: selectedIcon?.iconClass || selectedNode.icon,
      ParentID: selectedNode?.parentID,
      AppPermission: selectedNode.appPermission,
    };
    const res = await handleEditMenu(selectedNode.key, payload);
    if (res.status) {
      setTreeData((prev) => [
        { ...prev[0], title: value.newMenuName, url: value.Url },
      ]);
      message.success("Change name successfully");
      onToggleModalClearCache();
    } else {
      message.error(res.message);
    }
  };

  const handleAddChild = async (value) => {
    if (!selectedIconChild?.iconClass) {
      message.error("Please select menu icon");
      return;
    }
    if (!selectedNode) {
      message.error("Invalid node");
      return;
    }
    const model = new MenuModel();
    const payload = {
      ...value,
      ParentID: selectedNode?.key,
      AppPermission: selectedNode?.appPermission,
      Icon: selectedIconChild?.iconClass,
    };
    const res = await model.createMenu(payload);
    if (res.status) {
      setTreeData((prev) => {
        return [
          {
            ...prev[0],
            children: [
              ...(prev[0]?.children || []),
              { title: value.newChildName },
            ],
          },
        ];
      });
      message.success("Add child successfully");
      onToggleModalClearCache();
    } else {
      message.error(res.message);
    }
    return res;
  };
  // Change menu name
  const {
    formInputsWithSpan: fieldsChangeName,
    onSubmitHandler: onChangeNodeName,
    reset: resetChangeNodeName,
  } = useFormFields({
    fieldInputs,
    onSubmit: handleChangeMenuName,
  });

  // Add new child
  const {
    formInputsWithSpan: formInputsWithSpanAddChild,
    onSubmitHandler: onAddChild,
    reset: resetAddChild,
  } = useFormFields({
    fieldInputs: [
      {
        name: "Name",
        label: "Child name",
        labelClass: "required",
        type: "text",
        placeholder: "Enter child name",
        rules: yup.string().required("Please enter new menu name"),
        span: 24,
      },
      {
        name: "Url",
        label: "Child url",
        labelClass: "required",
        type: "text",
        placeholder: "Enter child url",
        rules: yup.string().required("Please enter new menu url"),
        span: 24,
      },
    ],
    onSubmit: handleAddChild,
  });

  // Move node
  const handleMoveNode = async () => {
    if (!selectedNode) {
      message.error("Invalid node");
      return;
    }
    let payload = {
      AppPermission: selectedNode.appPermission,
      Url: selectedNode.url,
      Icon: selectedNode.icon,
      Name: selectedNode.originTitle,
    };
    if (isUseAsParent) {
      // Change ParentID to 0
      payload = { ...payload, ParentID: 0 };
    } else {
      payload = { ...payload, ParentID: selectedMoveParent };
    }
    const res = await handleEditMenu(selectedNode.key, payload);
    if (res.status) {
      message.success("Move menu node successfully");
    } else {
      message.error(res.message);
    }
  };

  const onChangeUseAsParent = (e) => {
    const checked = e.target.checked;
    setIsUseAsParent(checked);
  };
  const items = [
    {
      key: "1",
      label: `Change name`,
      children: (
        <>
          <form
            onSubmit={(e) => {
              onChangeNodeName(e);
              resetChangeNodeName({});
            }}
            className="mb-10"
          >
            <Row gutter={[16, 0]}>
              <FieldList fields={fieldsChangeName} />
              <SelectIcons />
              <Col span={24} className="mt-10">
                <Button htmlType="submit" className="btn-danger">
                  Change
                </Button>
              </Col>
            </Row>
          </form>
        </>
      ),
    },
    {
      key: "2",
      label: `Add child`,
      children: (
        <>
          <form
            onSubmit={async (e) => {
              const res = await onAddChild(e);
              if (res && res.status) {
                resetAddChild({});
              }
            }}
            className="mb-10"
          >
            <Row gutter={[16, 16]}>
              <FieldList fields={formInputsWithSpanAddChild} />
              <Col span={24}>{<SelectIconsChild />}</Col>
              <Col span={24}>
                <Button htmlType="submit" className="btn-danger">
                  Add child
                </Button>
              </Col>
            </Row>
          </form>
        </>
      ),
    },
    {
      key: "3",
      label: `Move`,
      children: (
        <>
          <Checkbox onChange={onChangeUseAsParent}>
            <p style={{ fontSize: "12px" }}>Use as parent node</p>
          </Checkbox>
          {isUseAsParent ? null : (
            <div>
              <label
                style={{ fontSize: "12px" }}
                htmlFor=""
                className="required"
              >
                New parent
              </label>
              <TreeSelect
                placeholder="--Select parent to move--"
                treeNodeFilterProp="title"
                showSearch
                style={{
                  width: "100%",
                }}
                value={selectedMoveParent}
                onChange={onChangeSelectMoveParent}
                allowClear
                treeData={formatTreeData(allTreeData)}
              />
            </div>
          )}
          <Col span={24}>
            <Button className="btn-danger mt-10" onClick={handleMoveNode}>
              Move
            </Button>
          </Col>
        </>
      ),
    },
  ];

  return (
    <Drawer title={title?.toUpperCase()} {...props}>
      {selectedNode ? renderNode(selectedNode) : null}
      <Tabs defaultActiveKey="1" items={items} />
    </Drawer>
  );
};

export default DrawerAdd;
