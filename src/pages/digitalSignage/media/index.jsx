import React, { useCallback, useState } from 'react';
import { Drawer, Form } from 'antd';
import { DigitalSignageMediaApi, DigitalSignageTVApi, MediaApi } from 'api';
import MainTable from 'components/common/Table/UI/MainTable';
import Block from 'components/common/block/Block';
import { TableDigitalSignageMediaData } from 'data/render/table';
import AppMessage from 'message/reponse.message';
import DigitalSignageMediaFormDetails from 'pages/digitalSignage/media/form/details';
import DigitalSignageMediaFormSearch from 'pages/digitalSignage/media/form/search';
import useMediaQuery from 'pages/digitalSignage/media/hooks/useMediaQuery';
import { useQueryClient } from 'react-query';
import DigitalSignageNav from '../nav';
import ResponseHelper from 'helpers/ResponseHelper';
import useSetMediaDefaultMutation from 'pages/digitalSignage/media/hooks/useSetMediaDefaultMutation';

const DigitalSignageMedia = () => {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);
  const [isShowDrawerCreate, setIsShowDrawerCreate] = useState(false);
  const [searchParams, setSearchParams] = useState({ keyword: '' });
  const [form] = Form.useForm();
  const [isLoadingUploadMedia, setIsLoadingUploadMedia] = useState(false);
  const [formSearch] = Form.useForm();
  const setDefaultMutation = useSetMediaDefaultMutation();

  const toggleShowDrawerCreate = useCallback(() => {
    if (isLoadingUploadMedia && isShowDrawerCreate) {
      AppMessage.error('Please wating for upload process complete');
    } else {
      setIsShowDrawerCreate((prev) => !prev);
    }
  }, [isShowDrawerCreate]);

  const mediaQuery = useMediaQuery({ searchParams });
  const handleSetSearchParams = (value) => {
    setSearchParams((prev) => ({ ...prev, ...value }));
  };

  const handleUploadMedia = async (media) => {
    const formData = new FormData();
    formData.append('file', media);
    var res = await MediaApi.upload('video', formData, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percentCompleted);
      },
    });
    console.log({ resVideo: res });
    if (res.status) {
      return res.data.path;
    } else {
      return null;
    }
  };
  const handleSaveMedia = async (media) => {
    if (!media || media.length === 0) {
      return null;
    }
    setIsLoadingUploadMedia(true);
    const video = media[0];
    const url = await handleUploadMedia(video.originFileObj);
    if (url) {
      const payload = {
        url,
        name: video.name,
        size: video.size,
        type: 'video',
      };
      const res = await DigitalSignageMediaApi.createMedia(payload);
      if (res.status) {
        queryClient.invalidateQueries(['tv/medias']);
        await DigitalSignageTVApi.updateNotify({
          message: '{}',
          status: 2,
          requestType: 'UpdateMedia',
          tvExcute: 0,
        });
        AppMessage.success('Upload media successfully');
        toggleShowDrawerCreate();
        setIsLoadingUploadMedia(false);
        form.resetFields();
        return payload;
      } else {
        await MediaApi.delete(url);
        AppMessage.error(res.message);
        setIsLoadingUploadMedia(false);
        return null;
      }
    } else {
      AppMessage.error('Upload media failed');
      setIsLoadingUploadMedia(false);
      return null;
    }
  };
  const handleDeleteMedia = async (mediaCode) => {
    const res = await DigitalSignageMediaApi.deleteMedia(mediaCode);
    if (res.status) {
      AppMessage.success('Delete media successfully');
    } else {
      AppMessage.error(res.message);
    }
  };

  return (
    <DigitalSignageNav>
      <DigitalSignageMediaFormSearch
        form={formSearch}
        onOpenFormCreate={toggleShowDrawerCreate}
        onSetSearchParams={handleSetSearchParams}
      />
      <Block id="mediaSearchResult">
        <MainTable
          className="w-full fixed_header"
          style={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto' }}
          loading={mediaQuery.isLoading}
          columns={TableDigitalSignageMediaData.columns({ onDeleteMedia: handleDeleteMedia, setDefaultMutation })}
          dataSource={Object.values(mediaQuery.data || {}) || []}
        />
      </Block>
      <Drawer width={'fit-content'} open={isShowDrawerCreate} onClose={toggleShowDrawerCreate} footer={false}>
        <DigitalSignageMediaFormDetails
          form={form}
          onUploadMedia={handleSaveMedia}
          loading={isLoadingUploadMedia}
          progress={progress}
        />
      </Drawer>
    </DigitalSignageNav>
  );
};

export default DigitalSignageMedia;
