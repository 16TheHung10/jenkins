import { Col, Input, Row, Select, Upload, message } from 'antd';
import React from 'react';
import { Controller } from 'react-hook-form';
import Image from 'components/common/Image/Image';
import Icons from 'images/icons';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { FileHelper, StringHelper } from 'helpers';
import './style.scss';
const BannerItem = ({ data }) => {
  const { fileListObject, setFileListObject, errors, item, index, control } = data;
  return (
    <li id="bannerItem" key={item.id} className="section-block flex flex-col relative">
      <div className="flex gap-10 items-center mb-15">
        <Row gutter={[16, 16]} className="w-full">
          <Col span={12}>
            <div className="w-full">
              <label htmlFor={`images.${index}.title`} className="required">
                Banner title (for SEO)
              </label>
              <Controller
                rules={{ required: 'Image order is required' }}
                render={({ field }) => <Input {...field} placeholder="Banner title for SEO" />}
                name={`images.${index}.title`}
                control={control}
              />
              <p className="error-text-12">{errors?.images && errors?.images?.[index]?.title && errors.images[index].title.message}</p>
            </div>
          </Col>
          <Col span={12}>
            <div className="w-full">
              <label htmlFor={`images.${index}.link`}>Banner link</label>
              <Controller
                rules={{ required: 'Image order is required' }}
                render={({ field }) => <Input {...field} placeholder="Open link when click in banner" />}
                name={`images.${index}.link`}
                control={control}
              />
              <p className="error-text-12">{errors?.images && errors?.images?.[index]?.link && errors.images[index].link.message}</p>
            </div>
          </Col>
        </Row>
      </div>
      <div className="flex gap-10 flex-1 controller">
        <Controller
          rules={{ required: 'Image is required', length: 1 }}
          render={({ field }) => (
            <Upload
              {...field}
              onPreview={() => {}}
              action={null}
              accept="image/png, image/jpeg, image/webp"
              showUploadList={false}
              onChange={async (e) => {
                const validImagesSize = e.fileList?.filter((el) => {
                  const res = el.size / 1024 < 300;
                  if (!res) {
                    message.error({
                      key: 'itemImage',
                      content: 'Image size must be less than 300KB',
                      duration: 5,
                    });
                  }
                  return res;
                });
                let clone = JSON.parse(JSON.stringify(fileListObject));
                const fileList = await Promise.all(
                  validImagesSize?.map(async (item) => ({
                    ...item,
                    url: await FileHelper.convertToBase64(item.originFileObj),
                    status: 'done',
                  }))
                );
                clone[index] = fileList;
                setFileListObject((prev) => {
                  return [...clone];
                });
                field.onChange(fileList);
              }}
              fileList={fileListObject?.[index]}
              listType="picture-card"
              multiple={false}
              maxCount={1}
            >
              <div className="upload_button">
                <p className="ant-upload-drag-icon m-0 flex flex-col items-center">
                  <Icons.Camera style={{ color: 'var(--primary-color)', fontSize: '20px' }} />
                </p>
              </div>
            </Upload>
          )}
          name={`images.${index}.image`}
          control={control}
        />
        <div className="image flex flex-col">
          {fileListObject[index]?.[0] ? <Image style={{ width: '100%', height: 'calc(100% - 20px)' }} src={fileListObject[index][0].url} alt={`banner-${index}`} /> : null}
          <p className="error-text-12">{errors?.images?.[index]?.image && errors.images[index].image.message}</p>
        </div>
      </div>
    </li>
  );
};

export default BannerItem;
