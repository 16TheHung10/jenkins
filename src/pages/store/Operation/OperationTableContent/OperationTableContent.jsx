import { Button, DatePicker, Form, Modal, Popover, Select, message } from 'antd';
import { statusOption } from 'components/mainContent/store/StoreDetailsComp';
import { actionCreator, useStoreOperationContext } from 'contexts';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { APIHelper, UrlHelper } from 'helpers';
import StoreModel from 'models/StoreModel';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as HistoryIcon } from '../../../../images/history.svg';
import './style.scss';
const StatusValue = {
  0: 'Open',
  1: 'Close',
  2: 'Hold',
};

const OperationTableContent = ({ Pagination }) => {
  const history = useHistory();
  const [form] = Form.useForm();

  const { state, dispatch } = useStoreOperationContext();
  const { stores, regions } = state;

  const [selectedApplyDate, setSelectedApplyDate] = useState(null);
  const [selectedStoreHistory, setSelectedStoreHistory] = useState(null);
  const [selectedStoreAndStatus, setSelectedStoreAndStatus] = useState(null);

  const handleClickPaging = (pageNumber, pageSize) => {
    dispatch({ type: 'SET_PAGE_NUMBER', payload: pageNumber });
    dispatch({ type: 'SET_PAGE_SIZE', payload: pageSize });
  };

  const handleNavigateToDetails = (storeCode) => {
    history.push(`store-op/detail/${storeCode}`);
  };
  const handleGotoCreate = (storeCode) => {
    history.push(`store-op/create?initStoreCode=${storeCode}`);
  };

  useEffect(() => {
    const storesData = stores?.stores;
    if (storesData && storesData.length > 0) {
      const currentSearchParams = UrlHelper.getSearchParamsObject();
      if (currentSearchParams.store || currentSearchParams.status) {
        const currentStore = storesData.find((el) => el.storeCode === currentSearchParams.store);
        if (currentStore) {
          setSelectedStoreAndStatus({
            store: currentStore,
            status: currentSearchParams.status,
          });
        }
      }
    }
  }, [stores?.stores]);

  const handleOpenModelUpdateTime = (store, status) => {
    setSelectedStoreAndStatus({ store, status });
    UrlHelper.setSearchParamsFromObject({
      store: store.storeCode,
      status: status?.toString() || '',
    });
  };
  const convertApplyDate = (date) => {
    if (!date) return;
    let res = null;
    if (Array.isArray(date)) {
      const start = moment(date[0]).format('YYYY-MM-DD').toString();
      const end = moment(date[1]).format('YYYY-MM-DD').toString();
      res = start + ',' + end;
    } else {
      res = moment(date).format('YYYY-MM-DD').toString();
    }
    return res;
  };
  const handleUpdateStatus = async (store, status, data) => {
    const response = await APIHelper.put(`/store/update/status/${store?.storeCode}/${status}`, data);
    if (response.status) {
      const editedStoreIndex = stores.stores?.findIndex((el) => el.storeCode === store.storeCode);
      if (editedStoreIndex !== -1) {
        const clone = [...stores.stores];
        const applyDate = convertApplyDate(data.applyDate);
        const newData = {
          ...store,
          ...data,
          orderEndDate: data?.orderEndDate || null,
          orderStartDate: data?.orderStartDate || null,
          statusTask: status,
          applyDate: `${applyDate}`,
        };
        clone.splice(editedStoreIndex, 1, newData);
        dispatch(actionCreator('SET_STORES', { ...stores, stores: clone }));
      }
      message.success('Update status successfully!!!');
      form.resetFields();
      setSelectedStoreAndStatus(null);
    } else {
      message.error(response.message);
    }
  };
  const onSubmit = async (value) => {
    if (selectedStoreAndStatus) {
      const { store, status } = selectedStoreAndStatus;
      let payload = null;
      if (Array.isArray(value.applyDate)) {
        payload = {
          ...value,
          applyDate: convertApplyDate(value?.applyDate),
        };
      } else {
        payload = {
          ...value,
          applyDate: moment(value.applyDate).format('YYYY-MM-DD'),
        };
      }
      handleUpdateStatus(store, status, payload);
    }
  };

  const orderDateFactory = (type) => {
    let startDateDiffApplyDateFromNow;
    let endDateDiffApplyDateFromNow;

    if (Array.isArray(selectedApplyDate)) {
      startDateDiffApplyDateFromNow = moment(selectedApplyDate[0]).diff(moment(), 'days');
      endDateDiffApplyDateFromNow = moment(selectedApplyDate[1]).diff(moment(), 'days');
    } else {
      startDateDiffApplyDateFromNow = moment(selectedApplyDate).diff(moment(), 'days');
      endDateDiffApplyDateFromNow = moment(selectedApplyDate).diff(moment(), 'days');
    }
    const OrderStartDate = ({ isHold, title = 'Start order date' }) => {
      return (
        <Form.Item
          name="orderStartDate"
          label={<p className="m-0"> {title}</p>}
          rules={[
            {
              required: true,
              message: 'Start order date is required',
            },
          ]}
          className="text-right"
        >
          <DatePicker
            style={{ minWidth: 400, maxWidth: 400 }}
            disabledDate={(currentDate) => {
              if (isHold) {
                return (
                  currentDate &&
                  (currentDate < moment().add(endDateDiffApplyDateFromNow - 3, 'days') ||
                    currentDate > moment().add(endDateDiffApplyDateFromNow, 'days'))
                );
              }
              return (
                currentDate &&
                (currentDate < moment().add(startDateDiffApplyDateFromNow - 3, 'days') ||
                  currentDate > moment().add(startDateDiffApplyDateFromNow, 'days'))
              );
            }}
            format={'DD/MM/YYYY'}
            id="date"
            className="w-full"
          />
        </Form.Item>
      );
    };
    const OrderEndDate = ({ isHold, title = 'End order date' }) => {
      return (
        <Form.Item
          name="orderEndDate"
          label={<p className="m-0">{title} </p>}
          rules={[
            {
              required: true,
              message: 'End order date is required',
            },
          ]}
          className="text-right"
        >
          <DatePicker
            style={{ minWidth: 400, maxWidth: 400 }}
            disabledDate={(currentDate) => {
              if (isHold) {
                return (
                  currentDate &&
                  (currentDate < moment().add(startDateDiffApplyDateFromNow - 3, 'days') ||
                    currentDate > moment().add(startDateDiffApplyDateFromNow, 'days'))
                );
              }

              return (
                currentDate &&
                (currentDate < moment().add(endDateDiffApplyDateFromNow - 3, 'days') ||
                  currentDate > moment().add(endDateDiffApplyDateFromNow, 'days'))
              );
            }}
            format={'DD/MM/YYYY'}
            id="date"
            className="w-full"
          />
        </Form.Item>
      );
    };
    if (!selectedApplyDate) return null;
    if (type === 'open') {
      return <OrderStartDate />;
    }
    if (type === 'close') {
      return <OrderEndDate />;
    }
    return (
      <>
        <OrderStartDate isHold />
        <OrderEndDate isHold />
      </>
    );
  };

  const renderStatus = (status) => {
    if (status === undefined || status === null) return '-';
    return StatusValue[status];
  };
  const handleFetchHistory = async (storeCode) => {
    const model = new StoreModel();
    const res = await model.getStoreOPHistory(storeCode);
    if (res.status) {
      setSelectedStoreHistory(res.data.history);
      return res.data;
    }
    return null;
  };
  const applyDate = (store) => {
    const { applyDate: dateStrings, statusTask: futureStatus } = store;
    const dateArray = dateStrings?.split(',');
    const history = selectedStoreHistory;
    return (
      <div className="flex items-center">
        {!dateStrings || dateStrings === ',' ? (
          '-'
        ) : (
          <>
            {dateArray?.length === 1 ? (
              <>
                <span className="color-primary font-bold">{renderStatus(futureStatus)} </span>
                <span>at </span>
                <span className="">{moment(dateArray?.[0]).format('DD-MM-YYYY')}</span>
              </>
            ) : (
              <>
                <p className="m-0">
                  <span className="color-primary font-bold"> {renderStatus(futureStatus)} </span>
                </p>
                {dateArray.map((item, index) => {
                  return index === 0 ? (
                    <Fragment key={`status-future-${index}`}>
                      from
                      <span className=" "> {moment(item).format('DD-MM-YYYY')} </span>
                    </Fragment>
                  ) : (
                    <Fragment key={`status-future-${index}`}>
                      to
                      <span className=" "> {moment(item).format('DD-MM-YYYY')}</span>
                    </Fragment>
                  );
                })}
              </>
            )}
          </>
        )}

        <Popover
          trigger="click"
          title={`History update of store ${store.storeCode}`}
          onClick={() => handleFetchHistory(store.storeCode)}
          content={
            <div>
              <div
                style={{
                  maxHeight: 300,
                  overflowY: 'scroll',
                  padding: 10,
                  margin: '-10px',
                  fontSize: '12px',
                }}
              >
                {history && history.length > 0 ? (
                  <>
                    {history
                      .sort((a, b) => b.updatedDate?.toString().localeCompare(a.updatedDate?.toString()))
                      .map((item, index) => {
                        return (
                          <div key={index} className="" style={{ fontSize: 12 }}>
                            {/* <p>
                              <span className="">Type</span>{' '}
                              {<span className="color-primary font-bold">{renderStatus(item?.status)} </span>}
                            </p> */}
                            <p>
                              {renderStatus(item?.status) === 'Hold' ? (
                                <>
                                  <span className="color-primary font-bold">{renderStatus(item?.status)}</span> from{' '}
                                  {item.startDate ? moment(item.startDate).format('DD-MM-YYYY') : '-'} to{' '}
                                  {item.endDate ? moment(item.endDate).format('DD-MM-YYYY') : '-'}
                                </>
                              ) : (
                                <>
                                  <span className="color-primary font-bold">{renderStatus(item?.status)}</span> at{' '}
                                  {item.startDate ? moment(item.startDate).format('DD-MM-YYYY') : '-'}
                                </>
                              )}
                            </p>
                            <p>
                              {renderStatus(item?.status) === 'Hold' ? (
                                <>
                                  <span className="color-primary ">Order date </span> from{' '}
                                  {item.orderStartDate ? moment(item.orderStartDate).format('DD-MM-YYYY') : '-'} to{' '}
                                  {item.orderEndDate ? moment(item.orderEndDate).format('DD-MM-YYYY') : '-'}
                                </>
                              ) : renderStatus(item?.status) === 'Open' ? (
                                <>
                                  <span className="color-primary ">Start order date </span>{' '}
                                  {item.orderStartDate ? moment(item.orderStartDate).format('DD-MM-YYYY') : '-'}
                                </>
                              ) : (
                                <>
                                  <span className="color-primary ">End order date </span>{' '}
                                  {item.orderEndDate ? moment(item.orderEndDate).format('DD-MM-YYYY') : '-'}
                                </>
                              )}
                            </p>
                            <p>
                              Updated by:{' '}
                              {item.updateBy ? (
                                <>
                                  <span className="font-bold color-primary">{item.updateBy}</span>{' '}
                                  <span>{moment(item.updatedDate).format('DD-MM-YYYY - HH:mm')}</span>
                                </>
                              ) : (
                                '-'
                              )}{' '}
                            </p>

                            <hr />
                          </div>
                        );
                      })}
                  </>
                ) : (
                  <p style={{ textAlign: 'center' }}>NO EVENT</p>
                )}
              </div>
            </div>
          }
        >
          <HistoryIcon
            className="ml-10 cursor-pointer"
            width={12}
            style={{ fontSize: '16px', color: 'var(--primary-color)' }}
            fill="var(--primary-color)"
          />
        </Popover>
      </div>
    );
  };
  return (
    <div style={{ flex: 1 }} id="operationTableContent">
      <Modal
        className="change-store-op-status-modal"
        title={
          <p>
            Update status
            {selectedStoreAndStatus?.status === 2 ? (
              <span className="color-primary"> HOLD </span>
            ) : selectedStoreAndStatus?.status === 1 ? (
              <span className="color-primary"> CLOSE </span>
            ) : (
              <span className="color-primary"> OPEN </span>
            )}
            of store
            <span className="color-primary"> {selectedStoreAndStatus?.store?.storeCode}</span>
          </p>
        }
        open={selectedStoreAndStatus?.status === 0 || Boolean(selectedStoreAndStatus?.status)}
        // onOk={handleUpdateStatus}
        onCancel={() => {
          form.resetFields();
          setSelectedApplyDate(null);
          setSelectedStoreAndStatus(null);
        }}
        footer={false}
      >
        <Form form={form} onFinish={onSubmit}>
          <Form.Item
            name="applyDate"
            label="Apply date"
            rules={[
              {
                required: true,
                message: 'Apply date is required',
              },
            ]}
            className="text-right"
          >
            {selectedStoreAndStatus?.status === 2 ? (
              <DatePicker.RangePicker
                style={{ minWidth: 400, maxWidth: 400 }}
                disabledDate={(current) => {
                  return current && current < moment().add(3, 'days').endOf('day');
                }}
                onChange={(value) => {
                  setSelectedApplyDate(value);
                }}
                format={'DD/MM/YYYY'}
                id="date"
                className="w-full"
              />
            ) : (
              <DatePicker
                style={{ minWidth: 400, maxWidth: 400 }}
                disabledDate={(current) => {
                  return current && current < moment().add(3, 'days').endOf('day');
                }}
                onChange={(value) => {
                  setSelectedApplyDate(value);
                }}
                format={'DD/MM/YYYY'}
                id="date"
                className="w-full"
              />
            )}
          </Form.Item>
          {orderDateFactory(
            selectedStoreAndStatus?.status === 0 ? 'open' : selectedStoreAndStatus?.status === 1 ? 'close' : 'hold'
          )}
          <Button htmlType="submit" className="btn-danger">
            Change
          </Button>
        </Form>
      </Modal>
      <div className="row " style={{ height: '100%' }}>
        <div className="col-md-12 h-full">
          <div className="section-block flex flex-col" style={{ maxHeight: 'calc(100vh - 233px)' }}>
            <div className="w-fit">
              <div
                className="wrap-table htable paddinglessTable w-fit"
                style={{ flex: 1, maxHeight: 'calc(100vh - 331px)' }}
              >
                <table
                  className="table table-hover detail-search-rcv w-fit"
                  style={{
                    maxHeight: 500,
                    fontSize: 11,
                  }}
                >
                  <thead>
                    <tr>
                      {/* <th className="w10"></th> */}
                      <th>Store Code</th>
                      <th>Name</th>
                      <th>Region</th>
                      <th>City</th>
                      <th>
                        Status <span className="font-bold">(current)</span>
                      </th>
                      <th style={{ width: 'auto' }}>
                        Status <span className="font-bold">(future)</span>
                      </th>
                      <th style={{ width: 'auto' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(stores?.stores || {})?.map((store, i) => {
                      return (
                        <tr key={`tbody-row-${i}`}>
                          <td style={{ width: '100px' }}>{store.storeCode}</td>
                          <td>{store.storeName || '-'}</td>
                          <td>{regions?.find((el) => el.regionCode === store.regionCode)?.regionName || '-'}</td>
                          <td>{store.city || '-'}</td>
                          <td style={{ width: '120px' }}>
                            <Select
                              className={`${
                                store.status === 0
                                  ? 'select_status_open '
                                  : store.status === 1
                                  ? 'select_status_closed '
                                  : 'select_status_hold '
                              }`}
                              style={{ width: '100px', border: 'none' }}
                              value={store.status}
                              options={statusOption}
                              onChange={(value) => {
                                handleOpenModelUpdateTime(store, value);
                              }}
                              type
                            />
                          </td>
                          <td style={{ verticalAlign: 'middle' }}>
                            <div style={{ display: 'inline-block' }}>{applyDate(store) || '-'}</div>{' '}
                          </td>
                          <td style={{ verticalAlign: 'middle' }}>
                            <BaseButton
                              iconName="search"
                              onClick={() => {
                                handleNavigateToDetails(store.storeCode);
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {stores?.stores?.length === 0 ? <div className="table-message">Item not found</div> : ''}
              </div>
              {stores?.stores?.length > 0 ? (
                <div style={{ textAlign: 'center' }}>
                  <Pagination />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationTableContent;
