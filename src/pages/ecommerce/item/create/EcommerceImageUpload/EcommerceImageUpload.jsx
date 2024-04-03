import { Select, Switch, Upload, message } from 'antd';
import React from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { useState } from 'react';
import Icons from 'images/icons';
import './style.scss';
import { useEffect } from 'react';
import Block from 'components/common/block/Block';

const EcommerceImageUpload = ({ formState, initialValue }) => {
  const [fileListObject, setFileListObject] = useState([]);
  const { control, handleSubmit, setValue, errors } = formState;
  const { fields, append, prepend, remove, swap, move, insert, replace } = useFieldArray({
    control,
    name: 'images',
  });

  const getImageName = (imageUrl) => {
    const regex = /\/item\/([^/]+)\/([^/]+)\.jpg/;
    const match = imageUrl.match(regex);
    return match?.[2];
  };

  useEffect(() => {
    if (initialValue) {
      let imageObject = [];
      for (let index in initialValue) {
        let item = initialValue[index];
        const image = [
          {
            uid: `${item.image}-${index}`,
            name: `${getImageName(item.image)}`,
            status: 'done',
            url: item.image + `?random=${Date.now()}`,
          },
        ];
        imageObject.push(image);
      }
      setFileListObject((prev) => [...imageObject]);
    } else {
      setValue('images', [
        {
          image: '',
          isThumbnail: true,
          order: 0,
        },
      ]);
    }
  }, [initialValue]);

  return (
    <Block id="ecommerceImageUpload">
      <ul>
        {fields.map((item, index) => {
          return (
            <li key={item.id} className="section-block mt-15 aaaaa" id="ecommmerItemCreateImage">
              <div className="flex gap-10 items-center mb-15">
                <Controller
                  render={({ field }) => {
                    return (
                      <Switch
                        style={{ width: '179px' }}
                        {...field}
                        checked={field.value}
                        checkedChildren="Main"
                        unCheckedChildren="Main"
                        onChange={(e) => {
                          for (let i = 0; i < fields.length; i++) {
                            if (i === index) {
                              // field.onChange(e);
                              setValue(`images.${index}.isThumbnail`, true);
                            } else {
                              setValue(`images.${i}.isThumbnail`, false);
                            }
                          }
                        }}
                      />
                    );
                  }}
                  name={`images.${index}.isThumbnail`}
                  control={control}
                />
                <Controller
                  rules={{ required: 'Image order is required' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={[
                        { value: 0, label: 'Order : 1' },
                        { value: 1, label: 'Order : 2' },
                        { value: 2, label: 'Order : 3' },
                        { value: 3, label: 'Order : 4' },
                        { value: 4, label: 'Order : 5' },
                      ]}
                      placeholder="Select item  order"
                    />
                  )}
                  name={`images.${index}.order`}
                  control={control}
                />
                <BaseButton
                  color="error"
                  iconName="delete"
                  type="button"
                  disabled={fileListObject[index]?.isThumbnail}
                  onClick={() => {
                    if (fields[index].isThumbnail) {
                      message.info('Can not delete thumbnail image');
                      return;
                    }
                    setFileListObject((prev) => {
                      if (prev[index]?.isThumbnail) return prev;
                      const clone = [...prev];
                      clone.splice(index, 1);
                      return clone;
                    });
                    remove(index);
                  }}
                />
              </div>

              <Controller
                rules={{ required: 'Image is required', length: 1 }}
                render={({ field }) => (
                  <Upload
                    {...field}
                    showUploadList={{
                      showRemoveIcon: false,
                      showPreviewIcon: false,
                    }}
                    onPreview={() => {}}
                    action={null}
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => {
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
                      setFileListObject((prev) => {
                        prev[index] = validImagesSize?.map((item) => ({
                          ...item,
                          status: 'done',
                        }));
                        return [...prev];
                      });
                      field.onChange(
                        validImagesSize?.map((item) => ({
                          ...item,
                          status: 'done',
                        }))
                      );
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
              {errors.images && errors.images[index]?.image && (
                <span className="error-text-12">{errors.images[index].image.message}</span>
              )}
            </li>
          );
        })}
      </ul>
      {fields?.length < 5 && (
        <BaseButton
          iconName="plus"
          type="button"
          onClick={() => {
            if (fields?.length !== 0) {
              append({ isThumbnail: false, order: 0 });
            } else {
              append({ isThumbnail: true, order: 0 });
            }
          }}
        >
          Add image
        </BaseButton>
      )}
    </Block>
  );
};

export default EcommerceImageUpload;
