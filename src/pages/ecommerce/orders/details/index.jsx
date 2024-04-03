import { Col, Row } from 'antd';
import MainTable from 'components/common/Table/UI/MainTable';
import FieldList from 'components/common/fieldList/FieldList';
import { FieldsEcommerceOrderData } from 'data/render/form';
import { useFormFields } from 'hooks';
import React, { useEffect, useMemo } from 'react';
import StringHelper from '../../../../helpers/StringHelper';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import moment from 'moment';
import SubmitBottomButton from 'components/common/buttons/submitBottomButton/SubmitBottomButton';

const EcommerceOrdersDetails = ({ initialValue, onSendMailRequestPayment, onSubmit }) => {
  const handleSubmit = (value) => {
    onSubmit({ value });
  };
  const storeOptions = useMemo(() => {
    const cachedData = localStorage.getItem('cachedData') ? JSON.parse(localStorage.getItem('cachedData')) : null;
    if (!cachedData?.data?.stores) return [];
    return Object.values(cachedData?.data?.stores)?.map((item) => {
      return {
        value: item.storeCode,
        label: `${item.storeCode} - ${item.storeName}`,
      };
    });
  }, [localStorage.getItem('cachedData')]);
  const {
    formInputsWithSpan: fields,
    onSubmitHandler,
    reset,
  } = useFormFields({
    fieldInputs: FieldsEcommerceOrderData.fieldsInputsDetails({ isEdit: Boolean(initialValue), storeOptions }),
    onSubmit: handleSubmit,
  });
  useEffect(() => {
    if (initialValue) {
      reset({ ...initialValue.order });
    }
  }, [initialValue]);

  return (
    <div id="fc_master" className=" mt-15">
      {onSendMailRequestPayment && (
        <BaseButton iconName="send" onClick={onSendMailRequestPayment}>
          Send mail request payment
        </BaseButton>
      )}
      {initialValue && (
        <div className="section-block mt-15 mb-15">
          <div className="flex gap-10">
            <div className="flex flex-col">
              <p className="m-0">Created Date {moment(initialValue.order?.createdDate).format('DD/MM/YYYY HH:mm')}</p>
            </div>

            <div className="flex flex-col">
              <p className="m-0">
                Updated by: <span className="color-primary">{initialValue.order?.updatedBy}</span>{' '}
                <span className="hint">At: {moment(initialValue.order?.updatedDate).format('DD/MM/YYYY HH:mm')}</span>
              </p>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={onSubmitHandler}>
        <div className="section-block mt-15">
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <Row gutter={[16, 0]}>
                <FieldList fields={fields?.filter((el) => el.group !== 2)} />
              </Row>
            </Col>
          </Row>
        </div>
        <div className="section-block mt-15">
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <Row gutter={[16, 0]}>
                <FieldList fields={fields?.filter((el) => el.group === 2)} />
              </Row>
            </Col>
          </Row>
        </div>
        {initialValue && (
          <div className="section-block mt-15 mb-15">
            <MainTable
              className="w-full mt-15"
              columns={[
                {
                  title: 'Item',
                  dataIndex: 'productSKU',
                  key: 'productSKU',
                  render: (productSKU, record) =>
                    `${productSKU}${record.productTitle ? '- ' + record.productTitle : ''}`,
                },
                {
                  title: 'Selling price',
                  dataIndex: 'price',
                  key: 'price',
                  render: (price, record) => (price ? StringHelper.formatPrice(price) : '-'),
                },
                { title: 'Quantity', dataIndex: 'qty', key: 'qty', render: (qty, record) => qty || '-' },
              ]}
              dataSource={initialValue?.items}
            />
          </div>
        )}
        {initialValue && <SubmitBottomButton title={'Update'} />}
      </form>
    </div>
  );
};

export default EcommerceOrdersDetails;
