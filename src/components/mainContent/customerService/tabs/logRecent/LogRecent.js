import { Col, Modal, Row, message } from 'antd';
import FieldList from 'components/common/fieldList/FieldList';
import CONSTANT from 'constant';
import { useAppContext } from 'contexts';
import FormField from 'data/oldVersion/formFieldRender';
import { ArrayHelper, DateHelper, StringHelper, UrlHelper } from 'helpers';
import { useFormFields, useShowFilter } from 'hooks';
import Icons from 'images/icons';
import CustomerServiceModel from 'models/CustomerServiceModel';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import BillModel from '../../../../../models/BillModel';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import Info from '../../../bill/Info';
import './style.scss';

const LogRecent = ({ memberCode, isDrawerOpen, model = new CustomerServiceModel() }) => {
  const { isVisible, TriggerComponent } = useShowFilter();
  const contextValue = useAppContext();

  const [logData, setLogData] = useState(null);
  const [constData, setConstData] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState(null);
  const [billDetails, setBillDetails] = useState(null);

  const labelMethod = (eventName) => {
    switch (eventName) {
      case 'BILL_PRINTED':
        return 'Tích lũy';
      case 'PAYMENT':
        return 'Thanh Toán';
      case 'RETURN_ITEM':
        return 'Trả hàng';
      case 'ADD_REWARD':
        return 'Điểm thưởng';
      case 'APP_REDEEM_POINT':
        return 'Redeem điểm';
      case 'APP_REDEEM':
        return 'Redeem';
      case 'APP_REDEEM_DEPOSIT':
        return 'Đổi điểm';
      case 'LOCK_GIFT':
        return 'Tặng quà';
      case 'GIFT_CARD':
        return 'Nhận quà';
      case 'BILL_CANCEL':
        return 'Huỷ hoá đơn';
      default:
        return eventName;
    }
  };

  const itemResponseComp = (elm) => {
    const dataCv = elm.rowData;
    if (!dataCv) {
    }
    const paymentResponseArray = elm.paymentResponseArray;
    if (dataCv === null || dataCv === '' || dataCv === false) {
      return '';
    } else {
      return (
        <>
          {/* <td>{pay.GroupCode}</td> */}
          <td>{dataCv?.ItemCode || '-'}</td>
          <td>{dataCv?.ItemName || elm.itemName || '-'}</td>
          <td className="rule-number">{StringHelper.formatPrice(dataCv?.UnitPrice) || '-'}</td>
          <td className="rule-number">{+StringHelper.formatPrice(dataCv?.Qty) || '-'}</td>
          <td className="rule-number">{StringHelper.formatPrice(dataCv?.DiscountPrice) || '-'}</td>
          <td className="rule-number">{StringHelper.formatPrice(dataCv?.TotalPrice) || '-'}</td>
          {Object.keys(paymentMethods)?.length > 0 ? (
            Object.keys(paymentMethods)?.map((item, index) => {
              if (!paymentResponseArray) return null;
              const value = paymentResponseArray?.find((el) => el.PaymentCode === item)?.Value;
              if (!value)
                return (
                  <td className="rule-number" rowSpan={elm.rowLength}>
                    -
                  </td>
                );
              return (
                <td className="rule-number" rowSpan={elm.rowLength}>
                  {StringHelper.formatPrice(value)}
                </td>
              );
            })
          ) : (
            <td className="rule-number" rowSpan={elm.rowLength}>
              -
            </td>
          )}
        </>
      );
    }
  };
  useEffect(() => {
    setLogData(null);
    setConstData(null);
  }, [UrlHelper.getSearchParamsObject()?.selectedCustomer]);

  const handlGetLogInfo = async (value) => {
    await model
      .getLogDetail(memberCode, {
        ...value,
        invoiceCode: value?.invoiceCode?.trim(),
        date: value?.date ? moment(value.date).format(CONSTANT.FORMAT_DATE_PAYLOAD) : '',
      })
      .then((res) => {
        if (res.status) {
          const format = [];
          let paymentMethodsResponse = {};
          for (let item of res.data.logs) {
            const itemResponse = item.itemResponse ? JSON.parse(item.itemResponse) : item.itemCode;
            const paymentResponse = item.paymentResponse ? JSON.parse(item.paymentResponse) : [];
            for (let payment of paymentResponse) {
              if (payment)
                paymentMethodsResponse = {
                  ...paymentMethodsResponse,
                  [payment.PaymentCode]: payment,
                };
            }
            if (Array.isArray(itemResponse)) {
              for (let i in itemResponse) {
                let itemResponseItem = itemResponse[i];
                if (+i === 0) {
                  format.push({
                    ...item,
                    rowData: itemResponseItem,
                    paymentResponseArray: paymentResponse,
                    index: i,
                    originalEventName: item.eventName,
                    originalRequestDate: item.requestDate,
                    invoiceCodeFilter: item.invoiceCode,
                    rowLength: itemResponse.length,
                  });
                } else {
                  // colapse row
                  const { invoiceCode, eventName, transactionPoint, requestDate, ...rest } = item;
                  format.push({
                    ...rest,
                    rowData: itemResponseItem,
                    paymentResponseArray: null,
                    index: i,
                    originalRequestDate: item.requestDate,
                    invoiceCodeFilter: item.invoiceCode,
                    originalEventName: eventName,
                    rowLength: itemResponse.length,
                  });
                }
              }
            } else {
              format.push({
                ...item,
                rowData: { ItemCode: item.itemCode },
                paymentData: null,
                originalRequestDate: item.requestDate,
                paymentResponseArray: paymentResponse,
                originalEventName: item.eventName,
                invoiceCodeFilter: item.invoiceCode,
              });
            }
          }
          setPaymentMethods(paymentMethodsResponse);
          setLogData(format.filter((el) => el.eventName !== 'LOCK_GIFT' && el.eventName !== 'GIFT_CARD' && el.eventName !== ''));
          setConstData(format.filter((el) => el.eventName !== 'LOCK_GIFT' && el.eventName !== 'GIFT_CARD' && el.eventName !== ''));

          if (res.data.logs && res.data.logs.length === 0) {
            message.error('Recent logs not found');
          }
        }
      });
  };
  // options filter
  const initialEventOptions = {
    BILL_PRINTED: { value: 'BILL_PRINTED', label: 'Tích lũy' },
    PAYMENT: { value: 'PAYMENT', label: 'Thanh Toán' },
    RETURN_ITEM: { value: 'RETURN_ITEM', label: 'Trả hàng' },
    ADD_REWARD: { value: 'ADD_REWARD', label: 'Điểm thưởng' },
    APP_REDEEM_POINT: { value: 'APP_REDEEM_POINT', label: 'Redeem điểm' },
    APP_REDEEM: { value: 'APP_REDEEM', label: 'Redeem' },
    APP_REDEEM_DEPOSIT: { value: 'APP_REDEEM_DEPOSIT', label: 'Đổi điểm' },
    BILL_CANCEL: { value: 'BILL_CANCEL', label: 'Huỷ hoá đơn' },
    // LOCK_GIFT: { value: 'LOCK_GIFT', label: 'Tặng quà' },
    // GIFT_CARD: { value: 'GIFT_CARD', label: 'Nhận quà' },
  };

  const getFieldValueFromArrayJSON = (jsonString, userParams = 'PaymentCode') => {
    if (!jsonString) return [];
    const jsonArray = JSON.parse(jsonString); // Chuyển chuỗi JSON thành mảng đối tượng
    const res = [];
    for (const jsonObject of jsonArray) {
      if (userParams in jsonObject) {
        const paramValue = jsonObject[userParams];
        res.push(paramValue);
      }
    }
    return res;
  };

  const restOptions = useMemo(() => {
    if (!constData) return [];
    let invoiceCodeOptions = {};
    let itemOptions = {};
    let allPayments = [];
    let eventOptions = {};
    for (let v of constData) {
      const paymentMethods = getFieldValueFromArrayJSON(v.paymentResponse);
      if (paymentMethods && paymentMethods?.length > 0) {
        allPayments.push(...paymentMethods);
      }
      if (v.invoiceCode && v.invoiceCode.startsWith('VN')) {
        invoiceCodeOptions = {
          ...invoiceCodeOptions,
          [v.invoiceCode]: { value: v.invoiceCode, label: v.invoiceCode },
        };
      }
      if (v.itemCode) {
        itemOptions = {
          ...itemOptions,
          [v.itemCode]: {
            value: v.itemCode,
            label: v.itemCode,
            key: v.transID,
          },
        };
      }
      if (v.itemResponse) {
        const itemResponse = JSON.parse(v.itemResponse);
        for (let item of itemResponse) {
          if (itemOptions?.[item.ItemCode]) continue;
          itemOptions = {
            ...itemOptions,
            [item.ItemCode]: {
              value: item.ItemCode,
              label: item.ItemCode,
              type: 'response',
            },
          };
        }
      }
      if (v.eventName && initialEventOptions[v.eventName]) {
        eventOptions[v.eventName] = initialEventOptions[v.eventName];
      }
    }
    const response = {
      invoiceCodeOptions: Object.values(invoiceCodeOptions),
      itemOptions: Object.values(itemOptions),
      eventOptions: Object.values(eventOptions),
      paymentOptions:
        allPayments && allPayments.length > 0
          ? [...new Set(allPayments)].map((item, index) => ({
              value: item,
              label: contextValue.state.paymentmethods?.[item]?.methodName,
              key: index,
            }))
          : null,
    };
    return response;
  }, [constData]);

  const handleFilter = (value) => {
    const filteredData = ArrayHelper.multipleFilter(
      constData?.map((item) => ({
        ...item,
        itemCodeGroup: item.itemCode + ',' + getFieldValueFromArrayJSON(item.itemResponse, 'ItemCode')?.join(','),
      })),
      { ...value }
    );
    setLogData(filteredData);
  };
  const { formInputsWithSpan, onSubmitHandler, getValues, setError } = useFormFields({
    fieldInputs: [
      {
        name: 'invoiceCode',
        label: 'Invoice code',
        type: 'text',
        placeholder: 'Enter invoice code',
        span: 4,
      },
    ],
    onSubmit: handlGetLogInfo,
    watches: ['cityID', 'districtID'],
  });

  const {
    formInputsWithSpan: filterFields,
    onSubmitHandler: onFilter,
    getValues: getValuesFilter,
  } = useFormFields({
    fieldInputs: FormField.LogrecentOverview.fieldInputsFilter({
      ...restOptions,
    }),
    onSubmit: handleFilter,
    watches: ['paymentResponse', 'invoiceCodeFilter', 'originalEventName', 'itemCodeGroup'],
  });

  useEffect(() => {
    onFilter();
  }, [getValuesFilter('paymentResponse'), getValuesFilter('invoiceCodeFilter'), getValuesFilter('originalEventName'), getValuesFilter('itemCodeGroup')]);

  const handleFetchBillDetails = async (billCode) => {
    const model = new BillModel();
    const res = await model.searchBill({ billCode });
    if (res.status) {
      if (!res.data.bill) message.error('Can not find this bill');
      setBillDetails(res.data.bill);
    } else {
      message.error(res.message);
    }
  };

  useEffect(() => {
    if (isDrawerOpen) {
      handlGetLogInfo();
    }
    contextValue.onGetPaymentMethods();
  }, [isDrawerOpen]);

  const sortedLogData = useMemo(() => {
    return logData?.sort((a, b) => b.originalRequestDate?.localeCompare(a.originalRequestDate));
    // return logData
  }, [logData]);

  return (
    <div className="mt-15 w-full" id="log_recent">
      <Modal open={billDetails} onCancel={() => setBillDetails(null)} footer={false}>
        {billDetails ? <Info info={billDetails} list={billDetails?.items} payment={billDetails.payments} /> : null}
      </Modal>
      <div className="section-block mb-15">
        {/* Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (getValues('invoiceCode')) {
              const regex = /^(vn|VN)\d{16}$/;
              if (!regex.test(getValues('invoiceCode')?.trim())) {
                setError('invoiceCode', {
                  type: 'invalid type',
                  message: 'Invalid invoice Code, invoice code must start with "VN" + 16 degit, Ex:VN1234567891234567',
                });
              } else {
                onSubmitHandler(e);
              }
            } else {
              setError('invoiceCode', null);
              onSubmitHandler(e);
            }
          }}
        >
          <Row gutter={[16, 16]} className="items-center">
            <FieldList fields={formInputsWithSpan} />
            <Col span={4}>
              <div className="flex items-center gap-10">
                <BaseButton iconName={'search'} htmlType="submit">
                  Search
                </BaseButton>
                <TriggerComponent />
              </div>
            </Col>
          </Row>
        </form>
        {/* Filter */}
        {logData ? (
          <>
            <form onSubmit={onFilter} className={`mt-15 transition_animate_5 h-full ${isVisible ? 'show' : 'hide'}`}>
              <Row gutter={[16, 0]} className="items-center">
                <FieldList fields={filterFields} />
                {/* <Col span={4}>
                  <Button htmlType="submit" className="btn-danger">
                    Filter
                  </Button>
                </Col> */}
              </Row>
            </form>
          </>
        ) : null}
      </div>

      <Row gutter={[16, 16]}>
        {/* <Col span={24}>
          {billDetails ? <Info info={billDetails} list={billDetails.items} payment={billDetails.payments} /> : null}
        </Col> */}
        <Col span={24}>
          <div className="section-block">
            {' '}
            <p className="cl-red mt-10">
              <strong className="required"></strong> <span>Data lấy trong 30 ngày gần nhất</span>
            </p>
            <Row
              className="mt-15 "
              style={{
                maxHeight: '79vh',
                overflowY: 'scroll',
                maxWidth: '100%',
              }}
            >
              <table className="table table-hover table_border_header table-bordered" style={{ position: 'relative', fontSize: '12px' }}>
                <thead
                  style={{
                    position: 'sticky',
                    zIndex: 5,
                    posiiton: 'sticky',
                    top: -1,
                    fontSize: '12px',
                  }}
                >
                  <tr>
                    <th rowSpan={2} style={{ width: '165px' }}>
                      Invoice code
                    </th>

                    <th colSpan={6} className="text-center">
                      Item
                    </th>
                    <th colSpan={Object.values(paymentMethods || {})?.length || 1} rowSpan={Object.values(paymentMethods || {})?.length > 0 ? 1 : 2} className="text-center">
                      Payment
                    </th>
                    {/* <th rowSpan={2}>Created by</th> */}
                    <th rowSpan={2}>Event name</th>
                    <th rowSpan={2} className="rule-number">
                      Point
                    </th>
                    <th rowSpan={2} className="rule-date">
                      Created date
                    </th>
                  </tr>
                  <tr>
                    <th>Item code</th>
                    <th>Item name</th>
                    <th className="text-center">Unit price</th>
                    <th>Qty</th>
                    <th className="text-center">Discount price</th>
                    <th className="text-center">Total price</th>
                    {Object.values(paymentMethods || {})?.map((item, index) => {
                      return (
                        <th rowSpan={Object.values(paymentMethods || {})?.length} key={`payment-${index}`} className="text-center">
                          {contextValue.state.paymentmethods?.[item.PaymentCode]?.methodName || 'No data'}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {sortedLogData?.map((elm, i) => {
                    return (
                      <tr key={i}>
                        {elm.invoiceCode ? (
                          <td style={{ verticalAlign: 'top' }} rowSpan={elm.rowLength}>
                            {elm.invoiceCode?.startsWith('VN') ? elm.invoiceCode : ''}{' '}
                            {elm.invoiceCode?.startsWith('VN') ? (
                              <Icons.EyeOpen
                                onClick={() => {
                                  handleFetchBillDetails(elm.invoiceCode);
                                }}
                                className="eye_icon"
                                style={{
                                  color: 'var(--primary-color)',
                                  cursor: 'pointer',
                                }}
                              />
                            ) : null}
                          </td>
                        ) : null}

                        {itemResponseComp(elm)}
                        {/* {paymentResponseComp(elm.paymentResponse)} */}
                        {/* {elm.counter ? : null} */}
                        {/* <td>{elm.counter}</td> */}
                        {elm.eventName ? (
                          <td
                            style={{
                              verticalAlign: 'top',
                              color: `${
                                elm.eventName === 'BILL_CANCEL'
                                  ? 'red'
                                  : elm.eventName === 'BILL_PRINTED'
                                  ? 'green'
                                  : elm.eventName === 'PAYMENT'
                                  ? 'var(--primary-color)'
                                  : elm.eventName === 'APP_REDEEM_DEPOSIT'
                                  ? '#cb750a'
                                  : 'black'
                              }`,
                            }}
                            rowSpan={elm.rowLength}
                          >
                            {labelMethod(elm.eventName)}
                          </td>
                        ) : null}

                        {elm.transactionPoint ? (
                          <td style={{ verticalAlign: 'top' }} rowSpan={elm.rowLength} className="rule-number font-bold color-primary">
                            {elm.transactionPoint}
                          </td>
                        ) : elm.transactionPoint === '' || elm.transactionPoint === 0 ? (
                          <td style={{ verticalAlign: 'top' }} rowSpan={elm.rowLength} className="rule-number font-bold color-primary">
                            -
                          </td>
                        ) : null}
                        {elm.requestDate ? (
                          <td className="rule-date" rowSpan={elm.rowLength}>
                            {DateHelper.displayDateTime24HM(elm.requestDate)}
                          </td>
                        ) : null}
                        {/* {elm.requestDate ? (
                      
                    ) : null} */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default LogRecent;
