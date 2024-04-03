import { message } from 'antd';
import { DigitalSignageGroupMediaApi } from 'api';
import React from 'react';
import { useQuery } from 'react-query';

const useGroupDetailsQuery = ({ groupCode }) => {
  const handleGetGroupDetails = async () => {
    const res = await DigitalSignageGroupMediaApi.getGroupByID(groupCode);
    if (res.status) {
      const data = res.data.group;
      return data;
    } else {
      message.error(res.message);
    }
  };
  const groupDetailQuery = useQuery({
    queryKey: ['tv/group/details', groupCode],
    queryFn: handleGetGroupDetails,
    enabled: Boolean(groupCode),
  });
  return groupDetailQuery;
};

export default useGroupDetailsQuery;
