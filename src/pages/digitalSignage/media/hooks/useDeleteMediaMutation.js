import { message } from 'antd';
import { DigitalSignageMediaApi } from 'api';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import ResponseMessage from 'message/reponse.message';

const useDeleteMediaMutation = () => {
  const queryClient = useQueryClient();
  const handleDeleteMedia = async (mediaCode) => {
    const res = await DigitalSignageMediaApi.deleteMedia(mediaCode);
    if (res.status) {
      return mediaCode;
    } else {
      throw new Error(res.message);
    }
  };

  const mediaQuery = useMutation(handleDeleteMedia, {
    onSuccess: (mediaCode) => {
      ResponseMessage.success('Delete media successfully');
      queryClient.invalidateQueries(['tv/medias']);
    },
    onError: (err) => {
      ResponseMessage.error(err.message);
    },
  });
  return mediaQuery;
};

export default useDeleteMediaMutation;
