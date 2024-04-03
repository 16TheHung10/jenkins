import {
  FileExcelOutlined,
  FileSearchOutlined,
  FilterOutlined,
  FolderViewOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Checkbox, Col, Popover, Row, Space, Tag, message } from 'antd';
import { AuthApi } from 'api/AuthApi';
import AutocompleteBarcode from 'components/mainContent/reporting/selectCompSuggest';
import { DateHelper, StringHelper } from 'helpers';
import { handleExportWorkspaces } from 'helpers/ExportHelper';
import { cloneDeep, createDataTable, createListOption } from 'helpers/FuncHelper';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import DrawerComp from 'utils/drawer';
import SelectBox from 'utils/selectBox';
import TableCustom from 'utils/tableCustom';
import { DataContext } from '../../../../../contexts/DataContext';

const ItemMaster = ({ ...props }) => {
  const isMounted = useRef(true);

  const { data } = useContext(DataContext);
  const { suppliers, divisions } = data;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [itemCount, setItemCount] = useState(0);

  const [itemView, setItemView] = useState({});
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [dataDrawer, setDataDrawer] = useState([]);
  const [isLoadingDrawer, setIsLoadingDrawer] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [allItem, setAllItem] = useState([]);

  // option common data
  const [supplierOpt, setSupplierOpt] = useState([]);
  const [deliveryByOpt, setDeliveryByOpt] = useState([]);
  const [divisionOpt, setDivisionOpt] = useState([]);

  const [originOfGoodsOpt, setOriginOfGoodsOpt] = useState([]);
  const [selfDeclarationOpt, setSelfDeclarationOpt] = useState([]);
  const [preservedOpt, setPreservedOpt] = useState([]);
  const [expiryDateOpt, setExpiryDateOpt] = useState([]);
  const [vatInOpt, setVatInOpt] = useState([]);
  const [vatOutOpt, setVatOutOpt] = useState([]);

  // data search
  const [supplierSearch, setSupplierSearch] = useState('');
  const [deliveryBySearch, setDeliveryBySearch] = useState('');
  const [divisionSearch, setDivisionSearch] = useState('');

  // data filter
  const [salesAllowedFilter, setSalesAllowedFilter] = useState('');
  const [storeOrderAllowedFilter, setStoreOrderAllowedFilter] = useState('');
  const [whOrderAllowedFilter, setWhOrderAllowedFilter] = useState('');
  const [itemCodeFilter, setItemCodeFilter] = useState('');
  const [orderDayFilter, setOrderDayFilter] = useState([]);
  const [originOfGoodsFilter, setOriginOfGoodsFilter] = useState('');
  const [selfDeclarationFilter, setSelfDeclarationFilter] = useState('');
  const [preservedFilter, setPreservedFilter] = useState('');
  const [expiryDateFilter, setExpiryDateFilter] = useState('');

  const [vatInFilter, setVatInFilter] = useState('');
  const [vatOutFilter, setVatOutFilter] = useState('');

  // data detail
  const [dataDetailItem, setDataDetailItem] = useState([]);
  const [isOpenDrawerDetailItem, setIsOpenDrawerDetailItem] = useState(false);

  let customFields = [
    { value: 'orderDay', label: 'Order days' },
    { value: 'originOfGoods', label: 'Origin of goods' },
    { value: 'selfDeclaration', label: 'Self declaration' },
    { value: 'preserved', label: 'Preserved' },
    { value: 'expiryDate', label: 'Expiry date' },
    { value: 'vatIn', label: 'VAT in' },
    { value: 'vatOut', label: 'VAT out' },
  ];

  let customFieldsHide = ['orderDay', 'originOfGoods', 'selfDeclaration', 'preserved', 'expiryDate', 'vatIn', 'vatOut'];

  let arrCustomFields = [
    'divitionName',
    'categoryName',
    'subCategoryName',
    'itemCode',
    'itemName',
    'unit',
    'salesPrice',
    'moQ_Store',
    'moQ_WH',
    'minOrderWH',
    'maxOrderWH',
    'minOrderStore',
    'maxOrderStore',
    'supplierCode',
    'supplierName',
    'deliveryBy',
    'deliveryNameBy',
    'mov',
    'salesAllowed',
    'storeOrderAllowed',
    'whOrderAllowed',
    'createdDate',
    'updatedBy',
    'updatedDate',
    'masterCostFC',
    'masterCost',
    'costPrice',
    'margin',
    'action',
  ];

  let joinField = [...arrCustomFields];

  const [field, setField] = useState(joinField);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    handleGetAllItem();

    return () => handleGetAllItem();
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

  useEffect(() => {
    if (isMounted.current) {
      if (!!divisions) {
        const listOpt = Object.values(divisions)
          ?.map((el) => ({
            value: el.divisionCode,
            label: `${el.divisionCode} - ${el.divisionName}`,
          }))
          .sort((a, b) => (a.value >= b.value ? 1 : -1));
        setDivisionOpt(listOpt);
      }
    }
    return () => {};
  }, [divisions]);

  useEffect(() => {
    if (isMounted.current) {
      if (!!suppliers) {
        const listSupplierOpt = Object.values(suppliers)
          ?.map((el) => ({
            value: el.supplierCode,
            label: `${el.supplierCode} - ${el.supplierName}`,
          }))
          .sort((a, b) => (a.value >= b.value ? 1 : -1));
        setSupplierOpt(listSupplierOpt);
        setDeliveryByOpt(listSupplierOpt);
      }
    }
    return () => {};
  }, [suppliers]);

  const handleExport = (dataExport) => {
    // const dataExportClone = cloneDeep(dataExport);
    // const sort = ['divitionName', 'categoryName', 'subCategoryName', 'itemCode', 'itemName', 'unit', 'salesPrice', 'moQ_Store', 'moQ_WH', 'maxOrderWH', 'minOrderWH', 'maxOrderStore', 'minOrderStore', 'supplierCode', 'supplierName', 'deliveryBy', 'deliveryNameBy', 'mov', 'salesAllowed', 'storeOrderAllowed', 'whOrderAllowed', 'orderDay', 'originOfGoods', 'selfDeclaration', 'preserved', 'expiryDate', 'vatIn', 'vatOut', 'createdDate'];

    // if (props.type === 'md') {
    //     sort.splice(6, 0, 'masterCost');
    //     sort.splice(7, 0, 'costPrice');
    // }

    // const data = sortColumn(cloneDeep(dataExport), sort);

    // const colType = {
    //     moQ_Store: 'number',
    //     moQ_WH: 'number',
    //     mov: 'number',
    //     salesPrice: 'number',
    //     maxOrderWH: 'number',
    //     minOrderWH: 'number',
    //     maxOrderStore: 'number',
    //     minOrderStore: 'number',
    //     // vatIn: 'number',
    //     // vatOut: 'number',
    //     salesAllowed: 'bool',
    //     storeOrderAllowed: 'bool',
    //     whOrderAllowed: 'bool',
    // }

    // const colType = {
    //     costPrice: 'number',
    //     masterCost: 'number',
    //     masterCostFC: 'number',
    //     maxOrderStore: 'number',
    //     maxOrderWH: 'number',
    //     minOrderStore: 'number',
    //     minOrderWH: 'number',
    //     moQ_Store: 'number',
    //     moQ_WH: 'number',
    //     mov: 'number',
    //     salesAllowed: 'bool',
    //     salesPrice: 'number',
    //     storeOrderAllowed: 'bool',
    //     whOrderAllowed: 'bool',
    // }

    // handleExportAutoField(dataExportClone, "exportItemMaster", null, null, colType);

    let params = {
      supplierCode: supplierSearch,
      deliveryCode: deliveryBySearch,
      divisionCode: divisionSearch,
    };

    handleExportWorkspaces('itemmaster', params);
  };

  const handleShowIsFilter = () => {
    if (isMounted.current) {
      const val = showFilter;
      setShowFilter(!val);
    }
  };

  const handleUpdateLoading = () => {
    if (isMounted.current) {
      setIsLoading(true);
      setDataTable([]);
    }
  };

  const handleSearch = (current, currentPageSize) => {
    // if (supplierSearch === '') {
    //     message.error('Please choose supplier');
    //     return false;
    // }
    // if (deliveryBySearch === '') {
    //     message.error('Please choose delivery by');
    //     return false;
    // }

    handleUpdateLoading();
    handleUpdateState(current, currentPageSize);
  };

  const handleUpdateState = async (currentPage, currentPageSize) => {
    let params = {
      supplierCode: supplierSearch,
      deliveryCode: deliveryBySearch,
      divisionCode: divisionSearch,
      page,
      pageSize,
    };

    if (currentPage && typeof currentPage === 'number') {
      params.page = currentPage;
      setPage(currentPage);
    }

    if (currentPageSize && typeof currentPageSize === 'number') {
      params.pageSize = currentPageSize;
      setPageSize(currentPageSize);
    }

    try {
      const url = `/reporting/itemmaster`;
      const response = await AuthApi.get(url, params);

      if (response?.status) {
        let results = response?.data.items ?? [];

        let itemCount = response?.data.total;
        setItemCount(itemCount);

        const originOfGoods = createListOption(results, 'originOfGoods');
        setOriginOfGoodsOpt(originOfGoods);

        const selfDeclaration = createListOption(results, 'selfDeclaration');
        setSelfDeclarationOpt(selfDeclaration);

        let preserved = {};
        let expiryDate = {};

        for (const element of results) {
          if (element?.preserved && !preserved[element.preserved] && element.preserved !== '') {
            let ar = element.preserved?.split(',');
            if (ar?.length > 0) {
              if (ar.length > 1) {
                preserved[element.preserved] = {
                  value: element.preserved,
                  label: ar.shift() + ' to ' + ar.pop(),
                };
              } else {
                preserved[element.preserved] = {
                  value: element.preserved,
                  label: element.preserved,
                };
              }
            } else {
              preserved[element.preserved] = {
                value: element.preserved,
                label: element.preserved,
              };
            }
          }

          if (element?.expiryDate && !expiryDate[element.expiryDate] && element.expiryDate !== '') {
            expiryDate[element.expiryDate] = {
              value: element.expiryDate,
              label: element.expiryDate,
            };
          }
        }

        setPreservedOpt(Object.values(preserved));
        setExpiryDateOpt(Object.values(expiryDate));

        let optVATIn = createListOption(results, 'vatIn');
        for (let item of optVATIn) {
          if (item.vatIn == 0) {
            item.vatIn = item.vatIn.toString();
          }
        }

        let optVATOut = createListOption(results, 'vatOut');
        for (let item of optVATOut) {
          if (item.vatOut == 0) {
            item.vatOut = item.vatOut.toString();
          }
        }

        setVatInOpt(optVATIn);
        setVatOutOpt(optVATIn);

        setDataTable(results);

        if (results?.length == 0) {
          message.warning('Data not found');
        }
      } else {
        message.error(response.error);
      }
    } catch (error) {
      console.log('Error fetching data: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const styleTrueFalse = (value) => {
    if (value === true) {
      return <Tag color="success">Yes</Tag>;
    } else {
      return <Tag color="warning">No</Tag>;
    }
  };

  const returnStyleOrderDay = (value) => {
    switch (value) {
      case 'All':
        return 'default';
      case 'Mo':
        return '#007bff';
      case 'Tu':
        return '#28a745';
      case 'We':
        return '#dc3545';
      case 'Th':
        return '#ffc107';
      case 'Fr':
        return '#17a2b8';
      case 'Sa':
        return '#343a40';
      case 'S':
        return 'purple';
      default:
        return '';
    }
  };

  const styleOrderDay = (value) => {
    let arr = value?.split('-');

    return (
      <div>
        {arr?.map(
          (el, i) =>
            returnStyleOrderDay(el) !== '' && (
              <Tag key={i} color={returnStyleOrderDay(el)}>
                {el}
              </Tag>
            )
        )}
      </div>
    );
  };

  const handleFilter = (listItem) => {
    let list = cloneDeep(listItem);
    let results = [];

    if (isMounted.current) {
      results = itemCodeFilter !== '' ? list.filter((el) => el.itemCode === itemCodeFilter) : list;
      results =
        salesAllowedFilter !== '' ? results.filter((el) => el.salesAllowed.toString() === salesAllowedFilter) : results;
      results =
        storeOrderAllowedFilter !== ''
          ? results.filter((el) => el.storeOrderAllowed.toString() === storeOrderAllowedFilter)
          : results;
      results =
        whOrderAllowedFilter !== ''
          ? results.filter((el) => el.whOrderAllowed.toString() === whOrderAllowedFilter)
          : results;
      results =
        orderDayFilter !== '' && orderDayFilter?.length
          ? results.filter((el) => orderDayFilter.some((item) => el.orderDay.includes(item)))
          : results;
      results =
        originOfGoodsFilter !== ''
          ? results.filter((el) => el.originOfGoods.toString() === originOfGoodsFilter)
          : results;
      results =
        selfDeclarationFilter !== ''
          ? results.filter((el) => el.selfDeclaration.toString() === selfDeclarationFilter)
          : results;
      results = preservedFilter !== '' ? results.filter((el) => el.preserved.toString() === preservedFilter) : results;
      results =
        expiryDateFilter !== '' ? results.filter((el) => el.expiryDate.toString() === expiryDateFilter) : results;
      results = vatInFilter !== '' ? results.filter((el) => el.vatIn.toString() === vatInFilter) : results;
      results = vatOutFilter !== '' ? results.filter((el) => el.vatOut.toString() === vatOutFilter) : results;
    }
    return results;
  };

  const renderAction = (val, key, item) => {
    return (
      <>
        <Tag color="warning" onClick={() => handleViewItem(item)} className="cursor">
          <FolderViewOutlined />
        </Tag>
      </>
    );
  };

  const handleViewItem = (item) => {
    setItemView(item);
    setIsOpenDrawer(true);
    handleIsLoadingDrawer();
    handleGetItemView(item);
  };

  const handleIsLoadingDrawer = () => {
    setIsLoadingDrawer(true);
    setDataDrawer([]);
  };

  const handleGetItemView = async (item) => {
    try {
      const url = `/item/master/infor/${item.itemCode}`;

      const response = await AuthApi.get(url);

      if (response?.status) {
        setDataDrawer(response.data.infor);
      }

      if (response.data.infor?.length == 0) {
        message.error('Data not found');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setIsLoadingDrawer(false);
    }
  };

  const bodyFilter = useCallback((data) => {
    const truFalseOpt = [
      { label: 'Yes', value: 'true' },
      { label: 'No', value: 'false' },
    ];
    const orderDayOpt = [
      { value: 'Mo', label: 'Mon' },
      { value: 'Tu', label: 'Tue' },
      { value: 'We', label: 'Wed' },
      { value: 'Th', label: 'Thu' },
      { value: 'Fr', label: 'Fri' },
      { value: 'Sa', label: 'Sat' },
      { value: 'Su', label: 'Sun' },
    ];

    let dataExport = data;

    return (
      <>
        <Row gutter={16} className="mrt-10">
          <Col xl={24}>
            <div className="section-block">
              <Row gutter={16}>
                <Col xl={6}>
                  <label htmlFor="supplier" className="w100pc">
                    Supplier:
                    <SelectBox
                      data={supplierOpt}
                      funcCallback={(val) => setSupplierSearch(val)}
                      keyField={'supplierSearch'}
                      defaultValue={''}
                      isMode={''}
                    />
                  </label>
                </Col>
                <Col xl={6}>
                  <label htmlFor="deliveryBy" className="w100pc">
                    Delivered by:
                    <SelectBox
                      data={deliveryByOpt}
                      funcCallback={(val) => setDeliveryBySearch(val)}
                      keyField={'deliveryBySearch'}
                      defaultValue={''}
                      isMode={''}
                    />
                  </label>
                </Col>
                <Col xl={6}>
                  <label htmlFor="deliveryBy" className="w100pc">
                    Division:
                    <SelectBox
                      data={divisionOpt}
                      funcCallback={(val) => setDivisionSearch(val)}
                      keyField={'divisionSearch'}
                      defaultValue={''}
                      isMode={''}
                    />
                  </label>
                </Col>
              </Row>
              <Row gutter={16} className="mrt-10">
                <Col>
                  {/* <Button onClick={() => { this.handleUpdateLoading(); this.handleUpdateState() }}
                                            className="btn btn-danger h-30">
                                            Search
                                        </Button>
                                        <Button onClick={() => this.handleExport(data)}
                                            className="btn btn-danger h-30">
                                            Export
                                        </Button> */}
                  <Tag className="h-30 icon-search" onClick={handleSearch}>
                    <FileSearchOutlined /> <span className="icon-search-detail">Search</span>
                  </Tag>

                  {dataTable?.length > 0 && (
                    <>
                      <Tag
                        icon={<FileExcelOutlined />}
                        className="h-30 icon-excel"
                        onClick={() => handleExport(dataExport)}
                      >
                        <span className="icon-excel-detail">Export</span>
                      </Tag>
                      <Tag onClick={handleShowIsFilter} className="h-30 icon-orange">
                        <FilterOutlined />
                      </Tag>
                    </>
                  )}
                </Col>
              </Row>

              {showFilter && (
                <Row gutter={[16, 8]} className="mrt-10">
                  <Col xl={6}>
                    <label htmlFor="itemCodeFilter" className="w100pc">
                      Barcode - Item name:
                      <AutocompleteBarcode barCodes={allItem} updateFilter={(val, key) => setItemCodeFilter(val)} />
                    </label>
                  </Col>
                  <Col xl={6}>
                    <label htmlFor="orderDayFilter" className="w100pc">
                      Order days:
                      <SelectBox
                        data={orderDayOpt}
                        funcCallback={(val) => setOrderDayFilter(val)}
                        keyField={'orderDayFilter'}
                        defaultValue={''}
                        isMode={'multiple'}
                      />
                    </label>
                  </Col>
                  <Col xl={6}>
                    <label htmlFor="originOfGoodsFilter" className="w100pc">
                      Origin of goods:
                      <SelectBox
                        data={originOfGoodsOpt}
                        funcCallback={(val) => setOriginOfGoodsFilter(val)}
                        keyField={'originOfGoodsFilter'}
                        defaultValue={''}
                        isMode={''}
                      />
                    </label>
                  </Col>
                  <Col xl={6}>
                    <label htmlFor="selfDeclarationFilter" className="w100pc">
                      Self declaration:
                      <SelectBox
                        data={selfDeclarationOpt}
                        funcCallback={(val) => setSelfDeclarationFilter(val)}
                        keyField={'selfDeclarationFilter'}
                        defaultValue={''}
                        isMode={''}
                      />
                    </label>
                  </Col>
                  <Col xl={6}>
                    <label htmlFor="preservedFilter" className="w100pc">
                      Preserved:
                      <SelectBox
                        data={preservedOpt}
                        funcCallback={(val) => setPreservedFilter(val)}
                        keyField={'preservedFilter'}
                        defaultValue={''}
                        isMode={''}
                      />
                    </label>
                  </Col>
                  <Col xl={6}>
                    <label htmlFor="expiryDateFilter" className="w100pc">
                      Expiry date:
                      <SelectBox
                        data={expiryDateOpt}
                        funcCallback={(val) => setExpiryDateFilter(val)}
                        keyField={'expiryDateFilter'}
                        defaultValue={''}
                        isMode={''}
                      />
                    </label>
                  </Col>
                  <Col xl={6}>
                    <label htmlFor="vatInFilter" className="w100pc">
                      VAT in:
                      <SelectBox
                        data={vatInOpt}
                        funcCallback={(val) => setVatInFilter(val)}
                        keyField={'vatInFilter'}
                        defaultValue={''}
                        isMode={''}
                      />
                    </label>
                  </Col>
                  <Col xl={6}>
                    <label htmlFor="vatOutFilter" className="w100pc">
                      VAT out:
                      <SelectBox
                        data={vatOutOpt}
                        funcCallback={(val) => setVatOutFilter(val)}
                        keyField={'vatOutFilter'}
                        defaultValue={''}
                        isMode={''}
                      />
                    </label>
                  </Col>
                  <Col xl={4}>
                    <label htmlFor="salesAllowedFilter" className="w100pc">
                      Sales allowed:
                      <SelectBox
                        data={truFalseOpt}
                        funcCallback={(val) => setSalesAllowedFilter(val)}
                        keyField={'salesAllowedFilter'}
                        defaultValue={''}
                        isMode={''}
                      />
                    </label>
                  </Col>
                  <Col xl={4}>
                    <label htmlFor="storeOrderAllowedFilter" className="w100pc">
                      Store order allowed:
                      <SelectBox
                        data={truFalseOpt}
                        funcCallback={(val) => setStoreOrderAllowedFilter(val)}
                        keyField={'storeOrderAllowedFilter'}
                        defaultValue={''}
                        isMode={''}
                      />
                    </label>
                  </Col>
                  <Col xl={4}>
                    <label htmlFor="whOrderAllowedFilter" className="w100pc">
                      WH order allowed:
                      <SelectBox
                        data={truFalseOpt}
                        funcCallback={(val) => setWhOrderAllowedFilter(val)}
                        keyField={'whOrderAllowedFilter'}
                        defaultValue={''}
                        isMode={''}
                      />
                    </label>
                  </Col>
                </Row>
              )}
            </div>
          </Col>
        </Row>
      </>
    );
  });

  const handleCheckAllChangeOptionPopover = (checked) => {
    if (checked) {
      let newList = [...arrCustomFields, ...customFieldsHide];
      setField(newList);
    } else {
      let newList = [...arrCustomFields];
      setField(newList);
    }
  };

  const handleChangeOptionPopover = (value) => {
    if (field.includes(value)) {
      let list = cloneDeep(field);

      let results = list.filter((el) => el !== value);
      setField(results);
    } else {
      setField((prev) => [...prev, value]);
    }
  };

  const handleViewItemDetail = async (item) => {
    setIsOpenDrawerDetailItem(true);

    try {
      const url = `/item/iteminfo/${item.itemCode}`;

      const response = await AuthApi.get(url);

      if (response?.status) {
        setDataDetailItem(Object.values(response.data.items));
      }

      if (Object.values(response.data.items)?.length == 0) {
        message.error('Data not found');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
    }
  };

  const bodyContent = () => {
    // if (isMounted) {

    let items = handleFilter(dataTable);

    let columns = [
      {
        field: 'divitionName',
        label: 'Division',
        classHead: 'fs-10 border-none',
        rowSpanHead: 2,
        styleHead: {},
        classBody: 'fs-10',
        styleBody: {},
      },
      {
        field: 'categoryName',
        label: 'Category',
        classHead: 'fs-10 border-none',
        rowSpanHead: 2,
        styleHead: {},
        classBody: 'fs-10',
        styleBody: {},
      },
      {
        field: 'subCategoryName',
        label: 'Sub category',
        classHead: 'fs-10 border-none ',
        rowSpanHead: 2,
        styleHead: {},
        classBody: 'fs-10',
        styleBody: {},
      },

      {
        field: 'itemCode',
        label: 'Item',
        classHead: 'fs-10 border-none',
        styleHead: {},
        rowSpanHead: 2,
        colSpanHead: 2,
        classBody: 'fs-10',
        styleBody: { background: 'ivory' },
      },
      {
        field: 'itemName',
        label: '',
        classHead: 'fs-10 border-none',
        styleHead: {},
        rowSpanHead: 2,
        colSpanHead: 0,
        classBody: 'fs-10',
        styleBody: { background: 'ivory' },
      },

      {
        field: 'unit',
        label: 'Unit',
        classHead: 'fs-10 border-none',
        styleHead: {},
        rowSpanHead: 2,
        classBody: 'fs-10',
        styleBody: {},
      },

      {
        field: 'salesPrice',
        label: 'Sale price',
        classHead: 'fs-10 border-none text-center',
        rowSpanHead: 2,
        styleHead: {},
        classBody: 'fs-10 text-right',
        styleBody: { background: 'ivory' },
        formatBody: (val) => StringHelper.formatValue(val),
        isSort: true,
        keySort: 'salesPrice',
      },
      {
        field: 'margin',
        label: 'Margin',
        classHead: 'fs-10 border-none text-center',
        rowSpanHead: 2,
        styleHead: {},
        classBody: 'fs-10 text-right',
        styleBody: { minWidth: 50, background: 'ivory' },
        formatBody: (val) => StringHelper.formatValue(val),
        isSort: true,
        keySort: 'margin',
      },
      {
        field: 'moQ_Store',
        label: 'MOQ store',
        classHead: 'fs-10 border-none text-center',
        rowSpanHead: 2,
        styleHead: {},
        classBody: 'fs-10 text-right',
        styleBody: {},
        formatBody: (val) => StringHelper.formatValue(val),
        isSort: true,
        keySort: 'moQ_Store',
      },
      {
        field: 'moQ_WH',
        label: 'MOQ WH',
        classHead: 'fs-10 border-none text-center',
        rowSpanHead: 2,
        styleHead: {},
        classBody: 'fs-10 text-right',
        styleBody: {},
        formatBody: (val) => StringHelper.formatValue(val),
        isSort: true,
        keySort: 'moQ_WH',
      },

      {
        field: '',
        label: 'Order WH',
        classHead: 'fs-10 border-none text-center',
        styleHead: {},
        colSpanHead: 2,
        classBody: 'fs-10',
        styleBody: {},
        children: [
          {
            field: 'minOrderWH',
            label: 'Min',
            classHead: 'fs-10 text-right',
            styleHead: {
              minWidth: 70,
              border: 'none',
              borderTop: '1px solid orange',
            },
            classBody: 'fs-10 text-right',
            styleBody: {},
            formatBody: (val) => StringHelper.formatValue(val),
            isSort: true,
            keySort: 'minOrderWH',
          },
          {
            field: 'maxOrderWH',
            label: 'Max',
            classHead: 'fs-10 text-right',
            styleHead: {
              minWidth: 70,
              border: 'none',
              borderTop: '1px solid orange',
            },
            classBody: 'fs-10 text-right',
            styleBody: {},
            formatBody: (val) => StringHelper.formatValue(val),
            isSort: true,
            keySort: 'maxOrderWH',
          },
        ],
      },
      {
        field: '',
        label: 'Order Store',
        classHead: 'fs-10 border-none text-center',
        styleHead: {},
        colSpanHead: 2,
        classBody: 'fs-10',
        styleBody: {},
        children: [
          {
            field: 'minOrderStore',
            label: 'Min',
            classHead: 'fs-10 text-right',
            styleHead: { border: 'none', borderTop: '1px solid cyan' },
            classBody: 'fs-10 text-right',
            styleBody: {},
            formatBody: (val) => StringHelper.formatValue(val),
            isSort: true,
            keySort: 'minOrderStore',
          },
          {
            field: 'maxOrderStore',
            label: 'Max',
            classHead: 'fs-10 text-right',
            styleHead: { border: 'none', borderTop: '1px solid cyan' },
            classBody: 'fs-10 text-right',
            styleBody: {},
            formatBody: (val) => StringHelper.formatValue(val),
            isSort: true,
            keySort: 'maxOrderStore',
          },
        ],
      },

      {
        field: 'supplierCode',
        label: 'Supplier',
        classHead: 'fs-10 border-none ',
        rowSpanHead: 2,
        styleHead: {},
        colSpanHead: 2,
        classBody: 'fs-10',
        styleBody: {},
      },
      {
        field: 'supplierName',
        label: '',
        classHead: 'fs-10 border-none ',
        rowSpanHead: 2,
        styleHead: {},
        colSpanHead: 0,
        classBody: 'fs-10',
        styleBody: {},
      },

      {
        field: 'deliveryBy',
        label: 'Delivery',
        classHead: 'fs-10 border-none ',
        rowSpanHead: 2,
        styleHead: {},
        colSpanHead: 2,
        classBody: 'fs-10',
        styleBody: { background: 'ivory' },
      },
      {
        field: 'deliveryNameBy',
        label: '',
        classHead: 'fs-10 border-none ',
        rowSpanHead: 2,
        styleHead: {},
        colSpanHead: 0,
        classBody: 'fs-10',
        styleBody: { background: 'ivory' },
      },

      {
        field: 'mov',
        label: 'MOV',
        classHead: 'fs-10 border-none text-right',
        styleHead: {},
        rowSpanHead: 2,
        classBody: 'fs-10 text-right',
        styleBody: {},
        formatBody: (val) => StringHelper.formatValue(val),
        isSort: true,
        keySort: 'mov',
      },

      {
        field: '',
        label: 'Allowed',
        classHead: 'fs-10 border-none text-center',
        styleHead: {},
        colSpanHead: 3,
        classBody: 'fs-10',
        styleBody: {},
        children: [
          {
            field: 'salesAllowed',
            label: 'Sales',
            classHead: 'fs-10 text-center',
            styleHead: { border: 'none', borderTop: '1px solid orange' },
            classBody: 'fs-10',
            styleBody: {},
            formatBody: (val) => styleTrueFalse(val),
          },
          {
            field: 'storeOrderAllowed',
            label: 'Store order',
            classHead: 'fs-10 text-center',
            styleHead: {
              border: 'none',
              borderTop: '1px solid orange',
              minWidth: 70,
            },
            classBody: 'fs-10',
            styleBody: {},
            formatBody: (val) => styleTrueFalse(val),
          },
          {
            field: 'whOrderAllowed',
            label: 'WH order',
            classHead: 'fs-10 text-center',
            styleHead: {
              border: 'none',
              borderTop: '1px solid orange',
              minWidth: 70,
            },
            classBody: 'fs-10',
            styleBody: {},
            formatBody: (val) => styleTrueFalse(val),
          },
        ],
      },

      {
        field: 'orderDay',
        label: 'Order day',
        classHead: 'fs-10 border-none text-center',
        styleHead: {},
        rowSpanHead: 2,
        classBody: 'fs-10',
        styleBody: {},
        formatBody: (val) => styleOrderDay(val),
      },
      {
        field: 'originOfGoods',
        label: 'Origin of goods',
        classHead: 'fs-10 border-none  text-center',
        styleHead: {},
        rowSpanHead: 2,
        classBody: 'fs-10',
        styleBody: {},
      },
      {
        field: 'selfDeclaration',
        label: 'Self declaration',
        classHead: 'fs-10 border-none  text-center',
        styleHead: {},
        rowSpanHead: 2,
        classBody: 'fs-10',
        styleBody: {},
      },
      {
        field: 'preserved',
        label: 'Preserved',
        classHead: 'fs-10 border-none ',
        styleHead: {},
        rowSpanHead: 2,
        classBody: 'fs-10',
        styleBody: {},
      },
      {
        field: 'expiryDate',
        label: 'Expiry date',
        classHead: 'fs-10 border-none text-center',
        styleHead: {},
        rowSpanHead: 2,
        classBody: 'fs-10',
        styleBody: {},
      },
      {
        field: 'vatIn',
        label: 'VAT in',
        classHead: 'fs-10 border-none text-right',
        styleHead: {},
        rowSpanHead: 2,
        classBody: 'fs-10 text-right',
        styleBody: {},
      },
      {
        field: 'vatOut',
        label: 'VAT out',
        classHead: 'fs-10 border-none text-right',
        styleHead: {},
        rowSpanHead: 2,
        classBody: 'fs-10 text-right',
        styleBody: {},
      },
      {
        field: 'createdDate',
        label: 'Create date',
        classHead: 'fs-10 border-none text-center',
        styleHead: {},
        rowSpanHead: 2,
        classBody: 'fs-10',
        styleBody: {},
        formatBody: (val) => DateHelper.displayDateTime24HM(val),
        isSort: true,
        keySort: 'createdDate',
      },
      {
        field: 'updatedBy',
        label: 'User update',
        classHead: 'fs-10 border-none text-center',
        styleHead: {},
        rowSpanHead: 2,
        classBody: 'fs-10',
        styleBody: {},
      },
      {
        field: 'updatedDate ',
        label: 'User update date',
        classHead: 'fs-10 border-none text-center',
        styleHead: {},
        rowSpanHead: 2,
        classBody: 'fs-10',
        styleBody: {},
        formatBody: (val) => DateHelper.displayDateTime24HM(val),
      },
      {
        field: 'action',
        label: 'Action',
        classHead: 'fs-10',
        classBody: 'fs-10',
        rowSpanHead: 2,
        formatBody: renderAction,
      },
    ];

    if (props.type === 'md') {
      let masterCostFC = {
        field: 'masterCostFC',
        label: 'Master cost FC',
        classHead: 'fs-10 border-none text-right',
        styleHead: {},
        rowSpanHead: 2,
        classBody: 'fs-10 text-right',
        styleBody: {},
        formatBody: (val) => StringHelper.formatValue(val),
        isSort: true,
        keySort: 'masterCostFC',
      };
      let masterCost = {
        field: 'masterCost',
        label: 'Master cost',
        classHead: 'fs-10 border-none text-right',
        styleHead: {},
        rowSpanHead: 2,
        classBody: 'fs-10 text-right',
        styleBody: {},
        formatBody: (val) => StringHelper.formatValue(val),
        isSort: true,
        keySort: 'masterCost',
      };
      let promotionCost = {
        field: 'costPrice',
        label: 'Promotion cost price',
        classHead: 'fs-10 border-none text-right',
        styleHead: {},
        rowSpanHead: 2,
        classBody: 'fs-10 text-right',
        styleBody: {},
        formatBody: (val) => StringHelper.formatValue(val),
        isSort: true,
        keySort: 'costPrice',
      };
      columns.splice(6, 0, masterCostFC);
      columns.splice(7, 0, masterCost);
      columns.splice(8, 0, promotionCost);
    }

    let filteredObject = columns.filter((item) => field?.includes(item.field) || item.field === '');
    let data = createDataTable(items, filteredObject).sort((a, b) => (a['divitionName'] >= b['divitionName'] ? 1 : -1));

    let dataExport = data;

    let sumFooter = {
      mov: 0,
      minOrderStore: 0,
      maxOrderStore: 0,
      minOrderWH: 0,
      maxOrderWH: 0,
      salesPrice: 0,
      moQ_Store: 0,
      moQ_WH: 0,
      itemCode: '',
    };

    const content = (
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li>
          {/* <Checkbox
                        value="checkAll"
                        checked={field.length >= customFields?.length}
                        indeterminate={field.length > 0 && field.length < customFields?.length}
                        onChange={(e) => handleCheckAllChangeOptionPopover(e.target.checked)}
                    >
                        Check All
                    </Checkbox> */}
        </li>
        {customFields?.map(({ value, label }, index) => (
          <li key={index}>
            <Checkbox value={value} checked={field.includes(value)} onChange={() => handleChangeOptionPopover(value)}>
              {label}
            </Checkbox>
          </li>
        ))}
      </ul>
    );

    return (
      <div
        style={{
          height: 'calc(100vh - 46px)',
          overflow: 'auto',
          marginLeft: -15,
          marginRight: -15,
        }}
      >
        <div style={{ paddingLeft: 15, paddingRight: 15 }}>
          {bodyFilter(dataExport)}

          <Row className="mrt-10">
            <Col xl={24}>
              <div className="section-block">
                <TableCustom
                  data={data}
                  columns={filteredObject}
                  isLoading={isLoading}
                  sumFooter={sumFooter}
                  totalNumItems={itemCount}
                  currentPageComp={page}
                  onSearch={handleSearch}
                  onDoubleClick={handleViewItemDetail}
                >
                  <div className="f-left">
                    <Row gutter={16} style={{ marginBottom: 5 }}>
                      <Col xl={6}>
                        <Space wrap>
                          <Popover
                            content={content}
                            title="Custom fields"
                            trigger="click"
                            placement="right"
                            arrow={false}
                          >
                            <Tag className="h-30 icon-orange">
                              <UnorderedListOutlined />
                            </Tag>
                          </Popover>
                        </Space>
                      </Col>
                    </Row>
                  </div>
                </TableCustom>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
    // }
  };

  const bodyDrawer = () => {
    const columnsDrawer = [
      {
        field: 'attributeID',
        label: 'Attribute ID',
        colSpanHead: 0,
        colSpanBody: 0,
        notShow: true,
      },
      {
        field: 'attributeName',
        label: 'Attribute Name',
        classHead: 'fs-10',
        classBody: 'fs-10',
      },
      {
        field: 'attributeValue',
        label: 'Attribute Value',
        classHead: 'fs-10',
        classBody: 'fs-10',
      },
      {
        field: 'dataType',
        label: 'Data Type',
        colSpanHead: 0,
        colSpanBody: 0,
        notShow: true,
      },
      {
        field: 'keyMapping',
        label: 'Key Mapping',
        colSpanHead: 0,
        colSpanBody: 0,
        notShow: true,
      },
    ];

    const data = createDataTable(dataDrawer, columnsDrawer);

    return (
      <DrawerComp
        width={600}
        title={Object.keys(itemView)?.length > 0 ? `${itemView.itemCode} - ${itemView.itemName}` : 'Item information'}
        isOpen={isOpenDrawer}
        keyFilter={'isOpenDrawer'}
        updateFilter={(val) => setIsOpenDrawer(val)}
      >
        <Row gutter={16}>
          <Col xl={24}>
            <TableCustom data={data} columns={columnsDrawer} isLoading={isLoadingDrawer} fullWidth={true} />
          </Col>
        </Row>
      </DrawerComp>
    );
  };

  const bodyDrawerDetailItem = () => {
    return (
      <DrawerComp
        width={600}
        title={
          dataDetailItem?.length > 0
            ? `${dataDetailItem[0].itemCode} - ${dataDetailItem[0].itemName}`
            : 'Item information'
        }
        isOpen={isOpenDrawerDetailItem}
        keyFilter={'isOpenDrawerDetailItem'}
        updateFilter={(val) => setIsOpenDrawerDetailItem(val)}
      >
        <Row gutter={[16, 16]} className="mrt-10" style={{ borderBottom: '1px dashed grey' }}>
          <Col xl={12}>Supplier code:</Col>
          <Col xl={12}>{dataDetailItem[0]?.supplierCode}</Col>
        </Row>
        <Row gutter={[16, 16]} className="mrt-10" style={{ borderBottom: '1px dashed grey' }}>
          <Col xl={12}>Supplier name:</Col>
          <Col xl={12}>{dataDetailItem[0]?.supplierName}</Col>
        </Row>
        <Row gutter={[16, 16]} className="mrt-10" style={{ borderBottom: '1px dashed grey' }}>
          <Col xl={12}>Is fresh food:</Col>
          <Col xl={12}>
            {dataDetailItem[0]?.isFreshFood == 1 ? <Tag color="success">Yes</Tag> : <Tag color="warning">No</Tag>}
          </Col>
        </Row>
        <Row gutter={[16, 16]} className="mrt-10" style={{ borderBottom: '1px dashed grey' }}>
          <Col xl={12}>MOV:</Col>
          <Col xl={12}>{StringHelper.formatValue(dataDetailItem[0]?.mov)}</Col>
        </Row>
        <Row gutter={[16, 16]} className="mrt-10" style={{ borderBottom: '1px dashed grey' }}>
          <Col xl={8}>MOQ:</Col>
          <Col xl={8}>
            <Row>
              <Col>Warehouse: {StringHelper.formatValue(dataDetailItem[0]?.moq?.Warehouse)}</Col>
            </Row>
          </Col>
          <Col xl={8}>
            <Row>
              <Col>Store: {StringHelper.formatValue(dataDetailItem[0]?.moq?.Store)}</Col>
            </Row>
          </Col>
        </Row>
      </DrawerComp>
    );
  };

  return (
    <>
      {bodyDrawer()}
      {bodyDrawerDetailItem()}
      {bodyContent()}
    </>
  );
};

export default React.memo(ItemMaster);
