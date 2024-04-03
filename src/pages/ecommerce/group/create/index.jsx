import { message } from 'antd';
import { EcommerceGroupApi } from 'api';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import EcommerceGroupDetails from '../details';
import ComponentNav from '../nav';
import { useHistory } from 'react-router-dom';

const EcommerceGroupCreate = () => {
  const queryClient = useQueryClient();
  const history = useHistory();
  const handleCreate = async ({ value, onUploadMedia }) => {
    const { groupLogo, groupBanner, ...data } = value;
    const res = await EcommerceGroupApi.createGroup(data);
    if (res.status) {
      await onUploadMedia(groupLogo, groupBanner, res.data?.groupID);
      return value;
    } else {
      throw new Error(res.message);
    }
  };
  const muation = useMutation(handleCreate, {
    onSuccess: (data, context) => {
      message.success('Create FC successfully');
      queryClient.invalidateQueries('ecommerce/groups');
      history.push('/ecommerce/groups/search');
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

export default EcommerceGroupCreate;

