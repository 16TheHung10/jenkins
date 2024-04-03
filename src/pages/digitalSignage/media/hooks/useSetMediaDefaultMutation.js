import { message } from 'antd';
import { DigitalSignageMediaApi } from 'api';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import ResponseMessage from 'message/reponse.message';
const useSetMediaDefaultMutation = () => {
  const queryClient = useQueryClient();
  const handleSetMediaDefault = async (mediaCode) => {
    const res = await DigitalSignageMediaApi.setDefault(mediaCode);
    if (res.status) {
      return mediaCode;
    } else {
      throw new Error(res.message);
    }
  };

  const mediaQuery = useMutation(handleSetMediaDefault, {
    onSuccess: (mediaCode) => {
      ResponseMessage.success('Set media default successfully');
      queryClient.invalidateQueries(['tv/medias']);
    },
    onError: (err) => {
      ResponseMessage.error(err.message);
    },
  });
  return mediaQuery;
};

export default useSetMediaDefaultMutation;
