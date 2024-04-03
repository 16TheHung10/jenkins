import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Cascader, Modal, Popconfirm, Tree, message } from 'antd';
import BaseButton from 'components/common/buttons/baseButton/BaseButton.jsx';
import Action from 'components/mainContent/Action';
import { APIHelper, ArrayHelper, DateHelper, UrlHelper } from 'helpers';
import MenuModel from 'models/MenuModel';
import SettingModel from 'models/SettingModel';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DrawerAdd from '../DrawerAdd';
import SubmitBottomButton from 'components/common/buttons/submitBottomButton/SubmitBottomButton';
import AddNewMenu from './addNewMenu/AddNewMenu';
import './style.scss';
const EditMenuComponent = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [isOpenDrawerAdd, setIsOpenDrawerAdd] = useState(false);
  const [isAddNewMenuModalOpen, setIsAddNewMenuModalOpen] = useState(false);
  const [groupUser, setGroupUser] = useState([]);
  const [selectedGroupUserID, setSelectedGroupUserID] = useState(1);
  const [selectedWebApply, setSelectedWebApply] = useState(1000);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isLoadingFetchMenu, setIsLoadingFetchMenu] = useState(false);
  const [isModalClearCacheOpen, setIsModalClearCacheOpen] = useState(false);

  // Checked key of tree
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [checkedParentKeys, setCheckedParentKeys] = useState([]);

  const [haftCheckedKey, setHaftCheckedKey] = useState([]);
  // Tree data
  const [treeData, setTreeData] = useState([]);
  const [allMenus, setAllMenus] = useState([]);
  // All checked menu use this to map checked key
  const [listMenuPermission, setListMenuPermission] = useState([]);

  const AllPermissionObject = useRef();
  // Const list menu ( can not be change ) (all menu of group of app) use this to filter listMenu
  const [constListMenuPermission, setConstListMenuPermission] = useState([]);
  const groupUserOptions = useMemo(() => {
    return groupUser?.map((el) => ({
      value: +el.groupID,
      label: el.groupUserName,
      groupID: el.groupID,
    }));
  }, [groupUser]);
  const webOptions = [
    { value: 1000, label: 'Store Management' },
    { value: 1001, label: 'Portal' },
    { value: 1002, label: 'Franchise support' },
    { value: 1003, label: 'Internal App' },
  ];

  const onToggleModalClearCache = () => {
    setIsModalClearCacheOpen((prev) => !prev);
  };

  const handleGetGroupUser = async () => {
    setIsLoadingFetchMenu(true);
    await APIHelper.get('/common/object/Types=groupuser').then((response) => {
      setIsLoadingFetchMenu(false);
      if (response.status) {
        if (response.data.groupusers.length > 0) {
          setGroupUser(response.data.groupusers);
        } else {
          message.error('System Error');
        }
      } else {
        message.error(response.message);
      }
    });
  };

  const handleDeleteMenuNode = async (menuID) => {
    const model = new MenuModel();
    const res = await model.deleteMenu(menuID);
    if (res.status) {
      const deleted = ArrayHelper.deleteItemByKeyValue(treeData, 'key', menuID);
      setTreeData(deleted);
      message.success('Delete menu node successfully!!!');
    } else {
      message.error(res.message);
    }
  };

  const renderTreeNodes = (treeData) => {
    const res = treeData.map((item, index) => {
      return {
        ...item,
        originTitle: item.title,
        title: (
          <div className="flex items-center">
            <i className={'fas ' + item.icon} />
            <p className="m-0 ml-10">{item.title}</p>
            <Popconfirm
              title="Delete the menu node"
              description="Are you sure to delete this menu node?"
              onConfirm={() => {
                handleDeleteMenuNode(item.key);
              }}
              okText="Confirm"
              cancelText="Cancel "
            >
              <DeleteOutlined className="cl-red ml-10 menu-node-icon" />
            </Popconfirm>

            <EditOutlined className="color-primary ml-10 menu-node-icon" onClick={() => handleClickOnNode(null, item)} />
          </div>
        ),
        isLeaf: item.children && item.children.length > 0 ? false : true,
        children: item.children && item.children.length > 0 ? renderTreeNodes(item.children) : [],
        key: `${item.key.toString()}`,
      };
    });
    return res;
  };

  const handleGetAllMenu = async () => {
    await APIHelper.get('/menu/all')
      .then((response) => {
        if (response.status) {
          if (response.data.listMenu.length > 0) {
            setAllMenus(response.data.listMenu);
          }
        }
      })
      .catch((err) => {});
  };
  const handleGetPermissionMenu = async () => {
    await APIHelper.get('/menu/permission')
      .then((response) => {
        if (response.status) {
          if (response.data.listPermissionMenu.length > 0) {
            setConstListMenuPermission(response.data.listPermissionMenu);
            let object = {};
            for (let item of response.data.listPermissionMenu) {
              object = {
                ...object,
                [`${item.appPermission}-${item.groupID}-${item.key}`]: {
                  GroupCode: item.groupID,
                  AppPermission: item.appPermission,
                  MenuID: item.key,
                },
              };
            }
            AllPermissionObject.current = object;
          }
        }
      })
      .catch((err) => {});
  };
  // Drawer
  const handleOpenDrawer = useCallback(() => {
    setIsOpenDrawerAdd(true);
  }, [isOpenDrawerAdd]);

  const handleCloseDrawer = useCallback(() => {
    setIsOpenDrawerAdd(false);
    UrlHelper.setSearchParams('?');
  }, [isOpenDrawerAdd]);
  // END Drawer

  const handleOpenAddNewMenuModal = () => {
    setIsAddNewMenuModalOpen(true);
  };
  const handleCloseAddNewMenuModal = () => {
    setIsAddNewMenuModalOpen(false);
  };

  const handleClickOnNode = (e, node) => {
    UrlHelper.setSearchParamsFromObject({ selectedKey: node.key });
    handleOpenDrawer();
    setSelectedNode(node);
  };

  const onChangeGroupUser = (value) => {
    setSelectedGroupUserID(value.join().toString());
  };

  const onChangeWebApply = (value) => {
    setSelectedWebApply(value);
  };

  const onCheck = (checked, info) => {
    const { checkedNodes, halfCheckedKeys } = info;
    const validCheckedKeysObject = ArrayHelper.convertArrayToMap([...(checked || []), ...(halfCheckedKeys || [])]);
    const cloneCheckedParentKeys = JSON.parse(JSON.stringify(checkedParentKeys));
    for (let i in cloneCheckedParentKeys) {
      if (!validCheckedKeysObject.get(checkedParentKeys[i])) {
        cloneCheckedParentKeys.splice(i, 1, null);
      }
    }
    setCheckedParentKeys(cloneCheckedParentKeys?.filter((el) => el !== null));
    setHaftCheckedKey([...info.halfCheckedKeys]);
    setCheckedKeys(checked);
  };

  const findObjectByKey = (dataArray, key) => {
    for (let i = 0; i < dataArray.length; i++) {
      const item = dataArray[i];
      if (item.key === key) {
        return item;
      }
      if (item.children) {
        const foundObject = findObjectByKey(item.children, key);
        if (foundObject) {
          return foundObject;
        }
      }
    }
    return null;
  };

  useEffect(() => {
    handleGetGroupUser();
  }, []);
  useEffect(() => {
    handleGetAllMenu();
  }, []);

  useEffect(() => {
    setTreeData(allMenus?.filter((el) => el.appPermission.toString() === selectedWebApply?.toString()));
  }, [selectedWebApply, allMenus]);
  useEffect(() => {
    if (selectedGroupUserID) {
      handleGetPermissionMenu();
    }
  }, []);

  useEffect(() => {
    if (selectedGroupUserID) {
      const filtered = constListMenuPermission.filter((el) => {
        const compare = +el.groupID === +selectedGroupUserID && el.appPermission === selectedWebApply?.toString();
        return compare;
      });
      setListMenuPermission((prev) => filtered);
    }
  }, [constListMenuPermission, groupUser, selectedGroupUserID, selectedWebApply]);

  useEffect(() => {
    const checkedVaue = [];
    const checkedParent = [];
    for (let value of listMenuPermission) {
      if (!value.isParent) {
        checkedVaue.push(value.key?.toString());
      } else {
        checkedParent.push(value.key?.toString());
      }
    }
    setCheckedKeys(checkedVaue);
    setCheckedParentKeys(checkedParent);
  }, [listMenuPermission]);
  useEffect(() => {
    const paramsObject = UrlHelper.getSearchParamsObject();
    const key = paramsObject.selectedKey;
    if (key) {
      const selectedChild = findObjectByKey(renderTreeNodes(treeData), key);

      if (!selectedChild) {
        handleCloseDrawer();
        message.error('Invalid selected node');
      } else {
        setSelectedNode(selectedChild);
        handleOpenDrawer();
      }
    }
  }, [UrlHelper.getSearchParams(), treeData]);

  const handleSave = async () => {
    // if (checkedKeys?.length === 0) return;
    const originCheckedKey = listMenuPermission?.filter(
      (item) => +item.groupID === +selectedGroupUserID && +item.appPermission === +selectedWebApply
      // treeData?.findIndex((el) => +el.key === +item.key) !== -1
    );
    const payloadCheckedKeyMap = new Map();

    for (let item of [...checkedKeys, ...checkedParentKeys]) {
      if (!payloadCheckedKeyMap.get(item)) {
        payloadCheckedKeyMap.set(+item, true);
      }
    }
    const unCheckedKeys = [];
    for (let item of originCheckedKey) {
      if (!payloadCheckedKeyMap.get(+item.key)) {
        unCheckedKeys.push(item.key);
      }
    }
    const checkedKeyPayload = [...new Set([...checkedKeys, ...haftCheckedKey, ...checkedParentKeys])];
    const payload = checkedKeyPayload?.map((item, index) => {
      return {
        GroupCode: groupUserOptions?.find((el) => +el.value === +selectedGroupUserID).groupID,
        AppPermission: selectedWebApply.toString(),
        MenuID: +item,
      };
    });

    let object = {};

    for (let item of payload) {
      object = {
        ...object,
        [`${item.AppPermission}-${item.GroupCode}-${item.MenuID}`]: item,
      };
    }
    let removeUncheckedKeysObject = {
      ...AllPermissionObject.current,
      ...object,
    };
    for (let item of unCheckedKeys) {
      if (removeUncheckedKeysObject?.[`${selectedWebApply}-${selectedGroupUserID}-${item}`]) {
        delete removeUncheckedKeysObject?.[`${selectedWebApply}-${selectedGroupUserID}-${item}`];
      }
    }

    const MenuPermissions = [...Object.values(removeUncheckedKeysObject || {}).filter((el) => +el.GroupCode === +selectedGroupUserID)];

    const clone = JSON.parse(JSON.stringify(MenuPermissions));
    for (let item of MenuPermissions) {
      const parentId = ArrayHelper.findChildInNestedArray(treeData, item.MenuID, 'key')?.parentID || null;

      if (clone.findIndex((el) => +el.MenuID === +parentId) === -1) {
        if (parentId) {
          clone.push({ ...item, MenuID: parentId });
        }
      }
    }

    const response = await APIHelper.put(`/menu/permission/${+selectedGroupUserID}`, {
      MenuPermissions: clone,
    });

    if (response.status) {
      setIsUpdateSuccess(true);
      message.success('Update menu successfully !!!');
    } else {
      setIsUpdateSuccess(true);
      message.config(response.message);
    }
    return response;
  };

  const handleClearCacheByName = async () => {
    let settModel = new SettingModel();
    settModel.clearCacheByName('setting', DateHelper.displayDateFormat(Date.now())).then((response) => {
      setIsUpdateSuccess(false);
      message.config('Clear cache sccessfully');
    });
  };

  const treeProps = {
    checkStrictly: false,
    checkable: true,
    onCheck: onCheck,
    checkedKeys: [...checkedKeys],
    treeData: renderTreeNodes(treeData),
  };

  return (
    <section className="wrap-section" id="edit_menu_wrapper">
      {contextHolder}
      {isUpdateSuccess ? (
        <div className="section-block mt-15 flex items-center gap-10 w-fit tag_warning">
          <p className="m-0">Do you want to clear cache ? </p>
          <Button onClick={handleClearCacheByName} className="btn-danger">
            Clear
          </Button>
        </div>
      ) : null}
      <div className="mini_app_container ">
        <div className="section-block mt-15 mb-15">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div className="row flex">
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="group" className="w100pc">
                      Web<span style={{ color: 'red' }}>*</span>:{' '}
                    </label>
                    <Cascader className="w-full" allowClear={false} options={webOptions} defaultValue={selectedWebApply} onChange={onChangeWebApply} placeholder="Please select" />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="group" className="w100pc">
                      {' '}
                      Group<span style={{ color: 'red' }}>*</span>:{' '}
                    </label>
                    <Cascader className="w-full" allowClear={false} options={groupUserOptions} defaultValue={selectedGroupUserID} onChange={onChangeGroupUser} placeholder="Please select" />
                  </div>
                </div>

                <div className="col-md-3" style={{ alignSelf: 'center' }}>
                  <BaseButton iconName="plus" onClick={handleOpenAddNewMenuModal}>
                    Add new menu
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="section-block">
          {selectedGroupUserID ? (
            <>
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <div className="row">
                    <div className="col-md-8">
                      <div className="form-group">
                        <label htmlFor="group" className="w100pc">
                          Menu<span style={{ color: 'red' }}>*</span>:{' '}
                        </label>
                        <Tree {...treeProps} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <SubmitBottomButton title="Save" onClick={handleSave} />
            </>
          ) : null}
        </div>
      </div>
      <DrawerAdd
        selectedNode={selectedNode}
        onClose={handleCloseDrawer}
        open={isOpenDrawerAdd}
        title="Modify menu"
        placement="right"
        allTreeData={renderTreeNodes(treeData)}
        onToggleModalClearCache={onToggleModalClearCache}
      />
      <Modal open={isAddNewMenuModalOpen} onCancel={handleCloseAddNewMenuModal} footer={null}>
        <AddNewMenu initialMenu={renderTreeNodes(treeData)} initialAppPermission={selectedWebApply} />
      </Modal>
      <Modal title="Clear cache" open={isModalClearCacheOpen} footer={false} onCancel={onToggleModalClearCache}>
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
    </section>
  );
};

export default EditMenuComponent;
