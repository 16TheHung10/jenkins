import { FileExcelOutlined, FileSearchOutlined, FilterOutlined, LinkOutlined, ShopOutlined } from '@ant-design/icons';
import { Col, DatePicker, Row, Tag, message } from 'antd';
import DateHelper from 'helpers/DateHelper';
import { handleExportAutoField } from 'helpers/ExportHelper';
import { fetchData, fetchReport } from 'helpers/FetchData';
import { cloneDeep, createDataTable, createListOption } from 'helpers/FuncHelper';
import StringHelper from 'helpers/StringHelper';
import moment from 'moment';
import React, { useCallback, useContext, useState } from 'react';
import SelectboxAndCheckbox from 'utils/selectboxAndCheckbox';
import TableCustom from 'utils/tableCustom';
import DrawerComp from 'utils/drawer';
import { DataContext } from 'contexts/DataContext';
import ModelGroupDate from 'modelComponent/ModelGroupDate';

export default function MktPromotion() {
  const { data } = useContext(DataContext);
  const { stores } = data;

  const [isLoading, setIsLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const [groupDate, setGroupDate] = useState(moment().clone().subtract(1, 'days'));
  const [dateModel, setDateModel] = useState('month');

  const [itemCodeOpt, setItemCodeOpt] = useState([]);
  const [itemTypeOpt, setItemTypeOpt] = useState([]);
  const [promotionTypeOpt, setPromotionTypeOpt] = useState([]);
  const [promotionCodeOpt, setPromotionCodeOpt] = useState([]);
  const [docLinkOpt, setDocLinkOpt] = useState([{ value: '1', label: 'Item with doc link' }]);
  const [docCodeOpt, setDocCodeOpt] = useState([{ value: '1', label: 'Item with doc code' }]);
  const [couponCodeOpt, setCouponCodeOpt] = useState([]);

  const [code, setCode] = useState('Store apply');
  const [itemChoose, setItemChoose] = useState({});

  const returnLink = (val, key, item) => {
    return (
      <>
        {item.docCode !== null && item.docCode !== '' ? item.docCode : null}{' '}
        {item.docLink !== null && item.docLink !== '' ? (
          <LinkOutlined style={{ color: 'blue' }} onClick={() => window.open(item.docLink, '_blank')} />
        ) : null}
      </>
    );
  };

  const renderPromotionType = (val, key, item) => {
    if (item.promotionType == 'itemdiscount') {
      return <Tag color="cyan">Item discount</Tag>;
    } else if (item.promotionType == 'buygift') {
      return <Tag color="purple">Buy gift</Tag>;
    } else if (item.promotionType == 'billdiscount') {
      return <Tag color="orange">Bill discount</Tag>;
    } else if (item.promotionType == 'mixmatch') {
      return <Tag color="volcano">Mix match</Tag>;
    } else {
      return <Tag color="magenta">{item.promotionType}</Tag>;
    }
  };

  const renderPromoCode = (val, key, item) => {
    return (
      <>
        {item.promotionCode}
        {item.couponCode}
      </>
    );
  };

  const renderDrawer = () => {
    return (
      <DrawerComp
        width={350}
        title={`${code} Store apply`}
        isOpen={isOpenDrawer}
        keyFilter={'isOpenDrawer'}
        updateFilter={(val) => setIsOpenDrawer(val)}
      >
        {itemChoose?.storeApply !== null &&
          itemChoose?.storeApply?.split(',')?.map((el, index) => (
            <div style={{ margin: 5 }}>
              <Tag color="blue" key={index}>{`${el} - ${stores[el]?.storeName}`}</Tag>
            </div>
          ))}
      </DrawerComp>
    );
  };

  const handleShowDrawer = (item) => {
    setIsOpenDrawer(true);
    let code = '';
    if (item.couponCode !== null && item.couponCode !== '') {
      code = item.couponCode;
    } else {
      code = item.promotionCode;
    }

    setCode(code);
    setItemChoose(item);
  };

  const renderListStore = (val, key, item) => {
    return item.storeApply !== null ? (
      <Tag color="warning" onClick={() => handleShowDrawer(item)} className="cursor">
        <ShopOutlined />
      </Tag>
    ) : null;
  };

  const [columns, setColumns] = useState([
    {
      field: 'promotionCode',
      label: 'Code',
      classHead: 'fs-10',
      classBody: 'fs-10',
      formatBody: renderPromoCode,
      isSort: true,
      keySort: 'promotionCode',
    },
    { field: 'promotionGroupCode', label: 'Group', classHead: 'fs-10', classBody: 'fs-10' },
    { field: 'description', label: 'Promotion name', classHead: 'fs-10', classBody: 'fs-10' },
    {
      field: 'promotionType',
      label: 'Promotion type',
      classHead: 'fs-10',
      classBody: 'fs-10',
      formatBody: renderPromotionType,
    },
    {
      field: 'startDate',
      label: 'Start date',
      classHead: 'fs-10 text-right',
      classBody: 'fs-10 text-right',
      styleBody: { minWidth: 75 },
      formatBody: (val) => DateHelper.displayDateNo7(val),
      isSort: true,
      keySort: 'startDate',
    },
    {
      field: 'endDate',
      label: 'End date',
      classHead: 'fs-10 text-right',
      classBody: 'fs-10 text-right',
      styleBody: { minWidth: 75 },
      formatBody: (val) => DateHelper.displayDateNo7(val),
      isSort: true,
      keySort: 'endDate',
    },
    {
      field: 'barcode',
      label: 'Item',
      classHead: 'fs-10',
      classBody: 'fs-10',
      colSpendHead: 2,
      isSort: true,
      keySort: 'itemName',
    },
    {
      field: 'itemName',
      label: '',
      classHead: 'fs-10',
      classBody: 'fs-10',
      colSpendHead: 0,
      styleBody: { maxWidth: 120 },
      isTooltip: true,
    },
    {
      field: 'itemQty',
      label: 'Item qty',
      classHead: 'fs-10 text-right',
      classBody: 'fs-10 text-right',
      styleBody: { minWidth: 65 },
      formatBody: (val) => StringHelper.formatValue(val),
      isSort: true,
      keySort: 'itemQty',
    },
    { field: 'itemPromotionType', label: 'Item type', classHead: 'fs-10', classBody: 'fs-10' },
    {
      field: 'promotionDiscountRate',
      label: 'Discount rate',
      classHead: 'fs-10 text-right',
      classBody: 'fs-10 text-right',
      styleBody: { minWidth: 55 },
      isSort: true,
      keySort: 'promotionDiscountRate',
    },
    {
      field: 'discountAmount',
      label: 'Discount amount',
      classHead: 'fs-10 text-right',
      classBody: 'fs-10 text-right',
      styleBody: { minWidth: 55 },
      formatBody: (val) => StringHelper.formatValue(val),
      isSort: true,
      keySort: 'discountAmount',
    },
    {
      field: 'active',
      label: 'Status',
      classHead: 'fs-10',
      classBody: 'fs-10',
      formatBody: (val, key, item) => (
        <Tag color={item.active === 1 ? 'success' : 'warning'}>{item.active === 1 ? 'Active' : 'Inactive'}</Tag>
      ),
    },
    {
      field: 'docNote',
      label: 'Department of Industry and Trade',
      classHead: 'fs-10',
      classBody: 'fs-10',
      styleBody: { minWidth: 70 },
      formatBody: returnLink,
    },
    {
      field: 'docCode',
      label: 'Doc code',
      classHead: 'fs-10',
      classBody: 'fs-10',
      colSpanHead: 0,
      colSpanBody: 0,
      notShow: true,
    },
    {
      field: 'docLink',
      label: 'Doc link',
      classHead: 'fs-10',
      classBody: 'fs-10',
      colSpanHead: 0,
      colSpanBody: 0,
      notShow: true,
    },
    {
      field: 'couponCode',
      label: 'Coupon code',
      classHead: 'fs-10',
      classBody: 'fs-10',
      colSpanHead: 0,
      colSpanBody: 0,
      notShow: true,
    },
    {
      field: 'value',
      label: 'Value',
      classHead: 'fs-10 text-right',
      classBody: 'fs-10 text-right',
      styleBody: { minWidth: 75 },
      isSort: true,
      keySort: 'value',
      formatBody: (val) => StringHelper.formatValue(val),
    },
    {
      field: 'billConditionValue',
      label: 'Bill condition value',
      classHead: 'fs-10 text-right',
      classBody: 'fs-10 text-right',
      styleBody: { minWidth: 75 },
      isSort: true,
      keySort: 'billConditionValue',
      formatBody: (val) => StringHelper.formatValue(val),
    },
    { field: 'storeApply', label: 'Store apply', classHead: 'fs-10', classBody: 'fs-10', formatBody: renderListStore },
  ]);
  const [dataT, setDataT] = useState([]);
  const [dataExport, setDataExport] = useState([]);
  // const [date, setDate] = useState(moment(new Date(), 'MM/YYYY'));

  const [itemCode, setItemCode] = useState('');
  const [itemType, setItemType] = useState('');
  const [promotionType, setPromotionType] = useState('');
  const [promotionCode, setPromotionCode] = useState('');
  const [docLink, setDocLink] = useState('');
  const [docCode, setDocCode] = useState('');
  const [couponCode, setCouponCode] = useState('');

  const handleLoading = () => {
    setDataT([]);
    setDataExport([]);
    setIsLoading(true);
    setItemCode('');
    setItemType('');
    setPromotionType('');
    setPromotionCode('');
    setDocLink('');
    setDocCode('');
    setCouponCode('');
  };

  const handleSearch = async () => {
    let start = groupDate;
    let date = groupDate;

    if (groupDate.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
      message.warning({ key: 'search', content: 'Vui lòng không chọn ngày hiện tại.' });
      return false;
    }

    if (dateModel === 'week') {
      start = groupDate.clone().startOf('week');
      date =
        groupDate.week() == moment().week() && groupDate.year() >= moment().year()
          ? moment().subtract(1, 'days')
          : groupDate.clone().endOf('week');
    } else if (dateModel === 'month') {
      start = groupDate.clone().startOf('month');
      date =
        groupDate.month() == moment().month() && groupDate.year() >= moment().year()
          ? moment().subtract(1, 'days')
          : groupDate.clone().endOf('month');
    } else {
      start = groupDate;
      date = groupDate;
    }

    const formatDate = 'YYYY-MM-DD';

    if (groupDate.month() > moment().month() && groupDate.year() >= moment().year()) {
      message.warning('There is no data available for this month');
      return false;
    }

    try {
      handleLoading();

      const params = {
        start: start?.format(formatDate) === date?.format(formatDate) ? '' : start?.format(formatDate),
        date: date?.format(formatDate),
      };

      const url = `/promotion/infor`;
      const response = await fetchReport(url, 'GET', params);
      if (response?.status) {
        if (response?.data?.promotion?.length == 0) {
          message.warning('Data not found');
        }
        let results = response.data.promotion;
        setDataT(results);
        setDataExport(results);

        const listMapType = [
          { itemdiscount: 'Item discount' },
          { buygift: 'Buy gift' },
          { billdiscount: 'Bill discount' },
          { mixmatch: 'Mix match' },
        ];

        const optPromotionType = createListOption(results, 'promotionType')?.map((item) => {
          let target = listMapType?.find((el) => Object.keys(el) == item.value);

          if (target) {
            item.label = target[item.value];
          }
          return item;
        });

        const optItem = createListOption(results, 'barcode', 'itemName');
        const optItemType = createListOption(results, 'itemPromotionType');
        const optPromotionCode = createListOption(results, 'promotionCode');
        const optCouponCode = createListOption(results, 'couponCode');

        setItemCodeOpt(optItem);
        setItemTypeOpt(optItemType);
        setPromotionTypeOpt(optPromotionType);
        setPromotionCodeOpt(optPromotionCode);
        setCouponCodeOpt(optCouponCode);
      } else {
        message.error(response?.message);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    let data = handleFilter(dataExport);
    handleExportAutoField(data, 'exportListPromotion');
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
    newList = docLink == '1' ? newList.filter((el) => el.docLink !== '' && el.docLink != null) : newList;
    newList = docCode == '1' ? newList.filter((el) => el.docCode !== '' && el.docCode != null) : newList;

    // setData(newList)
    return newList;
  };

  // const onChangeMonth = (date, dateString) => {
  //     setDate(moment(date), 'MM/YYYY')
  // }

  const renderFilter = useCallback(() => {
    return (
      <>
        {isFilter && (
          <>
            <Row gutter={[16, 16]} className="mrt-10">
              <Col xl={6}>
                <label htmlFor="itemCode" className="w100pc">
                  Item:
                  <SelectboxAndCheckbox
                    data={itemCodeOpt}
                    funcCallback={(val) => setItemCode(val)}
                    keyField={'itemCode'}
                    defaultValue={itemCode}
                    isMode={''}
                  />
                </label>
              </Col>
              <Col xl={6}>
                <label htmlFor="itemType" className="w100pc">
                  Item type:
                  <SelectboxAndCheckbox
                    data={itemTypeOpt}
                    funcCallback={(val) => setItemType(val)}
                    keyField={'itemType'}
                    defaultValue={itemType}
                    isMode={''}
                  />
                </label>
              </Col>
              <Col xl={6}>
                <label htmlFor="promotionType" className="w100pc">
                  Promotion type:
                  <SelectboxAndCheckbox
                    data={promotionTypeOpt}
                    funcCallback={(val) => setPromotionType(val)}
                    keyField={'promotionType'}
                    defaultValue={promotionType}
                    isMode={''}
                  />
                </label>
              </Col>
              <Col xl={6}>
                <label htmlFor="promotionCode" className="w100pc">
                  Promotion code:
                  <SelectboxAndCheckbox
                    data={promotionCodeOpt}
                    funcCallback={(val) => setPromotionCode(val)}
                    keyField={'promotionCode'}
                    defaultValue={promotionCode}
                    isMode={''}
                  />
                </label>
              </Col>
              <Col xl={4}>
                <label htmlFor="docCode" className="w100pc">
                  Dept. of I&T:
                  <SelectboxAndCheckbox
                    data={docCodeOpt}
                    funcCallback={(val) => setDocCode(val)}
                    keyField={'docCode'}
                    defaultValue={docCode}
                    isMode={''}
                  />
                </label>
              </Col>
              <Col xl={4}>
                <label htmlFor="docLink" className="w100pc">
                  Share point folder:
                  <SelectboxAndCheckbox
                    data={docLinkOpt}
                    funcCallback={(val) => setDocLink(val)}
                    keyField={'docLink'}
                    defaultValue={docLink}
                    isMode={''}
                  />
                </label>
              </Col>
              <Col xl={6}>
                <label htmlFor="couponCode" className="w100pc">
                  Coupon code:
                  <SelectboxAndCheckbox
                    data={couponCodeOpt}
                    funcCallback={(val) => setCouponCode(val)}
                    keyField={'couponCode'}
                    defaultValue={couponCode}
                    isMode={''}
                  />
                </label>
              </Col>
            </Row>
          </>
        )}
      </>
    );
  }, [
    isFilter,
    itemCode,
    itemType,
    promotionType,
    promotionCode,
    docLink,
    docCode,
    couponCode,
    itemCodeOpt,
    itemTypeOpt,
    promotionTypeOpt,
    promotionCodeOpt,
    docLinkOpt,
    docCodeOpt,
    couponCodeOpt,
  ]);

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
                      <Row>
                        <Col xl={7}>
                          <ModelGroupDate
                            groupDate={groupDate}
                            setGroupDate={(val) => setGroupDate(val)}
                            dateModel={dateModel}
                            setDateModel={(val) => setDateModel(val)}
                            isWeek={false}
                            isDate={false}
                          />
                        </Col>
                      </Row>
                      <Row className="mrt-10">
                        <Col>
                          <Tag className="h-30 icon-search" onClick={handleSearch}>
                            <FileSearchOutlined /> <span className="icon-search-detail">Search</span>
                          </Tag>
                          <Tag icon={<FileExcelOutlined />} className="h-30 icon-excel" onClick={handleExport}>
                            <span className="icon-excel-detail">Export</span>
                          </Tag>
                          <Tag onClick={handleChangeShowHideFilter} className="h-30 icon-orange">
                            <FilterOutlined />
                          </Tag>
                        </Col>
                      </Row>

                      {renderFilter()}
                    </Col>
                    <Col xl={6}>
                      <Row>
                        <Col>
                          <div className="bg-note cl-red">
                            <strong>Lưu ý:</strong>
                            <br />- Promotion mới sẽ được đồng bộ qua ngày
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </>
    );
  }, [groupDate, isLoading, isFilter, itemCode, itemType, promotionCode, promotionType, couponCode, docLink, docCode]);

  const renderTable = useCallback(() => {
    let newData = handleFilter(dataT);
    const columnTable = columns || [];
    const dataTable = createDataTable(newData, columnTable);
    const objGroupByGroupCode = dataTable?.reduce((acc, item) => {
      (acc[item['promotionGroupCode']] = acc[item['promotionGroupCode']] || []).push(item);
      return acc;
    }, {});
    const dataGroupByGroupCode = Object.values(objGroupByGroupCode)?.reduce(
      (result, group) => result.concat(group),
      []
    );

    return (
      <>
        <Row gutter={16} className="mrt-10">
          <Col xl={24}>
            <TableCustom data={dataGroupByGroupCode} columns={columnTable} isLoading={isLoading} />
          </Col>
        </Row>
      </>
    );
  }, [
    dataT,
    itemCode,
    itemType,
    promotionCode,
    promotionType,
    couponCode,
    docLink,
    docCode,
    isOpenDrawer,
    code,
    isLoading,
  ]);

  return (
    <>
      {renderSearch()}
      {renderTable()}
      {renderDrawer()}
    </>
  );
}
