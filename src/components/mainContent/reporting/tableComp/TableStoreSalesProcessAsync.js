import { Col, Popover, Row, Tag } from 'antd';
import BaseComponent from 'components/BaseComponent';
import { StringHelper } from 'helpers';
import Icons from 'images/icons';
import React from 'react';
import Select from 'react-select';

export default class TableStoreSalesProcessAsync extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent = 'listDetail' + StringHelper.randomKey();
    this.items = [];

    this.itemReport = {
      totalItem: 0,
      totalOpenStock: 0,
      totalRcvQty: 0,
      totalSaleQty: 0,
      totalDeliveryQty: 0,
      totalSOH: 0,
    };

    this.fieldSelected.status = '';
    this.fieldSelected.statusStore = '';
    this.page = 1;

    this.dataCompareSaleRegion = [];
    this.colorBg = ['bg-block', 'bg-block-antiquewhite', 'bg-block-green', 'bg-block-red'];
    this.isDataRegion = false;
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.items !== this.items) {
      this.items = newProps.items;
    }
    // if (newProps.fieldSelected !== this.fieldSelected) {
    //     this.fieldSelected = newProps.fieldSelected;
    // }
    if (newProps.itemReport !== this.itemReport) {
      this.itemReport = newProps.itemReport;
    }

    if (newProps.dataCompareSaleRegion !== this.dataCompareSaleRegion) {
      this.dataCompareSaleRegion = newProps.dataCompareSaleRegion;
    }

    if (newProps.isDataRegion !== this.isDataRegion) {
      this.isDataRegion = newProps.isDataRegion;
    }

    this.page = 1;
    this.refresh();
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

  highLightText = (txt) => {
    if (txt === 'A') {
      return 'hl-red';
    } else if (txt === 'B') {
      return 'hl-yellow';
    } else {
      return '';
    }
  };

  handleReturnStatus = (status, statusStore) => {
    if (status === undefined) {
      return '';
    } else if (status) {
      return <span className="label label-success">Done</span>;
    } else {
      return <span className="label label-warning">Waiting</span>;
    }
  };

  handleReturnStatusStore = (status) => {
    if (status === 0) {
      return <span className="label label-success">Open</span>;
    } else if (status === 1) {
      return <span className="label label-danger">Closed</span>;
    } else {
      return <span className="label label-primary">Hold</span>;
    }
  };

  handleFilter = (lst) => {
    let arr = [];

    arr =
      this.fieldSelected.statusStore !== '' ? lst.filter((a) => a.statusStore === this.fieldSelected.statusStore) : lst;
    arr = this.fieldSelected.status !== '' ? arr.filter((a) => a.status === this.fieldSelected.status) : arr;

    return arr;
  };

  handleSum = (obj) => {
    let newSum = {
      storeOpen: 0,
      success: 0,
      process: 0,
      unknow: 0,
    };

    for (let k in obj) {
      let item = obj[k];

      if (item.statusStore === 0) {
        newSum.storeOpen += 1;
      }

      if (item.status === 1) {
        newSum.success += 1;
      } else {
        if (item.status === undefined) {
          if (item.statusStore === 0) {
            newSum.unknow += 1;
          }
        } else {
          newSum.process += 1;
        }
      }
    }
    return newSum;
  };
  checkDifferenceNumberInList = (numsList) => {
    const map = new Map();
    for (let item of numsList) {
      if (map.get(item)) {
        const current = map.get(item);
        map.set(item, current + 1);
      } else {
        map.set(item, 1);
      }
    }
    if (map.get(numsList[0]) === 3) return true;
    return false;
  };
  render() {
    let items = this.handleFilter(this.items);
    let objSum = this.handleSum(this.items);

    let optStatus = [
      {
        label: 'Done',
        value: 1,
      },
      {
        label: 'Waiting',
        value: 0,
      },
    ];

    let optStatusStore = [
      {
        label: 'Open',
        value: 0,
      },
      {
        label: 'Closed',
        value: 1,
      },
      {
        label: 'Hold',
        value: 2,
      },
    ];

    let dataObjRegion = {
      netSale: 0,
      dataMaster: 0,
      grossSage: 0,
      biReport: 0,
    };

    for (let key in this.dataCompareSaleRegion) {
      let item = this.dataCompareSaleRegion[key];
      if (item.name === 'Web Store Net sales') {
        dataObjRegion.netSale = item.sale;
      }
      if (item.name === 'Web Store Gross sales') {
        dataObjRegion.grossSage = item.sale;
      }

      if (item.name === 'Data Master') {
        dataObjRegion.dataMaster = item.sale;
      }
      if (item.name === 'BI Report') {
        dataObjRegion.biReport = item.sale;
      }
    }

    // let itemsIndex = data.length > 1 ? data.filter((el,i)=> (i >= (this.page - 1) * 30) && (i < this.page * 30) ) : data;
    // let itemsIndex = items.length > 1 ? items.filter((el,i)=> (i >= (this.page - 1) * 30) && (i < this.page * 30) ) : items;

    return (
      <section id={this.idComponent}>
        <Row gutter={[16, 16]} style={{ justifyContent: 'space-between', padding: '0 10px' }}>
          {/* <div className={'pos-relative  ' + this.colorBg[0]}>
            <h6 className="mrt-0">Web Store Net sales</h6>
            {this.isDataRegion ? (
              <h5 className="cl-org">{StringHelper.formatValue(dataObjRegion.netSale)}</h5>
            ) : (
              <div className="spinner-border text-primary br-black" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </div> */}
          <div className={'pos-relative  ' + this.colorBg[0]} style={{ width: 150 }}>
            <h6 className="mrt-0">Web Store Gross sales</h6>
            {this.isDataRegion ? (
              <div className="flex flex-col items-center">
                <h5
                  className={
                    this.checkDifferenceNumberInList([
                      dataObjRegion.dataMaster,
                      dataObjRegion.biReport,
                      dataObjRegion.grossSage,
                    ])
                      ? 'cl-org'
                      : 'cl-red'
                  }
                  style={{ margin: 0 }}
                >
                  {this.checkDifferenceNumberInList([
                    dataObjRegion.dataMaster,
                    dataObjRegion.biReport,
                    dataObjRegion.grossSage,
                  ]) ? null : (
                    <Popover content="Data not match" placement="topLeft">
                      <Icons.Warning className="cl-red shake_animation" />
                    </Popover>
                  )}{' '}
                  {StringHelper.formatValue(dataObjRegion.grossSage)}
                </h5>
                <p className="m-0 hint">Net {StringHelper.formatValue(dataObjRegion.netSale)}</p>
              </div>
            ) : (
              <div className="spinner-border text-primary br-black" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </div>
          <div className={'pos-relative  ' + this.colorBg[0]}>
            <h6 className="mrt-0">Data Master</h6>
            {this.isDataRegion ? (
              <h5
                className={
                  this.checkDifferenceNumberInList([
                    dataObjRegion.dataMaster,
                    dataObjRegion.biReport,
                    dataObjRegion.grossSage,
                  ])
                    ? 'cl-org'
                    : 'cl-red'
                }
              >
                {this.checkDifferenceNumberInList([
                  dataObjRegion.dataMaster,
                  dataObjRegion.biReport,
                  dataObjRegion.grossSage,
                ]) ? null : (
                  <Popover content="Data not match" placement="topLeft">
                    <Icons.Warning className="cl-red" />
                  </Popover>
                )}{' '}
                {StringHelper.formatValue(dataObjRegion.dataMaster)}
              </h5>
            ) : (
              <div className="spinner-border text-primary br-black" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </div>
          <div className={'pos-relative  ' + this.colorBg[0]}>
            <h6 className="mrt-0">Data WH Report</h6>
            {this.isDataRegion ? (
              <h5
                className={
                  this.checkDifferenceNumberInList([
                    dataObjRegion.dataMaster,
                    dataObjRegion.biReport,
                    dataObjRegion.grossSage,
                  ])
                    ? 'cl-org'
                    : 'cl-red'
                }
              >
                {this.checkDifferenceNumberInList([
                  dataObjRegion.dataMaster,
                  dataObjRegion.biReport,
                  dataObjRegion.grossSage,
                ]) ? null : (
                  <Popover content="Data not match" placement="topLeft">
                    <Icons.Warning className="cl-red" />
                  </Popover>
                )}{' '}
                {StringHelper.formatValue(dataObjRegion.biReport)}
              </h5>
            ) : (
              <div className="spinner-border text-primary br-black" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </div>
        </Row>

        <Row gutter={[16, 16]} className=" mt-10">
          <Col span={6}>
            <div className="form-group">
              <label htmlFor="statusStore" className="w100pc">
                Store status:
              </label>
              <Select
                isClearable
                classNamePrefix="select"
                maxMenuHeight={260}
                placeholder="-- All --"
                value={optStatusStore.filter((option) => option.value === this.fieldSelected.statusStore)}
                options={optStatusStore}
                onChange={(e) => this.handleChangeFieldCustom('statusStore', e ? e.value : '')}
              />
            </div>
          </Col>

          <Col span={6}>
            <div className="form-group">
              <label htmlFor="status" className="w100pc">
                Async status:
              </label>
              <Select
                isClearable
                classNamePrefix="select"
                maxMenuHeight={260}
                placeholder="-- All --"
                value={optStatus.filter((option) => option.value === this.fieldSelected.status)}
                options={optStatus}
                onChange={(e) => this.handleChangeFieldCustom('status', e ? e.value : '')}
              />
            </div>
          </Col>

          <Col span={8} offset={4} className="text-right">
            <table className="table-hover d-block" style={{ float: 'right', overflow: 'auto' }}>
              <thead>
                <tr>
                  <th className="fs-10 pd-5 bd-none text-center">Store open</th>
                  <th className="fs-10 pd-5 bd-none text-center">Done</th>
                  <th className="fs-10 pd-5 bd-none text-center">Waiting</th>
                  <th className="fs-10 pd-5 bd-none text-center">Not sale</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fs-10 pd-5 bd-none text-center" style={{ background: 'ivory', width: '80px' }}>
                    {StringHelper.formatValue(objSum.storeOpen)}
                  </td>
                  <td className="fs-10 pd-5 bd-none text-center" style={{ background: 'aliceblue', width: '60px' }}>
                    {StringHelper.formatValue(objSum.success)}
                  </td>
                  <td className="fs-10 pd-5 bd-none text-center" style={{ background: 'ivory', width: '80px' }}>
                    {StringHelper.formatValue(objSum.process)}
                  </td>
                  <td className="fs-10 pd-5 bd-none text-center" style={{ background: 'aliceblue', width: '80px' }}>
                    {StringHelper.formatValue(objSum.unknow)}
                  </td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>

        <div
          className="wrap-table table-chart w-full"
          style={{
            overflow: 'initial',
            zIndex: 1,
            position: 'relative',
            maxHeight: 'calc(100vh - 390px)',
            overflowY: 'scroll',
          }}
        >
          <table className={'table table-hover d-block ' + (items.length > 0 && 'mH-370')} style={{}}>
            <thead>
              <tr>
                <th>STT</th>
                <th>Store</th>
                <th>Store status</th>
                <th>Process status</th>
                <th>Note</th>
                <th className="flex items-center gap-10">
                  Counter status
                  {/* <Icons.Dot color="gray" />
                  offline */}
                  <Icons.RotateRight
                    color="white"
                    onClick={this.props.onRefreshCountersStatus}
                    className="cursor-pointer"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                return (
                  <tr key={index} data-group="itemGroup">
                    <td>{index + 1}</td>
                    <td style={{ background: 'aliceblue' }}>{item.storeCode}</td>
                    <td style={{ background: 'aliceblue' }}>{this.handleReturnStatusStore(item.statusStore)}</td>
                    <td style={{ background: 'aliceblue' }}>
                      {this.handleReturnStatus(item.status, item.statusStore)}
                    </td>
                    <td style={{ background: 'aliceblue' }}>{item.note}</td>
                    <td style={{ background: 'aliceblue' }}>
                      {item.status !== undefined && !item.status
                        ? Object.values(item.counters || {})?.map((item, index) => {
                            return (
                              <Tag
                                color={this.props.countersOnline?.[item.counterCode] ? 'green' : '#c4c4c4'}
                                className=""
                                style={{ margin: '0 5px 0 0o' }}
                              >
                                {item.counterCode}
                              </Tag>
                            );
                          })
                        : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {items.length === 0 ? <div className="table-message">Search ...</div> : ''}
        </div>
      </section>
    );
  }
}
