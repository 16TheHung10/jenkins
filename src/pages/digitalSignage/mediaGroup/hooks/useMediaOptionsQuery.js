import { message } from 'antd';
import { DigitalSignageGroupMediaApi, DigitalSignageMediaApi } from 'api';
import React from 'react';
import { useQuery } from 'react-query';

const useMediaOptionsQuery = () => {
  const handleGetMediaOptions = async () => {
    const res = await DigitalSignageMediaApi.getMedias();
    if (res.status) {
      return res.data.medias?.map((item) => ({ value: item.mediaCode, label: item.mediaName }));
    } else {
      message.error(res.message);
    }
  };
  const mediaOptionsQuery = useQuery({
    queryKey: ['medias'],
    queryFn: handleGetMediaOptions,
  });
  return mediaOptionsQuery;
};

export default useMediaOptionsQuery;
