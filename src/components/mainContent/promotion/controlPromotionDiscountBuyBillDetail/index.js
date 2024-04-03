//Plugin
import React from 'react';
// import DatePicker from "react-datepicker";
//Custom
import BaseComponent from 'components/BaseComponent';
import CommonModel from 'models/CommonModel';

import { Col, Popover, Row } from 'antd';
import moment from 'moment';
import InputComp from 'utils/input';
import InputNumberComp from 'utils/inputNumber';
import RadioComp from 'utils/radio';
import RangePicker from 'utils/rangePicker';
import SelectBox from 'utils/selectBox';
import SelectboxAndCheckbox from 'utils/selectboxAndCheckbox';
import WarningNote from 'components/common/warningNote/WarningNote';

export default class ControlPromotionDiscountBuyBillDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.idStatusRef = React.createRef();
    this.isCreate = this.props.isCreate;
    this.infoPromotion = this.props.infoPromotion || {};

    this.isUpdateForm = (this.infoPromotion.poCode || '') !== '';
    this.isAllowUpdate = !this.isUpdateForm || (!this.infoPromotion.approved && !this.infoPromotion.cancel);

    /*----------------------------------------*/
    /*----------------------------------------*/
    /*----------------------------------------*/
    /*----------------------------------------*/
    /*----------------------------------------*/
    /*----------------------------------------*/
    /*----------------------------------------*/
    /*----------------------------------------*/

    this.data.stores = [];

    if (this.infoPromotion.storeCode) {
      this.fieldSelected.storeCode = this.infoPromotion.storeCode;
      this.data.storeName = this.infoPromotion.storeName;
    }

    this.fieldSelected.promotionName = this.props.promotionName || '';
    this.fieldSelected.docLink = !this.isCopyType ? this.props.docLink : '';
    this.fieldSelected.docCode = !this.isCopyType ? this.props.docCode : '';
    // this.fieldSelected.discountBill = "";

    this.fieldSelected.createdDate = this.infoPromotion.createdDate
      ? new Date(this.infoPromotion.createdDate)
      : new Date();
    this.fieldSelected.startDate = this.infoPromotion.fromDate
      ? new Date(this.infoPromotion.fromDate)
      : moment().add(1, 'days');
    this.fieldSelected.endDate = this.infoPromotion.toDate
      ? new Date(this.infoPromotion.toDate)
      : moment().add(1, 'days');

    this.fieldSelected.group = '';

    this.fieldSelected.condition = this.props.condition || '';
    this.fieldSelected.discountAmount = this.props.discountAmount || '';
    this.fieldSelected.voucherValue = this.props.voucherValue || 0;
    this.fieldSelected.invoiceApplyInfor = this.props.invoiceApplyInfor || 0;
    this.fieldSelected.orderStatus = this.infoPromotion.active === 0 ? 2 : this.infoPromotion.active;

    this.listGroup = this.props.group || [];

    /*----------------------------------------*/
    /*----------------------------------------*/
    /*----------------------------------------*/
    /*----------------------------------------*/
    /*----------------------------------------*/
    /*----------------------------------------*/
    /*----------------------------------------*/
    /*----------------------------------------*/

    this.isRender = true;
  }

  componentDidMount() {
    this.handleUpdateState();
  }

  componentWillReceiveProps(newProps) {
    let isPoChange = this.props.infoPromotion !== newProps.infoPromotion;
    if (isPoChange) {
      this.infoPromotion = newProps.infoPromotion;
    }

    if (this.isCreate !== newProps.isCreate) {
      this.isCreate = newProps.isCreate;
    }

    if (newProps.group) {
      this.listGroup = newProps.group;
    }
    if (newProps.promotionName !== this.fieldSelected.promotionName) {
      this.fieldSelected.promotionName = newProps.promotionName;
    }
    // Doc update state
    if (newProps.docLink !== this.fieldSelected.docLink) {
      this.fieldSelected.docLink = newProps.docLink;
    }
    if (newProps.docCode !== this.fieldSelected.docCode) {
      this.fieldSelected.docCode = newProps.docCode;
    }
    // End Doc update state
    if (newProps.condition !== this.fieldSelected.condition) {
      this.fieldSelected.condition = newProps.condition;
    }
    if (newProps.discountAmount !== this.fieldSelected.discountAmount) {
      this.fieldSelected.discountAmount = newProps.discountAmount;
    }
    if (newProps.voucherValue !== this.fieldSelected.voucherValue) {
      this.fieldSelected.voucherValue = newProps.voucherValue;
    }
    if (newProps.invoiceApplyInfor !== this.fieldSelected.invoiceApplyInfor) {
      this.fieldSelected.invoiceApplyInfor = newProps.invoiceApplyInfor;
    }

    this.refresh();
  }

  async handleUpdateState() {
    if (!this.isUpdateForm || (!this.infoPromotion.approved && !this.infoPromotion.cancel)) {
      let commonModel = new CommonModel();
      await commonModel.getData('store').then((response) => {
        if (response.status && response.data.stores) {
          this.data.stores = response.data.stores;
        }
      });

      this.refresh();
    }
  }

  handleUpdateField = (value, key) => {
    let fields = this.fieldSelected;
    fields[key] = value;

    this.refresh();
  };

  handleUpdateDate = (start, end) => {
    let fields = this.fieldSelected;
    fields.startDate = start;
    fields.endDate = end;

    this.props.updateDate(start, end);
    this.refresh();
  };

  handleUpdateStore = (value) => {
    let fields = this.fieldSelected;
    fields.storeCode = value;

    this.refresh();
  };

  renderComp() {
    let fields = this.fieldSelected;

    let stores = this.data.stores;
    let orderStore = {};
    let storeOptions = [];

    Object.keys(stores)
      .sort()
      .forEach(function (key) {
        orderStore[key] = stores[key];
      });

    if (Object.keys(stores).length === 0) {
      let obj = {
        value: this.data.storeCode,
        label: this.data.storeCode + ' - ' + this.data.storeName,
      };
      storeOptions.push(obj);
    } else {
      storeOptions = Object.keys(orderStore).map((key) => {
        let obj = {
          value: stores[key].storeCode,
          label: stores[key].storeCode + ' - ' + stores[key].storeName,
        };
        return obj;
      });
    }

    let statusOptions = [
      { value: 2, label: 'Inactive' },
      { value: 1, label: 'Active' },
    ];
    const isRunning = this.props.isRunning;

    return (
      <section>
        <div className="form-filter">
          <Row>
            <Col xl={24}>
              <div className="section-block">
                <Row gutter={16}>
                  <Col xl={24}>
                    <Row gutter={[16, 16]}>
                      <Col xl={8} xxl={6}>
                        <label htmlFor="promotionName" className="w100pc">
                          <span className="required">Promotion name:</span>
                          <InputComp
                            isDisable={isRunning}
                            func={this.handleUpdateField}
                            funcCallback={this.props.updatePromotionName}
                            keyField="promotionName"
                            text={fields.promotionName}
                          />
                        </label>
                      </Col>

                      <Col xl={8} xxl={6}>
                        <label htmlFor="date" className="w100pc">
                          <span className="required"> Apply date:</span>
                          <div>
                            {/* <RangePicker start={fields.startDate} end={fields.endDate} func={this.handleUpdateDate} funcCallback={this.props.updateDate} disabledDate={new Date()}/> */}
                            <RangePicker
                              disabledDate={(currentDate) => currentDate && currentDate < moment().endOf('day')}
                              disabled={isRunning}
                              start={fields.startDate}
                              end={fields.endDate}
                              func={this.handleUpdateDate}
                              funcCallback={this.props.updateDate}
                            />
                          </div>
                        </label>
                      </Col>

                      <Col xl={8} xxl={6}>
                        <label htmlFor="storeCode" className="w100pc">
                          Apply store:
                          {isRunning ? (
                            <Popover
                              title={`Selected store (${fields.storeCode?.length || 0})`}
                              content={
                                <ul
                                  style={{
                                    maxHeight: '500px',
                                    overflowY: 'scroll',
                                  }}
                                >
                                  {fields?.storeCode?.map((item) => {
                                    return (
                                      <li>
                                        <p>{item}</p>
                                      </li>
                                    );
                                  })}
                                </ul>
                              }
                            >
                              <SelectBox
                                isDisable={isRunning}
                                data={storeOptions}
                                placeholder={'All store'}
                                func={this.handleUpdateStore}
                                keyField="storeCode"
                                value={fields.storeCode || []}
                                isMode={'multiple'}
                                funcCallback={this.props.updateStore}
                              />
                            </Popover>
                          ) : (
                            <SelectboxAndCheckbox
                              isDisable={isRunning}
                              data={storeOptions}
                              placeholder={'All store'}
                              func={this.handleUpdateStore}
                              keyField="storeCode"
                              value={fields.storeCode || []}
                              isMode={'multiple'}
                              funcCallback={this.props.updateStore}
                            />
                          )}
                        </label>
                      </Col>
                      <Col xl={8} xxl={6}></Col>
                      <Col xl={8} xxl={6}>
                        <label htmlFor="condition" className="w100pc">
                          <span className="required">Buy bill amount:</span>
                          <div>
                            <InputNumberComp
                              isDisable={isRunning}
                              value={fields.condition}
                              funcCallback={this.props.updateCondition}
                              func={this.handleUpdateField}
                              keyField={'condition'}
                            />
                          </div>
                        </label>
                      </Col>
                      <Col xl={8} xxl={6}>
                        <label htmlFor="discountAmount" className="w100pc">
                          <span className="required">Discount amount:</span>
                          <div>
                            <InputNumberComp
                              isDisable={isRunning}
                              value={fields.discountAmount}
                              funcCallback={this.props.updateDiscountAmount}
                              func={this.handleUpdateField}
                              keyField={'discountAmount'}
                            />
                          </div>
                        </label>
                      </Col>
                      {!this.isCreate && (
                        <Col xl={8} xxl={6}>
                          <label htmlFor="orderStatus" className="w100pc">
                            Status:
                            {/* <SelectBox data={statusOptions} func={this.handleUpdateField} funcCallback={this.props.updateActive} keyField={'orderStatus'} value={fields.orderStatus} isMode={''} /> */}
                            <RadioComp
                              disabled={isRunning}
                              data={statusOptions}
                              value={fields.orderStatus}
                              ref={this.idStatusRef}
                              // funcCallback={this.handleUpdateStatusApi}
                              funcCallback={this.props.updateActive}
                            />
                          </label>
                        </Col>
                      )}
                    </Row>
                  </Col>
                </Row>
              </div>
            </Col>
            {/* Doc */}
            <Col span={24} className="section-block mt-15">
              <p className="mb-10">Dept. of I&T note</p>
              <Row gutter={[16, 16]}>
                <Col xl={8} xxl={4}>
                  <label htmlFor="promotionName" className="w100pc ">
                    <span className="required">Dept. of I&T code:</span>
                    <InputComp
                      isDisable={isRunning}
                      func={this.handleUpdateField}
                      funcCallback={this.props.updateDocCode}
                      keyField="docCode"
                      text={fields.docCode}
                    />
                  </label>
                </Col>
                <Col xl={8} xxl={4}>
                  <label htmlFor="promotionName" className="w100pc ">
                    <span className="">Dept. of I&T link:</span>
                    <InputComp
                      isDisable={isRunning}
                      func={this.handleUpdateField}
                      funcCallback={this.props.updateDocLink}
                      keyField="docLink"
                      text={fields.docLink}
                    />
                  </label>
                </Col>
              </Row>
            </Col>
            {/* END Doc */}
          </Row>
        </div>
      </section>
    );
  }
}
