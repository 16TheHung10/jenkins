import { Button, Checkbox, Col, Form, Input, Modal, Radio, Row, Select, Space, message } from 'antd';
import { StoreApi } from 'api';
import POSManagementTable from 'components/mainContent/POS/POSManagement/Table/POSManagementTable';
import { ArrayHelper } from 'helpers';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import SectionWithTitle from 'components/common/section/SectionWithTitle';
import CommonModel from 'models/CommonModel';
import { useQuery } from 'react-query';
const POSManagement = () => {
  const params = useParams();
  const [isAddDeviceInfo, setIsAddDeviceInfo] = useState(false);
  const [counters, setCounters] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [selectedCounter, setSelectedCounter] = useState(null);
  const handleGetCounters = async () => {
    setIsLoading(true);
    const res = await StoreApi.getCounters(params.storeCode);
    if (res.status) {
      const counters = res.data.counters;
      setCounters(counters);
    } else {
      setCounters(null);
      message.error(res.message);
    }
    setIsLoading(false);
  };

  const handleGetTerminalOptions = async () => {
    const res = await new CommonModel().getData('terminalpartners,terminalsettles');
    if (res.status) {
      const terminalpartners = res.data?.terminalpartners || {};
      const terminalsettles = res.data?.terminalsettles || {};
      const terminalpartnersOptions =
        Object.keys(terminalpartners)?.map((item) => ({
          value: terminalpartners[item]?.key,
          label: `${item} - ${terminalpartners[item]?.value}`,
        })) || [];
      const terminalsettlesOptions =
        Object.keys(terminalsettles)?.map((item) => ({ value: item, label: `${item} - ${terminalsettles[item]}` })) ||
        [];
      return { terminalpartnersOptions, terminalsettlesOptions };
    } else {
      throw new Error(res.message);
    }
  };

  const terminalQuery = useQuery({
    queryKey: 'terminals',
    queryFn: handleGetTerminalOptions,
    enabled: isModalCreateOpen,
  });

  const handleChangeAllowPromotion = async (record, index) => {
    const res = await StoreApi.updateAllowPromotionCounter(
      params.storeCode,
      record.counterCode,
      !record.allowPromotion
    );

    if (res.status) {
      const cloneCounters = ArrayHelper.deepClone(counters);
      cloneCounters.splice(index, 1, {
        ...record,
        allowPromotion: !record.allowPromotion,
      });
      setCounters(cloneCounters);
      message.success('Successfully');
    } else {
      message.error(res.message);
      setCounters(record);
    }
  };

  const handleChangeAllowSysCall = async (record, index) => {
    const res = await StoreApi.allowSysCall(params.storeCode, record.counterCode, !record.allowRungOrder);

    if (res.status) {
      const cloneCounters = ArrayHelper.deepClone(counters);
      cloneCounters.splice(index, 1, {
        ...record,
        allowRungOrder: !record.allowRungOrder,
      });
      setCounters(cloneCounters);
      message.success('Successfully');
    } else {
      message.error(res.message);
      setCounters(record);
    }
  };

  useEffect(() => {
    handleGetCounters();
  }, []);

  const handleCeateCounter = async (data) => {
    const nextCounterCode = +counters[counters.length - 1].counterCode.slice(6) + 1;
    console.log({ counters, nextCounterCode });
    const payload = {
      ...data,
      counterCode: params.storeCode + (nextCounterCode < 10 ? `0${nextCounterCode}` : nextCounterCode),
    };
    const res = await StoreApi.createCounter(params.storeCode, payload);
    setIsModalCreateOpen(false);
    form.resetFields();
    if (res.status) {
      message.success('Create counter successfully');
      setCounters((prev) => [...prev, { ...payload, allowPromotion: true }]);
    } else {
      message.error(res.message);
    }
  };
  const handleUpdateCounter = async (data) => {
    let payload = {
      ...data,
      allowPromotion: selectedCounter.allowPromotion,
      allowRungOrder: selectedCounter.allowRungOrder,
      counterCode: selectedCounter.counterCode,
    };
    if (isAddDeviceInfo) {
      payload = {
        ...selectedCounter,
        ...payload,
      };
    }
    const res = await StoreApi.updateCounter(params.storeCode, payload);
    if (res.status) {
      message.success('Update counter successfully');
      setCounters((prev) => {
        const clone = JSON.parse(JSON.stringify(prev));
        const editIndex = clone.findIndex((el) => el.counterCode === selectedCounter.counterCode);
        clone.splice(editIndex, 1, { ...selectedCounter, ...payload });
        return clone;
      });
    } else {
      message.error(res.message);
    }
  };
  const [form] = Form.useForm();
  const isSelfCheckout = Form.useWatch('isSelfCheckout', form);

  const onSubmit = (value) => {
    let payload = {};
    if (isAddDeviceInfo) {
      const terminalArr = value.terminals || [];
      const terminalObj = {};
      for (let ter of terminalArr) {
        terminalObj[ter.terminal] = ter.details;
      }
      payload = {
        ...value,
        terminals: Object.keys(terminalObj)?.length > 0 ? JSON.stringify(terminalObj) : null,
        isSelfCheckout,
      };
    } else {
      payload = {
        counterName: value.counterName,
        isSelfCheckout,
      };
    }

    if (selectedCounter) return handleUpdateCounter(payload);
    return handleCeateCounter(payload);
  };
  const terminalOptionCompose = useMemo(() => {
    return [
      ...Object.values(terminalQuery?.data?.terminalpartnersOptions || {}),
      ...Object.values(terminalQuery?.data?.terminalsettlesOptions || {}),
    ];
  }, [terminalQuery?.data?.terminalpartnersOptions, terminalQuery?.data?.terminalsettlesOptions]);

  useEffect(() => {
    setIsAddDeviceInfo(false);
  }, [selectedCounter]);
  console.log({ selectedCounter, isAddDeviceInfo });
  return (
    <Row>
      <Col span={12}>
        <BaseButton onClick={() => setIsModalCreateOpen(true)} iconName="plus">
          Create
        </BaseButton>

        <POSManagementTable
          data={counters}
          loading={isLoading}
          onChangeAllowPromotion={handleChangeAllowPromotion}
          onChangeAllowSysCall={handleChangeAllowSysCall}
          onClickEdit={(record) => {
            const terminalObj = record.terminals ? JSON.parse(record.terminals) : {};
            setSelectedCounter(record);
            form.setFieldsValue({
              ...record,
              terminals: record.terminals
                ? Object.keys(terminalObj).map((item) => ({ terminal: item, details: terminalObj[item] }))
                : null,
            });
            setIsModalCreateOpen(true);
          }}
        />
      </Col>
      <Modal
        open={isModalCreateOpen}
        footer={false}
        onCancel={() => {
          setIsModalCreateOpen(false);
          setSelectedCounter(null);
          form.resetFields();
        }}
      >
        <Row>
          <Form form={form} className="mt-15 w-full" onFinish={onSubmit} layout="vertical">
            <Form.Item name="isSelfCheckout" label="POS type">
              <Select
                defaultValue={false}
                options={[
                  { value: false, label: 'Normal' },
                  { value: true, label: 'Self checkout' },
                ]}
                placeholder="Terminal"
              />
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: 'Please input counter name',
                },
              ]}
              name="counterName"
              label="Counter Name"
            >
              <Input placeholder="Enter counter name" />
            </Form.Item>

            {/* <label htmlFor="">Is Self Checkout</label> */}

            <>
              <label htmlFor="">Input device info</label>
              <Checkbox checked={isAddDeviceInfo} onChange={(e) => setIsAddDeviceInfo(e.target.checked)} />
            </>
            {isAddDeviceInfo && (
              <SectionWithTitle title="Device information">
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: 'Please input  ip address',
                    },
                  ]}
                  name="terminalIP"
                  label="IP address"
                >
                  <Input placeholder="Enter IP address" />
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: 'Please input  isettle',
                    },
                  ]}
                  name="terminalSettle"
                  label="EDC Banking Settlement"
                >
                  <Select
                    options={[...(terminalQuery.data?.terminalsettlesOptions || [])]}
                    loading={terminalQuery.isLoading}
                    disabled={terminalQuery.isError}
                    placeholder="Selectr EDC Banking Settlement"
                  />
                </Form.Item>

                <div id="deviceInfo" style={{ maxHeight: '300px', overflow: 'auto', width: '100%' }}>
                  <Form.List name="terminals">
                    {(fields, { add, remove }) => (
                      <>
                        {terminalOptionCompose?.length <= fields.length ? null : (
                          <Form.Item style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                            <Button
                              style={{ width: '100%' }}
                              type="primary"
                              onClick={() => {
                                const container = document.getElementById('deviceInfo');
                                container.scroll({ top: 0, behavior: 'smooth' });
                                add(null, 0);
                              }}
                              block
                              icon={<PlusOutlined />}
                            >
                              Add E-payment
                            </Button>
                          </Form.Item>
                        )}
                        {fields.map(({ key, name, ...restField }) => (
                          <div
                            key={key}
                            style={{
                              display: 'flex',
                              alignItems: 'baseline',
                              gap: 10,
                              marginBottom: 8,
                            }}
                          >
                            <div className="flex flex-1 gap-10 items-center">
                              <Form.Item
                                style={{
                                  flex: 1,
                                }}
                                {...restField}
                                name={[name, 'terminal']}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Missing E-payment',
                                  },
                                ]}
                              >
                                <Select
                                  options={terminalOptionCompose}
                                  loading={terminalQuery.isLoading}
                                  disabled={terminalQuery.isError}
                                  placeholder="E-payment"
                                />
                              </Form.Item>
                              <Form.Item
                                style={{
                                  flex: 1,
                                }}
                                {...restField}
                                name={[name, 'details']}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Missing details',
                                  },
                                ]}
                              >
                                <Input placeholder="Details" />
                              </Form.Item>
                            </div>

                            <MinusCircleOutlined onClick={() => remove(name)} />
                          </div>
                        ))}
                      </>
                    )}
                  </Form.List>
                </div>
              </SectionWithTitle>
            )}

            <Form.Item>
              <BaseButton iconName="send" htmlType="submit">
                {selectedCounter ? 'Update' : 'Create'}
              </BaseButton>
            </Form.Item>
          </Form>
        </Row>
      </Modal>
    </Row>
  );
};

export default POSManagement;
