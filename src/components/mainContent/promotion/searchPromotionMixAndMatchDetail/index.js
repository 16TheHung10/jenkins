//Plugin
import { EditOutlined } from '@ant-design/icons';
import { Col, Empty, Row, Tag, message } from 'antd';
import BaseComponent from 'components/BaseComponent';
import WarningNote from 'components/common/warningNote/WarningNote';
import ControlDetail from 'components/mainContent/promotion/controlPromotionMixAndMatchDetail';
import { AppContext } from 'contexts/AppContext';
import { DateHelper, ImageHelper, StringHelper } from 'helpers';
import { createDataTable } from 'helpers/FuncHelper';
import IconProduct from 'images/logo.png';
import $ from 'jquery';
import PromotionModel from 'models/PromotionModel';
import UploadMediaModel from 'models/UploadMediaModel';
import moment from 'moment';
import React from 'react';
import TableCustom from 'utils/tableCustom';

export default class SearchPromotionMixAndMatchDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.idControlItemRef = React.createRef();
    this.isCopyType = this.props.type === 'copy';
    this.orderCode = this.props.orderCode || '';
    this.isCreate = this.orderCode === '';

    this.isUpdateForm = this.orderCode !== '';
    this.isAllowShowForm = true;
    this.isAllowSave = true;
    this.isAllowUpdateStatus = false;
    this.items = [];
    this.infoPromotion = {};
    this.idSearchItemsComponent = 'searchItemPopup' + StringHelper.randomKey();
    this.idFilterItemsComponent = 'filterItemPopup' + StringHelper.randomKey();
    this.startDate = this.infoPromotion.fromDate ? new Date(this.infoPromotion.fromDate) : moment().add(1, 'day');
    this.endDate = this.infoPromotion.toDate ? new Date(this.infoPromotion.toDate) : moment().add(1, 'day');
    this.store = [];
    this.promotionName = '';
    this.docLink = '';
    this.docCode = '';
    this.active = '';

    this.dayOfWeeks = [];
    this.discountBill = '';

    this.qtyBuy = '';
    this.qtyGet = 1;

    this.idListComponentRef = React.createRef();
    this.addItemRef = React.createRef();

    this.editListItem = [];
    this.isEdit = false;

    this.imageList = [];
    this.isLoading = false;
    this.isRunning = false;
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
  updateDayOfWeeks = (value) => {
    this.dayOfWeeks = value;
    this.refresh();
  };
  updateDiscountBill = (value) => {
    this.discountBill = value;
    this.refresh();
  };
  updateQtyBuy = (value) => {
    this.qtyBuy = value;
    this.refresh();
  };
  updateQtyGet = (value) => {
    this.qtyGet = value;
    this.refresh();
  };

  componentDidMount = () => {
    this.handleUpdateState();
    this.context.onGetItems();
  };

  handleUpdateState = async () => {
    if (this.orderCode !== '') {
      let model = new PromotionModel();
      await model.getPromotion('combo', this.orderCode).then((res) => {
        if (res.status && res.data) {
          if (res.data.promotion) {
            this.infoPromotion = res.data.promotion;

            this.promotionName = !this.isCopyType ? res.data.promotion.promotionName : '';
            this.docLink = !this.isCopyType ? res.data.promotion.docLink : '';
            this.docCode = !this.isCopyType ? res.data.promotion.docCode : '';

            this.fieldSelected.store = this.infoPromotion.storeCode;
            this.store = this.infoPromotion.storeCode;

            this.startDate = !this.isCopyType
              ? this.infoPromotion.fromDate
                ? new Date(this.infoPromotion.fromDate)
                : moment().add(1, 'day')
              : moment().add(1, 'day');
            this.endDate = !this.isCopyType
              ? this.infoPromotion.toDate
                ? new Date(this.infoPromotion.toDate)
                : moment().add(1, 'day')
              : moment().add(1, 'day');

            this.qtyBuy = !this.isCopyType ? this.infoPromotion.quantityBuy : '';
            this.qtyGet = !this.isCopyType ? this.infoPromotion.quantityReceiving : 1;

            // res.data.promotionDetail && this.convertItemsResponse(res.data.promotionDetail);
            this.active = !this.isCopyType ? (this.infoPromotion.active === 0 ? 2 : this.infoPromotion.active) : '';
            this.items = this.infoPromotion.promotionDetails;
            for (let obj of this.items) {
              if (obj.type == '1') {
                obj.qty = this.infoPromotion.quantityReceiving;
              }
              if (obj.type == '0') {
                obj.qty = this.infoPromotion.quantityBuy;
              }
            }
            this.isRunning =
              (moment(this.startDate).isBefore(moment()) && moment(moment()).isBefore(this.endDate)) ||
              moment(this.endDate).isBefore(moment());
            this.props.onUpdateIsRunning(
              (moment(this.startDate).isBefore(moment()) && moment(moment()).isBefore(this.endDate)) ||
                moment(this.endDate).isBefore(moment())
            );
          }
          this.getActionMenu().refresh();
          this.props.onUpDateState(
            !this.isCopyType ? (this.infoPromotion.active === 0 ? 2 : this.infoPromotion.active) : ''
          );
          this.refreshAction();
          this.refresh();
        } else {
          // this.targetLink("/promotion-mix-and-match");
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
    if (this.isCopyType) {
      super.getActionMenu().showHideActionItem(['save'], this.isAllowSave);
    } else {
      super.getActionMenu().showHideActionItem(['save', 'updatestatus'], this.isAllowSave);
    }
    // super.getActionMenu().showHideActionItem(["approve", "delete"], this.isAllowUpdateStatus);
  };

  convertItemsResponse = (result) => {
    let arr = [];

    let group = result.reduce((r, a) => {
      r[a.group] = [...(r[a.group] || []), a];
      return r;
    }, {});

    for (let el in group) {
      arr.push(group[el]);
    }

    this.items = arr;
    this.refresh();
  };

  serviceUpdateStatus = async ({ status }) => {
    let model = new PromotionModel();
    let type = status === 1 ? '/inactive' : '/active';
    let page = 'combo' + type;
    console.log('active2', this.active);

    return await model.putPromotion(page, this.infoPromotion.promotionCode);
  };

  handleUploadImage = async (promotionCode, tableData) => {
    const model = new UploadMediaModel();
    await Promise.all(
      tableData?.map(async (item, index) => {
        if (StringHelper.isBase64(item.imageKey)) {
          const res = await model.uploadPromotionImage({
            promotionCode,
            itemCode: item.itemCode,
            image: StringHelper.base64Smooth(item.imageKey),
          });
          if (!res.status) {
            throw new Error(res.message);
          } else {
            return res;
          }
        }
        return null;
      })
    );
  };
  handleSave = () => {
    if (this.isCopyType) {
      this.orderCode = '';
    }

    if (this.promotionName === '') {
      message.error('Please enter promotion name');
      return;
    }

    if (this.startDate === '' || this.startDate === null || this.endDate === '' || this.endDate === null) {
      message.error('Please select date');
      return;
    }

    console.log({ date: moment(this.startDate).format() });
    if (!this.isCreate && DateHelper.diffDate(new Date(), new Date(this.startDate)) <= 0) {
      message.error('Apply date must be greater than or equal to current date');
      return;
    }

    // if (this.qtyBuy === '' || this.qtyBuy == 0) {
    //   message.error('Please insert quantity buy for apply promotion');
    //   return;
    // }

    // if (this.qtyGet === '' || this.qtyGet == 0) {
    //   message.error('Please insert quantity get for apply promotion');
    //   return;
    // }

    if (!this.docCode) {
      message.error('Please add docs code');
      return;
    }

    if (this.items.length === 0) {
      message.error('Item not found');
      return;
    }

    let arrList = [];
    // newne
    let qtyBuy = 0;
    let qtyGet = 0;
    // enewne

    this.items.map((elm, index) => {
      // newne
      if (elm.type == 0) {
        qtyBuy = elm.qty;
      }
      if (elm.type == 1) {
        qtyGet = elm.qty;
      }
      // enewne
      arrList.push({
        itemCode: elm.itemCode,
        discountAmount: elm.discountAmount,
        type: elm.type,
        qtyBuy: elm.qtyBuy,
      });
    });

    let model = new PromotionModel();

    let params = {
      promotionName: this.promotionName,
      startDate: DateHelper.displayDateFormatMinus(this.startDate),
      endDate: DateHelper.displayDateFormatMinus(this.endDate) + 'T23:59:59',
      // newne
      quantityBuy: parseInt(qtyBuy),
      quantityReceiving: parseInt(qtyGet),
      // enewne
      storeCode: this.store.length > 0 ? this.store : [],
      promotionDetails: arrList,
      docCode: this.docCode,
      docLink: this.docLink,
    };

    if (this.orderCode !== '') {
      params.status = parseInt(this.active === 2 ? 0 : this.active);
      if (this.store.length === 0) {
        message.error('Please choose store');
        return;
      }
      console.log('a');
      model.putPromotion('combo', this.orderCode, params).then(async (res) => {
        if (res.status && res.data) {
          if (res.data.promotionCode && res.data.promotionCode !== '') {
            await this.handleUploadImage(res.data.promotionCode, this.items);
            this.targetLink('/promotion-mix-and-match/' + res.data.promotionCode, '/promotion-mix-and-match');
          }
          message.success('Save successfully!', 3);
        } else {
          message.error(res.message);
        }
      });
    } else {
      params.status = 1;
      model.postPromotion('combo', params).then(async (res) => {
        if (res.status && res.data) {
          if (res.data.promotionCode && res.data.promotionCode !== '') {
            await this.handleUploadImage(res.data.promotionCode, this.items);
            this.targetLink('/promotion-mix-and-match/' + res.data.promotionCode, '/promotion-mix-and-match');
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
    console.log('active', this.active);
    let page = 'combo' + type;
    model.putPromotion(page, this.infoPromotion.promotionCode).then((res) => {
      if (res.status && res.data) {
        message.success('Save successfully!', 3);
        return true;
      } else {
        message.error(res.message);
        return false;
      }
    });
  };

  handleShowFilterItems = () => {
    $('.popup-form').hide();
    $('#' + this.idFilterItemsComponent).show();
  };

  handleUpdateItems = (items) => {
    this.items = items;
    this.refresh();
  };

  handleEditTable = () => {
    if (this.isEdit) return;
    this.isEdit = true;

    this.editListItem = [];
    this.editListItem = [...this.items];

    this.editListItem.forEach((object, index) => {
      object.key = index;
      object.isDelete = false;
    });

    this.idControlItemRef.current.handleEditItemsParent(this.editListItem, true);

    this.isLoading = true;
    this.refresh();
  };

  handleUpdateDataGroupPromo = (arr) => {
    this.isLoading = false;

    this.items = [];
    this.items = [...arr];

    this.isEdit = false;

    this.refresh();
  };

  handleUpdateIsEdit = (value) => {
    this.isEdit = value;
    this.isLoading = false;
    this.refresh();
  };
  handleToDetailCopy = () => {
    this.targetLink('/promotion-mix-and-match/' + this.infoPromotion.promotionCode + '/copy');
  };
  handleRenderImage = (val, key, item) => {
    const img = item.imageKey
      ? item.imageKey
      : ImageHelper.getImageUrlByPromotion(this.infoPromotion.promotionCode, item.itemCode);

    return (
      <>
        {item?.type !== 1 ? (
          <div className="">
            <span
              className="d-inline-block pos-relative br-2 pd-2"
              style={{ width: 35, height: 35, background: '#e6f0ff' }}
            >
              <img
                src={item && item.itemCode ? (item.imageKey ? img : IconProduct) : IconProduct}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = IconProduct;
                }}
                alt={`${item.itemName}`}
                width={'100%'}
                className="d-inline-block pos-absolute"
                style={{
                  verticalAlign: 'text-bottom',
                  left: 0,
                  top: '50%',
                  transform: 'translate(0px,-50%)',
                }}
              />
            </span>
          </div>
        ) : (
          ''
        )}
      </>
    );
  };

  renderType = (val, key, item) => {
    return (
      <Tag color={val === 0 ? 'green' : 'geekblue'} key={val}>
        {val === 0 ? 'Buy' : 'Get'}
      </Tag>
    );
  };

  renderComp = () => {
    const fields = this.fieldSelected;
    const columns = [
      { field: 'index', label: 'STT' },
      { field: 'itemCode', label: 'Item', colSpanHead: 2 },
      {
        field: 'itemName',
        label: '',
        colSpanHead: 0,
        styleBody: { maxWidth: 200 },
      },
      { field: 'type', label: 'Type', formatBody: this.renderType },
      { field: 'imageKey', label: 'Image', formatBody: this.handleRenderImage },
      // newne
      {
        field: 'qty',
        label: 'Qty',
        formatBody: (val) => {
          return val && val !== '' ? StringHelper.formatValue(val) : '-';
        },
      },
      // enewne
      {
        field: 'discountAmount',
        label: 'Discount amount',
        classHead: 'text-right',
        classBody: 'text-right',
        formatBody: (val) => {
          return val && val !== '' ? StringHelper.formatValue(val) : '-';
        },
      },
    ];

    const data = createDataTable(this.items, columns)?.map((el, index) => {
      return {
        ...el,
        index: index + 1,
        imageKey: el.imageKey
          ? el.imageKey
          : ImageHelper.getImageUrlByPromotion(this.infoPromotion.promotionCode, el.itemCode),
      };
    });

    this.imageList = data?.map((el) => {
      return {
        imageKey: el.imageKey,
        name: 'Image of item #' + el.itemCode,
        itemCode: el.itemCode,
      };
    });

    const contextValue = this.context;
    const { items } = contextValue.state;
    const isRunning = this.isRunning && !this.isCopyType && !this.isCreate;
    return (
      <section className="wrap-section">
        <div className="section-block mt-15">
          <div className="row header-detail ">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 flex items-center gap-10">
              <div className="flex justify-content-between w-full items-center">
                <div className="">
                  {' '}
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
                    <strong>Lưu ý chức năng:</strong> <br />
                    -Tên của khuyến mãi phải rõ ràng, chi tiết, thể hiện được mục đích của khuyến mãi. <br />- Chương
                    trình khuyến mãi sẽ được cập nhật qua ngày. <br />- Loại khuyến mãi mua sản phẩm A và giảm giá sản
                    phẩm B theo giá trị.
                    <br /> - Thời gian chương trình áp dụng phải sau ngày hiện tại. <br />- Một chương trình khuyến mãi
                    phải có ít nhất một sản phẩm mua và một sản phẩm tặng. <br />- Document SCT note: cập nhật thông tin
                    đã đăng ký với cơ quan, tổ chức nhà nước. <br />- Upload hình ảnh để thể hiện trên màn hình khách
                    hàng.
                  </div>
                </WarningNote>
              </div>
            </div>
          </div>
        </div>

        {this.isAllowShowForm ? (
          <ControlDetail
            isRunning={this.isRunning}
            ref={this.idControlItemRef}
            isCreate={this.isCreate}
            infoPromotion={this.infoPromotion}
            updateStartDate={this.updateStartDate}
            updateEndDate={this.updateEndDate}
            updateStore={this.updateStore}
            updatePromotionName={this.updatePromotionName}
            promotionName={this.promotionName}
            docCode={this.docCode}
            docLink={this.docLink}
            updateActive={this.updateActive}
            updateDocCode={this.updateDocCode}
            updateDocLink={this.updateDocLink}
            active={this.active}
            updateDayOfWeeks={this.updateDayOfWeeks}
            updateDiscountBill={this.updateDiscountBill}
            updateQtyBuy={this.updateQtyBuy}
            updateQtyGet={this.updateQtyGet}
            qtyBuy={this.qtyBuy}
            qtyGet={this.qtyGet}
            updateDate={this.updateDate}
            allItems={items}
            handleUpdateDataGroupPromo={this.handleUpdateDataGroupPromo}
            startDate={this.fieldSelected.startDate}
            endDate={this.fieldSelected.endDate}
            editListItem={this.editListItem}
            type={this.isCopyType}
            handleUpdateIsEdit={this.handleUpdateIsEdit}
            items={this.items}
            imageList={this.imageList}
          />
        ) : null}
        <div className="section-block">
          <Row>
            <Col xl={24}>
              <h4>List promotion preview</h4>
            </Col>
          </Row>
          {this.items.length > 0 ? (
            <Row gutter={16} className="mrt-5 mrb-5">
              <Col xl={16}>
                <div className="section-block">
                  <TableCustom
                    data={data}
                    columns={columns}
                    isPaging={false}
                    isLoading={this.isLoading}
                    fullWidth={true}
                  />
                </div>
              </Col>
              {isRunning ? null : (
                <Col xl={8}>
                  <Row className="mrb-10">
                    <Col>
                      <div
                        style={{
                          cursor: 'pointer',
                          color: '#1890ff',
                          width: 30,
                          height: 30,
                          borderRadius: '100%',
                          background: '#1890ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span style={{ color: '#fff', fontSize: 16 }}>
                          <EditOutlined onClick={() => this.handleEditTable()} />
                        </span>
                      </div>
                    </Col>
                  </Row>
                </Col>
              )}
            </Row>
          ) : (
            <Empty />
          )}
        </div>
      </section>
    );
  };
}

SearchPromotionMixAndMatchDetail.contextType = AppContext;
