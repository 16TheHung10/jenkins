import { DatePicker, Form } from 'antd';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import UploadFileComponent from 'components/common/upload/UploadFileComponent';
import WarningNote from 'components/common/warningNote/WarningNote';
import Icons from 'images/icons';
import React from 'react';

const DigitalSignageMediaFormDetails = ({ form, onUploadMedia, loading, progress }) => {
  return (
    <div className="section-block">
      <Form
        form={form}
        layout="vertical"
        onFinish={async (value) => {
          onUploadMedia(value.media);
        }}
      >
        <WarningNote>
          <p>Tên video phải rõ ràng, thể hiện được khái quát nội dung (mục đích) của video</p>
        </WarningNote>
        <Form.Item
          className="w-full"
          name="media"
          label="Video"
          rules={[
            { type: 'array', length: 1, message: 'Video is required' },
            { type: 'array', required: true, message: 'Video is required' },
          ]}
        >
          <UploadFileComponent
            uploadRoute={null}
            mediaSize={150 * 1024 * 1024}
            multiple={false}
            maxCount={1}
            ratio="16/9"
            type="video"
            accept="video/mp4"
            imageContainerHeightProps={350}
            Description={
              <div className="upload_button">
                <p className="ant-upload-drag-icon m-0 flex flex-col items-center">
                  <Icons.Camera style={{ color: 'var(--primary-color)', fontSize: '40px' }} />
                  <span style={{ fontSize: '14px' }}>Upload Video</span>
                  <span className="hint">Limit 1 video, only upload video size less than 150MB </span>
                </p>
              </div>
            }
          />
        </Form.Item>
        <div id="timeFrame"></div>

        <BaseButton loading={loading} iconName="send" htmlType="submit">
          {progress && loading ? `${progress}%` : 'Upload'}
        </BaseButton>
      </Form>
    </div>
  );
};

export default DigitalSignageMediaFormDetails;
