import { Radio, Spin, Upload, message } from 'antd';
import Image from 'components/common/Image/Image';
import { FileHelper } from 'helpers';
import Icons from 'images/icons';
import React, { forwardRef, useEffect, useRef, useState } from 'react';

import './style.scss';
import SuspenLoading from 'components/common/loading/SuspenLoading';
const { Dragger } = Upload;
const UploadFileComponent = (
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
    ...props
  },
  ref
) => {
  const timeoutRef = useRef();
  const onRemove = (image, index) => {
    onRemoveImage && onRemoveImage(image, index);
    const uid = image.uid;
    if (!uid) return;
    const element = document.querySelector(`div[data-index="${index}"]`);
    element.classList.add('fade-out');
    timeoutRef.current = setTimeout(() => {
      const currentImages = props.value;
      const cloneListImage = currentImages.filter((el) => el.uid !== uid);
      props.onChange(cloneListImage);
      element.classList.remove('fade-out');
    }, [300]);
  };
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState(null);
  const [videos, setVideos] = useState(null);
  const handleGenImages = async () => {
    const html = await Promise.all(
      (props.value || []).map(async (image, index) => {
        const url = image.url
          ? image.url + `${FileHelper.isBase64(image.url) ? '' : `?random=${Date.now()}`}`
          : await FileHelper.convertToBase64(image.originFileObj);
        return (
          <div
            style={{
              padding: '10px 10px 10px 10px',
              width: imageContainerHeightProps,
              height: imageContainerHeightProps,
            }}
            key={`${image.uid}`}
            data-index={index}
            className="w-full upload_image fade-in relative"
          >
            <div className="h-full upload_image_content">
              <Image
                src={url}
                style={{ width: `100%`, aspectRatio: ratio, borderRadius: '5px', objectFit: 'contain' }}
              />
              {FooterActions && <FooterActions index={index} url={url} />}
            </div>
            {disabledDelete ? null : (
              <div onClick={() => onRemove(image, index)} className="delete cursor-pointer">
                X
              </div>
            )}
          </div>
        );
      })
    );
    setImages(html);
  };

  const handleGenVideos = async () => {
    setIsLoading(true);
    const html = await Promise.all(
      (props.value || []).map(async (image, index) => {
        const url = image.url
          ? image.url + `${FileHelper.isBase64(image.url) ? '' : `?random=${Date.now()}`}`
          : await FileHelper.convertToBase64(image.originFileObj);
        return (
          <div
            style={{
              padding: '10px 10px 10px 10px',
              width: imageContainerHeightProps,
              height: imageContainerHeightProps,
            }}
            key={`${image.uid}`}
            data-index={index}
            className="w-full  fade-in relative upload_image"
          >
            <div className="h-full upload_image_content flex flex-col">
              <div className="description">
                <p style={{ fontSize: 12 }}>
                  <span className="font-bold">Name</span>: {image.name.slice(0, -4)}{' '}
                </p>
                <p style={{ fontSize: 12 }}>
                  <span className="font-bold">Size</span>: {Math.round(image.size / (1024 * 1024), 5)} MB
                </p>
              </div>
              <video controls src={url} style={{ aspectRatio: ratio }} />
              {FooterActions && <FooterActions index={index} url={url} />}
            </div>
            {disabledDelete ? null : (
              <div onClick={() => onRemove(image, index)} className="delete cursor-pointer">
                X
              </div>
            )}
          </div>
        );
      })
    );
    setVideos(html);
    setIsLoading(false);
  };

  useEffect(() => {
    if (type === 'image') {
      handleGenImages();
    } else if (type === 'video') {
      handleGenVideos();
    }
  }, [props.value, FooterActions, footerActionValue, type]);
  return (
    <div
      id="upload"
      style={{
        height: imageContainerHeightProps || 180,
        transition: 'all .3s',
        flex: isWrap ? 'wrap' : 'nowrap',
        ...props.style,
      }}
    >
      {/* <ImgCrop
        className="crop_image_modal"
        rotationSlider
        modalProps={{
          width: '700px',
        }}
      > */}
      {isLoading ? (
        <div className="center" style={{ width: imageContainerHeightProps }}>
          <Spin />
        </div>
      ) : (
        <>
          {' '}
          <Dragger
            ref={ref}
            action={action}
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
          {/* </ImgCrop> */}
          {isCustomImageList ? null : props.value?.length > 0 ? <>{images || videos}</> : null}
          {ListFileRender && ListFileRender}
        </>
      )}
    </div>
  );
};
export default forwardRef(UploadFileComponent);
