import { message } from 'antd';
import { EcommerceOrderApi } from 'api';
import SuspenLoading from 'components/common/loading/SuspenLoading';
import React from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import EcommerceOrdersDetails from '../details';
import ComponentNav from '../nav';

const EcommerceOrderUpdate = () => {
  const params = useParams();
  const queryClient = useQueryClient();

  const handleGetOrderDetails = async () => {
    const res = await EcommerceOrderApi.getOrderById(params.id);
    if (res.status) {
      return res.data;
    } else {
      message.error(res.message);
      return null;
    }
  };

  const ecommerceOrderDetailsQuery = useQuery({
    queryKey: ['ecommerce/orders', 'details', params.id],
    queryFn: handleGetOrderDetails,
    enabled: Boolean(params.id),
  });
  const handleSendMailRequestPayment = async () => {
    const res = await EcommerceOrderApi.sendMailRequestPayment(params.id, { ...ecommerceOrderDetailsQuery.data.order, listItem: ecommerceOrderDetailsQuery.data.items });
    if (res.status) {
      message.success('Send mail successfully');
    } else {
      message.error(res.message);
    }
  };
  const handleSubmit = async ({ value }) => {
    const res = await EcommerceOrderApi.updateOrder(params.id, { storeCode: value.storeCode, note: value.note });
    if (res.status) {
      message.success('Update successfully');
      queryClient.invalidateQueries({ queryKey: ['ecommerce/orders'] });
    } else {
      message.error(res.message);
    }
  };

  if (ecommerceOrderDetailsQuery.isLoading) return <SuspenLoading />;
  return (
    <ComponentNav isDetails taxCode={params.id}>
      <EcommerceOrdersDetails initialValue={ecommerceOrderDetailsQuery.data} onSendMailRequestPayment={handleSendMailRequestPayment} onSubmit={handleSubmit} />
    </ComponentNav>
  );
};

export default EcommerceOrderUpdate;

