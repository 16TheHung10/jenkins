import { Col, Form, InputNumber, Modal, Row, Typography, message } from 'antd';
import { EcommerceCategoryApi, StoreApi } from 'api';
import MainTable from 'components/common/Table/UI/MainTable';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { TableStoreTargetKPIData } from 'data/render/table';
import { ObjectHelper, UrlHelper } from 'helpers';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import StoreTargetKPINav from '../nav';
import { scrollToTop } from 'components/mainContent/MainContent';
import SelectStoreFormField from 'components/common/selects/SelectStoreFormField';
import { useCommonOptions, useCreateTargetKPIMutation, useUpdateeTargetKPIMutation } from 'hooks';
import DisableRangeDate2 from 'components/common/datePicker/rangePicker/DisableRangeDate2';
import moment from 'moment';
import CONSTANT from 'constant';
import AppMessage from 'message/reponse.message';

const initialCreateTargetFormValues = {
  fromDate: '',
  storeCode: '',
  amount: null,
};

const PromotionMixABMatchCPageSearch = () => {
  const [searchParams, setSearchParams] = useState({});
  const [selectedStore, setSelectedStore] = useState(null);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const options = useCommonOptions();
  const [searchForm] = Form.useForm();
  const [createForm] = Form.useForm();

  const handleSetSearchParamsUrl = (params) => {
    console.log({ params });
    UrlHelper.setSearchParamsFromObject({ ...params });
  };

  const handleFetchStoreKPI = async (value) => {
    const params = { ...value };
    const res = await StoreApi.getStoreTargetKPI(params);
    if (res.status) {
      return res.data.targets;
    }
    AppMessage.error(res.message);
    return null;
  };

  const storeKPIQuery = useQuery({
    queryKey: [
      ...CONSTANT.QUERY.STORE.KPI,
      {
        ...(ObjectHelper.removeAllNullValue(searchParams) || {}),
      },
    ],
    queryFn: () => handleFetchStoreKPI(searchParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
  const createTargetMutation = useCreateTargetKPIMutation();
  const updateTargetMutation = useUpdateeTargetKPIMutation();

  useEffect(() => {
    scrollToTop();
    handleSetSearchParamsUrl({
      ...searchParams,
    });
  }, [searchParams]);

  useEffect(() => {
    let currentParams = UrlHelper.getSearchParamsObject();
    setSearchParams({ ...currentParams });
    currentParams = {
      ...currentParams,
      fromDate: currentParams.fromDate
        ? [moment(currentParams.fromDate, 'YYYY-MM-DD'), moment(currentParams.fromDate, 'YYYY-MM-DD')]
        : null,
    };
    searchForm.setFieldsValue({ ...currentParams });
  }, []);

  const toggleModalCreate = () => {
    if (isModalCreateOpen) setSelectedStore(null);
    setIsModalCreateOpen((prev) => {
      return !prev;
    });
  };

  const handleCreateTarget = async (value) => {
    value = {
      ...value,
      fromDate: value.fromDate[0]
        ? moment(value.fromDate[0]).startOf('month').format(CONSTANT.FORMAT_DATE_PAYLOAD)
        : '',
    };
    selectedStore
      ? await updateTargetMutation.mutate({ value, targetID: selectedStore.targetID })
      : await createTargetMutation.mutate({ value });
    createForm.resetFields();
    toggleModalCreate();
  };

  const handleSetSelectedStore = (value) => {
    setSelectedStore(value);
    toggleModalCreate();
  };

  useEffect(() => {
    createForm.setFieldsValue(
      selectedStore
        ? {
            amount: selectedStore.amount,
            fromDate: [moment(selectedStore.fromDate), moment(selectedStore.fromDate)],
            storeCode: selectedStore.storeCode,
          }
        : initialCreateTargetFormValues
    );
  }, [selectedStore]);

  return (
    <StoreTargetKPINav>
      <div className="mini_app_container">
        <div className="section-block mt-15">
          <Form
            form={searchForm}
            layout="vertical"
            onFinish={(value) => {
              const fromDate = value.fromDate?.[0]
                ? moment(value.fromDate[0]).startOf('month').format(CONSTANT.FORMAT_DATE_PAYLOAD)
                : '';
              setSearchParams((prev) => ({ ...prev, ...value, fromDate }));
            }}
          >
            <Row gutter={[16, 0]}>
              <Col span={8}>
                <Form.Item name="storeCode">
                  <SelectStoreFormField options={options.storeOptions()} allowSelectStoreType />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="fromDate">
                  <DisableRangeDate2 allowSelectPast modeSelect={['month']} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="amount" label="Amount ">
                  <InputNumber placeholder="Enter min target" className="w-full" min={0} step={10} max={9999999999} />
                </Form.Item>
              </Col>
            </Row>
            <div className="flex items-center gap-10">
              <BaseButton htmlType="submit" iconName="search">
                Search
              </BaseButton>
              <BaseButton htmlType="button" color="green" iconName="plus" onClick={toggleModalCreate}>
                Create
              </BaseButton>
            </div>
          </Form>
        </div>
        <div className="table section-block mt-15 w-full">
          <div className=" w-full table-inner">
            <MainTable
              loading={storeKPIQuery.isLoading}
              className="w-full"
              columns={TableStoreTargetKPIData.columns({ onSetSelectedStore: handleSetSelectedStore })}
              dataSource={storeKPIQuery?.data}
            />
          </div>
        </div>
      </div>
      <Modal open={isModalCreateOpen} onCancel={toggleModalCreate} footer={false}>
        <Typography.Title>{selectedStore ? 'Update' : 'Create new'} target KPI</Typography.Title>
        <Form form={createForm} layout="vertical" onFinish={handleCreateTarget}>
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <Form.Item
                name="storeCode"
                rules={[{ type: 'string', required: true, message: 'Apply store is required' }]}
              >
                <SelectStoreFormField
                  disabled={Boolean(selectedStore)}
                  options={options.storeOptions()}
                  allowSelectStoreType
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="fromDate"
                rules={[{ type: 'array', required: true, message: 'Apply month is required' }]}
              >
                <DisableRangeDate2 allowSelectPast={false} modeSelect={['month']} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="amount"
                label="Amount"
                rules={[{ type: 'number', required: true, message: 'Amount is required' }]}
              >
                <InputNumber placeholder="Enter target" className="w-full" min={0} step={10} max={9999999999} />
              </Form.Item>
            </Col>
          </Row>
          <div className="flex items-center gap-10">
            <BaseButton
              loading={createTargetMutation.isLoading || updateTargetMutation.isLoading}
              htmlType="submit"
              iconName="search"
            >
              Submit
            </BaseButton>
          </div>
        </Form>
      </Modal>
    </StoreTargetKPINav>
  );
};

export default PromotionMixABMatchCPageSearch;
