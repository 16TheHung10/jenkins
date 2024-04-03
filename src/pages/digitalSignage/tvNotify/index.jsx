import { Col, Row, Upload } from 'antd';
import { DigitalSignageTVApi } from 'api';
import AppMessage from 'message/reponse.message';
import DigitalSignageTV from 'pages/digitalSignage/tv';
import DrawerUploadAPK from 'pages/digitalSignage/tvNotify/DrawerUploadAPK';
import TVNotifyActions from 'pages/digitalSignage/tvNotify/TVNotifyActions';
import NotifyDigitalSignageNav from 'pages/digitalSignage/tvNotify/nav';
import React, { useCallback, useState } from 'react';
import DigitalSignageTVMainContent from '../tv/content';
const { Dragger } = Upload;

const TVNotify = () => {
  const [isLoadingUploadAPK, setIsLoadingUploadAPK] = useState(false);
  const [isShowDrawerUploadApp, setIsShowDrawerUploadApp] = useState(false);
  const [selectedTVs, setSelectedTVs] = useState([]);
  const [count, setCount] = useState(0);
  const handleSetSelectedTVs = useCallback(
    (value) => {
      setSelectedTVs(value);
    },
    [selectedTVs]
  );
  const handleSetSocketAction = async (tvCode, action, mesage) => {
    if (selectedTVs?.length > 0) {
      const res = await DigitalSignageTVApi.socketAction(tvCode, action, mesage);
    } else {
      AppMessage.info('Please select tv before update app');
    }
  };

  const toggleShowDrawerUpdateApp = useCallback(
    (selectedTV) => {
      setIsShowDrawerUploadApp((prev) => !prev);
    },
    [isShowDrawerUploadApp]
  );

  return (
    <NotifyDigitalSignageNav>
      <Row gutter={[16, 16]}>
        <Col span={8} xxl={8}>
          <TVNotifyActions
            onSetSocketAction={handleSetSocketAction}
            selectedTVs={selectedTVs}
            onOpenFormUpdateApp={toggleShowDrawerUpdateApp}
          />
        </Col>
        <Col span={16} xxl={16}>
          <DigitalSignageTVMainContent
            hideNav
            role="admin"
            onSetTVs={handleSetSelectedTVs}
            selectedTvs={selectedTVs}
            scrollY={'calc(100vh - 365px)'}
          />
        </Col>
      </Row>
      <DrawerUploadAPK
        isLoadingUploadAPK={isLoadingUploadAPK}
        setIsLoadingUploadAPK={setIsLoadingUploadAPK}
        open={isShowDrawerUploadApp}
        onClose={toggleShowDrawerUpdateApp}
        footer={false}
        onSetSocketAction={handleSetSocketAction}
        selectedTVs={selectedTVs}
      />
    </NotifyDigitalSignageNav>
  );
};

export default TVNotify;
