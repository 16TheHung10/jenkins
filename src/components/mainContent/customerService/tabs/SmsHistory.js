import React, { useState, useEffect, useRef } from 'react';
import { Tooltip, message } from 'antd';
import MainTable from 'components/common/Table/UI/MainTable';
import FormField from 'data/oldVersion/formFieldRender';
import { UrlHelper } from 'helpers';
import Icons from 'images/icons';
import CustomerServiceModel from 'models/CustomerServiceModel';
import moment from 'moment';
import SmsHistoryFilterActions from './smsHistory/filterAction/SmsHistoryFilterActions';

const SmsHistory = ({ memberCode, isDrawerOpen }) => {
  const [smsLogData, setSmsLogData] = useState([]);
  const constSmsLogData = useRef();

  const handleFetchSmsLog = async (initialParams) => {
    const params = { ...UrlHelper.getSearchParamsObject(), ...initialParams };
    const model = new CustomerServiceModel();
    const res = await model.getSMSLogDetail({ phone: params.phone });
    if (res.status) {
      setSmsLogData(res.data?.logs?.sort((a, b) => b.createdDate.localeCompare(a.createdDate)));
      constSmsLogData.current = res.data?.logs;
    } else {
      message.error(res.message);
    }
  };

  useEffect(() => {
    if (isDrawerOpen) handleFetchSmsLog();
  }, [UrlHelper.getSearchParamsObject()?.selectedCustomer]);

  useEffect(() => {
    if (!isDrawerOpen) {
      setSmsLogData(null);
    }
  }, [UrlHelper.getSearchParamsObject()?.selectedCustomer]);
  // Search
  const [searchFields, setSearchFields] = useState({});
  const onChangeSearch = (value, fieldName) => {
    setSearchFields((prev) => ({ ...prev, [fieldName]: value }));
  };
  // Filter
  const [filterField, setFilterField] = useState({});
  const onChangeFilter = (value, fieldName) => {
    setFilterField((prev) => ({ ...prev, [fieldName]: value }));
  };

  const onSearch = () => {
    handleFetchSmsLog(searchFields);
  };

  useEffect(() => {
    const constArray = constSmsLogData.current;
    const dateSelected = filterField?.date ? filterField.date : null;
    let filtedData = constArray;
    if (dateSelected) {
      filtedData = constArray?.filter((el) => {
        const isBetween = moment(el.createdDate).isBetween(dateSelected.startDate, dateSelected.endDate, null, '[]');
        return isBetween;
      });
    }
    setSmsLogData(filtedData);
  }, [filterField]);

  return (
    <div className="section-block">
      <p className="cl-red flex items-center gap-10">
        <strong className="required"></strong> <span>Data lấy trong 7 ngày gần nhất</span>{' '}
        <Tooltip title="Click to refresh data">
          <Icons.RotateRight
            onClick={handleFetchSmsLog}
            style={{
              fontSize: '18px',
              cursor: 'pointer',
              color: 'var(--primary-color)',
              marginRight: '10px',
            }}
          />
        </Tooltip>
      </p>
      {/* <Row gutter={[16, 0]}>
        <SmsHistorySearchActions onChange={onChangeSearch} />
        <Col span={6} style={{ alignSelf: 'end' }}>
          <Button className="btn-danger" onClick={onSearch}>
            Search
          </Button>
        </Col>
      </Row> */}
      <hr />
      <p style={{ opacity: 0.7 }}>Filter</p>
      <label htmlFor="">Send date</label>
      <SmsHistoryFilterActions onChange={onChangeFilter} />
      <MainTable
        scroll={{
          y: '79vh',
        }}
        // pagination={false}
        className=" w-fit mt-15"
        columns={FormField.CustomerServiceSMSLog.columns()}
        dataSource={smsLogData}
      />
    </div>
  );
};

export default SmsHistory;
