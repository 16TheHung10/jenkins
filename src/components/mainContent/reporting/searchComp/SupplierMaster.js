import React, { useEffect, useState } from 'react';

import StringHelper from 'helpers/StringHelper';

import { FileExcelOutlined } from '@ant-design/icons';
import { Col, Row, Tag, message } from 'antd';
import { handleExportAutoField } from 'helpers/ExportHelper';
import { cloneDeep, createDataTable, createListOption, orderKeyArr } from 'helpers/FuncHelper';
import DrawerComp from 'utils/drawer';
import SelectboxAndCheckbox from 'utils/selectboxAndCheckbox';
import TableCustom from 'utils/tableCustom';
import { AuthApi } from '../../../../api/AuthApi';

export default function SupplierMaster({ ...props }) {
  const [loading, setLoading] = useState(true);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isDataItemMaster, setIsDataItemMaster] = useState(false);

  const [dataItemMaster, setDataItemMaster] = useState([]);
  const [dataDrawer, setDataDrawer] = useState([]);
  const [data, setData] = useState([]);
  const [supplier, setSupplier] = useState('');
  const [orderScheduled, setOrderScheduled] = useState('');
  const [orderDay, setOrderDay] = useState('');
  const [page, setPage] = useState(1);
  const [deliveryBy, setdeliveryBy] = useState('');
  const [internalCode, setInternalCode] = useState('');
  const [email, setEmail] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [tradingName, setTradingName] = useState('');
  const [phone, setPhone] = useState('');
  const [supplierTitle, setSupplierTitle] = useState('');

  const [report, setReport] = useState({
    supplier: 0,
    deliveryStore: 0,
    deliveryWH: 0,
  });
  const [supplierOpt, setSupplierOpt] = useState([]);
  const [internalCodeOpt, setInternalCodeOpt] = useState([]);
  const [optTruFalse, setOptTruFalse] = useState([
    { label: 'Yes', value: 'Scheduled' },
    { label: 'No', value: 'Not Scheduled' },
  ]);
  const [optOrderDay, setOptOrderDay] = useState([
    { value: 'Mo', label: 'Mon' },
    { value: 'Tu', label: 'Tue' },
    { value: 'We', label: 'Wed' },
    { value: 'Th', label: 'Thu' },
    { value: 'Fr', label: 'Fri' },
    { value: 'Sa', label: 'Sat' },
    { value: 'Su', label: 'Sun' },
  ]);
  const [deliveryByOpt, setDeliveryByOpt] = useState([]);
  const [emailOpt, setEmailOpt] = useState([
    { value: 'hasEmail', label: 'have email' },
    { value: 'noEmail', label: 'no email' },
  ]);
  const [taxCodeOpt, setTaxCodeOpt] = useState([
    { value: 'hasTaxCode', label: 'have tax code' },
    { value: 'noTaxCode', label: 'no tax code' },
  ]);
  const [tradingOpt, setTradingOpt] = useState([
    { value: 'hasTranding', label: 'have tranding' },
    { value: 'noTranding', label: 'no tranding' },
  ]);
  const [phoneOpt, setPhoneOpt] = useState([
    { value: 'hasPhone', label: 'have phone number' },
    { value: 'nPhone', label: 'no phone number' },
  ]);

  useEffect(() => {
    fetchSupplierMaster();
    fetchItemMaster();
  }, []);

  const fetchItemMaster = async () => {
    try {
      const url = '/reporting/itemmaster';

      const response = await AuthApi.get(url);

      if (response?.status) {
        const result = response.data?.items;

        setDataItemMaster(result);
        setIsDataItemMaster(true);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const fetchSupplierMaster = async () => {
    try {
      const url = '/reporting/suppliermaster';

      const response = await AuthApi.get(url);

      if (response?.status) {
        const result = response.data?.items;

        const listOptSupplier = result?.map((item) => ({
          value: item.supplierCode,
          label: item.supplierCode + ' - ' + item.supplierName,
        }));

        const listOptInternalCode = createListOption(result, 'internalCode');

        const uniqueDeliveryBy = new Set(result.map((item) => item.deliveryBy));

        const listOptDeliveryBy = Array.from(uniqueDeliveryBy).map((el) => ({
          value: el,
          label: el,
        }));

        setSupplierOpt(listOptSupplier);
        setInternalCodeOpt(listOptInternalCode);
        setDeliveryByOpt(listOptDeliveryBy);

        // tableSum(result);

        setData(result);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const tableSum = (result) => {
    const dataResult = cloneDeep(result);

    let supplier = 0;
    let allowOrder = 0;
    let emptyAllowOrder = 0;
    let notAllowOrder = 0;
    let deliveryWH = 0;
    let deliveryStore = 0;

    for (const item of dataResult) {
      supplier += 1;
      if (item.orderScheduled === 'Scheduled') {
        allowOrder += 1;
      } else if (item.orderScheduled === '') {
        emptyAllowOrder += 1;
      } else {
        notAllowOrder += 1;
      }

      if (item.deliveryBy === 'WH') {
        deliveryWH += 1;
      } else {
        if (item.deliveryBy !== 'WH') {
          deliveryStore += 1;
        }
      }
    }

    // setReport({ ...report, supplier, deliveryWH, deliveryStore });
    return {
      supplier,
      allowOrder,
      emptyAllowOrder,
      notAllowOrder,
      deliveryWH,
      deliveryStore,
    };
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
    let arr = value.split('-');

    return (
      <div>
        {arr?.map(
          (el, i) =>
            returnStyleOrderDay(el) !== '' && (
              <Tag className="d-inline-block" key={i} color={returnStyleOrderDay(el)}>
                {el}
              </Tag>
            )
        )}
      </div>
    );
  };

  const styleResults = (value) => {
    if (value === 'Scheduled') {
      return <Tag color="success">Yes</Tag>;
    } else {
      return <Tag color="error">No</Tag>;
    }
  };

  const handleViewItems = (supplierCode) => {
    if (!isDataItemMaster) {
      message.warning({
        content: 'Please wait for the list to load',
        key: 'unique_error_viewItem',
        duration: 2,
      });
      return;
    }

    const data = cloneDeep(dataItemMaster).filter((el) => el.supplierCode === supplierCode);

    if (data?.length > 0) {
      setIsOpenDrawer(true);
      setDataDrawer(data);
      setSupplierTitle(supplierCode);
    } else {
      message.warning('The supplier has no products');
      return;
    }
  };

  const handleRenderButtonItem = (val, key, item) => {
    return (
      <Tag color="warning" className="cursor" onClick={() => handleViewItems(item.supplierCode)}>
        View items
      </Tag>
    );
  };

  const handleExport = (data) => {
    let cloneData = cloneDeep(data);

    let colType = {
      leadTime: 'number',
      mov: 'number',
    };

    const keyOrder = ['supplierCode', 'supplierName', 'internalCode', 'tradingName', 'taxCode', 'email', 'phone', 'mov', 'leadTime', 'orderScheduled', 'orderDay', 'deliveryBy', 'deliveryName'];

    const dataOrder = orderKeyArr(cloneData, keyOrder);

    handleExportAutoField(dataOrder, 'exportSupplierMaster', null, null, colType);
  };

  const handleFilter = (list) => {
    const data = cloneDeep(list);
    let dataFilter = [];

    dataFilter = supplier !== '' ? data.filter((el) => el.supplierCode === supplier) : data;
    dataFilter = internalCode !== '' ? dataFilter.filter((el) => el.internalCode === internalCode) : dataFilter;
    dataFilter = orderScheduled !== '' ? dataFilter.filter((el) => el.orderScheduled === orderScheduled) : dataFilter;
    dataFilter = orderDay?.length > 0 && orderDay !== '' ? dataFilter.filter((el) => orderDay?.some((element) => el.orderDay.split('-').includes(element))) : dataFilter;
    dataFilter = deliveryBy !== '' ? dataFilter.filter((el) => el.deliveryBy === deliveryBy) : dataFilter;

    dataFilter = email !== '' ? (email === 'hasEmail' ? dataFilter.filter((el) => el.email !== '') : dataFilter.filter((el) => el.email === '')) : dataFilter;
    dataFilter = phone !== '' ? (phone === 'hasPhone' ? dataFilter.filter((el) => el.phone !== '') : dataFilter.filter((el) => el.phone === '')) : dataFilter;
    dataFilter = tradingName !== '' ? (tradingName === 'hasTranding' ? dataFilter.filter((el) => el.tradingName !== '') : dataFilter.filter((el) => el.tradingName === '')) : dataFilter;
    dataFilter = taxCode !== '' ? (taxCode === 'hasTaxCode' ? dataFilter.filter((el) => el.taxCode !== '') : dataFilter.filter((el) => el.taxCode === '')) : dataFilter;

    return dataFilter;
  };

  const bodyContent = () => {
    const dataFilter = handleFilter(data);

    const columns = [
      {
        field: 'supplierCode',
        label: 'Supplier',
        classHead: 'fs-10 ',
        styleHead: {},
        colSpanHead: 2,
        classBody: 'fs-10',
        styleBody: { background: 'ivory' },
        isSort: true,
        keySort: 'supplierName',
      },
      {
        field: 'supplierName',
        label: '',
        classHead: 'fs-10 ',
        styleHead: {},
        colSpanHead: 0,
        colSpanBody: 0,
        classBody: 'fs-10',
        styleBody: { maxWidth: 100, background: 'ivory' },
        isTooltip: true,
      },

      {
        field: 'internalCode',
        label: 'Internal code',
        classHead: 'fs-10 ',
        styleHead: {},
        classBody: 'fs-10',
        styleBody: {},
      },
      {
        field: 'tradingName',
        label: 'Trading name',
        classHead: 'fs-10 ',
        styleHead: {},
        classBody: 'fs-10',
        styleBody: { maxWidth: 150 },
        isTooltip: true,
        isSort: true,
        keySort: 'tradingName',
      },
      {
        field: 'taxCode',
        label: 'Tax code',
        classHead: 'fs-10 ',
        styleHead: {},
        classBody: 'fs-10',
        styleBody: {},
      },
      {
        field: 'email',
        label: 'Email',
        classHead: 'fs-10 ',
        styleHead: {},
        classBody: 'fs-10',
        styleBody: {},
      },
      {
        field: 'phone',
        label: 'Phone',
        classHead: 'fs-10 text-right',
        styleHead: {},
        classBody: 'fs-10 text-right',
        styleBody: {},
      },
      {
        field: 'mov',
        label: 'MOV',
        classHead: 'fs-10 text-right',
        styleHead: {},
        classBody: 'fs-10 text-right',
        styleBody: { background: 'ivory' },
        formatBody: (val) => StringHelper.formatValue(val),
        isSort: true,
        keySort: 'mov',
      },
      {
        field: 'leadTime',
        label: 'Order lead time',
        classHead: 'fs-10 text-right',
        styleHead: {},
        classBody: 'fs-10 text-right',
        styleBody: { minWidth: 90 },
        isSort: true,
        keySort: 'leadTime',
      },

      {
        field: 'orderScheduled',
        label: 'Allow order',
        classHead: 'fs-10 ',
        styleHead: {},
        classBody: 'fs-10 ',
        styleBody: {},
        formatBody: (val) => styleResults(val),
        isSort: true,
        keySort: 'orderScheduled',
      },
      {
        field: 'orderDay',
        label: 'Order day',
        classHead: 'fs-10 ',
        styleHead: {},
        classBody: 'fs-10 ',
        styleBody: {},
        formatBody: (val) => styleOrderDay(val),
      },

      {
        field: 'deliveryBy',
        label: 'Delivery to',
        classHead: 'fs-10',
        styleHead: {},
        colSpanHead: 2,
        classBody: 'fs-10',
        styleBody: { background: 'ivory' },
        isSort: true,
        keySort: 'deliveryBy',
      },
      {
        field: 'deliveryName',
        label: '',
        classHead: 'fs-10',
        styleHead: {},
        colSpanHead: 0,
        colSpanBody: 0,
        classBody: 'fs-10',
        styleBody: { background: 'ivory' },
      },

      {
        field: 'viewList',
        label: 'View list',
        classHead: 'fs-10',
        styleHead: {},
        classBody: 'fs-10',
        styleBody: {},
        formatBody: handleRenderButtonItem,
      },
    ];

    const dataTable = createDataTable(dataFilter, columns);

    const objReport = tableSum(dataTable);

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
          <Row gutter={16} className="mrt-10">
            <Col xl={24}>
              <div className="section-block">
                <Row gutter={16}>
                  <Col xl={18}>
                    <Row gutter={16}>
                      <Col xl={6}>
                        <label htmlFor="supplier" className="w100pc">
                          Supplier:
                          <SelectboxAndCheckbox data={supplierOpt} funcCallback={setSupplier} keyField={'supplier'} defaultValue={''} isMode={''} />
                        </label>
                      </Col>
                      <Col xl={4}>
                        <label htmlFor="internalCode" className="w100pc">
                          Internal code:
                          <SelectboxAndCheckbox data={internalCodeOpt} funcCallback={setInternalCode} keyField={'internalCode'} defaultValue={''} isMode={''} />
                        </label>
                      </Col>
                      <Col xl={4}>
                        <label htmlFor="orderScheduled" className="w100pc">
                          Allow order:
                          <SelectboxAndCheckbox data={optTruFalse} funcCallback={setOrderScheduled} keyField={'orderScheduled'} defaultValue={''} isMode={''} />
                        </label>
                      </Col>
                      <Col xl={6}>
                        <label htmlFor="orderDay" className="w100pc">
                          Order days:
                          <SelectboxAndCheckbox data={optOrderDay} funcCallback={setOrderDay} keyField={'orderDay'} defaultValue={''} isMode={'multiple'} />
                        </label>
                      </Col>
                      <Col xl={4}>
                        <label htmlFor="deliveryBy" className="w100pc">
                          Delivery to:
                          <SelectboxAndCheckbox data={deliveryByOpt} funcCallback={setdeliveryBy} keyField={'deliveryBy'} defaultValue={''} isMode={''} />
                        </label>
                      </Col>
                      <Col xl={5}>
                        <label htmlFor="email" className="w100pc">
                          Email:
                          <SelectboxAndCheckbox data={emailOpt} funcCallback={setEmail} keyField={'email'} defaultValue={''} isMode={''} />
                        </label>
                      </Col>
                      <Col xl={5}>
                        <label htmlFor="tradingName" className="w100pc">
                          Trading name:
                          <SelectboxAndCheckbox data={tradingOpt} funcCallback={setTradingName} keyField={'tradingName'} defaultValue={''} isMode={''} />
                        </label>
                      </Col>
                      <Col xl={5}>
                        <label htmlFor="taxCode" className="w100pc">
                          Tax code:
                          <SelectboxAndCheckbox data={taxCodeOpt} funcCallback={setTaxCode} keyField={'taxCode'} defaultValue={''} isMode={''} />
                        </label>
                      </Col>
                      <Col xl={6}>
                        <label htmlFor="phone" className="w100pc">
                          Phone:
                          <SelectboxAndCheckbox data={phoneOpt} funcCallback={setPhone} keyField={'phone'} defaultValue={''} isMode={''} />
                        </label>
                      </Col>
                      <Col xl={3}>
                        <label htmlFor="orderDay" className="w100pc op-0">
                          .
                        </label>
                        <Tag icon={<FileExcelOutlined />} className="h-30 icon-excel" onClick={() => handleExport(dataTable)}>
                          <span className="icon-excel-detail">Export</span>
                        </Tag>
                      </Col>
                    </Row>
                  </Col>
                  <Col xl={6}>
                    <table className="table-hover d-inline-block" style={{ width: 'auto', overflow: 'auto' }}>
                      <thead>
                        <tr>
                          <th className="fs-10 pd-5 bd-none rule-number">Supplier</th>
                          <th className="fs-10 pd-5 bd-none rule-number">Allowed order</th>
                          <th className="fs-10 pd-5 bd-none rule-number">Not allowed order</th>
                          <th className="fs-10 pd-5 bd-none rule-number">Delivery Store</th>
                          <th className="fs-10 pd-5 bd-none rule-number">Delivery WH</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="fs-10 pd-5 bd-none rule-number" style={{ background: 'ivory' }}>
                            {objReport && StringHelper.formatValue(objReport.supplier)}
                          </td>
                          <td className="fs-10 pd-5 bd-none rule-number" style={{ background: 'aliceblue' }}>
                            {objReport && StringHelper.formatValue(objReport.allowOrder)}
                          </td>
                          <td className="fs-10 pd-5 bd-none rule-number" style={{ background: 'ivory' }}>
                            {objReport && StringHelper.formatValue(objReport.notAllowOrder)}
                          </td>
                          <td className="fs-10 pd-5 bd-none rule-number" style={{ background: 'aliceblue' }}>
                            {objReport && StringHelper.formatValue(objReport.deliveryStore)}
                          </td>
                          <td className="fs-10 pd-5 bd-none rule-number" style={{ background: 'ivory' }}>
                            {objReport && StringHelper.formatValue(objReport.deliveryWH)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <Row gutter={16} className="mrt-10">
            <Col xl={24}>
              {/* <SupplierItemDetail id={this.idComponentDetail} items={this.itemsDetail} /> */}
              <div className="section-block flex justify-item-center">
                <TableCustom data={dataTable} columns={columns} currentPageComp={page} isPagingTable={true} updatePage={setPage} isLoading={loading} />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  };

  const bodyDrawer = () => {
    const columns = [
      {
        field: 'itemCode',
        label: 'Item',
        classHead: 'fs-10 ',
        styleHead: {},
        colSpanHead: 2,
        classBody: 'fs-10',
        styleBody: {},
      },
      {
        field: 'itemName',
        label: '',
        classHead: 'fs-10 ',
        styleHead: {},
        colSpanHead: 0,
        colSpanBody: 0,
        classBody: 'fs-10',
        styleBody: { maxWidth: 100 },
        isTooltip: true,
      },
      {
        field: 'divitionName',
        label: 'Division',
        classHead: 'fs-10 ',
        classBody: 'fs-10',
      },
      {
        field: 'categoryName',
        label: 'Category',
        classHead: 'fs-10 ',
        classBody: 'fs-10',
      },
      {
        field: 'subCategoryName',
        label: 'Sub category',
        classHead: 'fs-10 ',
        classBody: 'fs-10',
      },
      { field: 'unit', label: 'Unit', classHead: 'fs-10 ', classBody: 'fs-10' },
      {
        field: 'salesPrice',
        label: 'Sales price',
        classHead: 'fs-10 text-right',
        classBody: 'fs-10 text-right',
        styleBody: { background: 'ivory' },
        funcClassBody: (val) => (parseFloat(val) < 0 ? 'cl-red' : ''),
        formatBody: (val) => StringHelper.formatValue(val),
      },
    ];

    let totalFooterTable = {
      itemCode: '',
      salesPrice: 0,
    };

    const data = createDataTable(dataDrawer, columns);

    const objSupplier = supplierOpt?.find((el) => el.value === supplierTitle) || {};

    return (
      <DrawerComp
        width={680}
        title={Object.keys(objSupplier)?.length > 0 ? `${objSupplier.label}` : 'List item'}
        isOpen={isOpenDrawer}
        keyFilter={'isOpenDrawer'}
        updateFilter={(val) => setIsOpenDrawer(val)}
      >
        <TableCustom data={data} columns={columns} isPagingTable={false} fullWidth={true} sumFooter={totalFooterTable} />
      </DrawerComp>
    );
  };

  return (
    <>
      {bodyDrawer()}
      {bodyContent()}
    </>
  );
}
