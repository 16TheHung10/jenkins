import { message } from 'antd';
import { EcommerceCategoryApi } from 'api';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import EcommerceCategoryDetails from '../details';
import ComponentNav from '../nav';
import { useHistory } from 'react-router-dom';
const EcommerceCategoryCreate = () => {
  const queryClient = useQueryClient();
  const history = useHistory();

  const handleCreate = async ({ value }) => {
    const res = await EcommerceCategoryApi.createCategory({ ...value });
    if (res.status) {
      return null;
    } else {
      throw new Error(res.message);
    }
  };

  const muation = useMutation(handleCreate, {
    onSuccess: (data, context) => {
      message.success('Create Items successfully');
      queryClient.invalidateQueries(['ecommerce/categories']);
      history.push('/ecommerce/categories/search');
    },
    onError: (error) => {
      message.error(error.message);
    },
  });
  return (
    <ComponentNav>
      <EcommerceCategoryDetails onSubmit={muation.mutate} />
    </ComponentNav>
  );
};

export default EcommerceCategoryCreate;

