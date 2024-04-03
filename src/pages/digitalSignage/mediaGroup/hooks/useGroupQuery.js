import { message } from 'antd';
import { DigitalSignageGroupMediaApi } from 'api';
import React from 'react';
import { useQuery } from 'react-query';

const useGroupQuery = ({ searchParams }) => {
  const handleGetGroups = async () => {
    const res = await DigitalSignageGroupMediaApi.getGroups(searchParams);
    if (res.status) {
      return res.data.groupMedias;
    } else {
      message.error(res.message);
      return [];
    }
  };
  const groupQuery = useQuery({
    queryKey: ['tv/group', searchParams],
    queryFn: handleGetGroups,
  });
  return groupQuery;
};

export default useGroupQuery;
