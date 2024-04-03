import { Col, Row, Switch, Tabs, message } from 'antd';
import SubmitBottomButton from 'components/common/buttons/submitBottomButton/SubmitBottomButton';
import FieldList from 'components/common/fieldList/FieldList';
import { FieldsEcommerceGroupData } from 'data/render/form';
import { useFormFields } from 'hooks';
import moment from 'moment';
import React, { useEffect, useMemo } from 'react';
import FileHelper from '../../../../helpers/FileHelper';
import { StringHelper } from 'helpers';
import { EcommerceGroupApi } from 'api';
import AddGroupItem from '../addGroupItem/AddGroupItem';
import ListBannerComp from './ListBannerComp/ListBannerComp';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

const EcommerceGroupDetails = ({ groupID, initialValue, onSubmit, isLoading = false }) => {
  const [banner, setBanner] = useState('');

  const handleUploadBanner = async (banner, groupID) => {
    if (!banner || typeof banner?.[0].url === 'string') return;
    const base64 = await FileHelper.convertToBase64(banner[0].originFileObj);
    const base64Smooth = StringHelper.base64Smooth(base64);
    const res = await EcommerceGroupApi.uploadGroupBanner(groupID, base64Smooth);
    if (res.status) {
      return res.data?.image;
    } else {
      message.error(res.message);
    }
  };
  const handleUploadLogo = async (logo, groupID) => {
    if (!logo || typeof logo?.[0].url === 'string') return;
    const base64 = await FileHelper.convertToBase64(logo[0].originFileObj);
    const base64Smooth = StringHelper.base64Smooth(base64);
    const res = await EcommerceGroupApi.uploadGroupLogo(groupID, base64Smooth);
    if (res.status) {
      return res.data?.image;
    } else {
      message.error(res.message);
    }
  };
  const handleUploadGroupMedia = async (groupLogo, groupBanner, groupID) => {
    if (!groupID) return;
    const res = await Promise.all([handleUploadLogo(groupLogo, groupID), handleUploadBanner(groupBanner, groupID)]);
  };
  const handleSubmit = (value) => {
    onSubmit({ value, onUploadMedia: handleUploadGroupMedia });
  };

  const {
    formInputsWithSpan: fields,
    onSubmitHandler,
    reset,
    getValues,
    control,
  } = useFormFields({
    fieldInputs: FieldsEcommerceGroupData.fieldsInputsUpdate({ ListFileRender: <ListBannerComp image={banner} /> }),
    onSubmit: handleSubmit,
    watches: ['groupBanner'],
  });

  const handleSetBannerUrl = async (image) => {
    console.log({ image });
    if (!image) {
      return;
    }
    let imageUrlRaw = '';
    if (!image.url) {
      imageUrlRaw = await FileHelper.convertToBase64(image.originFileObj);
    } else imageUrlRaw = image.url;
    setBanner(imageUrlRaw);
  };
  useEffect(() => {
    const image = getValues('groupBanner')?.[0];
    handleSetBannerUrl(image);
  }, [getValues('groupBanner')]);

  useEffect(() => {
    if (initialValue) {
      reset({
        ...initialValue,
        groupBanner: initialValue.groupBanner
          ? [
              {
                uid: Date.now(),
                name: 'banner.png',
                status: 'done',
                url: initialValue.groupBanner,
              },
            ]
          : null,
        groupLogo: initialValue.groupLogo
          ? [
              {
                uid: Date.now(),
                name: 'groupLogo.png',
                status: 'done',
                url: initialValue.groupLogo,
              },
            ]
          : null,
      });
    }
  }, [initialValue, reset]);
  const items = () => {
    let res = [
      {
        key: '1',
        label: 'Group',
        children: (
          <form onSubmit={onSubmitHandler}>
            <div className="section-block w-full">
              <Row gutter={[16, 16]}>
                {initialValue && (
                  <Col span={24} className="mb-15">
                    <Controller
                      control={control}
                      name="active"
                      render={({ field: { onChange, onBlur, value, ref } }) => <Switch checkedChildren="Active" unCheckedChildren="Active" onChange={onChange} ref={ref} checked={value} />}
                    />
                  </Col>
                )}
                <FieldList fields={fields.filter((el) => el.group === 1)} />
              </Row>
              <Row gutter={[16, 0]}>
                <Col span={24}>
                  <Row gutter={[16, 0]} className="items-center">
                    <FieldList fields={fields.filter((el) => el.group === 2)} />
                    {/* <ListBannerComp image={banner} /> */}
                  </Row>
                </Col>
                <SubmitBottomButton style={{ marginLeft: '10px' }} loading={isLoading} title={initialValue ? 'Update' : 'Create'} />
              </Row>
            </div>
          </form>
        ),
      },
    ];
    if (groupID)
      res.push({
        key: '2',
        label: "Group's item",
        children: <AddGroupItem initialItems={Object.values(initialValue?.items || {})} groupID={groupID} />,
      });
    return res;
  };

  return (
    <div id="ecommerce" className="section-block mt-15 mini_app_container">
      {initialValue && (
        <div className="section-block mt-15 mb-15">
          <div className="flex gap-10">
            <div className="flex flex-col">
              <p className="m-0">
                Created by: <span className="color-primary">{initialValue.createdBy}</span>
              </p>
              <p className="hint m-0">At: {moment(initialValue.createdDate).format('DD/MM/YYYY HH:mm')}</p>
            </div>

            <div className="flex flex-col">
              <p className="m-0">
                Updated by: <span className="color-primary">{initialValue.updatedBy}</span>
              </p>
              <p className="hint">At: {moment(initialValue.updatedDate).format('DD/MM/YYYY HH:mm')}</p>
            </div>
          </div>
        </div>
      )}
      <Tabs defaultActiveKey="1" items={items()} />
    </div>
  );
};

export default EcommerceGroupDetails;

