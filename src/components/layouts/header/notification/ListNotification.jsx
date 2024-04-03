import { Badge, Collapse, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import NotificationTab from './notificationTab/NotificationTab';
import './style.scss';
const ListNotification = ({ oldData, newData, notiNumber }) => {
  const [newNotiTabsKey, setNewNotiTabsKey] = useState({});
  useEffect(() => {
    const transfer = newData?.filter((el) => el.object_type === 'transfer');
    const order = newData?.filter((el) => el.object_type === 'order');
    const cheatingMember = newData?.filter((el) => el.object_type === 'cheatingMember');
    const cheatingCico = newData?.filter((el) => el.object_type === 'cheatingCico');
    setNewNotiTabsKey((prev) => {
      return {
        ...prev,
        transfer: transfer?.length > 0,
        order: order?.length > 0,
        cheatingMember: cheatingMember?.length > 0,
        cheatingCico: cheatingCico?.length > 0,
      };
    });
  }, [newData]);
  const items = [
    // {
    //   key: '10',
    //   label: (
    //     <Badge size="small" count={newData?.length}>
    //       <label
    //         className="cursor-pointer"
    //         style={{ color: newNotiTabsKey?.transfer ? 'var(--primary-color)' : 'black' }}
    //       >
    //         New
    //       </label>
    //     </Badge>
    //   ),
    //   children: (
    //     <NotificationTab
    //       data={{
    //         oldData: [],
    //         newData: newData,
    //         notiNumber,
    //       }}
    //       type="Comp 10"
    //     />
    //   ),
    // },
    {
      key: '1',
      label: (
        <Badge size="small" count={newData?.filter((el) => el.object_type === 'transfer')?.length || 0}>
          <label
            className="cursor-pointer"
            style={{ color: newNotiTabsKey?.transfer ? 'var(--primary-color)' : 'black' }}
          >
            Transfer
          </label>
        </Badge>
      ),
      children: (
        <NotificationTab
          data={{
            oldData: oldData?.filter((el) => el.objectType === 'transfer'),
            newData: newData?.filter((el) => el.object_type === 'transfer'),
            notiNumber,
          }}
          type="Comp 1"
        />
      ),
    },
    {
      key: '2',
      label: (
        <Badge size="small" count={newData?.filter((el) => el.object_type === 'order')?.length || 0}>
          <label className="cursor-pointer" style={{ color: newNotiTabsKey?.order ? 'var(--primary-color)' : 'black' }}>
            Order
          </label>
        </Badge>
      ),
      children: (
        <NotificationTab
          data={{
            oldData: oldData?.filter((el) => el.objectType === 'order'),
            newData: newData?.filter((el) => el.object_type === 'order'),
            notiNumber,
          }}
          type="Comp 2"
        />
      ),
    },
    {
      key: '3',
      label: (
        <Badge size="small" count={newData?.filter((el) => el.object_type === 'cheatingMember')?.length || 0}>
          <label
            className="cursor-pointer"
            style={{ color: newNotiTabsKey?.cheatingMember ? 'var(--primary-color)' : 'black' }}
          >
            Member payment
          </label>
        </Badge>
      ),
      children: (
        <NotificationTab
          data={{
            oldData: oldData?.filter((el) => el.objectType === 'cheatingMember'),
            newData: newData?.filter((el) => el.object_type === 'cheatingMember'),
            notiNumber,
          }}
          type="Comp 3"
        />
      ),
    },
    {
      key: '4',
      label: (
        <Badge size="small" count={newData?.filter((el) => el.object_type === 'cheatingCico')?.length || 0}>
          <label
            className="cursor-pointer"
            style={{ color: newNotiTabsKey?.cheatingCico ? 'var(--primary-color)' : 'black' }}
          >
            Cico
          </label>
        </Badge>
      ),
      children: (
        <>
          <NotificationTab
            data={{
              oldData: oldData?.filter((el) => el.objectType === 'cheatingCico'),
              newData: newData?.filter((el) => el.object_type === 'cheatingCico'),
              notiNumber,
            }}
          />
        </>
      ),
    },
  ];

  return (
    <Tabs
      id="notification"
      className="notification_tabs"
      defaultActiveKey="1"
      items={items}
      onTabClick={(activeKey) => {
        setNewNotiTabsKey((prev) => {
          return { ...prev, [activeKey]: false };
        });
      }}
    />
  );
};

export default ListNotification;
