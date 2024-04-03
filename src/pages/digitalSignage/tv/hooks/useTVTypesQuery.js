import { message } from 'antd';
import { DigitalSignageTVApi } from 'api';
import React from 'react';
import { useQuery } from 'react-query';

const useTVTypesQuery = () => {
  const handleGetTVTypes = async () => {
    const res = await DigitalSignageTVApi.getTVTypes();
    if (res.status) {
      return res.data?.tvTypes;
    } else {
      message.error(res.message);
    }
  };

  const tvsQuery = useQuery({
    queryKey: ['tv/types'],
    queryFn: handleGetTVTypes,
  });
  return tvsQuery;
};

export default useTVTypesQuery;
