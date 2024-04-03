import { FileSearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Row, message } from 'antd';
import { DataContext } from 'contexts/DataContext';
import { fetchData } from 'helpers/FetchData';
import ModelGroupDate from 'modelComponent/ModelGroupDate';
import ModelGroupStore from 'modelComponent/ModelGroupStoreSales';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import DrawerComp from 'utils/drawer';

const { MonthPicker } = DatePicker;

export default function ModelExportDataMultiple({ ...props }) {
  const [groupStore, setGroupStore] = useState('');
  const [groupDate, setGroupDate] = useState(moment().subtract(1, 'days'));
  const [dateModel, setDateModel] = useState('week');

  const { data } = useContext(DataContext);
  const { storesales } = data;
  const [storeOpt, setStoreOpt] = useState([]);

  const [storeCode, setStoreCode] = useState('');
  const [date, setDate] = useState(moment(new Date(), 'MM/YYYY'));

  const [isOpenDrawerExport, setIsOpenDrawerExport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (props.isOpenDrawerExport) {
      setIsOpenDrawerExport(props.isOpenDrawerExport);
    }
  }, [props.isOpenDrawerExport]);

  useEffect(() => {
    if (props?.updateIsOpen) {
      props.updateIsOpen(isOpenDrawerExport);
    }
  }, [isOpenDrawerExport]);

  useEffect(() => {
    if (!!storesales) {
      let listStoreOpt = [];

      if (Object.keys(storesales)?.length === 0) {
        let storeCode = JSON.parse(localStorage.getItem('profile'))?.storeCode;
        let storeName = storeCode + ' - ' + JSON.parse(localStorage.getItem('profile'))?.storeName;

        listStoreOpt = [{ value: storeCode, label: storeName }];
      } else {
        listStoreOpt = Object.values(storesales)?.map((el) => ({
          value: el.storeCode,
          label: `${el.storeCode} - ${el.storeName}`,
          openedDate: el.openedDate,
        }));
      }

      setStoreOpt(listStoreOpt);
    }
  }, [storesales]);

  const onSearch = async () => {
    if (isLoading) {
      message.warning({ key: 'search', content: 'Please await...' });
      return false;
    }

    let storeCode = groupStore;
    let start = groupDate;
    let date = groupDate;

    if (storeCode === '' || storeCode?.length === 0 || storeCode[0] === '') {
      message.error('Please choose store to export');
      return false;
    }

    if (groupDate.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
      message.warning({ key: 'search', content: 'Vui lòng không chọn ngày hiện tại.' });
      return false;
    }

    if (dateModel === 'week') {
      start = groupDate.clone().startOf('week');
      date = groupDate.week() == moment().week() ? moment().subtract(1, 'days') : groupDate.clone().endOf('week');
    } else if (dateModel === 'month') {
      start = groupDate.clone().startOf('month');
      date = groupDate.month() == moment().month() ? moment().subtract(1, 'days') : groupDate.clone().endOf('month');
    } else {
      start = groupDate;
      date = groupDate;
    }

    const formatDate = 'YYYY-MM-DD';

    if (groupDate.month() > moment().month() && groupDate.year() > moment().year()) {
      message.warning('There is no data available for this month');
      return false;
    }
    setIsLoading(true);
    try {
      let params = {
        type: props?.type,
        method: 'email',
        start: start?.format(formatDate) === date?.format(formatDate) ? '' : start?.format(formatDate),
        date: date?.format(formatDate),
        storeCode: storeCode.toString(),
      };

      const url = `/Export`;
      const response = await fetchData(url, 'POST', params, null, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);

      if (response?.status) {
        // return response.data;
        message.success('File sent successfully, please check your mail ' + response.data?.receiver + ' in 15 minutes');
        setIsLoading(false);
      } else {
        setIsLoading(false);
        return null;
      }
    } catch (error) {
      console.log('Error fetching data: ', error);
      message.error('Unable to export file, please contact IT');
      setIsLoading(false);
      return null;
    }
  };

  const onChangeMonth = (date, dateString) => {
    setDate(moment(date), 'MM/YYYY');
  };

  const disabledDate = (current) => {
    const today = moment();

    if (current.isAfter(today, 'month')) {
      return true;
    }

    const yearDisable = moment('2023-01-01', 'YYYY-MM-DD');
    return current.isBefore(yearDisable, 'month');
  };

  const handleUpdateShowHide = (val) => {
    setIsOpenDrawerExport(val);
  };

  return (
    <div>
      <DrawerComp
        width={400}
        isOpen={isOpenDrawerExport}
        keyFilter={'isOpenDrawerExport'}
        updateFilter={(val) => handleUpdateShowHide(val)}
      >
        {/* <Row gutter={16}>
                    <Col xl={12}>
                        <label htmlFor="storeCode" className="w100pc">
                            Store:
                            <SelectboxAndCheckbox data={storeOpt} funcCallback={(val) => setStoreCode(val)} keyField={'storeCode'} defaultValue={''} isMode={'multiple'} />
                        </label>
                    </Col>
                    <Col xl={12} xxl={4}>
                        <label htmlFor="date" className="w100pc">
                            Date:
                            <div>
                                <MonthPicker className='w100pc' onChange={onChangeMonth} format={'MM/YYYY'} placeholder="Select month" defaultValue={date} allowClear={false} disabledDate={disabledDate} />
                            </div>
                        </label>
                    </Col>
                </Row> */}
        <Row gutter={[16, 16]}>
          <Col xl={24}>
            <ModelGroupStore
              // groupStore={groupStore}
              setGroupStore={setGroupStore}
              mode="multiple"
              // maxChoose={5}
            />
          </Col>
          <Col xl={24}>
            <ModelGroupDate
              groupDate={groupDate}
              setGroupDate={setGroupDate}
              dateModel={dateModel}
              setDateModel={setDateModel}
              isCurrentDate={false}
            />
          </Col>
        </Row>
        <Row gutter={16} className="mrt-10">
          <Col>
            {/* <Tag className="h-30 icon-search" onClick={onSearch}>
                            <FileSearchOutlined /> <span className="icon-search-detail">Send</span>
                        </Tag> */}
            <Button
              onClick={onSearch}
              style={{
                background: '#007cff',
                color: '#f6ffed',
                borderColor: '#b7eb8f',
                fontWeight: 'bold',
                fontSize: 10,
                padding: '2px 10px',
              }}
              loading={isLoading}
            >
              <FileSearchOutlined style={{ fontSize: 12 }} /> Send
            </Button>
          </Col>
        </Row>
      </DrawerComp>
    </div>
  );
}

{
  /* <ExportDataPopup type='detail/disposal' isOpenDrawerExport={this.isOpenDrawerExport} updateIsOpen={this.handleUpdateIsOpen}></ExportDataPopup> */
}
