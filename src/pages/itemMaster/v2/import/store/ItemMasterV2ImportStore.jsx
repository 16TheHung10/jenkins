import { Tabs } from 'antd';
import Block from 'components/common/block/Block';
import PageWithNav from 'components/layouts/pageWithNav/PageWithNav';
import ItemMasterNav from 'components/mainContent/itemMaster/nav/ItemMasterNav';
import ItemMasterV2ImportStoreCSV from 'pages/itemMaster/v2/import/store/tabs/ItemMasterV2ImportStoreCSV';
import ItemMasterV2ImportStoreCopy from 'pages/itemMaster/v2/import/store/tabs/ItemMasterV2ImportStoreCopy';
import React from 'react';

const ItemMasterV2ImportStore = () => {
  const tabItems = [
    {
      key: '1',
      label: `Import from CSV`,
      children: <ItemMasterV2ImportStoreCSV />,
    },
    {
      key: '2',
      label: `Import from other store`,
      children: <ItemMasterV2ImportStoreCopy />,
    },
  ];
  return (
    <ItemMasterNav version="2">
      <Block>
        <Tabs className="" defaultActiveKey="1" items={tabItems} />
      </Block>
    </ItemMasterNav>
  );
};

export default ItemMasterV2ImportStore;
