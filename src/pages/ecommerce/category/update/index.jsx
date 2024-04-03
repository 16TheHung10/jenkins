import { message } from 'antd';
import { EcommerceCategoryApi } from 'api';
import SuspenLoading from 'components/common/loading/SuspenLoading';
import { useAppContext } from 'contexts';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import EcommerceCategoryDetails from '../details';
import EcommerceCategoryNav from '../nav';
import PageNotFound from 'pages/common/PageNotFound';
const EcommerceCategoryUpdate = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  const { state: AppState } = useAppContext();

  const handleGetCategoryDetails = async () => {
    const res = await EcommerceCategoryApi.getCategoryById(params.id);
    if (res.status) {
      return res.data;
    } else {
      message.error(res.message);
      return null;
    }
  };

  const ecommerceItemDetailsQuery = useQuery({
    queryKey: ['ecommerce/categories', 'details', params.id],
    queryFn: handleGetCategoryDetails,
    enabled: Boolean(params.id),
  });

  const handleUpdate = async ({ value }) => {
    const res = await EcommerceCategoryApi.updateCategory(params.id, { ...value });
    if (res.status) {
      return value;
    } else {
      throw new Error(res.message);
    }
  };

  const muation = useMutation(handleUpdate, {
    onSuccess: (data, context) => {
      message.success('Update category successfully');
      queryClient.invalidateQueries({ queryKey: ['ecommerce/categories'] });
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  if (ecommerceItemDetailsQuery.isLoading) return <SuspenLoading />;
  if (!ecommerceItemDetailsQuery.data) return <PageNotFound />;
  return (
    <EcommerceCategoryNav isDetails categoryID={params.id}>
      <EcommerceCategoryDetails initialValue={ecommerceItemDetailsQuery.data} onSubmit={muation.mutate} />
    </EcommerceCategoryNav>
  );
};

export default EcommerceCategoryUpdate;

