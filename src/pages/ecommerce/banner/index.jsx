import { yupResolver } from '@hookform/resolvers/yup';
import { Col, Row, message } from 'antd';
import { EcommerceBannerApi } from 'api';
import SubmitBottomButton from 'components/common/buttons/submitBottomButton/SubmitBottomButton';
import { StringHelper } from 'helpers';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';
import BannerItem from './bannerItem/BannerItem';
import EcommerceBannerNav from './nav';
import Wiki from 'components/common/wiki/Wiki';
import './style.scss';
const schema = yup
  .object()
  .shape({
    images: yup
      .array()
      .of(
        yup.object().shape({
          title: yup.string().required('Title is required'),
          link: yup.string().matches(/^$|^\/[^/].*$/, 'Invalid URL format'),
        })
      )
      .required(),
  })
  .required();
const EcommerceBanners = () => {
  const [fileListObject, setFileListObject] = useState([]);

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      images: [
        { order: 0, title: '', link: '', image: [] },
        { order: 1, title: '', link: '', image: [] },
        { order: 2, title: '', link: '', image: [] },
      ],
    },
    resolver: yupResolver(schema),
  });
  const { fields, append, prepend, remove, swap, move, insert, replace } = useFieldArray({
    control,
    name: 'images',
  });

  const onSubmit = async (value) => {
    var res = await EcommerceBannerApi.createBanner(
      value.images.map((item) => {
        const imageUrl = item.image[0].url;
        return { image: imageUrl.includes(process.env.REACT_APP_API_EXT_MEDIA_GET) ? imageUrl : StringHelper.base64Smooth(imageUrl), order: item.order, title: item.title, link: item.link };
      })
    );
    if (res.status) {
      message.success('Create banner successfully');
    } else {
      message.error(res.message);
    }
  };
  const getImageName = (imageUrl) => {
    const regex = /\/item\/([^/]+)\/([^/]+)\.jpg/;
    const match = imageUrl.match(regex);
    return match?.[2];
  };
  const handleGetBannerData = async () => {
    const res = await EcommerceBannerApi.getBanner();
    if (res.status) {
      if (res.data.banners?.length === 3) {
        reset({
          images: res.data.banners?.map((item, index) => {
            return {
              ...item,
              image: [
                {
                  uid: `${item.image}-${index}`,
                  name: `${getImageName(item.image)}`,
                  status: 'done',
                  url: item.image + `?random=${Date.now()}`,
                },
              ],
            };
          }),
        });
      }

      setFileListObject(
        res.data.banners?.map((item, index) => {
          return [
            {
              uid: `${item.image}-${index}`,
              name: `${getImageName(item.image)}`,
              status: 'done',
              url: item.image + `?random=${Date.now()}`,
            },
          ];
        })
      );
    } else {
      message.error(res.message);
    }
  };
  useEffect(() => {
    handleGetBannerData();
  }, []);

  return (
    <EcommerceBannerNav>
      <Wiki code="ecommerce">
        <form onSubmit={handleSubmit(onSubmit)} id="ecommerceBanner" className="mt-15">
          <ul>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <BannerItem data={{ fileListObject, setFileListObject, errors, item: fields[0], index: 0, control }} />
              </Col>
              <Col span={24} className="w-full">
                <BannerItem data={{ fileListObject, setFileListObject, errors, item: fields[1], index: 1, control }} />
              </Col>
              <Col span={24} className="w-full">
                <BannerItem data={{ fileListObject, setFileListObject, errors, item: fields[2], index: 2, control }} />
              </Col>
            </Row>
            <div className="flex flex-col gap-10"></div>
          </ul>
          <div className="mb-15">
            <SubmitBottomButton title="Save change" />
          </div>
        </form>
      </Wiki>
    </EcommerceBannerNav>
  );
};

export default EcommerceBanners;
