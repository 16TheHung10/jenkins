import { Col, Row, Switch, message } from 'antd';
import { EcommerceGroupApi, ItemsMasterApi, LoyaltyApi } from 'api';
import SubmitBottomButton from 'components/common/buttons/submitBottomButton/SubmitBottomButton';
import FieldList from 'components/common/fieldList/FieldList';
import { FieldsLoyaltyItemRedeemData } from 'data/render/form';
import { StringHelper } from 'helpers';
import { useFormFields } from 'hooks';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import FileHelper from '../../../../helpers/FileHelper';
import ListBannerComp from './ListBannerComp/ListBannerComp';
import moment from 'moment';
import WarningNote from '../../../../components/common/warningNote/WarningNote';

const LoyaltyItemRedeemDetails = ({ itemCode, initialValue, onSubmit, isLoading = false }) => {
  const [banner, setBanner] = useState('');
  const [searchItemKeyword, setSearchItemKeyword] = useState('');
  const [itemOptions, setItemOptions] = useState([]);
  const searchRef = useRef();

  const handleGetItemOptions = useCallback(async () => {
    if (!searchItemKeyword || searchItemKeyword.length < 3) return;
    const res = await ItemsMasterApi.getItemOptions(searchItemKeyword);
    if (res.status) {
      setItemOptions(
        res.data?.items?.map((item) => ({
          value: JSON.stringify({ itemCode: item.barcode }),
          label: `${item.barcode} - ${item.itemName}`,
        })) || []
      );
    } else {
      message.error(res.message);
    }
  }, [searchItemKeyword]);

  useEffect(() => {
    if (searchRef.current) {
      clearTimeout(searchRef.current);
    }
    searchRef.current = setTimeout(() => {
      handleGetItemOptions();
    }, 1000);
  }, [handleGetItemOptions]);

  const handleUploadBanner = async (banner, itemCode) => {
    if (!banner || typeof banner?.[0].url === 'string') return;
    const base64 = await FileHelper.convertToBase64(banner[0].originFileObj);
    const base64Smooth = StringHelper.base64Smooth(base64);
    const res = await LoyaltyApi.uploadItemRedeemBanner(itemCode, { image: base64Smooth });
    if (res.status) {
      return res.data?.image;
    } else {
      message.error(res.message);
    }
  };
  const handleUploadLogo = async (logo, itemCode) => {
    if (!logo || typeof logo?.[0].url === 'string') return;
    const base64 = await FileHelper.convertToBase64(logo[0].originFileObj);
    const base64Smooth = StringHelper.base64Smooth(base64);
    const res = await LoyaltyApi.uploadItemRedeemLogo(itemCode, { image: base64Smooth });
    if (res.status) {
      return res.data?.image;
    } else {
      message.error(res.message);
    }
  };

  const handleUploadGroupMedia = async (logo, groupBanner, itemCode) => {
    if (!itemCode) return;
    const res = await Promise.all([handleUploadLogo(logo, itemCode), handleUploadBanner(groupBanner, itemCode)]);
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
    fieldInputs: FieldsLoyaltyItemRedeemData.fieldsInputsDetails({
      itemOptions,
      setSearch: setSearchItemKeyword,
      isDetails: itemCode,
      ListFileRender: <ListBannerComp image={banner} />,
    }),
    onSubmit: handleSubmit,
    watches: ['banner'],
  });

  const handleSetBannerUrl = async (image) => {
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
    const image = getValues('banner')?.[0];
    handleSetBannerUrl(image);
  }, [getValues('banner')]);

  useEffect(() => {
    if (initialValue) {
      reset({
        ...initialValue,
        startDate: initialValue.startDate ? moment(new Date(initialValue.startDate)) : null,
        endDate: initialValue.endDate ? moment(new Date(initialValue.endDate)) : null,
        banner: initialValue.banner
          ? [
              {
                uid: Date.now(),
                name: 'banner.png',
                status: 'done',
                url: initialValue.banner,
              },
            ]
          : null,
        logo: initialValue.logo
          ? [
              {
                uid: Date.now(),
                name: 'logo.png',
                status: 'done',
                url: initialValue.logo,
              },
            ]
          : null,
      });
    }
  }, [initialValue, reset]);

  return (
    <div id="ecommerce" className="section-block mt-15 mini_app_container">
      <form onSubmit={onSubmitHandler}>
        <div className="w-full">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Controller
                control={control}
                name="active"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Switch
                    checkedChildren="Active"
                    unCheckedChildren="Active"
                    onChange={onChange}
                    ref={ref}
                    checked={value}
                  />
                )}
              />
            </Col>
            <Col span={12} style={{ textAlign: 'end' }}>
              <WarningNote>
                <p className="cl-red">
                  <b className="font-bold">Lưu ý: </b>
                  <br />
                  Hàng hóa có điểm quy đổi thấp nhất là 100
                  <br />
                  Điểm quy đổi sẽ được cập nhật khi qua ngày
                  <br />
                </p>
              </WarningNote>
            </Col>
          </Row>
          {initialValue && (
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="mb-15">
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
                <p className="cl-red">
                  <b className="font-bold">Message</b>
                  {initialValue.message}
                </p>
              </Col>
              <Col span={12} className="flex gap-10" style={{ justifyContent: 'end' }}>
                <h4 className="text-right">
                  <b className="font-bold">Point: </b>
                  <span className="color-primary">
                    {StringHelper.formatPrice(initialValue.point || 0) || 'In update'}
                  </span>
                </h4>
              </Col>
            </Row>
          )}
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <Row gutter={[16, 0]} className="items-center">
                <FieldList fields={fields.filter((el) => el.group === 1)} />
              </Row>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <Row gutter={[16, 0]} className="items-center">
                <FieldList fields={fields.filter((el) => el.group === 2)} />
              </Row>
            </Col>
            <SubmitBottomButton
              style={{ marginLeft: '10px' }}
              loading={isLoading}
              title={initialValue ? 'Update' : 'Create'}
            />
          </Row>
        </div>
      </form>
    </div>
  );
};

export default LoyaltyItemRedeemDetails;
