//Plugin
import Paging from 'external/control/pagination';
import React, { Fragment } from 'react';

//Custom
import BaseComponent from 'components/BaseComponent';
import PageHelper from 'helpers/PageHelper';
import ReportingModel from 'models/ReportingModel';

import { BellOutlined, FileExcelOutlined, FileSearchOutlined, LockOutlined } from '@ant-design/icons';
import { Badge, Col, Row, Space, Tag, Typography, message } from 'antd';
import EstimateStockTab from 'components/mainContent/dashBoard/items/estimateStockTabPending';
import DateHelper from 'helpers/DateHelper';
import { handleExportAutoField } from 'helpers/ExportHelper';
import { createListOption } from 'helpers/FuncHelper';
import StringHelper from 'helpers/StringHelper';
import ModelGroupStore from 'modelComponent/ModelGroupStore';
import ModelInputSuggestItem from 'modelComponent/modelInputSuggestItem/ModelInputSuggestItem';
import SelectBox from 'utils/selectboxAndCheckbox';

export default class EstimateStock extends BaseComponent {
  constructor(props) {
    super(props);

    this.idTabPendingComponent = 'tabPending' + StringHelper.randomKey();
    this.idTabLockComponent = 'tabLock' + StringHelper.randomKey();
    this.idBarcodeItem1Ref = React.createRef();
    this.idBarcodeItem1 = 'idBarcodeItem1' + StringHelper.randomKey();

    //Default data
    this.data.stores = [];
    this.data.stock = [];
    this.data.pending = [];
    this.data.locked = [];
    this.isSearch = false;
    this.itemReportPending = [];
    this.itemReportLock = [];
    this.groupPendingFloatBtn = [];
    this.groupLockFloatBtn = [];
    this.objPending = {};
    this.objLock = {};
    this.objCategory = {};
    // this.itemsOrder = {};

    this.fieldSelected = this.assignFieldSelected(
      {
        countNumPending: 0,
        countNumLock: 0,
        isError: 0,
        categoryCode: '',
        numberSoh: '',
        barcode: '',
        itemCodeFilter: '',
      },
      ['storeCode']
    );

    this.isAutoload = PageHelper.updateFilters(this.fieldSelected, function (filters) {
      return true;
    });

    this.page = 1;

    this.isRender = true;
  }

  componentDidMount() {
    // this.handleCheckStatusInventory();
    // this.handleUpdateState();
  }

  // handleCheckStatusInventory = async () => {
  //     let model = new ReportingModel();
  //     let date = DateHelper.displayDateFormatMinus(decreaseDate(1));

  //     await model.checkStatusAPIinventory(date).then(response => {
  //         if (response.status && response.data.storeStatus) {
  //             this.handleUpdateState();

  //             if (response.message) {
  //                 if (response.message !== "") {
  //                     this.showAlert(response.message, 'error', false);
  //                 }
  //             }
  //         }
  //         else {
  //             var elUpdating = document.getElementById("content-updating");
  //             elUpdating.classList.remove('d-none');
  //         }

  //     });

  //     this.refresh();
  // }

  handleUpdateFilterBarcode = (itemCode, isFilter) => {
    if (isFilter) {
      this.fieldSelected.barcode = itemCode;
      this.refresh();
    }
  };

  // handleUpdateState = async () => {
  //     let itemModel = new ItemModel();
  //     itemModel.getAllItems().then(res => {
  //         if (res.status && res.data.items) {
  //             this.itemsOrder = res.data.items;
  //             this.refresh();
  //         }
  //     });

  //     let commonModel = new CommonModel();
  //     commonModel.getData("store").then((res) => {
  //         if (res.status) {
  //             this.data.stores = res.data.stores;
  //             this.refresh();
  //         }
  //     });

  // }

  handleExport = () => {
    this.showAlert('Feature is being updated');
    // let model = new ReportingModel();
    // model
    //     .exportBill(
    //         this.fieldSelected.storeCode,
    //         DateHelper.displayDateFormat(this.fieldSelected.startDate),
    //         DateHelper.displayDateFormat(this.fieldSelected.endDate)
    //     )
    //     .then((response) => {
    //         if (response.status) {
    //             let downloadModel = new DownloadModel();
    //             downloadModel.get(response.data.downloadUrl, null, null, ".xls");
    //         } else {
    //             this.showAlert(response.message);
    //         }
    //     });
  };

  handleSearch = async () => {
    const fields = this.fieldSelected;

    if (fields.storeCode === '' || fields.storeCode?.length === 0 || fields.storeCode[0] === '') {
      message.error('Please choose store to search');
      return false;
    }

    let model = new ReportingModel();
    let date = DateHelper.displayDateFormatMinus(new Date());

    await model.checkStatusAPIinventory(date).then((response) => {
      if (response.status && response.data.storeStatus) {
        if (response.message) {
          if (response.message !== '') {
            this.showAlert(response.message, 'error', false);
          }
        }

        this.handleGetInventory();
      } else {
        this.showAlert('Data updating', 'error', false);
      }
    });

    this.refresh();
  };

  handleGetInventory = async () => {
    this.isSearch = false;
    this.fieldSelected.isError = 0;
    this.data.stock = [];
    this.data.pending = [];
    this.data.locked = [];
    this.itemReportPending = [];

    let objCategory = {};

    let paramsStock = {
      type: 'estimatedatastock',
      storeCode: this.fieldSelected.storeCode,
      itemCode: this.fieldSelected.barcode,
    };

    let model = new ReportingModel();

    await model.getEstimateStock(paramsStock).then((res) => {
      if (res.status && res.data) {
        if (res.data.data) {
          res.data.data.stock && (this.data.stock = res.data.data.stock === '' ? [] : res.data.data.stock);

          res.data.data.invFail && (this.fieldSelected.isError = res.data.data.invFail);
          res.data.data.lastInv && (this.fieldSelected.lastInv = res.data.data.lastInv);
          res.data.data.curInv && (this.fieldSelected.curInv = res.data.data.curInv);
          this.isSearch = true;

          for (let key in this.data.stock) {
            let item = this.data.stock[key];

            if (!objCategory[item.categoryCode]) {
              objCategory[item.categoryCode] = {
                value: item.categoryCode,
                label: item.categoryCode + ' - ' + item.categoryName,
              };
            }
          }

          this.objCategory = objCategory;

          this.itemCodeOpt = createListOption(this.data.stock, 'itemCode', 'itemName');

          if (this.data.stock.length === 0) {
            this.showAlert('Data not found', 'error', false, false);
          }
        }
      } else {
        // this.showAlert("System busy!");
      }
    });

    let paramsPending = {
      type: 'estimatedatapending',
      storeCode: this.fieldSelected.storeCode,
    };
    let modelPending = new ReportingModel();
    await modelPending.getEstimateStock(paramsPending).then((res) => {
      if (res.status && res.data) {
        if (res.data.data) {
          res.data.data.pending && (this.data.pending = res.data.data.pending === '' ? [] : res.data.data.pending);

          if (res.data.data.pending) {
            this.data.pending = res.data.data.pending === '' ? [] : res.data.data.pending;
            let num = 0;
            this.data.pending.forEach((el) => {
              num++;
            });
            this.fieldSelected.countNumPending = num;

            this.handleListType(this.data.pending, 'pending');
          }
        }
      } else {
        // this.showAlert("System busy!");
      }
    });

    let paramsLock = {
      type: 'estimatedatalock',
      storeCode: this.fieldSelected.storeCode,
    };
    let modelLock = new ReportingModel();
    await modelLock.getEstimateStock(paramsLock).then((res) => {
      if (res.status && res.data) {
        if (res.data.data) {
          res.data.data.locked && (this.data.locked = res.data.data.locked === '' ? [] : res.data.data.locked);

          if (res.data.data.locked) {
            this.data.locked = res.data.data.locked === '' ? [] : res.data.data.locked;
            let num = 0;
            this.data.locked.forEach((el) => {
              num++;
            });
            this.fieldSelected.countNumLock = num;

            this.handleListType(this.data.locked, 'lock');
          }
        }
      } else {
        // this.showAlert("System busy!");
      }
    });

    let paramsReport = {
      type: 'estimatedatareport',
      storeCode: this.fieldSelected.storeCode,
    };
    let modelReport = new ReportingModel();
    await modelReport.getEstimateStock(paramsReport).then((res) => {
      if (res.status && res.data) {
        if (res.data.data) {
          res.data.data.reportingPending &&
            (this.itemReportPending = res.data.data.reportingPending === '' ? [] : res.data.data.reportingPending);

          res.data.data.reportingLocked &&
            (this.itemReportLock = res.data.data.reportingLocked === '' ? [] : res.data.data.reportingLocked);
        }
      } else {
        // this.showAlert("System busy!");
      }
    });

    this.refresh();
  };

  handleListType = (arr, type) => {
    if (arr) {
      arr &&
        arr.forEach((element) => {
          if (type === 'pending') {
            if (!this.groupPendingFloatBtn.includes(element.type)) {
              this.groupPendingFloatBtn.push(element.type);
            }
          }

          if (type === 'lock') {
            if (!this.groupLockFloatBtn.includes(element.type)) {
              this.groupLockFloatBtn.push(element.type);
            }
          }
        });

      if (type === 'pending') {
        let result = arr.reduce(function (r, a) {
          let key = a.type;
          r[key] = r[key] || [];
          r[key].push(a);
          return r;
        }, Object.create(null));

        this.objPending = result;
      }

      if (type === 'lock') {
        let resultLock = arr.reduce(function (r, a) {
          let key = a.type;
          r[key] = r[key] || [];
          r[key].push(a);
          return r;
        }, Object.create(null));

        this.objLock = resultLock;
      }
    } else {
      this.objPending = [];
      this.objLock = [];
      this.groupPendingFloatBtn = [];
      this.groupLockFloatBtn = [];
    }
    this.refresh();
  };

  handleUpdateFilter = (code) => {
    this.fieldSelected.itemCode = code;
    this.refresh();
  };

  renderFilter() {
    const fields = this.fieldSelected;
    let stores = this.data.stores;
    let storeKeys = Object.keys(stores);
    const orderStore = {};
    Object.keys(stores)
      .sort()
      .forEach(function (key) {
        orderStore[key] = stores[key];
      });
    let storeOptions = [];
    if (storeKeys.length === 0) {
      storeOptions.push({ value: this.data.storeCode, label: this.data.storeCode + ' - ' + this.data.storeName });
    } else {
      storeOptions = Object.keys(orderStore).map((key) => {
        return { value: stores[key].storeCode, label: stores[key].storeCode + ' - ' + stores[key].storeName };
      });
    }

    let optCategory = Object.keys(this.objCategory).map((key) => {
      return { value: key, label: this.objCategory[key].label };
    });

    let optEstSOH = [
      { value: 0, label: 'Stock in positive' },
      { value: 1, label: 'Stock in negative' },
    ];

    return (
      <div className="form-filter">
        <Row gutter={16}>
          <Col xl={24}>
            <div className="section-block">
              <Row gutter={16}>
                <Col xl={19}>
                  <Row gutter={16}>
                    <Col xl={11}>
                      {/* <div className="form-group">
                                                <label htmlFor="store" className="w100pc">
                                                    Store:
                                                </label>
                                                <Select
                                                    isDisabled={storeOptions.length === 1 && !this.getAccountState().isAdmin()}
                                                    isClearable
                                                    classNamePrefix="select"
                                                    maxMenuHeight={260}
                                                    placeholder="-- All --"
                                                    value={storeOptions.filter((option) => option.value === this.fieldSelected.storeCode)}
                                                    options={storeOptions}
                                                    onChange={(e) => this.handleChangeFieldCustom("storeCode", e ? e.value : "", () => {
                                                        this.isSearch = false; this.data.pending = [];
                                                        this.data.locked = []; this.refresh()
                                                    })}
                                                />
                                            </div> */}
                      <ModelGroupStore
                        // groupStore={fields.storeCode}
                        setGroupStore={(val) => {
                          fields.storeCode = val;
                          this.isSearch = false;
                          this.data.pending = [];
                          this.data.locked = [];
                          this.refresh();
                        }}
                        // mode='multiple'
                        // maxChoose={5}
                      />
                    </Col>
                    <Col xl={8}>
                      {/* <div className="form-group"> */}
                      <label className="w100pc">Barcode - Item name:</label>
                      {/* <BarcodeComp
                                                    idComponent={this.idBarcodeItem1}
                                                    ref={this.idBarcodeItem1Ref}
                                                    barCodes={this.itemsOrder}
                                                    AddBarcode={this.handleAddBarcode}
                                                    updateFilter={this.handleUpdateFilterBarcode}
                                                /> */}
                      <ModelInputSuggestItem
                        getBarcode={(val) => {
                          fields.barcode = val;
                          this.refresh();
                        }}
                      />
                      {/* </div> */}
                    </Col>
                  </Row>
                  <Row gutter={16} className="mrt-10">
                    <Col xl={24}>
                      {/* <Tag
                                                onClick={this.handleIsShowFilter}
                                                className="h-30 icon-orange"
                                            >
                                                <FilterOutlined />
                                            </Tag> */}

                      <Space
                        size={'small'}
                        // style={{ paddingTop: 11 }}
                      >
                        <Tag className="h-30 icon-search" onClick={this.handleSearch}>
                          <FileSearchOutlined /> <span className="icon-search-detail">Search</span>
                        </Tag>
                        <Tag
                          icon={<FileExcelOutlined />}
                          className="h-30 icon-excel"
                          onClick={() => handleExportAutoField(this.data.stock, 'SOH-Estimate')}
                        >
                          <span className="icon-excel-detail">Export</span>
                        </Tag>
                        {this.groupPendingFloatBtn &&
                          this.groupPendingFloatBtn.map((el, i) => (
                            <Fragment key={i}>
                              <Space
                                className="cursor btn-showpp bg-orange br-2"
                                size={'middle'}
                                style={{ padding: 5 }}
                                onClick={() => this.handleClickFloatingBtn('pending-' + el)}
                              >
                                <Badge
                                  style={{ transform: 'translate(50%, -70%)' }}
                                  count={this.objPending[el] && (this.objPending[el].length || 0)}
                                  overflowCount={this.objPending[el] && (this.objPending[el].length || 0)}
                                >
                                  <BellOutlined style={{ fontSize: 25, color: '#fff' }} />
                                </Badge>
                                <Typography.Text style={{ color: '#fff' }}>WAIT RCV</Typography.Text>
                              </Space>
                            </Fragment>
                          ))}
                        {this.groupLockFloatBtn &&
                          this.groupLockFloatBtn.map((el, i) => (
                            <Fragment key={i}>
                              <Space
                                className="cursor btn-showpp bg-orange br-2"
                                size={'middle'}
                                style={{ padding: 5 }}
                                onClick={() => this.handleClickFloatingBtn('lock-' + el)}
                              >
                                <Badge
                                  style={{ transform: 'translate(50%, -70%)' }}
                                  count={this.objLock[el] && (this.objLock[el].length || 0)}
                                  overflowCount={this.objLock[el] && (this.objLock[el].length || 0)}
                                >
                                  <LockOutlined style={{ fontSize: 25, color: '#fff' }} />
                                </Badge>
                                <Typography.Text style={{ color: '#fff', textTransform: 'uppercase' }}>
                                  LOCK {el}
                                </Typography.Text>
                              </Space>
                            </Fragment>
                          ))}
                      </Space>
                    </Col>
                  </Row>
                  {/* <Row gutter={16} className="mrt-10">
                                        <Col>
                                            <Button className="btn btn-danger h-30" onClick={this.handleSearch} >
                                                Search
                                            </Button>
                                            <Button className="btn btn-danger h-30" onClick={() => handleExportAutoField(this.data.stock, "SOH-Estimate")} >
                                                Export
                                            </Button>
                                        </Col>
                                    </Row> */}
                  {this.data.stock.length > 0 && (
                    <Row gutter={16} className="mrt-10">
                      <Col xl={8}>
                        <label htmlFor="categoryCode" className="w100pc">
                          Category:
                          <SelectBox
                            data={optCategory}
                            func={this.updateFilter}
                            funcCallback={() => {
                              this.page = 1;
                              this.refresh();
                            }}
                            keyField={'categoryCode'}
                            defaultValue={this.fieldSelected.categoryCode}
                            isMode={''}
                          />
                        </label>
                      </Col>

                      {/* <Col xl={8}>
                                                <div className="form-group">
                                                    <label htmlFor="categoryCode" className="w100pc">
                                                        Category:
                                                    </label>
                                                    <Select

                                                        isClearable
                                                        classNamePrefix="select"
                                                        maxMenuHeight={260}
                                                        placeholder="-- All --"
                                                        value={optCategory.filter((option) => option.value === this.fieldSelected.categoryCode)}
                                                        options={optCategory}
                                                        onChange={(e) => this.handleChangeFieldCustom("categoryCode", e ? e.value : "", () => { this.page = 1; this.refresh() })}
                                                    />
                                                </div>
                                            </Col> */}

                      <Col xl={8}>
                        <label htmlFor="numberSoh" className="w100pc">
                          Status estimate SOH:
                          <SelectBox
                            data={optEstSOH}
                            func={this.updateFilter}
                            funcCallback={() => {
                              this.page = 1;
                              this.refresh();
                            }}
                            keyField={'numberSoh'}
                            defaultValue={this.fieldSelected.numberSoh}
                            isMode={''}
                          />
                        </label>
                      </Col>

                      {/* <Col xl={8}>
                                                <div className="form-group">
                                                    <label htmlFor="numberSoh" className="w100pc">
                                                        Status estimate SOH :
                                                    </label>
                                                    <Select

                                                        isClearable
                                                        classNamePrefix="select"
                                                        maxMenuHeight={260}
                                                        placeholder="-- All --"
                                                        value={optEstSOH.filter((option) => option.value === this.fieldSelected.numberSoh)}
                                                        options={optEstSOH}
                                                        onChange={(e) => this.handleChangeFieldCustom("numberSoh", e ? e.value : "", () => { this.page = 1; this.refresh() })}
                                                    />
                                                </div>
                                            </Col> */}
                      <Col xl={6}>
                        <label htmlFor="itemCodeFilter" className="w100pc">
                          Items:
                          <SelectBox
                            data={this.itemCodeOpt}
                            func={this.updateFilter}
                            keyField={'itemCodeFilter'}
                            defaultValue={this.fieldSelected.itemCodeFilter}
                            isMode={''}
                          />
                        </label>
                      </Col>
                    </Row>
                  )}
                </Col>

                <Col xl={5}>
                  <Row gutter={16}>
                    <div className="cl-red bg-note">
                      {this.isSearch &&
                        (this.fieldSelected.isError === 1 ? (
                          <>
                            <span>
                              Last inventory: {DateHelper.displayDate(new Date(this.fieldSelected.lastInv))} inventory
                              not update, please wait process running{' '}
                            </span>{' '}
                            <br />
                          </>
                        ) : (
                          <>
                            <span style={{ color: 'green', fontWeight: 'bold' }}>
                              Current inventory:{' '}
                              {DateHelper.displayDate(new Date(this.fieldSelected.curInv || new Date()))} inventory
                              updated{' '}
                            </span>
                            <br />
                          </>
                        ))}
                      <span>Stock are running and update to every hours</span>
                    </div>
                  </Row>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  handleClickFloatingBtn = (id) => {
    if (!this.isSearch) {
      this.showAlert('Please click button search');
      return;
    }

    if (id === this.idTabLockComponent) {
      if (this.data.locked && this.data.locked.length <= 0) {
        this.showAlert('No items are locked');
        return;
      }
    }

    if (id === this.idTabPendingComponent) {
      if (this.data.pending && this.data.pending.length <= 0) {
        this.showAlert('No items are pending');
        return;
      }
    }

    this.handleShowPp(id);
  };

  handleHighlight = (qty) => {
    if (qty < 0) {
      return 'cl-red';
    }
    return '';
  };

  handleClickPaging = (page) => {
    this.page = page;
    this.refresh();
  };

  handleFilter = (arr) => {
    let lst = arr || [];

    if (this.fieldSelected.categoryCode !== '') {
      lst = lst.filter((a) => a.categoryCode == this.fieldSelected.categoryCode);
    }

    if (this.fieldSelected.numberSoh !== '') {
      if (this.fieldSelected.numberSoh === 0) {
        lst = lst.filter((a) => a.estSOH >= 0);
      } else {
        lst = lst.filter((a) => a.estSOH < 0);
      }
    }

    if (this.fieldSelected.itemCodeFilter !== '') {
      lst = lst.filter((a) => a.itemCode == this.fieldSelected.itemCodeFilter);
    }

    return lst;
  };

  renderList() {
    let item = this.handleFilter(this.data.stock);
    let itemsStock = item.length > 1 ? item.filter((el, i) => i >= (this.page - 1) * 30 && i < this.page * 30) : item;

    return (
      <>
        <section className="wrap-section">
          <div className="row">
            <div className="col-md-12">
              <div className="wrap-table table-chart" style={{ maxHeight: 'auto', overflow: 'initial' }}>
                {item.length > 0 ? (
                  <div className="row">
                    <div className="col-md-12 text-right">
                      <div style={{ display: 'inline-block' }}>
                        <Paging
                          page={this.page}
                          onClickPaging={this.handleClickPaging}
                          onClickSearch={() => console.log()}
                          itemCount={item.length}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  ''
                )}
                <table
                  className={'table table-hover detail-search-rcv ' + (item.length > 0 && 'mH-370')}
                  style={{ maxHeight: 'calc(100vh - 267px)', overflow: 'auto', display: 'block' }}
                >
                  <thead style={{ position: 'sticky', top: 0 }}>
                    <tr>
                      <th rowSpan={2} className="w10">
                        STT
                      </th>
                      <th rowSpan={2} className="w10">
                        Store
                      </th>
                      <th rowSpan={2}>Item code</th>
                      <th rowSpan={2} style={{ maxWidth: 420 }}>
                        Item name
                      </th>
                      <th rowSpan={2} className="text-center">
                        Open <br />
                        stock
                      </th>
                      <th colSpan={6} className="text-center">
                        Qty
                      </th>
                      <th rowSpan={2} className="text-center">
                        Sales <br />
                        qty
                      </th>
                      <th rowSpan={2} className="text-center">
                        SOH
                      </th>
                      <th rowSpan={2} className="text-center">
                        Est <br />
                        PO
                      </th>
                      <th rowSpan={2} className="text-center">
                        Est <br />
                        RCV
                      </th>
                      <th colSpan={3} className="text-center">
                        Estimate
                      </th>
                      {/* <th rowSpan={2} className='text-center'>Est <br/>dispatch</th> */}
                      <th rowSpan={2} className="text-center">
                        Est <br />
                        SOH
                      </th>
                    </tr>
                    {/* <tr style={{borderTop:'1px solid white'}}> */}
                    <tr>
                      <th className="text-center pos-relative">
                        <span
                          className="d-block pos-absolute"
                          style={{ height: 2, width: '105%', background: 'orange', top: '-2px', left: 0 }}
                        ></span>
                        Int <br />
                        transfer
                      </th>
                      <th className="text-center pos-relative">
                        <span
                          className="d-block pos-absolute"
                          style={{ height: 2, width: '105%', background: 'orange', top: '-2px', left: 0 }}
                        ></span>
                        Return <br />
                        supplier
                      </th>
                      <th className="text-center pos-relative">
                        <span
                          className="d-block pos-absolute"
                          style={{ height: 2, width: '105%', background: 'orange', top: '-2px', left: 0 }}
                        ></span>
                        Disposal
                      </th>
                      <th className="text-center pos-relative">
                        <span
                          className="d-block pos-absolute"
                          style={{ height: 2, width: '105%', background: 'orange', top: '-2px', left: 0 }}
                        ></span>
                        Store <br />
                        used
                      </th>
                      <th className="text-center pos-relative">
                        <span
                          className="d-block pos-absolute"
                          style={{ height: 2, width: '105%', background: 'orange', top: '-2px', left: 0 }}
                        ></span>
                        RCV <br />
                        supplier
                      </th>
                      <th className="text-center pos-relative">
                        <span
                          className="d-block pos-absolute"
                          style={{ height: 2, width: '105%', background: 'orange', top: '-2px', left: 0 }}
                        ></span>
                        RCV <br />
                        intTransfer
                      </th>

                      <th className="text-center pos-relative">
                        <span
                          className="d-block pos-absolute"
                          style={{ height: 2, width: '105%', background: 'orange', top: '-2px', left: 0 }}
                        ></span>
                        Disposal
                      </th>
                      <th className="text-center pos-relative">
                        <span
                          className="d-block pos-absolute"
                          style={{ height: 2, width: '105%', background: 'orange', top: '-2px', left: 0 }}
                        ></span>
                        Return <br />
                        supplier
                      </th>
                      <th className="text-center pos-relative">
                        <span
                          className="d-block pos-absolute"
                          style={{ height: 2, width: '105%', background: 'orange', top: '-2px', left: 0 }}
                        ></span>
                        Transfer
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsStock.map((item, i) => (
                      <tr key={i}>
                        <td className="w10">{i + 1}</td>
                        <td>{item.storeCode}</td>
                        <td>{item.itemCode}</td>
                        <td>{item.itemName}</td>
                        <td className={'text-center ' + this.handleHighlight(item.openStock)}>
                          <b>{StringHelper.formatValue(item.openStock)}</b>
                        </td>
                        <td
                          className={'text-center ' + this.handleHighlight(item.intTransferQty)}
                          style={{ background: 'antiquewhite' }}
                        >
                          {StringHelper.formatValue(item.intTransferQty)}
                        </td>
                        <td
                          className={'text-center ' + this.handleHighlight(item.returnSupplierQty)}
                          style={{ background: 'antiquewhite' }}
                        >
                          {StringHelper.formatValue(item.returnSupplierQty)}
                        </td>
                        <td
                          className={'text-center ' + this.handleHighlight(item.disposalQty)}
                          style={{ background: 'antiquewhite' }}
                        >
                          {StringHelper.formatValue(item.disposalQty)}
                        </td>
                        <td
                          className={'text-center ' + this.handleHighlight(item.storeUsedQty)}
                          style={{ background: 'antiquewhite' }}
                        >
                          {StringHelper.formatValue(item.storeUsedQty)}
                        </td>
                        <td
                          className={'text-center ' + this.handleHighlight(item.receivingSupplierQty)}
                          style={{ background: 'antiquewhite' }}
                        >
                          {StringHelper.formatValue(item.receivingSupplierQty)}
                        </td>
                        <td
                          className={'text-center ' + this.handleHighlight(item.receivingIntTransferQty)}
                          style={{ background: 'antiquewhite' }}
                        >
                          {StringHelper.formatValue(item.receivingIntTransferQty)}
                        </td>
                        <td className={'text-center ' + this.handleHighlight(item.salesQty)}>
                          {StringHelper.formatValue(item.salesQty)}
                        </td>
                        <td
                          className={'text-center bg-yellow' + this.handleHighlight(item.soh)}
                          style={{ background: 'ivory' }}
                        >
                          <b>{StringHelper.formatValue(item.soh)}</b>
                        </td>
                        <td className={'text-center ' + this.handleHighlight(item.estP)} style={{ background: 'aqua' }}>
                          {StringHelper.formatValue(item.estPO)}
                        </td>
                        <td
                          className={'text-center ' + this.handleHighlight(item.estRCV)}
                          style={{ background: 'aqua' }}
                        >
                          {StringHelper.formatValue(item.estRCV)}
                        </td>

                        <td
                          className={'text-center ' + this.handleHighlight(item.estDisposal)}
                          style={{ background: 'antiquewhite' }}
                        >
                          {StringHelper.formatValue(item.estDisposal)}
                        </td>
                        <td
                          className={'text-center ' + this.handleHighlight(item.estReturnSupplier)}
                          style={{ background: 'antiquewhite' }}
                        >
                          {StringHelper.formatValue(item.estReturnSupplier)}
                        </td>
                        <td
                          className={'text-center ' + this.handleHighlight(item.estTransfer)}
                          style={{ background: 'antiquewhite' }}
                        >
                          {StringHelper.formatValue(item.estTransfer)}
                        </td>

                        <td
                          className={'text-center ' + this.handleHighlight(item.estSOH)}
                          style={{ background: 'ivory' }}
                        >
                          <b>{StringHelper.formatValue(item.estSOH)}</b>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {itemsStock.length === 0 ? <div className="table-message">Search ...</div> : ''}
              </div>
            </div>
          </div>

          {this.groupPendingFloatBtn.map((el, i) => (
            <EstimateStockTab
              idComponent={'pending-' + el}
              items={this.objPending[el]}
              key={i}
              type={el}
              lock={''}
              report={this.itemReportPending}
            />
          ))}

          {this.groupLockFloatBtn.map((el, i) => (
            <EstimateStockTab
              idComponent={'lock-' + el}
              items={this.objLock[el]}
              key={i}
              type={el}
              lock={'lock'}
              report={this.itemReportLock}
            />
          ))}
        </section>
      </>
    );
  }

  renderComp() {
    return (
      <div>
        {this.renderFilter()}
        {this.renderList()}

        <div
          id="content-updating"
          className="detail-tab row d-none pos-absolute"
          style={{ width: '100%', height: '100%', top: 0, bottom: 0, background: 'white' }}
        >
          <h6 className="cl-red pos-relative" style={{ padding: '0 15px' }}>
            Dữ liệu đang được cập nhật, vui lòng quay lại sau.{' '}
            <button onClick={() => super.back('/')} type="button" className="btn btn-back">
              Back
            </button>
          </h6>
        </div>
      </div>
    );
  }
}
