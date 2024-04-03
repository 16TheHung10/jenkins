import { FileExcelOutlined, FileSearchOutlined, FilterOutlined } from '@ant-design/icons';
import { Col, Row, Tag, message, Modal, Button, DatePicker } from 'antd';
import { fetchData } from 'helpers/FetchData';
import { createDataTable, decreaseDate, createListOption, cloneDeep } from 'helpers/FuncHelper';
import DateHelper from 'helpers/DateHelper';
import StringHelper from 'helpers/StringHelper';
import moment from 'moment';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import DatePickerComp from 'utils/datePicker';
import TableCustomComp from 'utils/tableCustom';
import SelectboxAndCheckbox from 'utils/selectboxAndCheckbox';
import { handleExportAutoField } from 'helpers/ExportHelper';
import { DataContext } from 'contexts/DataContext';
import AutocompleteBarcode from 'components/mainContent/reporting/selectCompSuggest';
import { AuthApi } from 'api/AuthApi';

const { MonthPicker } = DatePicker;

export default function StockMovement() {
  const { data } = useContext(DataContext);
  const { stores } = data;
  const [storeOpt, setStoreOpt] = useState([]);

  const [isFilter, setIsFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [dataTable, setDataTable] = useState([]);

  const [date, setDate] = useState(moment(new Date(), 'MM/YYYY'));

  // Option list
  const [itemsOpt, setItemsOpt] = useState([]);
  const [storeFilterOpt, setStoreFilterOpt] = useState([]);
  // const [itemCodeOpt, setItemCodeOpt] = useState([]);
  const [allItem, setAllItem] = useState([]);

  // value filter
  const [storeFilter, setStoreFilter] = useState('');
  const [storeCode, setStoreCode] = useState('');
  const [itemCode, setItemCode] = useState('');

  const [dataList, setDataList] = useState([]);

  const [errorIndexes, setErrorIndexes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [apiUrls, setApiUrls] = useState([]);
  const [errorMessages, setErrorMessages] = useState(Array(apiUrls.length).fill(null));

  const [isLoadingpp, setIsloadingpp] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const [isSearchMovement, setIsSearchMovement] = useState(false);
  const [isErrorMovement, setIsErrorMovement] = useState(0);
  const [lastInvMovement, setLastInvMovement] = useState('');
  const [curInvMovement, setCurInvMovement] = useState('');
  const [textNotifyMovement, setTextNotifyMovement] = useState('Stock are running and update to every day');

  useEffect(() => {
    handleCheckStatusInventory();
  }, []);

  useEffect(() => {
    handleGetAllItem();
  }, []);

  const handleGetAllItem = async () => {
    try {
      // return APIHelper.get("/item/all" + (storeCode ? "?storeCode=" + storeCode : ""), null,rootUrl,cacheAge);
      const url = `/item/stockmovement`;
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

  useEffect(() => {
    if (!!stores) {
      let listStoreOpt = [];

      if (Object.keys(stores)?.length === 0) {
        let storeCode = JSON.parse(localStorage.getItem('profile'))?.storeCode;
        let storeName = storeCode + ' - ' + JSON.parse(localStorage.getItem('profile'))?.storeName;

        listStoreOpt = [{ value: storeCode, label: storeName }];
      } else {
        listStoreOpt = Object.values(stores)?.map((el) => ({
          value: el.storeCode,
          label: `${el.storeCode} - ${el.storeName}`,
          openedDate: el.openedDate,
        }));
      }

      setStoreOpt(listStoreOpt);
    }
  }, [stores]);

  useEffect(() => {
    const list = dataList;
    const flattenedArray = list?.flatMap((subArr) => subArr?.map((obj) => ({ ...obj })));

    setDataTable(flattenedArray);
  }, [dataList]);

  useEffect(() => {
    // console.log({ errorIndexes: errorIndexes.length })
    if (errorIndexes.length === 0) {
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  }, [errorIndexes]);

  const handleLoading = () => {
    setIsLoading(true);
    setDataTable([]);
    setDataList([]);
  };

  const handleIsFilter = () => {
    setIsFilter(!isFilter);
  };

  const handleExport = (arr) => {
    const results = cloneDeep(arr);

    // const renderCloseStock = (val, key, item) => {
    //     let value = 0;

    //     value = parseFloat(item.openQty + item.receivingQty + item.internalReceivingQty) - parseFloat(item.saleQty + item.disposalQty + item.transferQty + item.storeUsedQty + item.returnQty + item.lostQty);

    //     return StringHelper.formatValue(value);
    // }

    const columns = [
      { field: 'itemCode', label: 'Item' },
      { field: 'itemName', label: '' },
      { field: 'dateKey', label: 'Date' },
      { field: 'openQty', label: 'Open stock' },
      { field: 'saleQty', label: 'Sales' },
      { field: 'receivingQty', label: 'RCV stock' },
      { field: 'internalReceivingQty', label: 'Internal RCV' },
      { field: 'transferQty', label: 'Transfer' },
      { field: 'disposalQty', label: 'Disposal' },
      { field: 'storeUsedQty', label: 'Store used' },
      { field: 'returnQty', label: 'Return' },
      { field: 'lostQty', label: 'Lost' },
      { field: 'stockBalanceQty', label: 'Stock balance' },
      // { field: 'closeStock', label: 'Close stock', },
    ];

    const dataExport = createDataTable(results, columns);

    for (let item of dataExport) {
      item.closeStock =
        parseFloat(item.openQty + item.receivingQty + item.internalReceivingQty) -
        parseFloat(
          item.saleQty + item.disposalQty + item.transferQty + item.storeUsedQty + item.returnQty + item.lostQty
        );
    }

    const typeCol = {
      dateKey: 'number',
      openQty: 'number',
      saleQty: 'number',
      receivingQty: 'number',
      internalReceivingQty: 'number',
      transferQty: 'number',
      disposalQty: 'number',
      storeUsedQty: 'number',
      returnQty: 'number',
      lostQty: 'number',
      stockBalanceQty: 'number',
      closeStock: 'number',
    };

    handleExportAutoField(dataExport, 'exportStockMovement', null, null, typeCol);
  };

  // Call api loop ---START
  const fetchDataList = async (listAllStore) => {
    handleLoading();

    try {
      const promiseList = listAllStore?.map((store, index) => callApiLoop(store, index));
      const results = await Promise.all(promiseList);
      const newDataList = [];
      const newErrorIndexes = [];
      await results.forEach((data, index) => {
        if (data !== null) {
          newDataList[index] = data;
        } else {
          newErrorIndexes.push(index);
        }
      });

      setDataList(newDataList);
      setErrorIndexes(newErrorIndexes);
    } catch (error) {
      console.error('Error promise data: ', error);
    } finally {
      setIsLoading(false);
      setIsSearch(false);
    }
  };

  const callApiLoop = async (store, index) => {
    try {
      let params = {
        date: DateHelper.displayDateFormatMinus(date),
        storeCode: store,
      };

      const url = `/sale/store/payment/movement`;
      const response = await fetchData(url, 'GET', params, null, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);

      if (response?.status) {
        return response.data.sale;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
      return null;
    }
  };

  const onSearch = () => {
    // if (isSearch === true) {
    //     message.warning('Please wait');
    //     return false;
    // }

    // setIsSearch(true);

    // if (storeCode === '') {
    //     let listAllStore = storeOpt?.map(el => el.value);
    //     // let listAllStore = ['VN0137', 'VN0001', 'VN0002', 'VN0003'];
    //     setApiUrls(listAllStore);

    //     fetchDataList(listAllStore);
    // }
    // else {
    //     handleSearch();
    // }

    handleSearch();
  };

  const handleRetry = async () => {
    const apiIndexToRetry = errorIndexes;
    if (apiIndexToRetry !== undefined) {
      setIsloadingpp(true);
      setRetrying(true);
      let listAllStore = apiUrls.filter((el, index) => errorIndexes.includes(index));
      // let listAllStore = ['VN0004', 'VN0005'];
      const promiseList = listAllStore?.map((store, index) => callApiLoop(store, index));
      const results = await Promise.all(promiseList);
      const oldDataList = cloneDeep(dataList);
      const newDataList = [];
      const newErrorIndexes = [];

      await results.forEach((data, index) => {
        if (data !== null) {
          newDataList[index] = data;
        } else {
          newErrorIndexes.push(index);
        }
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsloadingpp(false);
      setRetrying(false);
      setShowModal(false);

      const mergedArray = [...oldDataList, ...newDataList];
      setDataList(mergedArray);
      setErrorIndexes(newErrorIndexes);
    }
  };
  // Call api loop ---END

  const handleSearch = async (currentPage, currentPageSize) => {
    handleCheckStatusInventory(decreaseDate(1), handleGetStockMovement(currentPage, currentPageSize));
  };

  const handleCheckStatusInventory = async (valueDate, fn) => {
    try {
      const params = {
        date: DateHelper.displayDateFormatMinus(decreaseDate(1)) ?? '',
      };

      const url = `/inventory/storestatus/inventory/movement`;
      // const response = await fetchData(url, 'GET', params, null, 'https://api.gs25.com.vn:8091/ext');
      const response = await fetchData(url, 'GET', params, null, process.env.REACT_APP_INVENTORY_REPORT_ROOT_URL);

      if (response?.status && response?.data?.storeStatus) {
        if (fn) {
          fn();
        }

        if (response.message) {
          if (response.message !== '') {
            this.showAlert(response.message, 'error', false);
          }
        }
      } else {
        var elUpdating = document.getElementById('content-updating');
        elUpdating.classList.remove('d-none');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const handleGetStockMovement = async (currentPage, currentPageSize) => {
    // setIsErrorMovement(0);
    // setIsSearchMovement(false);

    let dateCur = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const firstDateOfMonth = new Date(dateCur.getFullYear(), dateCur.getMonth(), 1);
    const formattedCurrentDate = dateCur.toLocaleDateString(undefined, options);
    const formattedFirstDate = firstDateOfMonth.toLocaleDateString(undefined, options);

    if (storeCode === '') {
      message.error('Please choose store');
      return false;
    }

    let params = {
      storeCode: storeCode,
      startDate: DateHelper.displayDateFormatMinus(formattedFirstDate),
      endDate: DateHelper.displayDateFormatMinus(formattedCurrentDate),
    };

    if (currentPage && typeof currentPage == 'number') {
      params.page = currentPage;
      setPage(currentPage);
    }

    if (!isNaN(currentPageSize)) {
      params.pageSize = currentPageSize;
      setPageSize(currentPageSize);
    }

    try {
      if (isSearch === true) {
        message.warning('Please wait');
        return false;
      }

      setIsSearch(true);
      handleLoading();

      const url = `/inventory/stockitem/summary`;
      const response = await AuthApi.get(url, params, null, process.env.REACT_APP_REPORT_ROOT_URL);
      if (response?.status) {
        // setDataTable(response.data);
        // const listItemOpt = createListOption(response.data.sale, 'code', 'name');
        // setItemsOpt(listItemOpt);

        const resultArray = generateDataArray(response.data);
        setDataTable(resultArray);
        if (response.data?.length === 0) {
          message.warning('Data not found');
        }
      } else {
        message.error(response?.message || 'Error fetching data');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setIsLoading(false);
      setIsSearch(false);
      // setIsSearchMovement(true);
    }

    // try {
    //     const url = `/reporting/stockmovement`;
    //     // const response = await fetchData(url, 'GET', date, null, process.env.REACT_APP_REPORT_ROOT_URL);
    //     const response = await fetchData(url, 'GET', params);
    //     console.log(response)
    //     if (response?.status) {
    //         setIsSearchMovement(true);
    //     }
    // } catch (error) {
    //     console.error('Error fetching data: ', error);
    // }

    // let model = new ReportingModel();
    // await model.getStockMovement(params).then(res => {
    //     if (res.status && res.data) {
    //         this.itemsStockMovement = res.data.stock;
    //         res.data.invFail && (this.fieldSelected.isErrorMovement = res.data.invFail);
    //         res.data.lastInv && (this.fieldSelected.lastInvMovement = res.data.lastInv);
    //         res.data.curInv && (this.fieldSelected.curInvMovement = res.data.curInv);

    //         this.fieldSelected.isSearchMovement = true;
    //     }
    //     else {
    //         // this.showAlert("System busy!");
    //     }
    // });

    // this.refresh();
  };

  const generateDataArray = (dataArray) => {
    const dateChoose = new Date(date);
    const currentYear = dateChoose.getFullYear();
    const currentMonth = dateChoose.getMonth() + 1;

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);

    const { itemCode, itemName } = dataArray[0];
    let resultArray = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentYear}${currentMonth.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;

      const newData = {
        itemCode,
        itemName,
        dateKey: parseInt(dateString),
        openQty: 0,
        receivingQty: 0,
        internalReceivingQty: 0,
        saleQty: 0,
        disposalQty: 0,
        transferQty: 0,
        storeUsedQty: 0,
        returnQty: 0,
        lostQty: 0,
        closeStock: 0,
      };

      resultArray.push(newData);
    }

    const dataMap = new Map();

    for (const item of resultArray) {
      const dateKey = item.dateKey;
      dataMap.set(dateKey, { ...item });
    }

    for (const item of dataArray) {
      const dateKey = item.dateKey;
      if (dataMap.has(dateKey)) {
        const existingItem = dataMap.get(dateKey);
        // console.log(existingItem)
        dataMap.set(dateKey, { ...existingItem, ...item });
      }
    }

    let combinedArray = Array.from(dataMap.values());

    let foundFirstOpenQty = false;
    let previousCloseStock = 0;

    for (const obj of combinedArray) {
      if (!foundFirstOpenQty) {
        previousCloseStock =
          obj.openQty +
          obj.receivingQty +
          obj.internalReceivingQty -
          (obj.saleQty + obj.disposalQty + obj.transferQty + obj.storeUsedQty + obj.returnQty + obj.lostQty);

        obj.closeStock = previousCloseStock;
      }

      if (foundFirstOpenQty) {
        if (obj.openQty == 0) {
          obj.openQty = previousCloseStock;
        }
        obj.closeStock =
          obj.openQty +
          obj.receivingQty +
          obj.internalReceivingQty -
          (obj.saleQty + obj.disposalQty + obj.transferQty + obj.storeUsedQty + obj.returnQty + obj.lostQty);
        previousCloseStock = obj.closeStock;
      }
      if (!foundFirstOpenQty) {
        foundFirstOpenQty = true;
      }
    }

    // console.log({ daysInMonth, dataArray, resultArray, combinedArray })

    return combinedArray;
  };

  const getDaysInMonth = (year, month) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    if (currentYear === year && currentMonth === month) {
      const day = currentDate.getDate();
      return day;
    } else {
      return new Date(year, month, 0).getDate();
    }
  };

  // const existingData = dataArray.find(item => item.dateKey == dateString);

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

  const searchComp = () => {
    return (
      <>
        <Row gutter={16}>
          <Col xl={24}>
            <div className="section-block">
              <Row gutter={16}>
                <Col xl={18}>
                  <Row gutter={[16, 8]}>
                    <Col xl={6}>
                      <label htmlFor="storeCode" className="w100pc">
                        Store:
                        <SelectboxAndCheckbox
                          data={storeOpt}
                          funcCallback={(val) => setStoreCode(val)}
                          keyField={'storeCode'}
                          defaultValue={''}
                          isMode={''}
                        />
                      </label>
                    </Col>
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

                    {/* <Col xl={6} xxl={4}>
                                        <label htmlFor="itemCode" className="w100pc">
                                            Barcode - Item name:
                                            <AutocompleteBarcode
                                                barCodes={allItem}
                                                updateFilter={(val, key) => setItemCode(val)}
                                            />
                                        </label>
                                    </Col> */}
                  </Row>

                  <Row gutter={16} className="mrt-10">
                    <Col>
                      {/* <Tag className="h-30 icon-search" onClick={handleSearch}> */}
                      <Tag className="h-30 icon-search" onClick={onSearch}>
                        <FileSearchOutlined /> <span className="icon-search-detail">Search</span>
                      </Tag>
                      {dataTable?.length > 0 && (
                        <>
                          <Tag
                            icon={<FileExcelOutlined />}
                            className="h-30 icon-excel"
                            onClick={() => handleExport(dataTable)}
                          >
                            <span className="icon-excel-detail">Export</span>
                          </Tag>
                          {/* <Tag
                                                    onClick={handleIsFilter}
                                                    className="h-30 icon-orange"
                                                >
                                                    <FilterOutlined />
                                                </Tag> */}
                        </>
                      )}
                    </Col>
                  </Row>

                  {/* {
                                    isFilter &&
                                    <Row gutter={16} className='mrt-5'>
                                        <Col xl={6}>
                                            <label htmlFor="storeCode" className="w100pc">
                                                Store:
                                                <SelectboxAndCheckbox data={storeFilterOpt} funcCallback={(val) => setStoreFilter(val)} keyField={'storeFilter'} defaultValue={''} isMode={''} />
                                            </label>
                                        </Col>
                                        <Col xl={6}>
                                            <label htmlFor="itemCode" className="w100pc">
                                                Items:
                                                <SelectboxAndCheckbox data={itemsOpt} func={(val) => setItemCode(val)} keyField={'itemCode'} value={itemCode} isMode={''} />
                                            </label>
                                        </Col>
                                    </Row>
                                } */}
                </Col>
                <Col xl={6}>
                  <div className="cl-red bg-note">
                    {isSearchMovement &&
                      (isErrorMovement === 1 ? (
                        <>
                          <span>
                            Last inventory: {DateHelper.displayDate(new Date(lastInvMovement))} inventory not update,
                            please wait process running{' '}
                          </span>
                          <br />{' '}
                        </>
                      ) : (
                        <>
                          <span style={{ color: 'green', fontWeight: 'bold' }}>
                            Current inventory: {DateHelper.displayDate(new Date(curInvMovement))} inventory updated{' '}
                          </span>
                          <br />
                        </>
                      ))}

                    {textNotifyMovement}
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </>
    );
  };

  const handleFilter = (arr) => {
    let dataClone = cloneDeep(arr);
    let newList = [];

    // newList = storeFilter !== '' ? dataClone?.filter(el => el.storeCode === storeFilter) : dataClone;
    // newList = itemCode !== '' ? newList?.filter(el => el.code === itemCode) : newList;

    newList = dataClone;

    return newList;
  };

  const tableComp = useCallback(() => {
    const list = handleFilter(dataTable);

    // const columns = [
    //     { field: 'storeCode', label: 'Store', classHead: 'fs-10', classBody: 'fs-10', colSpanHead: 2, rowSpanHead: 2, isSort: true, keySort: 'storeCode' },
    //     { field: 'storeName', label: '', classHead: 'fs-10', classBody: 'fs-10', colSpanHead: 0 },
    //     { field: 'transactionID', label: 'Transaction ID', classHead: 'fs-10', classBody: 'fs-10', rowSpanHead: 2, styleHead: { minWidth: 100 } },
    //     { field: 'counterCode', label: 'Counter code', classHead: 'fs-10', classBody: 'fs-10', rowSpanHead: 2, isSort: true, keySort: 'counterCode' },

    //     {
    //         field: '', label: 'Bill', classHead: 'fs-10 border-none text-center', styleHead: {}, colSpanHead: 3, classBody: 'fs-10', styleBody: {}, children: [
    //             { field: 'billDiscount', label: 'Discount', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', styleHead: { border: 'none', borderTop: '1px solid cyan', minWidth: 70 }, isSort: true, keySort: 'billDiscount', formatBody: val => StringHelper.formatValue(val) },
    //             { field: 'billGrossSales', label: 'GrossSales', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', styleHead: { border: 'none', borderTop: '1px solid cyan', minWidth: 70 }, isSort: true, keySort: 'billGrossSales', formatBody: val => StringHelper.formatValue(val) },
    //             { field: 'billReturnPaid', label: 'Return paid', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', styleHead: { border: 'none', borderTop: '1px solid cyan', minWidth: 70 }, isSort: true, keySort: 'billReturnPaid', formatBody: val => StringHelper.formatValue(val) },
    //         ]
    //     },

    //     {
    //         field: '', label: 'Invoice', classHead: 'fs-10 border-none text-center', styleHead: {}, colSpanHead: 3, classBody: 'fs-10', styleBody: {}, children: [
    //             { field: 'invoiceCode', label: 'Code', classHead: 'fs-10', classBody: 'fs-10', styleHead: { border: 'none', borderTop: '1px solid orange', minWidth: 70 } },
    //             { field: 'invoiceDate', label: 'Date', classHead: 'fs-10', classBody: 'fs-10', styleHead: { border: 'none', borderTop: '1px solid orange', minWidth: 70 }, formatBody: val => DateHelper.displayDateTimeNo7(val) },
    //             { field: 'invoiceType', label: 'Type', classHead: 'fs-10', classBody: 'fs-10', styleHead: { border: 'none', borderTop: '1px solid orange', minWidth: 70 } },
    //         ]
    //     },

    //     { field: 'amount', label: 'Amount', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', styleHead: { minWidth: 70 }, rowSpanHead: 2, isSort: true, keySort: 'amount', formatBody: val => StringHelper.formatValue(val) },

    //     { field: 'customerCode', label: 'Customer code', classHead: 'fs-10', classBody: 'fs-10', rowSpanHead: 2, },

    //     {
    //         field: '', label: 'Payment method', classHead: 'fs-10 border-none text-center', styleHead: {}, colSpanHead: 2, classBody: 'fs-10', styleBody: {}, children: [
    //             { field: 'paymentMethodCode', label: 'Code', classHead: 'fs-10', classBody: 'fs-10', styleHead: { border: 'none', borderTop: '1px solid cyan', minWidth: 70 }, },
    //             { field: 'paymentMethodName', label: 'Name', classHead: 'fs-10', classBody: 'fs-10', styleHead: { border: 'none', borderTop: '1px solid cyan', minWidth: 70 }, },
    //         ]
    //     },

    //     {
    //         field: '', label: 'Account', classHead: 'fs-10 border-none text-center', styleHead: {}, colSpanHead: 2, classBody: 'fs-10', styleBody: {}, children: [
    //             { field: 'accountHolder', label: 'Holder', classHead: 'fs-10', classBody: 'fs-10', styleHead: { border: 'none', borderTop: '1px solid orange', minWidth: 70 } },
    //             { field: 'accountNumber', label: 'Number', classHead: 'fs-10', classBody: 'fs-10', styleHead: { border: 'none', borderTop: '1px solid orange', minWidth: 70 } },
    //         ]
    //     },
    // ];

    const renderCloseStock = (val, key, item) => {
      let value = 0;

      value =
        parseFloat(item.openQty + item.receivingQty + item.internalReceivingQty) -
        parseFloat(
          item.saleQty + item.disposalQty + item.transferQty + item.storeUsedQty + item.returnQty + item.lostQty
        );

      return StringHelper.formatValue(value);
    };

    const columns = [
      {
        field: 'itemCode',
        label: 'Item',
        classHead: 'fs-10',
        classBody: 'fs-10',
        colSpanHead: 0,
        colSpanBody: 0,
        notShow: true,
      },
      {
        field: 'itemName',
        label: '',
        classHead: 'fs-10',
        classBody: 'fs-10',
        colSpanHead: 0,
        colSpanBody: 0,
        notShow: true,
      },
      {
        field: 'dateKey',
        label: 'Date',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => DateHelper.displayDate(DateHelper.convertKeyDateToYYYYMMDD(val)),
        isSort: true,
        keySort: 'dateKey',
      },
      {
        field: 'openQty',
        label: 'Open stock',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => StringHelper.formatValue(val),
        isSort: true,
        keySort: 'openQty',
        styleBody: { backgroundColor: 'ivory' },
      },
      {
        field: 'receivingQty',
        label: 'Supplier RCV',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => StringHelper.formatValue(val),
        isSort: true,
        keySort: 'receivingQty',
        styleBody: { backgroundColor: 'antiquewhite' },
      },
      {
        field: 'internalReceivingQty',
        label: 'Internal RCV',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => StringHelper.formatValue(val),
        isSort: true,
        keySort: 'internalReceivingQty',
        styleBody: { backgroundColor: 'antiquewhite' },
      },
      {
        field: 'saleQty',
        label: 'Sales',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => StringHelper.formatValue(val),
        isSort: true,
        keySort: 'saleQty',
        styleBody: { backgroundColor: 'aliceblue' },
      },
      {
        field: 'transferQty',
        label: 'Transfer',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => StringHelper.formatValue(val),
        isSort: true,
        keySort: 'transferQty',
        styleBody: { backgroundColor: 'aliceblue' },
      },
      {
        field: 'disposalQty',
        label: 'Disposal',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => StringHelper.formatValue(val),
        isSort: true,
        keySort: 'disposalQty',
        styleBody: { backgroundColor: 'aliceblue' },
      },
      {
        field: 'storeUsedQty',
        label: 'Store used',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => StringHelper.formatValue(val),
        isSort: true,
        keySort: 'storeUsedQty',
        styleBody: { backgroundColor: 'aliceblue' },
      },
      {
        field: 'returnQty',
        label: 'Return',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => StringHelper.formatValue(val),
        isSort: true,
        keySort: 'returnQty',
        styleBody: { backgroundColor: 'aliceblue' },
      },
      {
        field: 'lostQty',
        label: 'Lost',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => StringHelper.formatValue(val),
        isSort: true,
        keySort: 'lostQty',
        styleBody: { backgroundColor: 'aliceblue' },
      },
      {
        field: 'stockBalanceQty',
        label: 'Stock balance',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => StringHelper.formatValue(val),
        isSort: true,
        keySort: 'stockBalanceQty',
        styleBody: { backgroundColor: 'aliceblue' },
      },
      // { field: 'closeStock', label: 'Close stock', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', formatBody: renderCloseStock, isSort: true, keySort: 'closeStock', styleBody: { backgroundColor: 'ivory' } },
      {
        field: 'closeStock',
        label: 'Close stock',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        formatBody: (val) => StringHelper.formatValue(val),
        isSort: true,
        keySort: 'closeStock',
        styleBody: { backgroundColor: 'ivory' },
      },
    ];

    const results = createDataTable(list, columns);

    return (
      <>
        <Row gutter={16} className="mrt-10">
          <Col xl={24}>
            <TableCustomComp data={results} columns={columns} isLoading={isLoading} />
          </Col>
        </Row>
      </>
    );
  }, [dataTable, isLoading, itemCode]);

  // Call api loop ---START MODAL
  const renderModal = useCallback(() => {
    let strError = '';

    for (let index of errorIndexes) {
      strError += `${apiUrls[index]}, `;
    }

    return (
      <Modal
        title="API Error"
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => handleRetry()}
        cancelButtonProps={{ danger: true }}
        okText="Retry"
        okButtonProps={{ loading: isLoadingpp && retrying }}
      >
        There was an error fetching data from API {strError}. Do you want to retry?
      </Modal>
    );
  }, [showModal, errorIndexes, isLoadingpp, retrying]);
  // Call api loop ---END MODAL

  return (
    <>
      {searchComp()}
      {tableComp()}
      {renderModal()}
    </>
  );
}
