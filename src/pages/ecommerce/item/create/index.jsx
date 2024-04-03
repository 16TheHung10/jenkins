import { message } from 'antd';
import { EcommerceItemApi } from 'api';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import EcommerceItemsDetails from '../details';
import ComponentNav from '../nav';
import { useHistory } from 'react-router-dom';
const EcommerceItemsCreate = () => {
  const queryClient = useQueryClient();
  const history = useHistory();

  const handleCreate = async ({ value, onUploadImage }) => {
    const res = await EcommerceItemApi.createItems({ ...value });
    if (res.status) {
      // await onUploadImage(itemCode, value.images);
      return null;
    } else {
      throw new Error(res.message);
    }
  };

  const muation = useMutation(handleCreate, {
    onSuccess: (data, context) => {
      message.success('Create Items successfully');
      queryClient.invalidateQueries(['ecommerce/items']);
      history.push('/ecommerce/items/search');
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  return (
    <ComponentNav>
      <EcommerceItemsDetails onSubmit={muation.mutate} loading={muation.isLoading} />
    </ComponentNav>
  );
};

export default EcommerceItemsCreate;

