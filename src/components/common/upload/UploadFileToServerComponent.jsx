import { Radio, Upload, message } from 'antd';
import Image from 'components/common/Image/Image';
import { FileHelper } from 'helpers';
import Icons from 'images/icons';
import React, { forwardRef, useEffect, useRef, useState } from 'react';

import './style.scss';
import SuspenLoading from 'components/common/loading/SuspenLoading';
const { Dragger } = Upload;
const UploadFileToServerComponent = (
  {
    name = 'file',
    type = 'image',
    Description,
    disabledDelete = false,
    ratio = '1/1',
    onRemoveImage,
    FooterActions,
    footerActionValue,
    isCustomImageList,
    imageContainerHeightProps = 180,
    ListFileRender,
    isWrap = true,
    mediaSize = 300,
    action = null,
    uploadRoute,
    ...props
  },
  ref
) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div
      id="upload"
      style={{ height: imageContainerHeightProps || 180, transition: 'all .3s', flex: isWrap ? 'wrap' : 'nowrap' }}
    >
      {isLoading ? (
        <SuspenLoading />
      ) : (
        <>
          {' '}
          <Dragger
            headers={{ Authorization: `Bearer ${localStorage.getItem('accessToken')}` }}
            ref={ref}
            action={`http://localhost:5003/api/media/editormedia/antd/${uploadRoute}`}
            {...props}
            name={name}
            // ref={ref}
            listType="picture"
            showUploadList={false}
            fileList={props.value}
            onChange={(e) => {
              const validImagesSize = e.fileList?.filter((el) => {
                return el.size / 1024 < mediaSize;
              });
              console.log({ validImagesSize });
              if (validImagesSize?.length !== e.fileList?.length) {
                message.error({
                  key: name,
                  content: `Image size must be less than ${mediaSize}KB`,
                  duration: 5,
                });
                return;
              }
              props.onChange(validImagesSize);
            }}
          >
            {Description ? (
              Description
            ) : (
              <div className="upload_button">
                <p className="ant-upload-drag-icon m-0 flex flex-col items-center">
                  <Icons.Camera style={{ color: 'var(--primary-color)', fontSize: '40px' }} />
                  <span style={{ fontSize: '14px' }}>Upload item's images</span>
                  <span className="hint">Litmit 5 images, only upload image size less than {mediaSize}KB </span>
                </p>
              </div>
            )}
          </Dragger>
        </>
      )}
    </div>
  );
};
export default forwardRef(UploadFileToServerComponent);
