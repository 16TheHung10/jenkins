import { Drawer, Form, Input, Upload } from 'antd';
import Block from 'components/common/block/Block';
import AppMessage from 'message/reponse.message';
import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { DigitalSignageTVApi, MediaApi } from 'api';
const { Dragger } = Upload;

const DrawerUploadAPK = ({
  setIsLoadingUploadAPK,
  isLoadingUploadAPK,
  onSetSocketAction,
  open,
  onClose,
  selectedTVs,
}) => {
  const [progress, setProgress] = useState(0);

  const handleUploadAPK = async (file, appName) => {
    if (selectedTVs?.length > 0) {
      setIsLoadingUploadAPK(true);
      const formData = new FormData();
      formData.append('file', file);
      var res = await MediaApi.upload('apk', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      if (res.status) {
        const messageSocket = {
          appLink: `${process.env.REACT_APP_API_EXT_MEDIA_V2}/download/${res.data.path}`,
          appName,
        };
        setIsLoadingUploadAPK(false);
        onSetSocketAction(selectedTVs, 'update_version_tv', messageSocket);
        await DigitalSignageTVApi.updateNotify({
          message: JSON.stringify(messageSocket),
          status: 2,
          requestType: 'UpdateApp',
          tvExcute: selectedTVs?.length || 0,
        });
        AppMessage.success('Upload APK successfully');
        return res.data.path;
      } else {
        setIsLoadingUploadAPK(false);
        return null;
      }
    } else {
      AppMessage.info('Please select tv before update app');
    }
  };

  return (
    <Drawer width={500} open={open} onClose={onClose} footer={false}>
      <Block id="tvUploadAPK">
        <Form
          layout="vertical"
          onFinish={(value) => {
            const apk = value.apk.fileList[0].originFileObj;
            handleUploadAPK(apk, value.appName);
          }}
        >
          <Form.Item
            name="appName"
            label="App version"
            rules={[{ required: true, message: 'App version is required' }]}
          >
            <Input placeholder="Enter app version" />
          </Form.Item>
          <Form.Item name="apk" rules={[{ required: true, message: 'File is required' }]}>
            <Dragger name="file" maxCount={1} action={null} accept=".apk, application/vnd.android.package-archive">
              <div className="p-10">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files
                </p>
              </div>
            </Dragger>
          </Form.Item>
          <Form.Item>
            <BaseButton loading={isLoadingUploadAPK} htmlType="submit" iconName="upload" color="green ">
              {progress && isLoadingUploadAPK ? `${progress} %` : ''} Update app
            </BaseButton>
          </Form.Item>
        </Form>
      </Block>
    </Drawer>
  );
};

export default DrawerUploadAPK;
