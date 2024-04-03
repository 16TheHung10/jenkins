
import FcMasterDetailsComp from '../details';
import React, { useEffect } from 'react';
import { FcApi } from 'api';
import ComponentNav from '../nav';
import { useMutation, useQueryClient } from 'react-query';
import { StringHelper } from 'helpers';
import { message } from 'antd';
const FcMasterCreate = () => {
  const getLatestSearchParamsOfFCManagementPage = () => {
    const url = new URL('http://localhost:3000/fc-master?pageSize=30&pageNumber=1');
    const searchObject = StringHelper.convertSearchParamsToObject(url.search);
    return searchObject;
  };
  const queryClient = useQueryClient();

  const handleCreate = async (value) => {
    const res = await FcApi.createFC(value);
    if (res.status) {
      return value;
    } else {
      throw new Error(res.message);
    }
  };
  const muation = useMutation(handleCreate, {
    onSuccess: (data, context) => {
      message.success('Create FC successfully');
      const currentData = queryClient.getQueryData(['fc', { ...getLatestSearchParamsOfFCManagementPage() }]);
      if (currentData) {
        queryClient.setQueryData(['fc', { ...getLatestSearchParamsOfFCManagementPage() }], {
          ...currentData,
          fcMasters: [data, ...currentData.fcMasters],
        });
      }
    },
    onError: (error) => {
      message.error(error.message);
    },
  });
  return (
    <ComponentNav>
      <FcMasterDetailsComp onSubmit={muation.mutate} />
    </ComponentNav>
  );
};

export default FcMasterCreate;

