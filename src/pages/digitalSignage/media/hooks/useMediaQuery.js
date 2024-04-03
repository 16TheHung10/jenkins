import { message } from 'antd';
import { DigitalSignageMediaApi } from 'api';
import React from 'react';
import { useQuery } from 'react-query';

const useMediaQuery = ({ searchParams }) => {
  const handleGetMedias = async () => {
    const res = await DigitalSignageMediaApi.getMedias(searchParams);
    if (res.status) {
      return res.data.medias;
    } else {
      message.error(res.message);
    }
  };

  const mediaQuery = useQuery({
    queryKey: ['tv/medias', searchParams],
    queryFn: handleGetMedias,
  });
  return mediaQuery;
};

export default useMediaQuery;
