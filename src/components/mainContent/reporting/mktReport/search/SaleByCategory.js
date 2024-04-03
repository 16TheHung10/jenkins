//Plugin
import Moment from 'moment';
import React, { useEffect, useState } from 'react';

import TableSalesByCategory from 'components/mainContent/reporting/mktReport/table/TableSalesByCategory';

import { FileExcelOutlined, FileSearchOutlined, FilterOutlined } from '@ant-design/icons';
import { Col, Row, Space, Tag, message } from 'antd';
import { handleExportAutoField } from 'helpers/ExportHelper';
import { fetchData } from 'helpers/FetchData';
import ModelGroupDate from 'modelComponent/ModelGroupDate';
import ModelGroupStore from 'modelComponent/ModelGroupStore';
import ModelExportDataMultiple from 'modelComponent/export/ModelExportDataMultipleFix';

export default function SaleByCategory() {
  const [isOpenDrawerExport, setIsOpenDrawerExport] = useState(false);
  const [storeOpt, setStoreOpt] = useState([]);

  useEffect(() => {
    if (groupStore === '') {
      if (storeOpt?.length > 0) {
        let foundObject = null;

        for (let i = 0; i < storeOpt.length; i++) {
          const item = storeOpt[i];
          if (item.value.startsWith('VN')) {
            foundObject = item;
            break;
          }
        }

        if (foundObject) {
          setGroupStore(foundObject.value);
        }
      }
    }
  }, [storeOpt]);

  const [groupStore, setGroupStore] = useState('');

  const [dateModel, setDateModel] = useState('date');
  const [groupDate, setGroupDate] = useState(Moment().subtract(1, 'days'));

  const [resultSbc, setResultSbc] = useState([]);
  const [isFilter, setIsFilter] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleIsShowFilter = () => {
    setIsFilter(!isFilter);
  };

  const handleIsLoading = () => {
    setIsLoading(true);
    setIsSearch(true);
    setResultSbc([]);
  };

  const handleSearchSalesbyCategory = async () => {
    let storeCode = groupStore;

    if (groupDate.format('YYYY-MM-DD') === Moment().format('YYYY-MM-DD')) {
      message.warning({ key: 'search', content: 'Vui lòng không chọn ngày hiện tại.' });
      return false;
    }

    let start = groupDate;
    let date = groupDate;

    if (dateModel === 'week') {
      start = groupDate.clone().startOf('week');
      date =
        groupDate.week() == Moment().week() && groupDate.year() >= Moment().year()
          ? Moment().subtract(1, 'days')
          : groupDate.clone().endOf('week');
    } else if (dateModel === 'month') {
      start = groupDate.clone().startOf('month');
      date =
        groupDate.month() == Moment().month() && groupDate.year() >= Moment().year()
          ? Moment().subtract(1, 'days')
          : groupDate.clone().endOf('month');
    } else {
      start = groupDate;
      date = groupDate;
    }

    const formatDate = 'YYYY-MM-DD';

    let params = {
      start: start?.format(formatDate) === date?.format(formatDate) ? '' : start?.format(formatDate),
      date: date?.format(formatDate),
    };

    try {
      if (isSearch === true) {
        message.warning({ key: 'search', content: 'Please await' });
        return false;
      }

      handleIsLoading();

      // let page = "/realtimesale/store/transaction/item"
      // model.getAllReviewSale(page, params)

      const url = storeCode !== '' ? `/storesale/${storeCode}/item/top/daily` : `/sale/store/item/top/daily`;
      const response = await fetchData(url, 'GET', params, null, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);
      if (response?.status) {
        let result = response?.data?.sale ?? [];
        setResultSbc(result.filter((el) => el.itemQty !== 0) ?? []);
      } else {
        message.error(response?.message);
      }
    } catch (error) {
      console.log('Error fetching data: ', error);
    } finally {
      setIsLoading(false);
      setIsSearch(false);
    }
  };

  return (
    <>
      <Row gutter={16}>
        <Col xl={24}>
          <div className="section-block">
            <Row gutter={16}>
              <Col xl={6}>
                <ModelGroupStore
                  // groupStore={groupStore}
                  setGroupStore={setGroupStore}
                  allowClear={true}
                  // setStoreOpt={setStoreOpt}
                  // mode='multiple'
                  // maxChoose={5}
                />
              </Col>
              <Col xl={6}>
                {/* <label className="w100pc">Date: </label> */}
                <ModelGroupDate
                  groupDate={groupDate}
                  setGroupDate={setGroupDate}
                  dateModel={dateModel}
                  setDateModel={setDateModel}
                  isCurrentDate={false}
                  // isLabel={false}
                  // isMonth={false}
                  // isWeek={false}
                />
              </Col>
            </Row>
            <Row gutter={16} className="mrt-10">
              <Col xl={6}>
                <Space size={'small'}>
                  <Tag className="h-30 icon-search" onClick={handleSearchSalesbyCategory}>
                    <FileSearchOutlined /> <span className="icon-search-detail">Search</span>
                  </Tag>
                  <Tag
                    icon={<FileExcelOutlined />}
                    className="h-30 icon-excel"
                    onClick={() => handleExportAutoField(resultSbc, 'salebycategory', ['sumQty'])}
                  >
                    <span className="icon-excel-detail">Export</span>
                  </Tag>
                  <Tag
                    icon={<FileExcelOutlined />}
                    className="h-30 icon-excel"
                    onClick={() => setIsOpenDrawerExport(true)}
                  >
                    <span className="icon-excel-detail">Export multi</span>
                  </Tag>
                  <Tag onClick={handleIsShowFilter} className="h-30 icon-orange">
                    <FilterOutlined />
                  </Tag>
                </Space>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xl={24}>
          <TableSalesByCategory data={resultSbc} isFilter={isFilter} isLoading={isLoading} />
        </Col>
      </Row>

      <ModelExportDataMultiple
        type="saleitem"
        isOpenDrawerExport={isOpenDrawerExport}
        updateIsOpen={setIsOpenDrawerExport}
      />
    </>
  );
}
