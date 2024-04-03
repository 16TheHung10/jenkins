import { message } from 'antd';
import { EcommerceItemApi } from 'api';
import SuspenLoading from 'components/common/loading/SuspenLoading';
import { useAppContext } from 'contexts';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import EcommerceItemDetails from '../details';
import EcommerceItemNav from '../nav';
const EcommerceItemUpdate = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  const { state: AppState } = useAppContext();

  const handleGetItemDetails = async () => {
    const res = await EcommerceItemApi.getItemById(params.id);
    if (res.status) {
      return res.data;
    } else {
      message.error(res.message);
      return null;
    }
  };

  const ecommerceItemDetailsQuery = useQuery({
    queryKey: ['ecommerce/items', 'details', params.id],
    queryFn: handleGetItemDetails,
    enabled: Boolean(params.id),
  });
  const getImageName = (imageUrl) => {
    const regex = /\/item\/([^/]+)\/([^/]+)\.jpg/;
    const match = imageUrl.match(regex);
    return match?.[2];
  };
  const handleUpdate = async ({ value, onGetItemTags }) => {
    const res = await EcommerceItemApi.updateItems(params.id, { ...value, itemCode: params.id });
    if (res.status) {
      await onGetItemTags();
      return { ...value, tags: value.tags?.map((item) => ({ tagID: item })) };
    } else {
      throw new Error(res.message);
    }
  };

  const muation = useMutation(handleUpdate, {
    onSuccess: (data, context) => {
      message.success('Update item successfully');
      queryClient.invalidateQueries({ queryKey: ['ecommerce/items'] });
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  if (ecommerceItemDetailsQuery.isLoading) return <SuspenLoading />;
  return (
    <EcommerceItemNav isDetails taxCode={params.id}>
      <EcommerceItemDetails itemID={params.id} initialValue={ecommerceItemDetailsQuery.data} onSubmit={muation.mutate} loading={muation.isLoading} />
    </EcommerceItemNav>
  );
};

export default EcommerceItemUpdate;
