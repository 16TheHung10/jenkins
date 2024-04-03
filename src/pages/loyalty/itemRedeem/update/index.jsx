import { message } from 'antd';
import { LoyaltyApi } from 'api';
import SuspenLoading from 'components/common/loading/SuspenLoading';
import { useAppContext } from 'contexts';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import LoyaltyItemRedeemDetails from '../details';
import LoyaltyItemRedeemNav from '../nav';
const LoyaltyItemRedeemUpdate = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  const handleGetItemRedeemDetails = async () => {
    const res = await LoyaltyApi.getItemRedeemDetails(params.id);
    if (res.status) {
      return res.data.item;
    } else {
      message.error(res.message);
      return null;
    }
  };

  const loyaltyItemRedeemDetailsQuery = useQuery({
    queryKey: ['loyalty/itemRedeems', 'details', params.id],
    queryFn: handleGetItemRedeemDetails,
    enabled: Boolean(params.id),
  });

  const handleUpdate = async ({ value, onUploadMedia }) => {
    const { banner, logo, ...data } = value;
    const res = await LoyaltyApi.updateItemRedeem(params.id, { ...data });
    if (res.status) {
      await onUploadMedia(logo, banner, params.id);
      return value;
    } else {
      throw new Error(res.message);
    }
  };
  const muation = useMutation(handleUpdate, {
    onSuccess: (data, context) => {
      message.success('Update item successfully');
      queryClient.invalidateQueries({ queryKey: ['loyalty/itemRedeems'] });
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  if (loyaltyItemRedeemDetailsQuery.isLoading) return <SuspenLoading />;
  return (
    <LoyaltyItemRedeemNav isDetails itemCode={params.id}>
      <LoyaltyItemRedeemDetails itemCode={params.id} initialValue={loyaltyItemRedeemDetailsQuery.data} onSubmit={muation.mutate} isLoading={muation.isLoading} />
    </LoyaltyItemRedeemNav>
  );
};

export default LoyaltyItemRedeemUpdate;

