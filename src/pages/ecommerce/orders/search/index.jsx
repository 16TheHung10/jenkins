import { Col, Row, message } from 'antd';
import { EcommerceOrderApi } from 'api';
import MainTable from 'components/common/Table/UI/MainTable';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import FieldList from 'components/common/fieldList/FieldList';
import { scrollToTop } from 'components/mainContent/MainContent';
import { FieldsEcommerceOrderData } from 'data/render/form';
import { TableEcommerceOrderData } from 'data/render/table';
import { ObjectHelper, UrlHelper } from 'helpers';
import { useFormFields, usePagination } from 'hooks';
import CommonModel from 'models/CommonModel';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import ComponentNav from '../nav';

const EcommerceOrderSearch = () => {
  const history = useHistory();
  const searchInitialValue = {
    date: [moment(), moment()],
  };
  const [totalOrdersData, setTotalOrdersData] = useState(0);
  const [paymentOptions, setPaymentOptions] = useState([]);

  const handleGetPaymentMethods = async () => {
    const model = new CommonModel();
    const res = await model.getData('paymentmethod');
    if (res.status) {
      const paymentOptionsRaw = Object.values(res.data.paymentmethods)?.map((item) => {
        return {
          value: Number(item.methodCode),
          label: item.methodName,
        };
      });
      setPaymentOptions(paymentOptionsRaw);
    } else {
      message.error('Cannot get payment method');
    }
  };

  useEffect(() => {
    handleGetPaymentMethods();
  }, []);

  const { Pagination, pageSize, pageNumber, setValues: onResetPagination } = usePagination({ total: totalOrdersData });
  const {
    formInputsWithSpan: fields,
    onSubmitHandler,
    reset,
    getValues,
  } = useFormFields({
    fieldInputs: FieldsEcommerceOrderData.fieldsSearch({ paymentOptions }),
    onSubmit: () => {
      onResetPagination({ pageSize, pageNumber: 1 });
    },
    defaultValue: searchInitialValue,
  });

  const handleSetSearchParamsUrl = (params) => {
    const currentParams = UrlHelper.getSearchParamsObject();
    const newParams = { ...currentParams, ...params };
    UrlHelper.setSearchParamsFromObject(newParams);
  };

  const handleFetchOrders = async (value) => {
    const orderStartDate = value.date?.[0] ? moment(value.date?.[0]).format('YYYY-MM-DD') : null;
    const orderEndDate = value.date?.[1] ? moment(value.date?.[1]).format('YYYY-MM-DD') : null;
    const { date, ...rest } = value;
    const params = { ...rest, pageSize, pageNumber, orderStartDate, orderEndDate };
    const res = await EcommerceOrderApi.getOrders(params);
    if (res.status) {
      return res.data;
    }
    message.error(res.message);
    return null;
  };

  useEffect(() => {
    const currentParams = UrlHelper.getSearchParamsObject();
    const { pageNumber, pageSize, ...restSearch } = currentParams;
    const dateSplit = currentParams.date?.split(',') || [];
    reset({
      ...restSearch,
      date:
        dateSplit?.length > 0 ? [moment(new Date(dateSplit[0])), moment(new Date(dateSplit[1]))] : [moment(), moment()],
    });
    if (!Number.isNaN(+currentParams?.pageSize) || !Number.isNaN(+currentParams?.pageNumber)) {
      onResetPagination({ pageSize: +currentParams.pageSize, pageNumber: +currentParams.pageNumber });
    }
  }, []);

  const ecommerceOrderQuery = useQuery({
    queryKey: [
      'ecommerce/orders',
      {
        ...(ObjectHelper.removeAllNullValue(getValues()) || {}),
        pageSize: pageSize?.toString() || 30,
        pageNumber: pageNumber?.toString() || 1,
      },
    ],
    queryFn: () => handleFetchOrders(getValues()),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: Boolean(pageNumber) && Boolean(pageSize),
  });

  useEffect(() => {
    setTotalOrdersData(ecommerceOrderQuery.data?.total);
  }, [ecommerceOrderQuery.data?.total]);

  useEffect(() => {
    scrollToTop();
    handleSetSearchParamsUrl({
      ...getValues(),
      pageSize: pageSize?.toString() || 30,
      pageNumber: pageNumber?.toString() || 1,
    });
  }, [getValues('orderCode'), getValues('paymentType'), getValues('date'), pageSize, pageNumber]);
  console.log(getValues('orderCode'), getValues('paymentType'), getValues('date'));
  return (
    <ComponentNav>
      <div className="mini_app_container">
        <div className="section-block mt-15">
          <form onSubmit={onSubmitHandler}>
            <Row gutter={[16, 0]}>
              <Col span={24}>
                <Row gutter={[16, 0]}>
                  <FieldList fields={fields} />
                </Row>
              </Col>
            </Row>
            <div className="flex items-center gap-10">
              <BaseButton htmlType="submit" iconName="search">
                Search
              </BaseButton>
            </div>
          </form>
        </div>
        <div className="table section-block mt-15">
          <div className="table-inner">
            <MainTable
              loading={ecommerceOrderQuery.isLoading}
              className="fixed_header"
              style={{ maxHeight: 'calc(100vh - 330px)', overflow: 'auto' }}
              columns={TableEcommerceOrderData.columns()}
              dataSource={ecommerceOrderQuery?.data?.orderList}
            />
            <div className="w-full text-center paging">
              <Pagination showSizeChanger />
            </div>
          </div>
        </div>
      </div>
    </ComponentNav>
  );
};

export default EcommerceOrderSearch;
