import { FileSearchOutlined, GiftOutlined, LaptopOutlined } from '@ant-design/icons';
import { Col, DatePicker, Row, Tabs, Tag, message } from 'antd';
import DateHelper from 'helpers/DateHelper';
import { cloneDeep } from 'helpers/FuncHelper';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import InputComp from 'utils/input';
import SelectboxAndCheckbox from 'utils/selectboxAndCheckbox';
import { AuthApi } from '../../../../api/AuthApi';
import TableGamePromotion from './table/TableGamePromotion';
import TablePosPromotion from './table/TablePosPromotion';

const { MonthPicker } = DatePicker;

export default function CampaignPromotion() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [allItem, setAllItem] = useState([]);

  const [itemCodeOpt, setItemCodeOpt] = useState([]);
  const [itemTypeOpt, setItemTypeOpt] = useState([]);
  const [promotionTypeOpt, setPromotionTypeOpt] = useState([]);
  const [promotionCodeOpt, setPromotionCodeOpt] = useState([]);

  const [couponCodeOpt, setCouponCodeOpt] = useState([]);
  const [statusOpt, setStatusOpt] = useState([
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' },
  ]);

  useEffect(() => {
    handleGetAllItem();
  }, []);

  const handleGetAllItem = async () => {
    try {
      // return APIHelper.get("/item/all" + (storeCode ? "?storeCode=" + storeCode : ""), null,rootUrl,cacheAge);
      const url = `/item/all`;
      const response = await AuthApi.get(url);

      if (response?.status) {
        let result = Object.values(response.data?.items);
        setAllItem(result || []);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const [data, setData] = useState([]);
  // const [dataExport, setDataExport] = useState([]);
  const [date, setDate] = useState(moment(new Date(), 'MM/YYYY'));

  const [itemCode, setItemCode] = useState('');
  const [itemType, setItemType] = useState('');
  const [promotionType, setPromotionType] = useState('');
  const [promotionCode, setPromotionCode] = useState('');

  const [couponCode, setCouponCode] = useState('');

  const [status, setStatus] = useState('');
  const [campaignCode, setCampaignCode] = useState('');

  const handleLoading = () => {
    setData([]);
    // setDataExport([]);
    setIsLoading(true);
    setItemCode('');
    setItemType('');
    setPromotionType('');
    setPromotionCode('');
    setCouponCode('');
  };

  const handleSearch = async () => {
    let dateCur = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const firstDateOfMonth = new Date(dateCur.getFullYear(), dateCur.getMonth(), 1);
    const formattedCurrentDate = dateCur.toLocaleDateString(undefined, options);
    const formattedFirstDate = firstDateOfMonth.toLocaleDateString(undefined, options);

    try {
      handleLoading();

      const params = {
        // campaignCode: campaignCode,
        startDate: DateHelper.displayDateFormatMinus(formattedFirstDate),
        endDate: DateHelper.displayDateFormatMinus(formattedCurrentDate),
        // active: status,
      };

      const queryString = new URLSearchParams(params).toString();

      const url = `/campaign?${queryString}`;
      const response = await AuthApi.get(url);
      // console.log(response)
      if (response?.status) {
        if (response?.data?.length == 0) {
          message.warning('Data not found');
        }
        let results = response.data.campaigns;
        setData(results);
      } else {
        message.error(response?.message);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeShowHideFilter = () => {
    let newValue = !isFilter;
    setIsFilter(newValue);
  };

  const handleFilter = (arr) => {
    let newList = [];
    const oldList = cloneDeep(arr);

    newList = itemCode !== '' ? oldList.filter((el) => el.barcode === itemCode) : oldList;
    newList = itemType !== '' ? newList.filter((el) => el.itemPromotionType === itemType) : newList;
    newList = promotionCode !== '' ? newList.filter((el) => el.promotionCode === promotionCode) : newList;
    newList = promotionType !== '' ? newList.filter((el) => el.promotionType === promotionType) : newList;
    newList = couponCode !== '' ? newList.filter((el) => el.couponCode == couponCode) : newList;
    // setData(newList)
    return newList;
  };

  const onChangeMonth = (date, dateString) => {
    setDate(moment(date), 'MM/YYYY');
  };

  const renderFilter = useCallback(() => {
    return (
      <>
        {isFilter && (
          <>
            <Row gutter={[16, 16]} className="mrt-10">
              <Col xl={8}>
                <label htmlFor="promotionType" className="w100pc">
                  Promotion type:
                  <SelectboxAndCheckbox data={promotionTypeOpt} funcCallback={(val) => setPromotionType(val)} keyField={'promotionType'} defaultValue={promotionType} isMode={''} />
                </label>
              </Col>
              <Col xl={8}>
                <label htmlFor="promotionCode" className="w100pc">
                  Promotion code:
                  <SelectboxAndCheckbox data={promotionCodeOpt} funcCallback={(val) => setPromotionCode(val)} keyField={'promotionCode'} defaultValue={promotionCode} isMode={''} />
                </label>
              </Col>
              <Col xl={8}>
                <label htmlFor="status" className="w100pc">
                  Status:
                  <SelectboxAndCheckbox data={statusOpt} funcCallback={(val) => setStatus(val)} keyField={'status'} defaultValue={status} isMode={''} />
                </label>
              </Col>
              <Col xl={8}>
                <label htmlFor="campaignCode" className="w100pc">
                  Campaign code:
                  <InputComp func={(val) => setCampaignCode(val)} keyField="campaignCode" text={campaignCode} placeholder={''} />
                </label>
              </Col>
            </Row>
          </>
        )}
      </>
    );
  }, [isFilter, itemCode, itemType, promotionType, promotionCode, couponCode, itemCodeOpt, itemTypeOpt, promotionTypeOpt, promotionCodeOpt, couponCodeOpt]);

  const disabledDate = (current) => {
    const today = moment();

    if (current.isAfter(today, 'month')) {
      return true;
    }

    const yearDisable = moment('2023-01-01', 'YYYY-MM-DD');
    return current.isBefore(yearDisable, 'month');
  };

  const renderSearch = useCallback(() => {
    return (
      <>
        <Row gutter={16}>
          <Col xl={24}>
            <div className="section-block">
              <Row gutter={16}>
                <Col xl={24}>
                  <Row gutter={16}>
                    <Col xl={18}>
                      <Row gutter={16}>
                        <Col xl={6} xxl={4}>
                          <label htmlFor="date" className="w100pc">
                            Date:
                            <div>
                              <MonthPicker
                                className="w100pc"
                                onChange={onChangeMonth}
                                format={'MM/YYYY'}
                                placeholder="Select month"
                                defaultValue={date}
                                allowClear={false}
                                disabledDate={disabledDate}
                              />
                            </div>
                          </label>
                        </Col>
                      </Row>
                      <Row className="mrt-10">
                        <Col>
                          <Tag className="h-30 icon-search" onClick={handleSearch}>
                            <FileSearchOutlined /> <span className="icon-search-detail">Search</span>
                          </Tag>
                        </Col>
                      </Row>

                      {renderFilter()}
                    </Col>
                    <Col xl={6}></Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </>
    );
  }, [date, isLoading, isFilter, itemCode, itemType, promotionCode, promotionType, couponCode]);

  const renderTab = () => {
    const tabList = [
      {
        label: (
          <span>
            <LaptopOutlined />
            Campaign POS
          </span>
        ),
        key: '1',
        children: <TablePosPromotion data={data} isLoading={isLoading} allItem={allItem} />,
      },
      {
        label: (
          <span>
            <GiftOutlined />
            Campaign Game
          </span>
        ),
        key: '2',
        children: <TableGamePromotion data={data} allItem={allItem} />,
      },
    ];

    return (
      <div className="section-block mt-15">
        <Row gutter={16}>
          <Col xl={24}>
            <Tabs defaultActiveKey="1" items={tabList} />
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <>
      {renderSearch()}
      {renderTab()}
    </>
  );
}
