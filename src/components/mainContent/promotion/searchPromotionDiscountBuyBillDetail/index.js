//Plugin
import React from 'react';

//Custom
import BaseComponent from 'components/BaseComponent';
import { DateHelper, StringHelper } from 'helpers';
import PromotionModel from 'models/PromotionModel';

// import ListDetail from "components/mainContent/promotion/listDetailDiscountBill";
import { message } from 'antd';
import ControlDetail from 'components/mainContent/promotion/controlPromotionDiscountBuyBillDetail';
import moment from 'moment';
import WarningNote from 'components/common/warningNote/WarningNote';

export default class SearchPromotionDiscountBuyBillDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.orderCode = this.props.orderCode || '';
    this.isCreate = this.orderCode === '';
    this.group = [];
    this.numberGroup = 1;

    this.isUpdateForm = this.orderCode !== '';
    this.isAllowShowForm = true;
    this.isAllowSave = true;
    this.isAllowUpdateStatus = false;
    this.items = [];
    this.infoPromotion = {};

    this.idFilterItemsComponent = 'filterItemPopup' + StringHelper.randomKey();

    this.startDate = this.infoPromotion.fromDate ? new Date(this.infoPromotion.fromDate) : moment().add(1, 'day');
    this.endDate = this.infoPromotion.toDate ? new Date(this.infoPromotion.toDate) : moment().add(1, 'day');
    this.store = [];
    this.promotionName = '';
    this.docLink = '';
    this.docCode = '';
    this.active = '';
    this.partnerList = [{ codeName: '', codeValue: '' }];
    this.dayOfWeeks = [];
    this.discountBill = '';

    this.indexAddMore = -1;
    this.condition = '';
    this.discountAmount = '';
    this.voucherValue = '';
    this.invoiceApplyInfor = '';

    this.isRunning = false;
    this.idListComponentRef = React.createRef();
    this.addItemRef = React.createRef();

    if (!this.isUpdateForm) {
      this.isRender = true;
    }
  }

  updateStartDate = (date) => {
    this.startDate = date;
    this.refresh();
  };
  updateEndDate = (date) => {
    this.endDate = date;
    this.refresh();
  };
  updateDate = (start, end) => {
    this.startDate = start;
    this.endDate = end;
    this.refresh();
  };
  updateStore = (date) => {
    this.store = date;
    this.refresh();
  };
  updateDocLink = (value) => {
    this.docLink = value;
    this.refresh();
  };
  updateDocCode = (value) => {
    this.docCode = value;
    this.refresh();
  };
  updatePromotionName = (value) => {
    this.promotionName = value;
    this.refresh();
  };
  updateActive = (value) => {
    this.active = value;
    this.refresh();
  };

  componentDidMount = () => {
    this.handleUpdateState();
  };

  handleUpdateState = async () => {
    if (this.orderCode !== '') {
      let model = new PromotionModel();
      await model.getPromotion('bill', this.orderCode).then((res) => {
        if (res.status && res.data) {
          if (res.data.promotion) {
            this.infoPromotion = res.data.promotion;
            this.promotionName = res.data.promotion.promotionName;
            this.docLink = res.data.promotion.docLink;
            this.docCode = res.data.promotion.docCode;
            this.fieldSelected.store = this.infoPromotion.storeCode || '';

            this.startDate = this.infoPromotion.fromDate
              ? new Date(this.infoPromotion.fromDate)
              : moment().add(1, 'day');
            this.endDate = this.infoPromotion.toDate ? new Date(this.infoPromotion.toDate) : moment().add(1, 'day');

            this.items = this.infoPromotion.promotionDetails;

            this.condition = this.infoPromotion.condition || '';
            this.discountAmount = this.infoPromotion.discountAmount || '';
            this.voucherValue = this.infoPromotion.voucherValue || 0;
            this.invoiceApplyInfor = this.infoPromotion.invoiceApplyInfor || 0;

            this.active = this.infoPromotion.active === 0 ? 2 : this.infoPromotion.active;
          }
          this.isRunning =
            (moment(this.startDate).isBefore(moment()) && moment(moment()).isBefore(this.endDate)) ||
            moment(this.endDate).isBefore(moment());
          this.props.onUpdateIsRunning(
            (moment(this.startDate).isBefore(moment()) && moment(moment()).isBefore(this.endDate)) ||
              moment(this.endDate).isBefore(moment())
          );
          this.props.onUpDateState(
            !this.isCopyType ? (this.infoPromotion.active === 0 ? 2 : this.infoPromotion.active) : ''
          );
          this.refreshAction();
          this.refresh();
        } else {
          // this.targetLink("/promotion-discount-buy-bill");
          message.error(res.message);
        }
      });
      // this.handleHotKey(this.funcHotKey);
    } else {
      // this.refreshAction();
      super.getActionMenu().showHideActionItem(['save'], this.isAllowSave);
      // this.handleHotKey(this.funcHotKey);
    }
  };

  refreshAction = () => {
    super.getActionMenu().showHideActionItem(['save', 'updatestatus'], this.isAllowSave);
    // super.getActionMenu().showHideActionItem(["approve", "delete"], this.isAllowUpdateStatus);
  };

  handleSave = () => {
    if (this.promotionName === '') {
      message.error('Please enter promotion name');
      return;
    }

    if (this.startDate === '' || this.startDate === null || this.endDate === '' || this.endDate === null) {
      message.error('Please select date');
      return;
    }

    if (!this.isCreate && DateHelper.diffDate(new Date(), new Date(this.startDate)) <= 0) {
      message.error('Apply date must be greater than or equal to current date');
      return;
    }

    if (this.condition === '') {
      message.error('Please enter buy bill amount');
      return;
    }

    if (parseFloat(this.condition) < 10000) {
      message.error('Please enter buy bill amount more than 10000 VND');
      return;
    }

    if (this.discountAmount === '') {
      message.error('Please enter discount amount');
      return;
    }

    if (parseFloat(this.discountAmount) < 1000) {
      message.error('Please enter discount amount more than 1000 VND');
      return;
    }

    if (parseFloat(this.condition) <= parseFloat(this.discountAmount)) {
      message.error('Please enter buy bill amount more than discount amount');
      return;
    }
    if (!this.docCode) {
      message.error('Please add docs code');
      return;
    }

    let model = new PromotionModel();

    let params = {
      promotionName: this.promotionName,
      startDate: DateHelper.displayDateFormatMinus(this.startDate),
      endDate: DateHelper.displayDateFormatMinus(this.endDate) + 'T23:59:59',
      storeCode: this.store.length > 0 ? this.store : [],
      condition: this.condition,
      discountAmount: this.discountAmount,
      voucherValue: this.voucherValue === '' ? 0 : this.voucherValue,
      invoiceApplyInfor: this.invoiceApplyInfor === '' ? 0 : this.invoiceApplyInfor,
      billPromotionType: 2,
      docCode: this.docCode,
      docLink: this.docLink,
    };

    if (this.orderCode !== '') {
      params.status = parseInt(this.active === 2 ? 0 : this.active);
      model.putPromotion('bill', this.orderCode, params).then((res) => {
        if (res.status && res.data) {
          if (res.data.promotionCode && res.data.promotionCode !== '') {
            this.targetLink('/promotion-discount-buy-bill/' + res.data.promotionCode, '/promotion-discount-buy-bill');
          }
          message.success('Save successfully!', 3);
        } else {
          message.error(res.message);
        }
      });
    } else {
      params.status = 1;
      model.postPromotion('bill', params).then((res) => {
        if (res.status && res.data) {
          if (res.data.promotionCode && res.data.promotionCode !== '') {
            this.targetLink('/promotion-discount-buy-bill/' + res.data.promotionCode, '/promotion-discount-buy-bill');
          }
          message.success('Save successfully!', 3);
        } else {
          message.error(res.message);
        }
      });
    }
  };

  handleUpdateStatus = () => {
    let model = new PromotionModel();
    let type = this.active === 1 ? '/active' : '/inactive';
    let page = 'bill' + type;
    model.putPromotion(page, this.infoPromotion.promotionCode).then((res) => {
      if (res.status && res.data) {
        message.success('Save successfully!', 3);
      } else {
        message.error(res.message);
      }
    });
  };

  handleAddItemsToList = (results, index) => {
    let arrGroup = [];

    for (let elm in results) {
      let objElm = results[elm].item;

      this.items.push(objElm);
    }

    this.refresh();
  };

  handleUpdateItems = (items) => {
    this.items = items;
    this.refresh();
  };

  updateCondition = (value) => {
    this.condition = value;
    this.refresh();
  };
  updateDiscountAmount = (value) => {
    this.discountAmount = value;
    this.refresh();
  };
  updateVoucherValue = (value) => {
    this.voucherValue = value;
    this.refresh();
  };
  updateInvoiceApplyInfor = (value) => {
    this.invoiceApplyInfor = value;
    this.refresh();
  };

  renderComp = () => {
    this.funcHotKey = {
      ppFilter: () => this.handleShowFilterItems(),
      addItem:
        this.isAllowShowForm && (!this.isUpdateForm || (!this.infoPromotion.approved && !this.infoPromotion.cancel))
          ? () => this.addItemRef.current.handleAddItems()
          : undefined,
    };
    const isRunning = this.isRunning;

    return (
      <section className="wrap-section">
        <div className="section-block mt-15">
          <div className="row header-detail ">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 flex items-center gap-10">
              <div className="flex justify-content-between items-center w-full">
                <div className="">
                  <button
                    onClick={() => super.back('/promotion-mix-and-match')}
                    type="button"
                    className="btn btn-back"
                    style={{ background: 'beige' }}
                  >
                    Back
                  </button>
                  <h2 className="name-target">
                    {this.isCopyType ? (
                      'New promotion'
                    ) : (
                      <>{!this.isUpdateForm ? 'New promotion' : '#' + this.orderCode}</>
                    )}
                  </h2>
                  {!this.isCopyType && (
                    <>
                      {!this.isCreate && (
                        <h6
                          className="d-inline-block"
                          style={{
                            verticalAlign: 'middle',
                            marginTop: 8,
                            marginLeft: 10,
                          }}
                        >
                          Created date: {DateHelper.displayDate(this.infoPromotion.createdDate)}
                        </h6>
                      )}
                    </>
                  )}

                  {/* lasted update */}
                  {this.infoPromotion && Object.keys(this.infoPromotion).length > 0 ? (
                    <div className="update_info m-0">
                      <h6 className="flex m-0">
                        <span>Latest update :</span>
                        <span className="color-primary font-bold">
                          {this.infoPromotion?.updatedDate
                            ? moment(new Date(this.infoPromotion?.updatedDate)).format('DD-MM-YYYY - HH:mm:ss')
                            : null}
                        </span>
                        {this.infoPromotion?.updateBy ? (
                          <span className="ml-10">
                            {' '}
                            By - <span className="color-primary font-bold"> {this.infoPromotion?.updateBy || ''}</span>
                          </span>
                        ) : null}
                      </h6>
                    </div>
                  ) : null}
                </div>
                <WarningNote>
                  <div className="cl-red bg-note">
                    <strong>Lưu ý chức năng:</strong>
                    <br />
                    - Tên của khuyến mãi phải rõ ràng, chi tiết, thể hiện được mục đích của khuyến mãi.
                    <br />
                    - Chương trình khuyến mãi sẽ được cập nhật qua ngày.
                    <br />
                    - Loại khuyến mãi giảm giá theo hóa đơn.
                    <br />
                    - Thời gian áp dụng phải sau ngày hiện tại.
                    <br />
                    - Tiền giảm giá không được lớn hơn giá trị hóa đơn mua.
                    <br />- Dept. of I&T note: cập nhật thông tin đã đăng ký với cơ quan, tổ chức nhà nước.
                  </div>
                </WarningNote>
              </div>
            </div>
          </div>
        </div>

        {this.isAllowShowForm ? (
          <ControlDetail
            docCode={this.docCode}
            docLink={this.docLink}
            updateDocCode={this.updateDocCode}
            updateDocLink={this.updateDocLink}
            isRunning={this.isRunning}
            isCreate={this.isCreate}
            infoPromotion={this.infoPromotion}
            group={this.group}
            updateStartDate={this.updateStartDate}
            updateEndDate={this.updateEndDate}
            updateStore={this.updateStore}
            updatePromotionName={this.updatePromotionName}
            promotionName={this.promotionName}
            updateActive={this.updateActive}
            active={this.active}
            updateCondition={this.updateCondition}
            updateDiscountAmount={this.updateDiscountAmount}
            updateInvoiceApplyInfor={this.updateInvoiceApplyInfor}
            updateVoucherValue={this.updateVoucherValue}
            condition={this.condition}
            discountAmount={this.discountAmount}
            voucherValue={this.voucherValue}
            invoiceApplyInfor={this.invoiceApplyInfor}
            updateDate={this.updateDate}
          />
        ) : null}

        {/* {this.isAllowShowForm ? (
                    <ListDetail
                        infoPromotion={this.infoPromotion}
                        items={this.items}

                        filter={this.filterListPoDetail}
                      
                        updateItems={this.handleUpdateItems}
                        type={this.props.type}

                        ref={this.idListComponentRef}
                        isCreate={this.isCreate}
                        group={this.group}
                    />
                ) : null} */}
      </section>
    );
  };
}
