import { message } from 'antd';
import { CampaignApi } from 'api';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import CampaignDetailsMain from '../details/CampaignDetailsMain';
import CampaignNav from '../nav/CampaignNav';

const CreateCampaign = () => {
  const history = useHistory();
  const queryClient = useQueryClient();

  const handleSubmit = async ({ rest: data, imageProps, handleUploadImage: onUploadImage }) => {
    const res = await CampaignApi.createCampaign(data);
    if (res.status) {
      if (res.data) {
        await onUploadImage(res.data.campaignCode, imageProps.listImageUploaded);
        history.push('/campaigns');
      }
    } else {
      throw new Error(res.message);
    }
  };

  const campaignQuery = useMutation(handleSubmit, {
    onSuccess: (data) => {
      message.success('Create campaign successfully');
      queryClient.invalidateQueries((queryKey) => {
        return queryKey.some((key) => {
          return key === 'campaign' && key !== 'campaign/details';
        });
      });
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  return (
    <CampaignNav>
      <CampaignDetailsMain onSubmit={campaignQuery.mutate} query={campaignQuery} />
    </CampaignNav>
  );
};

export default CreateCampaign;

