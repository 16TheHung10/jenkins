import { message } from 'antd';
import { LoyaltyApi } from 'api';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import EcommerceGroupDetails from '../details';
import ComponentNav from '../nav';
import { useHistory } from 'react-router-dom';

const LoyaltyItemRedeemCreate = () => {
  const queryClient = useQueryClient();
  const history = useHistory();
  const handleCreate = async ({ value, onUploadMedia }) => {
    const { logo, banner, ...data } = value;
    const res = await LoyaltyApi.createItemRedeem({ ...data, type: 'Product', itemCode: JSON.parse(value.itemCode).itemCode });
    if (res.status) {
      await onUploadMedia(logo, banner, JSON.parse(value.itemCode).itemCode);
      return value;
    } else {
      throw new Error(res.message);
    }
  };
  const muation = useMutation(handleCreate, {
    onSuccess: (data, context) => {
      message.success('Create FC successfully');
      queryClient.invalidateQueries('ecommerce/groups');
      history.push('/loyalty/item-redeems/search');
    },
    onError: (error) => {
      message.error(error.message);
    },
  });
  return (
    <ComponentNav>
      <EcommerceGroupDetails onSubmit={muation.mutate} isLoading={muation.isLoading} />
    </ComponentNav>
  );
};

export default LoyaltyItemRedeemCreate;

