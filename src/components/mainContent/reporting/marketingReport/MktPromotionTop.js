import { FileExcelOutlined, FileSearchOutlined, FilterOutlined } from '@ant-design/icons';
import { Col, DatePicker, Row, Tag, message } from 'antd';
// import { DataContext } from "context/DataContext";
import DateHelper from 'helpers/DateHelper';
import { handleExportAutoField } from 'helpers/ExportHelper';
import { fetchData } from 'helpers/FetchData';
import { cloneDeep, createDataTable, createListOption } from 'helpers/FuncHelper';
import StringHelper from 'helpers/StringHelper';
import moment from 'moment';
import React, { useCallback, useContext, useState } from 'react';
import SelectboxAndCheckbox from 'utils/selectboxAndCheckbox';
import TableCustom from 'utils/tableCustom';
import { fnSum } from 'helpers/FuncHelper';

const { MonthPicker } = DatePicker;

export default function MktPromotionTop() {
  // const { data } = useContext(DataContext);
  // const { stores } = data;

  const [reportQty, setReportQty] = useState({
    itemdiscount: 0,
    buygift: 0,
    billdiscount: 0,
    mixmatch: 0,
  });

  const [reportValue, setReportValue] = useState({
    itemdiscount: 0,
    buygift: 0,
    billdiscount: 0,
    mixmatch: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const [promotionTypeOpt, setPromotionTypeOpt] = useState([]);
  const [promotionCodeOpt, setPromotionCodeOpt] = useState([]);

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
    { field: 'description', label: 'Promotion name', classHead: 'fs-10', classBody: 'fs-10' },
    {
      field: 'promotionType',
      label: 'Promotion type',
      classHead: 'fs-10',
      classBody: 'fs-10',
      formatBody: renderPromotionType,
    },
    {
      field: 'invoiceCount',
      label: 'Invoice',
      classHead: 'fs-10 text-right',
      classBody: 'fs-10 text-right',
      styleBody: { minWidth: 75 },
      isSort: true,
      keySort: 'value',
      formatBody: (val) => StringHelper.formatValue(val),
    },
    {
      field: 'itemQty',
      label: 'Item',
      classHead: 'fs-10 text-right',
      classBody: 'fs-10 text-right',
      styleBody: { minWidth: 65 },
      formatBody: (val) => StringHelper.formatValue(val),
      isSort: true,
      keySort: 'itemQty',
    },
    // { field: 'billGrossSales', label: 'Bill condition value', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', styleBody: { minWidth: 75 }, isSort: true, keySort: 'billConditionValue', formatBody: (val) => StringHelper.formatValue(val) },
  ]);
  const [dataT, setDataT] = useState([]);
  const [dataExport, setDataExport] = useState([]);
  const [date, setDate] = useState(moment(new Date(), 'MM/YYYY'));

  const [promotionType, setPromotionType] = useState('');
  const [promotionCode, setPromotionCode] = useState('');

  const handleLoading = () => {
    setDataT([]);
    setDataExport([]);
    setIsLoading(true);

    setPromotionType('');
    setPromotionCode('');
  };

  const handleSearch = async () => {
    let dateCur = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const firstDateOfMonth = new Date(dateCur.getFullYear(), dateCur.getMonth(), 1);
    const formattedCurrentDate = dateCur.toLocaleDateString(undefined, options);
    const formattedFirstDate = firstDateOfMonth.toLocaleDateString(undefined, options);
    dateCur.setMonth(dateCur.getMonth() + 1);
    dateCur.setDate(0);
    const lastDateOfMonth = dateCur.getDate();
    const lastMonth = dateCur.getMonth() + 1;
    const lastYear = dateCur.getFullYear();
    const formattedLastDateOfMonth = `${lastYear}-${lastMonth.toString().padStart(2, '0')}-${lastDateOfMonth
      .toString()
      .padStart(2, '0')}`;

    try {
      handleLoading();

      const params = {
        start: DateHelper.displayDateFormatMinus(formattedFirstDate),
        date: DateHelper.displayDateFormatMinus(formattedLastDateOfMonth),
      };

      const rootDomain = process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL;
      const url = `/promotion/promotioncode/summary`;
      const response = await fetchData(url, 'GET', params, null, rootDomain);
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

        const optPromotionCode = createListOption(results, 'promotionCode');

        const promotionTypeQtyTotals = {};
        const promotionTypeSaleTotals = {};

        results.forEach((item) => {
          const promotionType = item.promotionType;
          const itemQty = item.itemQty;
          const invoiceCount = item.invoiceCount;

          if (!promotionTypeQtyTotals[promotionType]) {
            promotionTypeQtyTotals[promotionType] = itemQty;
          } else {
            promotionTypeQtyTotals[promotionType] += itemQty;
          }

          if (!promotionTypeSaleTotals[promotionType]) {
            promotionTypeSaleTotals[promotionType] = invoiceCount;
          } else {
            promotionTypeSaleTotals[promotionType] += invoiceCount;
          }
        });

        setReportQty((prev) => ({ ...prev, ...promotionTypeQtyTotals }));
        setReportValue((prev) => ({ ...prev, ...promotionTypeSaleTotals }));
        setPromotionTypeOpt(optPromotionType);
        setPromotionCodeOpt(optPromotionCode);
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

    newList = promotionCode !== '' ? oldList.filter((el) => el.promotionCode === promotionCode) : oldList;
    newList = promotionType !== '' ? newList.filter((el) => el.promotionType === promotionType) : newList;

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
            </Row>
          </>
        )}
      </>
    );
  }, [isFilter, promotionType, promotionCode, promotionTypeOpt, promotionCodeOpt]);

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
                    <Col xl={16}>
                      <Row>
                        <Col xl={7}>
                          <label htmlFor="date" className="w100pc">
                            Date:
                            <div>
                              <MonthPicker
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
                    <Col xl={8}>
                      {/* <Row>
                                            <Col>
                                                <div className='bg-note cl-red'>
                                                    <strong>Lưu ý:</strong><br />
                                                    - Promotion mới sẽ được đồng bộ qua ngày
                                                </div>
                                            </Col>
                                        </Row> */}
                      <Row>
                        <Col>
                          {console.log({ reportQty, reportValue })}
                          <table className="table-hover d-block" style={{ width: 'auto', overflow: 'auto' }}>
                            <thead>
                              <tr>
                                <th className="fs-10 pd-5 bd-none rule-number"></th>
                                <th className="fs-10 pd-5 bd-none rule-number">Buy gift</th>
                                <th className="fs-10 pd-5 bd-none rule-number">Item discount</th>
                                <th className="fs-10 pd-5 bd-none rule-number">Bill discount</th>
                                <th className="fs-10 pd-5 bd-none rule-number">Mix match</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="fs-10 pd-5 bd-none rule-number">Item</td>
                                <td className="fs-10 pd-5 bd-none rule-number" style={{ background: 'ivory' }}>
                                  {StringHelper.formatValue(reportQty.buygift)}
                                </td>
                                <td className="fs-10 pd-5 bd-none rule-number" style={{ background: 'aliceblue' }}>
                                  {StringHelper.formatValue(reportQty.itemdiscount)}
                                </td>
                                <td className="fs-10 pd-5 bd-none rule-number" style={{ background: 'ivory' }}>
                                  {StringHelper.formatValue(reportQty.billdiscount)}
                                </td>
                                <td className="fs-10 pd-5 bd-none rule-number" style={{ background: 'aliceblue' }}>
                                  {StringHelper.formatValue(reportQty.mixmatch)}
                                </td>
                              </tr>
                              <tr>
                                <td className="fs-10 pd-5 bd-none rule-number">Invoice</td>
                                <td className="fs-10 pd-5 bd-none rule-number" style={{ background: 'ivory' }}>
                                  {StringHelper.formatValue(reportValue.buygift)}
                                </td>
                                <td className="fs-10 pd-5 bd-none rule-number" style={{ background: 'aliceblue' }}>
                                  {StringHelper.formatValue(reportValue.itemdiscount)}
                                </td>
                                <td className="fs-10 pd-5 bd-none rule-number" style={{ background: 'ivory' }}>
                                  {StringHelper.formatValue(reportValue.billdiscount)}
                                </td>
                                <td className="fs-10 pd-5 bd-none rule-number" style={{ background: 'aliceblue' }}>
                                  {StringHelper.formatValue(reportValue.mixmatch)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
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
  }, [date, isLoading, isFilter, promotionCode, promotionType]);

  const renderTable = useCallback(() => {
    let newData = handleFilter(dataT);
    const columnTable = columns || [];
    const dataTable = createDataTable(newData, columnTable)?.sort((a, b) =>
      a.invoiceCount >= b.invoiceCount ? -1 : 1
    );

    return (
      <>
        <Row gutter={16} className="mrt-10">
          <Col xl={24}>
            <TableCustom data={dataTable} columns={columnTable} isLoading={isLoading} />
          </Col>
        </Row>
      </>
    );
  }, [dataT, promotionCode, promotionType, isOpenDrawer, isLoading]);

  return (
    <>
      {renderSearch()}
      {renderTable()}
    </>
  );
}
