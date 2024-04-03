import { Form, Spin } from 'antd';
import NotFound from 'component/NotFound';
import ItemMasterNav from 'components/mainContent/itemMaster/nav/ItemMasterNav';
import { useGetItemMasterDetailsQuery, useUpdateItemMasterMutation } from 'hooks';
import moment from 'moment';
import ItemMasterDetailsForm from 'pages/itemMaster/v2/details/form/ItemMasterDetailsForm';
import ItemMasterBottomTabs from 'pages/itemMaster/v2/details/tabs/ItemMasterBottomTabs';
import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

const ItemMasterDetailsV2 = () => {
  const { itemCode } = useParams();
  const itemDetailsQuery = useGetItemMasterDetailsQuery({ itemCode });
  const [itemDetailsForm] = Form.useForm();
  const updater = useUpdateItemMasterMutation({ itemCode });

  const itemType = useMemo(() => {
    if (itemDetailsQuery.data?.type === 0 && itemDetailsQuery.data?.level === 0) return 0;
    if (itemDetailsQuery.data?.type === 0 && itemDetailsQuery.data?.level === 1) return 1;
    if (itemDetailsQuery.data?.type === 1 && itemDetailsQuery.data?.level === 1) return 2;
    return '';
  }, [itemDetailsQuery.data?.type, itemDetailsQuery.data?.level]);

  useEffect(() => {
    if (itemDetailsQuery.data && !itemDetailsQuery.isLoading) {
      const resetValues = {
        ...itemDetailsQuery.data,
        shelfLife: +itemDetailsQuery.data.shelfLife,
        imagePath: itemDetailsQuery.data.imagePath
          ? [
              {
                uid: Date.now(),
                name: `${itemCode}.png`,
                status: 'done',
                url: itemDetailsQuery.data.imagePath,
              },
            ]
          : null,
        firstOrderDate: itemDetailsQuery.data.firstOrderDate ? moment(itemDetailsQuery.data.firstOrderDate) : null,
        firstSalesDate: itemDetailsQuery.data.firstSalesDate ? moment(itemDetailsQuery.data.firstSalesDate) : null,
        type: itemType,
      };
      itemDetailsForm.setFieldsValue({
        ...resetValues,
      });
    }
  }, [itemDetailsQuery.data, itemDetailsQuery.isLoading, itemType]);

  const handleUpdateItem = (value) => {
    const payload = { ...value, level: itemDetailsQuery.data.level };
    if (value.type === 0) {
      payload.type = 0;
      payload.level = 0;
    } else if (value.type === 1) {
      payload.type = 0;
      payload.level = 1;
    } else if (value.type === 2) {
      payload.type = 1;
      payload.level = 1;
    }
    updater.mutate({ ...payload });
  };

  if (itemDetailsQuery.isLoading) {
    return (
      <div className="h-full w-full center">
        <Spin />
      </div>
    );
  }
  if (!itemDetailsQuery.data) {
    return <NotFound />;
  }
  return (
    <ItemMasterNav itemCode={itemCode} version="2">
      <ItemMasterDetailsForm
        form={itemDetailsForm}
        onSubmit={handleUpdateItem}
        loading={updater.isLoading}
        itemCode={itemCode}
        itemName={itemDetailsQuery.data.itemName}
        detailsData={itemDetailsQuery.data}
      />
      <ItemMasterBottomTabs itemCode={itemCode} itemType={itemType} itemData={itemDetailsQuery.data} />
    </ItemMasterNav>
  );
};

export default ItemMasterDetailsV2;
