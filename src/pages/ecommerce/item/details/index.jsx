import { Tabs, message } from 'antd';
import { EcommerceCategoryApi, EcommerceItemApi, ItemsMasterApi } from 'api';
import { FieldsEcommerceItemData } from 'data/render/form';
import { FileHelper, StringHelper } from 'helpers';
import { useFormFields } from 'hooks';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import EcommerceTagApi from '../../../../api/ecommerce/EcommerceTagApi';
import EcommerceRelateItems from '../relateItems';
import EcommerceItemFormDetails from './FormDetails/EcommerceItemFormDetails';

const EcommerceItemDetails = ({ initialValue, itemID, onSubmit, loading = false }) => {
  const [itemSearchKeyword, setItemSearchKeyword] = useState('');
  const [thumbnailImageIndex, setThumbnailImageIndex] = useState(-1);
  const [itemOptions, setItemOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [imageForDeleteTemp, setImageForDeleteTemp] = useState([]);
  const [defaultItemPrice, setDefaultItemPrice] = useState(0);
  const [tagOptions, setTagOptions] = useState([]);
  const [isLoadingGetTags, setIsLoadingGetTags] = useState(false);
  const searchItemRef = useRef();

  const getImageName = (imageUrl) => {
    const regex = /\/item\/([^/]+)\/([^/]+)\.jpg/;
    const match = imageUrl.match(regex);
    return match?.[2];
  };
  const handleUploadImage = async (itemCode, images, currrentNumberOfImages = 0) => {
    const imageBase64Array = [];
    for (let image of images) {
      if (!image || typeof image?.url === 'string') return;
      const base64 = await FileHelper.convertToBase64(image.originFileObj);
      const base64Smooth = StringHelper.base64Smooth(base64);
      imageBase64Array.push(base64Smooth);
    }
    let res = await EcommerceItemApi.uploadItemImages(itemCode, imageBase64Array, currrentNumberOfImages);
    return res.data?.images;
  };

  const handleDeleteImage = async (itemCode, newImageName) => {
    await Promise.all(
      imageForDeleteTemp.map(async (item) => {
        if (newImageName.includes(+item.image?.name)) return null;
        await EcommerceItemApi.deleteItemImages(itemCode, item?.image?.name);
      })
    );
    setImageForDeleteTemp([]);
  };

  const handleGetTags = async () => {
    setIsLoadingGetTags((prev) => true);
    const res = await EcommerceTagApi.getTags();
    if (res.status) {
      setTagOptions(res.data.tags?.map((item) => ({ value: +item.tagID, label: `${item.tagName}` })));
      setIsLoadingGetTags((prev) => false);
    } else {
      setTagOptions(null);
    }
  };

  const handleSubmit = async (value) => {
    if (!value.images || value.images.length === 0) {
      message.error('Please provide at least one image');
      return;
    }
    const item = JSON.parse(value.itemCode);
    const itemCode = item.itemCode;
    const itemName = value.itemName || item.itemName;
    const newImages = [];
    for (let imageData of value.images?.filter((el) => el.image)) {
      if (typeof imageData.image?.[0]?.url === 'string') {
        newImages.push({
          isThumbnail: imageData.isThumbnail,
          order: imageData.order,
          image: imageData.image?.[0]?.url,
        });
      } else {
        const image = await FileHelper.convertToBase64(imageData.image?.[0]?.originFileObj);
        newImages.push({
          isThumbnail: imageData.isThumbnail,
          order: imageData.order,
          image: StringHelper.base64Smooth(image),
        });
      }
    }
    const payload = { ...value, images: newImages, itemCode, itemName, thumbnailImageIndex };
    await onSubmit({
      value: payload,
      onUploadImage: handleUploadImage,
      onDeleteImage: handleDeleteImage,
      onGetItemTags: handleGetTags,
    });
  };

  useEffect(() => {
    handleGetTags();
  }, []);

  const {
    formInputsWithSpan: fields,
    onSubmitHandler,
    reset,
    getValues,
    setValue,
    control,
    formState,
  } = useFormFields({
    fieldInputs: FieldsEcommerceItemData.fieldsInputsDetails({
      isUpdate: Boolean(initialValue),
      onSearchItem: setItemSearchKeyword,
      itemOptions,
      categoryOptions,
      defaultItemPrice,
      isLoadingGetTags,
      tagOptions,
    }),
    onSubmit: handleSubmit,
    watches: ['itemCode', 'itemDefaultPrice'],
  });
  useEffect(() => {
    if (initialValue && itemOptions?.length > 0) {
      setValue('itemCode', itemOptions[0].value);
    }
  }, [initialValue, itemOptions, setValue]);

  useEffect(() => {
    if (initialValue) {
      reset({
        itemDefaultPrice: getValues('itemDefaultPrice') || 0,
        ...initialValue,
        itemCode: JSON.stringify({ itemName: initialValue.itemName, itemCode: initialValue.itemCode }),
        tags: initialValue.tags?.map((item) => +item.tagID),
        images: initialValue.images
          ? initialValue.images?.map((imageItem, index) => {
              return {
                isThumbnail: imageItem.isThumbnail,
                order: imageItem.order,
                image: [
                  {
                    uid: `${imageItem.image}-${index}`,
                    name: `${getImageName(imageItem.image)}`,
                    status: 'done',
                    url: imageItem.image,
                  },
                ],
              };
            })
          : [],
      });
      setItemSearchKeyword(initialValue.itemCode);
    }
  }, [initialValue]);

  const handleGetItemOptions = async () => {
    let keyword = itemSearchKeyword;
    if (!keyword || keyword.length < 3 || keyword.length >= 40) return;
    const res = await ItemsMasterApi.getItemOptions(keyword);
    if (res.status) {
      setItemOptions(
        res.data?.items?.map((item) => {
          return {
            value: JSON.stringify({ itemName: item.itemName, itemCode: item.barcode }),
            label: `${item.barcode} - ${item.itemName}`,
          };
        }) || []
      );
    } else {
      message.error(res.message);
    }
  };
  const handleGetCategoryOptions = async () => {
    const res = await EcommerceCategoryApi.getCategories();
    if (res.status) {
      setCategoryOptions(
        res.data?.categories
          ?.sort((a, b) => a.categoryID - b.categoryID)
          ?.map((item) => ({ value: item.categoryID, label: `${item.categoryID} - ${item.categoryName}` })) || []
      );
    } else {
      message.error(res.message);
    }
  };

  const handleGetItemMasterDetails = async (itemCode) => {
    if (itemCode) {
      const res = await EcommerceItemApi.getItemMasterInfo(itemCode);
      if (res.status) {
        setValue('itemDefaultPrice', res.data?.infor?.defaultPrice);
        setDefaultItemPrice(res.data?.infor?.defaultPrice);
      } else {
        setValue('itemDefaultPrice', "Something went wrong when get item's price");
        setDefaultItemPrice(0);
      }
    }
  };
  useEffect(() => {
    console.log("getValues('itemCode')", getValues('itemCode'));
    if (getValues('itemCode')) {
      const itemCode = JSON.parse(getValues('itemCode'))?.itemCode;
      handleGetItemMasterDetails(itemCode);
    } else {
      setValue('itemDefaultPrice', 0);
      setDefaultItemPrice(0);
    }
  }, [getValues('itemCode')]);

  useEffect(() => {
    handleGetCategoryOptions();
  }, []);

  useEffect(() => {
    if (searchItemRef.current) {
      clearTimeout(searchItemRef.current);
    }
    searchItemRef.current = setTimeout(() => {
      handleGetItemOptions();
    }, 1000);
    return () => {
      clearTimeout(searchItemRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemSearchKeyword]);

  const items = () => {
    let res = [
      {
        key: '1',
        label: 'Items',
        children: (
          <EcommerceItemFormDetails
            initialValue={initialValue}
            onSubmitHandler={onSubmitHandler}
            formState={formState}
            setValue={setValue}
            loading={loading}
            fields={fields}
            control={control}
          />
        ),
      },
    ];
    if (itemID)
      res.push({
        key: '2',
        label: 'Relate items',
        children: <EcommerceRelateItems itemCode={itemID} />,
      });
    return res;
  };
  return (
    <div id="ecommerce" className=" mt-15 mini_app_container">
      {initialValue && (
        <div className="section-block mt-15 mb-15">
          <a href={`https://fresh.gs25vietnam.com.vn/san-pham/${initialValue.itemSlug}`} target="_blank">
            Link: {`https://fresh.gs25vietnam.com.vn/san-pham/${initialValue.itemSlug}`}
          </a>
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
      <div className="section-block mb-15 all">
        {initialValue ? (
          <Tabs defaultActiveKey="1" items={items()} />
        ) : (
          <EcommerceItemFormDetails
            initialValue={initialValue}
            onSubmitHandler={onSubmitHandler}
            formState={formState}
            setValue={setValue}
            loading={loading}
            fields={fields}
            control={control}
          />
        )}
      </div>
    </div>
  );
};

export default EcommerceItemDetails;
