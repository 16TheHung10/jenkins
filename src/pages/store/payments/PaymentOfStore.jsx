import { Col, Drawer, Form, Modal, Row, Select, message } from 'antd';
import { StoreApi } from 'api';
import PaymentOfStoreTable from 'components/mainContent/store/payments/table/PaymentOfStoreTable';
import { useAppContext } from 'contexts';
import { ArrayHelper } from 'helpers';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { Menu, Switch } from 'antd';
const PaymentOfStore = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingChangePaymentStatus, setIsLoadingChangePaymentStatus] = useState(false);
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
  const items = [
    getItem('Navigation One', 'sub1', <MailOutlined />, [getItem('Option 1', '1'), getItem('Option 2', '2'), getItem('Option 3', '3'), getItem('Option 4', '4')]),
    getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
      getItem('Option 5', '5'),
      getItem('Option 6', '6'),
      getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
    ]),
    getItem('Navigation Three', 'sub4', <SettingOutlined />, [getItem('Option 9', '9'), getItem('Option 10', '10'), getItem('Option 11', '11'), getItem('Option 12', '12')]),
  ];

  const { state: AppState, onGetPaymentMethods } = useAppContext();

  const params = useParams();
  const [createdPayments, setCreatedPayment] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  console.log({ isLoading });

  const handleGetPayments = async () => {
    setIsLoading((prev) => true);
    const res = await StoreApi.getPayments(params.storeCode);
    if (res.status) {
      const patyments = res.data?.payments;
      setCreatedPayment(patyments);
    } else {
      setCreatedPayment(null);
      message.error(res.message);
    }
    setIsLoading((prev) => {
      console.log({ prev });
      return false;
    });
  };

  const handleChangeAllowPaymentMethod = async (record, index) => {
    setIsLoadingChangePaymentStatus((prev) => true);
    const res = await StoreApi.updatePaymentMethodOfStore(params.storeCode, { storeCode: params.storeCode, paymentCode: record.paymentCode, active: !record.active });
    if (res.status) {
      const cloneAllowedPayments = ArrayHelper.deepClone(createdPayments);
      cloneAllowedPayments.splice(index, 1, {
        ...record,
        active: !record.active,
      });
      setCreatedPayment(cloneAllowedPayments);
      message.success('Successfully');
    } else {
      message.error(res.message);
    }
    setIsLoadingChangePaymentStatus((prev) => false);
  };

  useEffect(() => {
    handleGetPayments();
  }, []);

  useEffect(() => {
    onGetPaymentMethods();
  }, []);

  const tableData = useMemo(() => {
    return createdPayments?.map((item) => {
      return item;
    });
  }, [createdPayments]);
  const handeCreateMethodCode = async (data) => {
    const payload = { ...data, storeCode: params.storeCode, active: true, paymentName: AppState.paymentmethods[data.paymentCode].methodName };
    const res = await StoreApi.createPaymentMethodOfStore(params.storeCode, payload);
    if (res.status) {
      message.success('Create payment method successfully');
      setCreatedPayment((prev) => [...prev, payload]);
    } else {
      message.error(res.message);
    }
  };
  return (
    <Row>
      <Col span={12}>
        <BaseButton iconName="plus" htmlType="button" onClick={() => setIsOpenDrawer(true)}>
          Add new
        </BaseButton>
        <PaymentOfStoreTable data={tableData} loading={isLoading} onChangeAllowPromotion={handleChangeAllowPaymentMethod} isLoading={isLoadingChangePaymentStatus} />
      </Col>
      <Modal open={isOpenDrawer} onCancel={() => setIsOpenDrawer(false)} footer={false}>
        <Form onFinish={handeCreateMethodCode}>
          <Form.Item name="paymentCode" label={<span className="required">Payment</span>}>
            <Select
              options={Object.values(AppState.paymentmethods || {})
                ?.filter((el) => !createdPayments?.find((p) => p.paymentCode === el.methodCode))
                ?.map((item) => ({ value: item.methodCode, label: `${item.methodCode} - ${item.methodName}` }))}
            />
          </Form.Item>
          <div className="flex justify-content-end">
            <BaseButton iconName="send" htmlType="submit">
              Add new
            </BaseButton>
          </div>
        </Form>
      </Modal>
    </Row>
  );
};

export default PaymentOfStore;
