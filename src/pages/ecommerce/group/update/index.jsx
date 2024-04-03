import { message } from 'antd';
import { EcommerceGroupApi } from 'api';
import SuspenLoading from 'components/common/loading/SuspenLoading';
import { useAppContext } from 'contexts';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import EcommerceDetailsComp from '../details';
import EcommerceGroupNav from '../nav';
const EcommerceGroupUpdate = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  const { state: AppState } = useAppContext();
  const handleGetGroupDetails = async () => {
    const res = await EcommerceGroupApi.getGroupByID(params.id);
    if (res.status) {
      return res.data;
    } else {
      message.error(res.message);
      return null;
    }
  };

  const ecommerceGroupDetailsQuery = useQuery({
    queryKey: ['ecommerce/groups', 'details', params.id],
    queryFn: handleGetGroupDetails,
    enabled: Boolean(params.id),
  });

  const handleUpdate = async ({ value, onUploadMedia }) => {
    const { groupLogo, groupBanner, ...data } = value;
    const res = await EcommerceGroupApi.updateGroup(params.id, { ...data });
    if (res.status) {
      await onUploadMedia(groupLogo, groupBanner, params.id);
      return value;
    } else {
      throw new Error(res.message);
    }
  };
  const muation = useMutation(handleUpdate, {
    onSuccess: (data, context) => {
      message.success('Update Group successfully');
      queryClient.invalidateQueries({ queryKey: ['ecommerce/groups'] });
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  if (ecommerceGroupDetailsQuery.isLoading) return <SuspenLoading />;
  return (
    <EcommerceGroupNav isDetails groupID={params.id}>
      <EcommerceDetailsComp groupID={params.id} initialValue={ecommerceGroupDetailsQuery.data} onSubmit={muation.mutate} isLoading={muation.isLoading} />
    </EcommerceGroupNav>
  );
};

export default EcommerceGroupUpdate;

