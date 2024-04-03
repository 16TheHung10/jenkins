import { Drawer, Form, Input, Select, Spin, Switch, Tag, message } from 'antd';
import Image from 'components/common/Image/Image';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import SuspenLoading from 'components/common/loading/SuspenLoading';
import AppMessage from 'message/reponse.message';
import CommonModel from 'models/CommonModel';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import * as yup from 'yup';
import { PaymentMethodApi } from '../../api';
import FileHelper from '../../helpers/FileHelper';
import StringHelper from '../../helpers/StringHelper';
import PaymentMethodNav from './nav';
import PaymentGroupForm from './paymentGroup/form/PaymentGroupForm';
import './style.scss';

const PaymentMethods = () => {
  const queryClient = useQueryClient();

  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isLoadingGetPaymentMethodDetails, setIsLoadingGetPaymentMethodDetails] = useState(false);
  const [paymentGroups, setPaymentGroups] = useState([]);
  const [isLoadingPayment, setIsLoadingPayment] = useState('');
  const [searchValues, setSearchValues] = useState({
    search: '',
    group: '',
    active: null,
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
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
  const toggleModalCreate = () => {
    setIsModalCreateOpen((prev) => !prev);
  };

  const handleGetPaymentGroups = async () => {
    const model = new CommonModel();
    const res = await model.getData('paymentgroup');
    if (res.status) {
      let object = {};
      for (let group of res.data.paymentgroups || []) {
        object[group.groupCode] = { ...group };
      }
      setPaymentGroups(object);
    } else {
      message.error(res.message);
    }
  };
  console.log({
    paymentGroups: Object.values(paymentGroups)?.map((item) => {
      return { value: item.groupCode, label: item?.groupName };
    }),
  });

  const handleGetPaymentMethods = async () => {
    const res = await PaymentMethodApi.getPaymentMethods();
    if (res.status) {
      const data = res.data.paymentMethods;
      return Object.values(data || {});
    } else {
      message.error(res.message);
    }
  };

  const handleGetPaymentMethodByCode = async (methodCode) => {
    setIsLoadingGetPaymentMethodDetails(true);
    const res = await PaymentMethodApi.getPaymentMethodByCode(methodCode);
    if (res.status) {
      const data = res.data.paymentMethod;
      setSelectedPayment(data);
      setIsLoadingGetPaymentMethodDetails(false);
      return data;
    } else {
      setIsLoadingGetPaymentMethodDetails(false);
      message.error(res.message);
    }
  };

  const handleChangePaymentStatus = async (checked, payment, index) => {
    setIsLoadingPayment(payment.methodCode);
    let res = {};
    if (checked) {
      res = await PaymentMethodApi.activePaymentMethod(payment.methodCode);
    } else {
      res = await PaymentMethodApi.inActivePaymentMethod(payment.methodCode);
    }
    if (res.status) {
      const clonePayments = JSON.parse(JSON.stringify(paymentMethods));
      clonePayments[index] = { ...payment, active: checked };
      setPaymentMethods(clonePayments);
      AppMessage.success('Updated status successfully');
    } else {
      AppMessage.error(res.message);
    }
    setIsLoadingPayment('');
  };

  useEffect(() => {
    handleGetPaymentGroups();
  }, []);

  const paymentQuery = useQuery({
    queryKey: ['payment', 'method'],
    queryFn: handleGetPaymentMethods,
  });
  useEffect(() => {
    setPaymentMethods(paymentQuery.data);
  }, [paymentQuery.data]);
  const renderGroupUI = (groupCode) => {
    const group = paymentGroups[groupCode];
    // if (groupCode === '001') return <Tag color="blue">{group?.groupName}</Tag>;
    // if (groupCode === '011') return <Tag color="green">{group?.groupName}</Tag>;
    // if (groupCode === '111') return <Tag color="orange">{group?.groupName}</Tag>;
    return <Tag color="blue">{group?.groupName}</Tag>;
  };
  const [editForm] = Form.useForm();

  useEffect(() => {
    editForm.setFieldsValue({
      storeCodes: selectedPayment?.storeCodes || [],
      paymentName: selectedPayment?.methodName || '',
      paymentGroup: selectedPayment?.groupCode || '',
      paymentImage: selectedPayment?.image
        ? [
            {
              uid: `${Date.now()}`,
              name: `${selectedPayment?.methodName}`,
              status: 'done',
              url: `data:image/jpeg;base64,${selectedPayment?.image}`,
            },
          ]
        : [],
    });
  }, [selectedPayment]);

  useEffect(() => {
    const filteredData = paymentQuery.data?.filter((el) => {
      const res =
        el.methodName?.toLowerCase().includes(searchValues.search?.trim().toLowerCase()) &&
        el.groupCode.includes(searchValues.group || '') &&
        (searchValues.active === null || searchValues.active === undefined || el.active === searchValues.active);

      return res;
    });
    setPaymentMethods(filteredData);
  }, [searchValues, paymentQuery.data]);

  return (
    <PaymentMethodNav>
      <div className="flex flex-col">
        {paymentQuery.isLoading ? (
          <SuspenLoading />
        ) : (
          <div className="section-block mt-15" style={{ width: '50%' }}>
            <BaseButton iconName="plus" onClick={toggleModalCreate}>
              Add new method
            </BaseButton>
            <p className="m-0 mt-15">Filter</p>
            <div className="flex gap-10 items-center">
              <Input
                placeholder="Enter method name"
                className="flex-1"
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchValues((prev) => ({ ...prev, search: value }));
                }}
              />
              <Select
                allowClear
                className="flex-1"
                placeholder="Select Group"
                options={Object.values(paymentGroups)?.map((item) => {
                  return { value: item.groupCode, label: item?.groupName };
                })}
                onChange={(value) => {
                  setSearchValues((prev) => ({ ...prev, group: value }));
                }}
              />
              <Select
                allowClear
                className="flex-1"
                placeholder="Status"
                options={[
                  { value: true, label: 'Active' },
                  { value: false, label: 'InActive' },
                ]}
                onChange={(value) => {
                  setSearchValues((prev) => ({ ...prev, active: value }));
                }}
              />
            </div>
            <div className="w-full p-0 mt-15" style={{ overflow: 'auto', maxHeight: 'calc(100vh - 247px)' }}>
              <table data-group="inforBillItem" className="table w-full fixed_header">
                <thead>
                  <tr>
                    <th className="rule-text">Name</th>
                    <th className="text-center">Group</th>
                    <th className="text-center">Created by</th>
                    <th className="text-center">Updated by</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentMethods?.map((payment, index) => {
                    return (
                      <tr key={payment.methodCode}>
                        <td className="rule-number">
                          <div className="flex gap-20 items-center">
                            <Image
                              key={payment.methodCode}
                              style={{
                                width: '60px',
                                height: '60px',
                                boxShadow: ' #32325d40 0px 2px 5px -1px, #0000004d 0px 1px 3px -1px',
                                borderRadius: '10px',
                              }}
                              src={`data:image/jpeg;base64,${payment.image}`}
                            />
                            <p className="m-0">{payment.methodName}</p>
                          </div>
                        </td>
                        <td className="" style={{ textAlign: 'center' }}>
                          {renderGroupUI(payment.groupCode)}
                        </td>
                        <td className="rule-number">
                          <div>
                            <p className="m-0">#{payment.createdBy}</p>
                            <p className="hint">
                              {payment.createdDate ? moment(payment.createdDate).utc().format('DD/MM/YYYY') : null}
                            </p>
                          </div>
                        </td>
                        <td className="rule-number">
                          <div>
                            <p className="m-0">#{payment.updatedBy}</p>
                            <p className="hint">
                              {payment.updatedDate ? moment(payment.updatedDate).utc().format('DD/MM/YYYY') : null}
                            </p>
                          </div>
                        </td>
                        <td className="rule-number">
                          <Switch
                            loading={isLoadingPayment === payment.methodCode}
                            checkedChildren="Active"
                            unCheckedChildren="Active"
                            checked={payment.active}
                            onChange={(checked) => {
                              handleChangePaymentStatus(checked, payment, index);
                            }}
                          />
                        </td>

                        <td className="">
                          <BaseButton
                            loading={isLoadingGetPaymentMethodDetails}
                            iconName="edit"
                            onClick={() => handleGetPaymentMethodByCode(payment.methodCode)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <Drawer open={isModalCreateOpen} onClose={toggleModalCreate}>
        <h5>Create new payment</h5>
        <Form
          onFinish={async (value) => {
            const base64 = await FileHelper.convertToBase64(value.paymentImage?.[0]?.originFileObj);
            const payload = { ...value, paymentImage: StringHelper.base64Smooth(base64) };
            const res = await PaymentMethodApi.createPaymentMethods(payload);
            if (res.status) {
              message.success('Create new payment method successfully!!!');
              queryClient.invalidateQueries('payment');
            } else {
              message.error(res.message);
            }
          }}
        >
          <PaymentGroupForm paymentGroups={paymentGroups} />
        </Form>
      </Drawer>

      <Drawer open={Boolean(selectedPayment)} onClose={() => setSelectedPayment(null)}>
        <h5>Edit {selectedPayment?.methodName}</h5>
        {isLoadingGetPaymentMethodDetails ? (
          <div className="h-full w-full center">
            <Spin />
          </div>
        ) : (
          <Form
            form={editForm}
            onFinish={async (value) => {
              let payload = { ...value };
              if (value.paymentImage[0].url) {
                payload = { ...value, paymentImage: StringHelper.base64Smooth(value.paymentImage[0].url) };
              } else {
                const base64 = await FileHelper.convertToBase64(value.paymentImage?.[0]?.originFileObj);
                payload = { ...value, paymentImage: StringHelper.base64Smooth(base64) };
              }
              const res = await PaymentMethodApi.updatePaymentMethods(selectedPayment.methodCode, payload);
              if (res.status) {
                queryClient.invalidateQueries('payment');
                message.success('Update payment successfuly');
              } else {
                message.error(res.message);
              }
            }}
          >
            <PaymentGroupForm paymentGroups={paymentGroups} storeOptions={storeOptions} />
          </Form>
        )}
      </Drawer>
    </PaymentMethodNav>
  );
};

export default PaymentMethods;
