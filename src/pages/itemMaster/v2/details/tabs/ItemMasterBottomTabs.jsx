import { Tabs } from 'antd';
import Block from 'components/common/block/Block';
import { mainContentRef } from 'components/mainContent/MainContent';
import ItemDetailsInfo from 'components/mainContent/itemMaster/itemDetailsInfo';
import ItemMasterCombineByStore from 'pages/itemMaster/v2/details/byStore/ItemMasterCombineByStore';
import ItemMasterDetailsByStore from 'pages/itemMaster/v2/details/byStore/ItemMasterDetailsByStore';
import ItemMasterOrderByStore from 'pages/itemMaster/v2/details/byStore/ItemMasterOrderByStore';
import React, { useEffect, useMemo, useState } from 'react';

const ItemMasterBottomTabs = ({ itemCode, itemData, itemType }) => {
  const [activeKey, setActiveKey] = useState('1');
  const tabItems = useMemo(() => {
    const items = [
      {
        key: '1',
        label: `Store price`,
        children: <ItemMasterDetailsByStore />,
      },
      {
        key: '2',
        label: `Store order`,
        children: <ItemMasterOrderByStore />,
      },
      {
        key: '3',
        label: `Items info`,
        children: <ItemDetailsInfo itemCode={itemCode} />,
      },
    ];
    if ([1, 2].includes(+itemType)) {
      items.unshift({
        key: '0',
        label: `Combine`,
        children: <ItemMasterCombineByStore itemData={itemData} itemType={itemType} />,
      });
    }
    return items;
  }, [itemCode, itemType]);
  useEffect(() => {
    setTimeout(() => {
      mainContentRef.current.scrollTo({
        top: mainContentRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }, 0);
  }, [activeKey]);

  return (
    <Block className="mb-15">
      <Tabs
        onChange={setActiveKey}
        activeKey={activeKey}
        items={tabItems}
        // style={{ background: '#f0f2f5', padding: '10px', borderRadius: '10px' }}
      />
    </Block>
  );
};

export default ItemMasterBottomTabs;
