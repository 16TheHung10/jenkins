import { message } from 'antd';
import { DigitalSignageTVApi } from 'api';
import React from 'react';
import { useQuery } from 'react-query';

const useTVDetailsQuery = ({ tvCode }) => {
  const handleGetTVs = async () => {
    const res = await DigitalSignageTVApi.getTVByCode(tvCode);
    if (res.status) {
      return res.data?.tv;
    } else {
      message.error(res.message);
    }
  };

  const tvQuery = useQuery({
    queryKey: ['tv/details', tvCode],
    queryFn: handleGetTVs,
    enabled: Boolean(tvCode),
  });
  return tvQuery;
};

export default useTVDetailsQuery;
