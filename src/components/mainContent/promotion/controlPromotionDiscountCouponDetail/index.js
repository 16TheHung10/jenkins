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
import RangePicker from 'utils/rangePicker';
import SelectBox from 'utils/selectBox';
import SelectboxAndCheckbox from 'utils/selectboxAndCheckbox';

export default class ControlPromotionDiscountCouponDetail extends BaseComponent {
  constructor(props) {
    super(props);
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
    } else {
      this.fieldSelected.storeCode = [];
    }

    this.fieldSelected.promotionName = this.props.promotionName || '';
    this.fieldSelected.docLink = !this.isCopyType ? this.props.docLink : '';
    this.fieldSelected.docCode = !this.isCopyType ? this.props.docCode : '';
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

    this.fieldSelected.discountAmount = this.props.discountAmount || '';

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
    this.idStatusRef = React.createRef();
    this.isRender = true;
  }

  componentDidMount() {
    this.handleUpdateState();
  }

  componentWillReceiveProps(newProps) {
    let isPoChange = this.props.infoPromotion !== newProps.infoPromotion;
    if (isPoChange) {
      this.infoPromotion = newProps.infoPromotion;
      this.fieldSelected.orderStatus = newProps.infoPromotion.active === 0 ? 2 : newProps.infoPromotion.active;
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

    if (newProps.discountAmount !== this.fieldSelected.discountAmount) {
      this.fieldSelected.discountAmount = newProps.discountAmount;
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
    let discountOptions = [
      { value: 5, label: '5%' },
      { value: 7, label: '7%' },
      { value: 10, label: '10%' },
      { value: 15, label: '15%' },
      { value: 20, label: '20%' },
      { value: 30, label: '30%' },
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
                          <span className="required"> Coupon code:</span>
                          <InputComp
                            isDisable={isRunning}
                            func={this.handleUpdateField}
                            funcCallback={this.props.updatePromotionName}
                            keyField="promotionName"
                            text={fields.promotionName}
                            placeholder={'exp: ABCDCODE'}
                            typeText={'uppercase'}
                          />
                        </label>
                      </Col>

                      <Col xl={8} xxl={6}>
                        <label htmlFor="date" className="w100pc">
                          <span className="required">Apply date:</span>
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
                    </Row>
                    <Row gutter={16} className="mt-15">
                      <Col xl={8} xxl={6}>
                        <label htmlFor="discountAmount" className="w100pc">
                          <span className="required">Discount (%):</span>
                          <InputNumberComp
                            isDisable={isRunning}
                            func={this.handleUpdateField}
                            funcCallback={this.props.updateDiscountAmount}
                            keyField="discountAmount"
                            value={fields.discountAmount}
                            placeholder="1% to 100%"
                            minValue={1}
                            maxValue={100}
                          />
                          {/* <SelectBox
                            data={discountOptions}
                            placeholder={'Percent'}
                            func={this.handleUpdateField}
                            keyField="discountAmount"
                            value={fields.discountAmount}
                            isMode={''}
                            funcCallback={this.props.updateDiscountAmount}
                            // isAdd={true}
                            // typeAdd={'number'}
                          /> */}
                          {/* <div>
                                                <InputNumberComp value={fields.discountAmount} funcCallback={this.props.updateDiscountAmount} func={this.handleUpdateField} keyField={'discountAmount'} />
                                            </div> */}
                        </label>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Col>
            {/* Doc */}
            <Col span={24} className="section-block mt-15 ">
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
