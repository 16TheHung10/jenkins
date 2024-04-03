//Plugin
import React from 'react';

//Custom
import BaseComponent from 'components/BaseComponent';
import { DateHelper, StringHelper } from 'helpers';
import PromotionModel from 'models/PromotionModel';

// import ListDetail from "components/mainContent/promotion/listDetailDiscountBill";
import { message } from 'antd';
import ControlDetail from 'components/mainContent/promotion/controlPromotionDiscountCouponDetail';
import moment from 'moment';
import WarningNote from 'components/common/warningNote/WarningNote';

export default class SearchPromotionDiscountCouponDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.orderCode = this.props.orderCode || '';
    this.isCreate = this.orderCode === '';
    this.group = [];

    this.isUpdateForm = this.orderCode !== '';
    this.isAllowShowForm = true;
    this.isAllowSave = true;
    this.isAllowUpdateStatus = false;
    this.items = [];
    this.infoPromotion = {};
    this.isRunning = false;
    this.idFilterItemsComponent = 'filterItemPopup' + StringHelper.randomKey();

    this.startDate = this.infoPromotion.fromDate ? new Date(this.infoPromotion.fromDate) : moment().add(1, 'day');
    this.endDate = this.infoPromotion.toDate ? new Date(this.infoPromotion.toDate) : moment().add(1, 'day');
    this.store = [];
    this.promotionName = '';
    this.docLink = '';
    this.docCode = '';
    this.active = this.infoPromotion.active;
    this.partnerList = [{ codeName: '', codeValue: '' }];
    this.dayOfWeeks = [];
    this.discountBill = '';

    this.indexAddMore = -1;

    this.discountAmount = '';

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
  handleToDetailCopy = () => {
    this.targetLink(
      '/promotion-discount-coupon/' + this.infoPromotion.promotionCode + '/copy',
      '/promotion-discount-coupon'
    );
  };
  handleUpdateState = async () => {
    if (this.orderCode !== '') {
      let model = new PromotionModel();
      await model.getPromotion('coupon', this.orderCode).then((res) => {
        if (res.status && res.data) {
          if (res.data.promotion) {
            this.infoPromotion = res.data.promotion;
            this.promotionName = res.data.promotion.couponCode;
            this.docLink = res.data.promotion.docLink;
            this.docCode = res.data.promotion.docCode;
            this.fieldSelected.store = this.infoPromotion.storeCode || '';
            this.store = this.infoPromotion.storeCode || '';

            this.startDate = this.infoPromotion.fromDate
              ? new Date(this.infoPromotion.fromDate)
              : moment().add(1, 'day');
            this.endDate = this.infoPromotion.toDate ? new Date(this.infoPromotion.toDate) : moment().add(1, 'day');

            this.items = this.infoPromotion.promotionDetails;

            this.discountAmount = this.infoPromotion.discountAmount || '';

            this.active = this.infoPromotion.active === 0 ? 2 : this.infoPromotion.active;
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
          }

          this.refreshAction();
          this.refresh();
        } else {
          // this.targetLink("/promotion-discount-coupon");
          message.error(res.message);
        }
      });
    } else {
      // this.refreshAction();
      super.getActionMenu().showHideActionItem(['save'], this.isAllowSave);
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

    if (this.discountAmount === '') {
      message.error('Please enter discount amount');
      return;
    }

    if (!this.docCode) {
      message.error('Please add docs code');
      return;
    }

    // if (parseFloat(this.discountAmount) < 1000) {
    //     message.error("Please enter discount amount more than 1000 VND");
    //     return;
    // }

    let model = new PromotionModel();

    let params = {
      CouponCode: this.promotionName,
      startDate: DateHelper.displayDateFormatMinus(this.startDate) + 'T00:00:00',
      endDate: DateHelper.displayDateFormatMinus(this.endDate) + 'T23:59:59',
      storeCode: this.store.length > 0 ? this.store : [],
      discountAmount: this.discountAmount,
      docCode: this.docCode,
      docLink: this.docLink,
    };
    if (this.orderCode !== '') {
      params.status = parseInt(this.active === 2 ? 0 : this.active);
      model.putPromotion('coupon', this.orderCode, params).then((res) => {
        if (res.status && res.data) {
          if (res.data.promotionCode && res.data.promotionCode !== '') {
            this.targetLink('/promotion-discount-coupon/' + res.data.promotionCode, '/promotion-discount-coupon');
          }
          message.success('Save successfully!', 3);
        } else {
          message.error(res.message);
        }
      });
    } else {
      params.status = 1;
      model.postPromotion('coupon', params).then((res) => {
        if (res.status && res.data) {
          if (res.data.promotionCode && res.data.promotionCode !== '') {
            this.targetLink('/promotion-discount-coupon/' + res.data.promotionCode, '/promotion-discount-coupon');
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
    let page = 'coupon' + type;
    model.putPromotion(page, this.infoPromotion.promotionCode).then((res) => {
      if (res.status && res.data) {
        message.success('Save successfully!', 3);
      } else {
        message.error(res.message);
      }
    });
  };

  updateDiscountAmount = (value) => {
    this.discountAmount = value;
    this.refresh();
  };

  renderComp = () => {
    return (
      <section className="wrap-section">
        <div className="section-block mt-15">
          <div className="row header-detail ">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 flex items-center gap-10">
              <div className="flex justify-content-between w-full items-center">
                <div className="">
                  <button
                    onClick={() => super.back('/promotion-discount-coupon')}
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
                      <>{!this.isUpdateForm ? 'New promotion' : '#' + this.infoPromotion?.couponCode}</>
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
                    - Loại khuyến mãi giảm giá theo phần trăm dựa bằng mã giảm giá. Số % là số nguyên.
                    <br />
                    - Thời gian áp dụng phải sau ngày hiện tại.
                    <br />- Dept. of I&T note: cập nhật thông tin đã đăng ký với cơ quan, tổ chức nhà nước. (hoặc
                    Approved từ BOM).
                  </div>
                </WarningNote>
              </div>
            </div>
          </div>
        </div>

        {this.isAllowShowForm ? (
          <ControlDetail
            isRunning={this.isRunning}
            docCode={this.docCode}
            docLink={this.docLink}
            updateDocCode={this.updateDocCode}
            updateDocLink={this.updateDocLink}
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
            updateDiscountAmount={this.updateDiscountAmount}
            discountAmount={this.discountAmount}
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
