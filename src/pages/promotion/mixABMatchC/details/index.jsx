import { MinusCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Switch,
  message,
} from 'antd';
import { ItemsMasterApi } from 'api';
import Block from 'components/common/block/Block';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import SubmitBottomButton from 'components/common/buttons/submitBottomButton/SubmitBottomButton';
import SectionWithTitle from 'components/common/section/SectionWithTitle';
import SelectItemMaster from 'components/common/selects/SelectItemMaster';
import SelectStoreFormField from 'components/common/selects/SelectStoreFormField';
import CONSTANT from 'constant';
import { ArrayHelper, StringHelper } from 'helpers';
import { useCommonOptions, useImportExcel } from 'hooks';
import Icons from 'images/icons';
import AppMessage from 'message/reponse.message';
import PromotionModel from 'models/PromotionModel';
import UploadMediaModel from 'models/UploadMediaModel';
import moment from 'moment';
import PromotionMixABMatchCDetailsHeader from 'pages/promotion/mixABMatchC/details/header';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
const initialFormValue = {
  promotionCode: '',
  promotionName: '',
  date: null,
  stores: [],
  docCode: '',
  docLink: '',
  promotionType: null,
  itemGets: '',
  itemsA: [],
  itemsB: [],
  image: [],
  discount: null,
};
const PromotionMixABMatchCDetails = ({ initialData, onSubmit, isRunning, Title }) => {
  const isUpdate = Boolean(initialData?.promotionCode);
  const [initialOptionsItem, setInitialOptionsItem] = useState(null);
  const [isPopupNoteOpen, setIsPopupNoteOpen] = useState(false);
  const [isPromotionActive, setIsPromotionActive] = useState(false);
  const [selectedItemC, setSelectedItemC] = useState(null);
  const { ComponentImport: ImportItem1, dataImported: dataA, setDataImported: setDataA } = useImportExcel();
  const { ComponentImport: ImportItem2, dataImported: dataB, setDataImported: setDataB } = useImportExcel();
  const options = useCommonOptions();
  const [form] = Form.useForm();
  const promotionTypeWarcher = Form.useWatch('promotionType', form);
  const itemsAWarcher = Form.useWatch('itemsA', form);
  const itemsBWarcher = Form.useWatch('itemsB', form);
  const params = useParams();

  const dataAObject = useMemo(() => {
    return itemsAWarcher?.length > 0
      ? ArrayHelper.convertArrayToObject(
          itemsAWarcher.filter((el) => el),
          'itemCode'
        )
      : null;
  }, [itemsAWarcher]);

  const dataBObject = useMemo(() => {
    return itemsBWarcher?.length > 0
      ? ArrayHelper.convertArrayToObject(
          itemsBWarcher.filter((el) => el),
          'itemCode'
        )
      : null;
  }, [itemsBWarcher]);

  const handleGetItemImportDetails = async (items) => {
    if (items.length > 0) {
      const res = await ItemsMasterApi.getItemsInfo({ barcodes: items?.map((item) => item.itemCode).join(',') });
      if (res.status) {
        return res.data.items?.map((item) => ({ ...item, itemCode: item.barcode }));
      } else {
        AppMessage.error(res.message);
      }
    }
    return [];
  };

  const handleUploadImage = async (promotionCode, tableData) => {
    const model = new UploadMediaModel();
    await Promise.all(
      tableData?.map(async (item, index) => {
        if (StringHelper.isBase64(item.imageKey)) {
          const res = await model.uploadPromotionImage({
            promotionCode,
            itemCode: item.itemCode,
            image: StringHelper.base64Smooth(item.imageKey),
          });
          if (!res.status) {
            throw new Error(res.message);
          } else {
            return res;
          }
        }
        return null;
      })
    );
  };

  const handleMergeDataImportWithDetails = async (items) => {
    if (items) {
      const itemsDetail = await handleGetItemImportDetails(items);
      const itemsDetailObject = ArrayHelper.convertArrayToObject(itemsDetail || [], 'itemCode');
      let dataObject = ArrayHelper.convertArrayToObject(items || [], 'itemCode');
      for (let key of Object.keys(dataObject || {})) {
        let item = itemsDetailObject[key];
        if (item) {
          dataObject[key] = {
            option: { value: item?.itemCode, label: `${item?.itemCode} - ${item?.itemName}` },
            itemCode: item?.itemCode,
          };
        } else {
          delete dataObject[key];
          message.info(`Invalid item code ${key}`);
        }
      }
      setInitialOptionsItem((prev) => ({ ...prev, ...(dataObject || {}) }));
    }
  };

  const handleGetDuplicateItemInList = (list) => {
    const map = new Map();
    const duplicateItems = [];
    for (let item of list) {
      const currentValue = map.get(item.itemCode);
      if (currentValue) {
        const nextValue = { ...currentValue, count: currentValue.count + 1 };
        map.set(item.itemCode, nextValue);
      } else {
        map.set(item.itemCode, { itemCode: item.itemCode, count: 1 });
      }
    }
    duplicateItems.push(...Object.values(Object.fromEntries(new Map([...map].filter(([k, v]) => v.count > 1)))));
    return duplicateItems;
  };

  const handleImportPromotion = async (value) => {
    const duplicateItems = handleGetDuplicateItemInList([...(value.itemsA || []), ...(value.itemsB || [])]);
    if (duplicateItems?.length > 0) {
      message.error(
        <div className="">
          <h4>Duplicate item in MIX list</h4>
          <div className="text-left" style={{ maxHeight: '500px', scroll: 'auto' }}>
            {duplicateItems?.map((item) => (
              <p key={item.itemCode}>{item.itemCode}</p>
            ))}
          </div>
        </div>
      );
      return;
    }

    const { date, discount, itemsA, itemsB, ...restValue } = value;
    const startDate = value.date?.[0] ? moment(value.date[0]).format(CONSTANT.FORMAT_DATE_PAYLOAD) : null;
    const endDate = value.date?.[1] ? moment(value.date[1]).format(CONSTANT.FORMAT_DATE_PAYLOAD) : null;
    const itemBuys = [
      ...itemsA.map((item) => ({ itemCode: item.itemCode, group: 1 })),
      ...itemsB.map((item) => ({ itemCode: item.itemCode, group: 2 })),
    ];
    const itemGets = [
      {
        itemCode: value.itemGets,
        discount: value.promotionType === 2 ? 0 : discount,
      },
    ];
    const payload = {
      ...restValue,
      endDate,
      startDate,
      itemBuys,
      itemGets,
      stores: value.stores.map((item) => ({ storeCode: item })),
    };
    console.log({ payload, value });
    onSubmit(payload, () => {
      form.setFieldsValue(initialFormValue);
    });
  };

  const handleGetSelectedItemCDetail = (detailsData) => {
    setSelectedItemC(detailsData);
  };

  const handleResetFormValue = async (data) => {
    form.setFieldsValue(data);
  };

  const handleUpdateStatus = (note) => {
    let model = new PromotionModel();
    let type = isPromotionActive === 1 ? '/inactive' : '/active';
    let page = 'combo' + type;
    model.putPromotion(page, params.promotionCode, { note }).then((res) => {
      if (res.status && res.data) {
        setIsPromotionActive((prev) => (prev === 1 ? 0 : 1));
        message.success('Update status successfully!', 3);
      } else {
        message.error(res.message);
      }
    });
  };

  useEffect(() => {
    if (dataA) {
      form.setFieldValue('itemsA', dataA);
      handleMergeDataImportWithDetails(dataA);
    }
  }, [dataA]);

  useEffect(() => {
    if (initialData) {
      handleResetFormValue(initialData);
      setIsPromotionActive(initialData.active);
    }
  }, [initialData?.promotionCode]);

  useEffect(() => {
    if (initialData)
      handleMergeDataImportWithDetails([
        ...initialData?.itemsA,
        ...initialData?.itemsB,
        ...[{ itemCode: initialData.itemGets }],
      ]);
  }, [initialData]);

  useEffect(() => {
    if (promotionTypeWarcher === 2) {
      form.setFieldValue('discount', 0);
    }
  }, [promotionTypeWarcher]);

  useEffect(() => {
    if (dataAObject?.[selectedItemC?.value] || dataBObject?.[selectedItemC?.value]) {
      form.setFields([
        {
          name: 'itemGets',
          errors: ['Match item can not be in Mix items'],
        },
      ]);
      form.setFieldValue('itemGets', null);
    }
  }, [selectedItemC]);
  return (
    <>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleImportPromotion}
        className="mb-15"
        disabled={Boolean(isRunning)}
      >
        <PromotionMixABMatchCDetailsHeader
          promotionCode={initialData?.promotionCode}
          isUpdate={isUpdate}
          data={initialData}
          Title={() => <Title />}
          StatusComp={() => (
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Active"
              checked={isPromotionActive === 1}
              onClick={() => setIsPopupNoteOpen(true)}
            />
          )}
        />

        <Block id="info">
          <Row className="mt-15" gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item
                label="Promotion name"
                name="promotionName"
                rules={[{ type: 'string', required: true, message: 'Promotion name is required' }]}
              >
                <Input placeholder="Enter promotion name" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Apply date"
                name="date"
                rules={[{ type: 'array', required: true, message: 'Promotion apply date is required' }]}
              >
                <DatePicker.RangePicker
                  format={CONSTANT.FORMAT_DATE_IN_USE}
                  disabledDate={(current) => current && current < moment().add(1, 'day').startOf('day')}
                  className="w-full"
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="stores" rules={[{ type: 'array', required: true, message: 'Apply store is required' }]}>
                <SelectStoreFormField
                  options={options.storeOptions()}
                  allowSelectStoreType
                  mode="multiple"
                  placeholder="Select apply stores"
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Dept. of I&T code:"
                name="docCode"
                rules={[{ type: 'string', required: true, message: 'Dept. of I&T code: is required' }]}
              >
                <Input placeholder="Enter dept. of I&T code:" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Dept. of I&T link"
                name="docLink"
                rules={[{ type: 'string', required: true, message: 'Dept. of I&T link is required' }]}
              >
                <Input placeholder="Enter dept. of I&T link" />
              </Form.Item>
            </Col>
            {/* <Col span={24}>
            <Form.Item
              className="w-full"
              name="image"
              label="Image"
              rules={[
                { type: 'array', length: 1, message: 'Video is required' },
                { type: 'array', required: true, message: 'Video is required' },
              ]}
            >
              <UploadFileComponent
                uploadRoute={null}
                mediaSize={0.2 * 1024 * 1024}
                multiple={false}
                maxCount={1}
                ratio="16/9"
                type="image"
                accept=".jpg,.png"
                imageContainerHeightProps={150}
                Description={
                  <div className="upload_button">
                    <p className="ant-upload-drag-icon m-0 flex flex-col items-center">
                      <Icons.Camera style={{ color: 'var(--primary-color)', fontSize: '40px' }} />
                      <span style={{ fontSize: '14px' }}>Upload Image</span>
                      <span className="hint">Limit 1 image, only upload image size less than 200KB </span>
                    </p>
                  </div>
                }
              />
            </Form.Item>
          </Col> */}
          </Row>
        </Block>

        <Row gutter={[16, 16]} className="mb-15">
          <Col span={16}>
            <SectionWithTitle title="MIX" className="section-block mt-15">
              <Row gutter={[15, 15]}>
                <Col span={11}>
                  <Block>
                    {isRunning ? null : <ImportItem1 linkDownload="123" />}
                    <Form.List name="itemsA" className="mt-15">
                      {(fields, { add, remove }, { errors }) => (
                        <div className="mt-15">
                          {fields.map(({ key, name, ...restField }) => (
                            <div
                              className="flex gap-10 items-center mt-15"
                              key={key}
                              style={{
                                display: 'flex',
                                marginBottom: 8,
                              }}
                              align="baseline"
                            >
                              <Form.Item
                                {...restField}
                                name={[name, 'itemCode']}
                                rules={[
                                  {
                                    required: true,
                                    whitespace: true,
                                    message: 'Please input item A or delete this field.',
                                  },
                                ]}
                                noStyle
                              >
                                <SelectItemMaster
                                  initialOptions={
                                    Object.keys(initialOptionsItem || {})?.length > 0
                                      ? Object.values(initialOptionsItem)?.map((item) => item.option)
                                      : null
                                  }
                                  style={{ width: '95%' }}
                                />
                              </Form.Item>
                              <Popconfirm title="Are you sure delete this item?" onConfirm={() => remove(name)}>
                                <MinusCircleOutlined disabled={fields.length <= 1} />
                              </Popconfirm>
                            </div>
                          ))}
                          {fields?.length >= 20 ? null : (
                            <Form.Item>
                              <Button type="primary" onClick={() => add()} className="w-full" icon={<Icons.Plus />}>
                                Add item A
                              </Button>

                              <Form.ErrorList errors={errors} />
                            </Form.Item>
                          )}
                        </div>
                      )}
                    </Form.List>
                  </Block>
                </Col>
                <Col flex="auto" style={{ alignSelf: 'center', textAlign: 'center' }}>
                  <Icons.Merge style={{ fontSize: 25, color: 'var(--primary-color)' }} />
                </Col>
                <Col span={11}>
                  <Block>
                    {isRunning ? null : <ImportItem2 linkDownload="123" />}

                    <Form.List name="itemsB">
                      {(fields, { add, remove }, { errors }) => (
                        <div className="mt-15">
                          {fields.map(({ key, name, ...restField }) => (
                            <div
                              className="flex gap-10 items-center "
                              key={key}
                              style={{
                                display: 'flex',
                                marginBottom: 8,
                              }}
                              align="baseline"
                            >
                              <Form.Item
                                {...restField}
                                name={[name, 'itemCode']}
                                rules={[
                                  {
                                    required: true,
                                    whitespace: true,
                                    message: 'Please input item A or delete this field.',
                                  },
                                ]}
                                noStyle
                              >
                                <SelectItemMaster
                                  style={{ width: '95%' }}
                                  initialOptions={
                                    Object.keys(initialOptionsItem || {})?.length > 0
                                      ? Object.values(initialOptionsItem)?.map((item) => item.option)
                                      : null
                                  }
                                />
                              </Form.Item>
                              <Popconfirm title="Are you sure delete this item?" onConfirm={() => remove(name)}>
                                <MinusCircleOutlined disabled={fields.length <= 1} />
                              </Popconfirm>
                            </div>
                          ))}
                          {fields?.length >= 20 ? null : (
                            <Form.Item>
                              <Button type="primary" onClick={() => add()} className="w-full" icon={<Icons.Plus />}>
                                Add item B
                              </Button>

                              <Form.ErrorList errors={errors} />
                            </Form.Item>
                          )}
                        </div>
                      )}
                    </Form.List>
                  </Block>
                </Col>
              </Row>
            </SectionWithTitle>
          </Col>

          <Col span={8}>
            <SectionWithTitle title="MATCH" className="section-block mt-15">
              <Col span={24} style={{ alignSelf: 'center' }}>
                <Form.Item
                  label="Promotion type"
                  name="promotionType"
                  rules={[{ required: true, message: 'Promotion type is required' }]}
                >
                  <Select
                    placeholder="Enter promotion type"
                    options={[
                      { value: 1, label: 'Discount' },
                      { value: 2, label: 'Gift' },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  label="Item C"
                  name="itemGets"
                  rules={[{ type: 'string', required: true, message: 'Item C is required' }]}
                >
                  <SelectItemMaster
                    key={1}
                    onGetSelectedItemDetail={handleGetSelectedItemCDetail}
                    initialOptions={
                      Object.keys(initialOptionsItem || {})?.length > 0
                        ? Object.values(initialOptionsItem)?.map((item) => item.option)
                        : null
                    }
                  />
                </Form.Item>
                {promotionTypeWarcher && promotionTypeWarcher !== 2 ? (
                  <Form.Item
                    label="Discount"
                    name="discount"
                    rules={[{ type: 'number', required: true, message: 'Item C discount required' }]}
                  >
                    <InputNumber
                      disabled={promotionTypeWarcher === 2}
                      min={0}
                      max={10000000}
                      step={1000}
                      className="w-full"
                      placeholder="Enter discount value"
                    />
                  </Form.Item>
                ) : null}
              </Col>
            </SectionWithTitle>
          </Col>
        </Row>

        {isRunning ? null : <SubmitBottomButton title="Submit" />}
      </Form>
      <Modal
        footer={false}
        open={isPopupNoteOpen}
        onCancel={() => {
          setIsPopupNoteOpen(false);
        }}
      >
        <Form
          onFinish={(value) => {
            handleUpdateStatus(value.note);
            setIsPopupNoteOpen(false);
          }}
          layout="vertical"
        >
          <Form.Item name="note" label="Reason" rules={[{ type: 'string', required: true, message: 'Missing reason' }]}>
            <Input.TextArea rows={10} placeholder="Input reason" maxLength={1000} showCount />
          </Form.Item>
          <BaseButton type="primary" htmlType="submit">
            Inactive promotion
          </BaseButton>
        </Form>
      </Modal>
    </>
  );
};

export default PromotionMixABMatchCDetails;
