import { Form } from 'antd';
import { mainContentRef } from 'components/mainContent/MainContent';
import { useGetItemMasterOrderByStoreQuery, useUpdateItemMasterOrderByStoreMutation } from 'hooks';
import ItemMasterOrderByStoreForm from 'pages/itemMaster/v2/details/byStore/form/ItemMasterOrderByStoreForm';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ItemMasterOrderByStore = () => {
  const { itemCode } = useParams();
  const [searchFormValue, setSearchFormValue] = useState({});
  const itemByStoreDetailsQuery = useGetItemMasterOrderByStoreQuery({
    itemCode,
    storeCode: searchFormValue.storeCode,
  });

  const [itemByStoreDetailsForm] = Form.useForm();
  const updater = useUpdateItemMasterOrderByStoreMutation({ itemCode, storeCode: searchFormValue.storeCode });

  useEffect(() => {
    if (itemByStoreDetailsQuery.data && !itemByStoreDetailsQuery.isLoading) {
      const resetValues = {
        ...itemByStoreDetailsQuery.data,
      };
      itemByStoreDetailsForm.setFieldsValue({
        ...resetValues,
      });
    }
  }, [itemByStoreDetailsQuery.data, itemByStoreDetailsQuery.isLoading]);

  const handleUpdateItem = (value) => {
    updater.mutate({ ...value, itemCode, storeCode: searchFormValue.storeCode });
  };
  const handleSearch = (value) => {
    setSearchFormValue((prev) => ({ ...prev, ...value }));
  };
  useEffect(() => {
    if (itemByStoreDetailsQuery.status === 'success') {
      mainContentRef.current.scrollTo({
        top: mainContentRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [itemByStoreDetailsQuery.status]);

  return (
    <ItemMasterOrderByStoreForm
      form={itemByStoreDetailsForm}
      onSearch={handleSearch}
      onSubmit={handleUpdateItem}
      loading={updater.isLoading}
      isLoadingSearch={itemByStoreDetailsQuery.isLoading}
      searchQueryStatus={itemByStoreDetailsQuery.status}
    />
  );
};

export default ItemMasterOrderByStore;
