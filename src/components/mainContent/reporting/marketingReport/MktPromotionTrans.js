//Plugin
import React, { useCallback, useMemo, useState } from 'react';

//Custom
import ProgressBarTracking from 'helpers/ProgressBarTracking';

// import TableMDpromotionDiscount from "components/mainContent/reporting/tableComp/TableMDPromotionDiscount";
// import TableMDpromotionBuygift from "components/mainContent/reporting/tableComp/TableMDPromotionBuygift";

import { fetchReport } from 'helpers/FetchData';
import { createDataTable } from 'helpers/FuncHelper';

import {
  FileExcelOutlined,
  FileSearchOutlined,
  FilterOutlined,
  FolderViewOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Col, Popover, Row, Space, Tag, message } from 'antd';
import ModelTable from 'modelComponent/modelTable/ModelTable';
import DrawerComp from 'utils/drawer';
import SelectBox from 'utils/selectboxAndCheckbox';
import DrawerPromo from './table/DrawerPromo';

import ModelGroupDate from 'modelComponent/ModelGroupDate';
import ModelGroupStore from 'modelComponent/ModelGroupStore';
import moment from 'moment';
import { handleExportAutoField } from 'helpers/ExportHelper';
import Block from 'components/common/block/Block';
const MDPromotion = ({ ...props }) => {
  const [search, setSearch] = useState({
    storeCode: '',
    date: moment().clone().subtract(1, 'days'),
    dateModel: 'week',
  });

  const [filter, setFilter] = useState({
    type: '',
    invoiceCode: '',
    itemCode: '',
  });

  const [table, setTable] = useState({
    isLoading: false,
    dataSource: [],
    page: 1,
  });

  const [isShowFilter, setIsShowFilter] = useState(false);
  // const [isShowDrawer, setIsShowDrawer] = useState(false);
  const [drawer, setDrawer] = useState({
    isShowDrawer: false,
    invoiceCode: '',
  });

  const [dataObjPromotion, setDataObjPromotion] = useState({});

  const hanldeResetData = () => {
    setTable((prev) => ({ ...prev, dataSource: [] }));
  };

  const handleSearch = () => {
    getPromotion();
    onSearch();
  };

  const getPromotion = async () => {
    let start = search.date;
    let date = search.date;

    if (search.dateModel === 'week') {
      start = search.date.clone().startOf('week');
      date = search.date.week() == moment().week() ? moment().subtract(1, 'days') : search.date.clone().endOf('week');
    } else if (search.dateModel === 'month') {
      start = search.date.clone().startOf('month');
      date =
        search.date.month() == moment().month() ? moment().subtract(1, 'days') : search.date.clone().endOf('month');
    }

    const params = {
      start:
        start.clone().format('YYYY-MM-DD') == date.clone().format('YYYY-MM-DD')
          ? ''
          : start.clone().format('YYYY-MM-DD'),
      date: date.clone().format('YYYY-MM-DD'),
    };
    console.log({ params });
    try {
      const url = `/promotion/infor`;
      const response = await fetchReport(url, 'GET', params);
      if (response?.status) {
        let results = response?.data?.promotion ?? [];
        const objData = results?.reduce((acc, item) => {
          const { promotionCode, promotionType, promotionGroupCode, itemPromotionType, barcode } = item;
          if (!acc[promotionCode]) {
            acc[promotionCode] = {};
          }

          if (promotionType != 'itemdiscount' && promotionType != 'billdiscount' && promotionGroupCode != null) {
            if (!acc[promotionCode][promotionGroupCode]) {
              acc[promotionCode][promotionGroupCode] = {};
            }

            if (!acc[promotionCode][promotionGroupCode][itemPromotionType]) {
              acc[promotionCode][promotionGroupCode][itemPromotionType] = {};
            }

            acc[promotionCode][promotionGroupCode][itemPromotionType][barcode] = item;
          } else {
            if (!acc[promotionCode][itemPromotionType]) {
              acc[promotionCode][itemPromotionType] = {};
            }
            acc[promotionCode][itemPromotionType][barcode] = item;
          }

          return acc;
        }, {});

        setDataObjPromotion(objData);
      } else {
        message.error(response?.message);
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  const onSearch = async () => {
    if (search.storeCode === '' || search.storeCode === undefined) {
      message.warning({ key: 'search', content: 'Please choose store' });
      return false;
    }

    hanldeResetData();

    const storeCode = search.storeCode;

    let start = search.date;
    let date = search.date;

    if (search.dateModel === 'week') {
      start = search.date.clone().startOf('week');
      date = search.date.week() == moment().week() ? moment().subtract(1, 'days') : search.date.clone().endOf('week');
    } else if (search.dateModel === 'month') {
      start = search.date.clone().startOf('month');
      date =
        search.date.month() == moment().month() ? moment().subtract(1, 'days') : search.date.clone().endOf('month');
    }

    const dateArray = [];
    const currentDate = start.clone();

    while (currentDate.isSameOrBefore(date)) {
      dateArray.push(currentDate.format('YYYY-MM-DD'));
      currentDate.add(1, 'day');
    }

    const diff = dateArray.length;

    var result = [];
    let onePc = (100 * 100) / diff / 100;

    ProgressBarTracking.start(onePc, diff, 0);
    for (let i = 0; i < diff; i++) {
      let params = {
        // date: (fields.start && DateHelper.displayDateFormatMinus(DateHelper.addDays(fields.start, i))) || ""
        date: dateArray[i],
      };

      if (ProgressBarTracking.instance !== null) {
        try {
          const url = `/promotion/transaction/item/${storeCode}`;
          const response = await fetchReport(url, 'GET', params);
          if (response?.status) {
            if (response?.data?.promotion) {
              ProgressBarTracking.instance !== null && ProgressBarTracking.start(onePc, diff, i);

              result = [...result, ...response.data.promotion];
            }
          } else {
            message.error(response.message);
          }
        } catch (error) {
          console.log('Error fetching data: ', error);
        }
      } else {
        result = [];
      }
    }

    ProgressBarTracking.hide();

    setTable((prev) => ({ ...prev, dataSource: result }));
  };

  const handleExport = () => {
    const dataExport = table.dataSource;
    handleExportAutoField(dataExport, 'exportPromotionTransaction');
  };

  const contentNote = () => (
    <div className="bg-note cl-red fs-12">
      <p>- Bước 1: Thực hiện chức năng tìm kiếm lấy danh sách sản phẩm.</p>
      <p>- Bước 2: chọn promotion để lấy thông tin phiếu export</p>
    </div>
  );

  const handleGetTypePromo = useCallback(
    (list) => {
      const { type, invoiceCode, itemCode } = filter;
      let arr = [];
      arr = type != '' && type == 'billDiscount' ? list?.filter((item) => item.billPromotionCode != '') : list;
      arr = (type != '') & (type == 'DI') ? arr?.filter((item) => item.itemPromotionCode.slice(0, 2) == type) : arr;
      arr = (type != '') & (type == 'BG') ? arr?.filter((item) => item.itemPromotionCode.slice(0, 2) == type) : arr;
      arr = (type != '') & (type == 'BD') ? arr?.filter((item) => item.itemPromotionCode.slice(0, 2) == type) : arr;
      arr = invoiceCode !== '' ? arr?.filter((item) => item.invoiceCode == invoiceCode) : arr;
      arr = itemCode !== '' ? arr?.filter((item) => item.barcode == itemCode) : arr;

      const arrayGroupInvoice = Object.values(
        arr?.reduce((acc, item) => {
          let { invoiceCode, itemPromotionCode, promotionGroupCode, itemPromotionType, barcode, itemName } = item;

          if (!acc[invoiceCode]) {
            acc[invoiceCode] = {
              ...item,
            };
          }

          if (!acc[invoiceCode].promoCode) {
            acc[invoiceCode].promoCode = {};
          }

          if (!acc[invoiceCode].promoCode[itemPromotionCode]) {
            acc[invoiceCode].promoCode[itemPromotionCode] = {};
          }

          if (promotionGroupCode !== '') {
            if (!acc[invoiceCode].promoCode[itemPromotionCode][promotionGroupCode]) {
              acc[invoiceCode].promoCode[itemPromotionCode][promotionGroupCode] = {};
            }

            if (!acc[invoiceCode].promoCode[itemPromotionCode][promotionGroupCode][itemPromotionType]) {
              acc[invoiceCode].promoCode[itemPromotionCode][promotionGroupCode][itemPromotionType] = {};
            }

            if (!acc[invoiceCode].promoCode[itemPromotionCode][promotionGroupCode][itemPromotionType][barcode]) {
              acc[invoiceCode].promoCode[itemPromotionCode][promotionGroupCode][itemPromotionType][barcode] = itemName;
            }
          } else {
            if (!acc[invoiceCode].promoCode[itemPromotionCode][barcode]) {
              acc[invoiceCode].promoCode[itemPromotionCode][barcode] = itemName;
            }
          }

          return acc;
        }, {})
      );

      return arrayGroupInvoice;
    },
    [filter]
  );
  const memoziedFilter = useMemo(() => {
    const typeOption = [
      { value: 'BG', label: 'Buy gift' },
      { value: 'DI', label: 'Item discount' },
      { value: 'BD', label: 'Mix match' },
      { value: 'billDiscount', label: 'Bill discount' },
    ];

    const dataTrans = table.dataSource != undefined ? handleGetTypePromo(table.dataSource) : [];

    const objinvoiceOption = dataTrans?.reduce((acc, item) => {
      const { invoiceCode } = item;
      if (!acc[invoiceCode]) {
        acc[invoiceCode] = {
          value: invoiceCode,
          label: invoiceCode,
        };
      }
      return acc;
    }, {});

    const invoiceOption = objinvoiceOption != undefined ? Object.values(objinvoiceOption) : [];

    const objItemOption = dataTrans?.reduce((acc, item) => {
      const { barcode, itemName } = item;
      if (!acc[barcode]) {
        acc[barcode] = {
          value: barcode,
          label: `${barcode} - ${itemName}`,
        };
      }
      return acc;
    }, {});

    const itemOption = Object.values(objItemOption);

    return (
      <>
        {isShowFilter == true ? (
          <Row gutter={16} className="mrt-5">
            <Col xl={8}>
              <label htmlFor="type" className="w100pc">
                Type promotion:
                <SelectBox
                  data={typeOption}
                  funcCallback={(val) => setFilter((prev) => ({ ...prev, type: val, invoiceCode: '', itemCode: '' }))}
                  keyField={'type'}
                  value={filter.type}
                />
              </label>
            </Col>
            <Col xl={8}>
              <label htmlFor="type" className="w100pc">
                Invoice:
                <SelectBox
                  data={invoiceOption}
                  funcCallback={(val) => setFilter((prev) => ({ ...prev, invoiceCode: val, itemCode: '' }))}
                  keyField={'invoiceCode'}
                  value={filter.invoiceCode}
                />
              </label>
            </Col>
            <Col xl={8}>
              <label htmlFor="type" className="w100pc">
                Item:
                <SelectBox
                  data={itemOption}
                  funcCallback={(val) => setFilter((prev) => ({ ...prev, itemCode: val }))}
                  keyField={'itemCode'}
                  value={filter.itemCode}
                />
              </label>
            </Col>
          </Row>
        ) : null}
      </>
    );
  }, [filter, table, isShowFilter, handleGetTypePromo]);

  const memoziedSearch = useMemo(() => {
    return (
      <Row gutter={16} className="mrt-5 mrb-5">
        <Col xl={24}>
          <div className="section-block">
            <Row gutter={16}>
              <Col xl={16}>
                <Row gutter={16}>
                  <Col xl={8}>
                    <ModelGroupStore setGroupStore={(val) => setSearch((prev) => ({ ...prev, storeCode: val }))} />
                  </Col>
                  <Col xl={8}>
                    <ModelGroupDate
                      groupDate={search.date}
                      setGroupDate={(val) => setSearch((prev) => ({ ...prev, date: val }))}
                      dateModel={search.dateModel}
                      setDateModel={(val) => setSearch((prev) => ({ ...prev, dateModel: val }))}
                    />
                  </Col>
                  <Col xl={8}>
                    <label htmlFor="date" className="w100pc">
                      &nbsp;
                    </label>
                    <Space size={'small'}>
                      <Tag className="h-30 icon-search" onClick={handleSearch}>
                        <FileSearchOutlined /> <span className="icon-search-detail">Search</span>
                      </Tag>
                      <Tag icon={<FileExcelOutlined />} className="h-30 icon-excel" onClick={handleExport}>
                        <span className="icon-excel-detail">Export</span>
                      </Tag>
                      <Tag onClick={() => setIsShowFilter((prev) => !prev)} className="h-30 icon-orange">
                        <FilterOutlined />
                      </Tag>
                    </Space>
                  </Col>
                </Row>

                {memoziedFilter}
              </Col>
              <Col xl={8} className="text-right">
                <label htmlFor="date" className="w100pc">
                  &nbsp;
                </label>
                <Popover content={contentNote()} placement="bottomRight">
                  <Tag
                    className="bg-note fs-12 fw-bold cl-red"
                    style={{ marginRight: 0, cursor: 'help', padding: '2px 5px' }}
                    icon={<WarningOutlined />}
                    color="error"
                  >
                    Lưu ý
                  </Tag>
                </Popover>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    );
  }, [search, isShowFilter, table, memoziedFilter]);

  const renderInvoiceType = (value, item) => {
    if (value == 0) {
      return <Tag color="warning">Uncompleted</Tag>;
    }
    if (value == 1) {
      return <Tag color="green">Completed</Tag>;
    }
    if (value == 3) {
      return <Tag color="info">Refund</Tag>;
    }
    if (value == 4) {
      return <Tag color="error">Cancel</Tag>;
    }
  };

  // const renderAction = (value, item) => {
  //     const { billPromotionCode } = item;
  //     // if (item.invoiceCode == 'VN0255011012230007') { console.log({ item }) }
  //     return <>
  //         {
  //             billPromotionCode != '' ? <Tag
  //                 color="warning"
  //                 className="cursor"
  //                 onClick={() => {
  //                     this.invoiceCode = item.invoiceCode;
  //                     this.isShowDrawer = true;
  //                     this.refresh();
  //                 }
  //                 }>
  //                 <FolderViewOutlined />
  //             </Tag> : null
  //         }
  //     </>
  // }

  const renderAction = (value, item) => {
    const { billPromotionCode } = item;
    // if (item.invoiceCode == 'VN0255011012230007') { console.log({ item }) }
    return (
      <>
        {billPromotionCode != '' ? (
          <Tag
            color="warning"
            className="cursor"
            onClick={() => setDrawer((prev) => ({ ...prev, isShowDrawer: true, invoiceCode: item.invoiceCode }))}
          >
            <FolderViewOutlined />
          </Tag>
        ) : null}
      </>
    );
  };

  const renderItemDiscount = (val, item) => {
    const { itemPromotionCode, barcode } = item;

    const itemTarget = dataObjPromotion[itemPromotionCode]?.Discount?.[barcode];

    if (itemPromotionCode.slice(0, 2) == 'DI') {
      console.log({ itemTarget, itemPromotionCode });
      console.log(dataObjPromotion);
    }

    return (
      <>
        {itemTarget != undefined ? (
          <>
            {itemTarget.barcode}
            <br /> {itemTarget.itemName}
          </>
        ) : null}
      </>
    );
  };

  const renderBGBuy = (val, item) => {
    const { itemPromotionCode, barcode, promotionGroupCode } = item;
    const itemTarget = dataObjPromotion[itemPromotionCode]?.[promotionGroupCode]?.Buy?.[barcode];

    // if (itemPromotionCode.slice(0, 2) == "BG") {
    //     console.log({ itemTarget, itemPromotionCode })
    //     console.log(dataObjPromotion)
    // }

    return (
      <>
        {itemTarget != undefined ? (
          <>
            {itemTarget.barcode}
            <br /> {itemTarget.itemName}
          </>
        ) : null}
      </>
    );
  };

  const renderBGGift = (val, item) => {
    const { itemPromotionCode, barcode, promotionGroupCode } = item;
    const itemTarget = dataObjPromotion[itemPromotionCode]?.[promotionGroupCode]?.Gift?.[barcode];
    return (
      <>
        {itemTarget != undefined ? (
          <>
            {itemTarget.barcode}
            <br /> {itemTarget.itemName}
          </>
        ) : null}
      </>
    );
  };

  const renderBDBuy = (val, item) => {
    const { itemPromotionCode, barcode, promotionGroupCode } = item;
    const itemTarget = dataObjPromotion[itemPromotionCode]?.[promotionGroupCode]?.Buy?.[barcode];
    return (
      <>
        {itemTarget != undefined ? (
          <>
            {itemTarget.barcode}
            <br /> {itemTarget.itemName}
          </>
        ) : null}
      </>
    );
  };

  const renderBDDiscount = (val, item) => {
    const { itemPromotionCode, barcode, promotionGroupCode } = item;
    const itemTarget = dataObjPromotion[itemPromotionCode]?.[promotionGroupCode]?.Discount?.[barcode];
    return (
      <>
        {itemTarget != undefined ? (
          <>
            {itemTarget.barcode}
            <br /> {itemTarget.itemName}
          </>
        ) : null}
      </>
    );
  };

  const memoziedTable = useMemo(() => {
    // dataObjPromotion
    const dataTrans = handleGetTypePromo(table.dataSource) ?? [];
    let columnsFinal = [];
    let columns = [
      {
        field: 'invoiceDate',
        label: 'Date',
        formatBody: (val) => (val.invoiceDate != '' ? moment(val.invoiceDate).format('DD/MM/YYYY hh:mm A') : null),
      },
      { field: 'invoiceCode', label: 'Invoice' },
      { field: 'invoiceType', label: 'Type', formatBody: renderInvoiceType },
      { field: 'storeCode', label: 'Store' },
      // { field: 'action', label: '', formatBody: renderAction },

      { field: 'itemPromotionCode', label: '', notShow: true },
      { field: 'promotionGroupCode', label: '', notShow: true },
      { field: 'itemPromotionType', label: '', notShow: true },
      { field: 'barcode', label: '', notShow: true },
      { field: 'itemName', label: '', notShow: true },
      // { field: 'promoCode', label: '', notShow: true, },
    ];
    if (filter.type == 'DI') {
      columns.push({ field: 'itemDiscount', label: 'Item discount', formatBody: renderItemDiscount });
      const removeKey = ['itemBy', 'itemGift'];
      columnsFinal = columns?.filter((item) => !removeKey.includes(item.field));
    } else if (filter.type == 'BG') {
      columns.push({ field: 'itemBy', label: 'Item buy', formatBody: renderBGBuy });
      columns.push({ field: 'itemGift', label: 'Item gift', formatBody: renderBGGift });
      const removeKey = ['itemDiscount'];
      columnsFinal = columns?.filter((item) => !removeKey.includes(item.field));
    } else if (filter.type == 'BD') {
      columns.push({ field: 'itemBy', label: 'Item buy', formatBody: renderBDBuy });
      columns.push({ field: 'itemDiscount', label: 'Item discount', formatBody: renderBDDiscount });
      const removeKey = ['itemGift'];
      columnsFinal = columns?.filter((item) => !removeKey.includes(item.field));
    } else {
      // billDiscount
      const removeKey = ['itemBy', 'itemGift', 'itemDiscount'];
      columnsFinal = columns?.filter((item) => !removeKey.includes(item.field));
    }
    const dataTable = createDataTable(dataTrans, columnsFinal);

    return (
      <Row gutter={[16, 8]}>
        <Col xl={24}>
          <Block>
            <ModelTable
              style={{ display: 'inline-block' }}
              data={dataTable}
              columns={columns}
              isLoading={table.isLoading}
              initialPage={table.page}
              updateInitialPage={(val) => setTable((prev) => ({ ...prev, page: val }))}
            />
          </Block>
        </Col>
      </Row>
    );
  }, [filter, table, dataObjPromotion]);

  const memoziedDrawer = useMemo(() => {
    const dataTrans = table.dataSource != undefined ? handleGetTypePromo(table.dataSource) : [];
    return (
      <DrawerComp
        width={600}
        isOpen={drawer.isShowDrawer}
        keyFilter={'isShowDrawer'}
        updateFilter={(val) => setDrawer((prev) => ({ ...prev, isShowDrawer: val }))}
        title={'List Promotion'}
      >
        <DrawerPromo data={dataTrans} invoiceCode={drawer.invoiceCode} />
      </DrawerComp>
    );
  }, [drawer, table.dataSource]);

  return (
    <>
      {memoziedSearch}
      {memoziedTable}
      {memoziedDrawer}
    </>
  );
};

export default MDPromotion;
