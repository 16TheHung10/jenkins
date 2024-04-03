//Plugin
import $ from 'jquery';
import React from 'react';

//Custom
import BaseComponent from 'components/BaseComponent';
import { DateHelper, ImageHelper, StringHelper } from 'helpers';
import PromotionModel from 'models/PromotionModel';

import ControlDetail from 'components/mainContent/promotion/controlDetailDiscountItem';

import { EditOutlined } from '@ant-design/icons';
import { Col, Empty, Row, Tooltip, message } from 'antd';
import { createDataTable, hasDuplicateObject } from 'helpers/FuncHelper';
import IconProduct from 'images/logo.png';
import TableCustom from 'utils/tableCustom';

import { AppContext } from 'contexts/AppContext';
import UploadMediaModel from 'models/UploadMediaModel';
import moment from 'moment';
import WarningNote from 'components/common/warningNote/WarningNote';

export default class SearchDetailDiscountItem extends BaseComponent {
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

    this.idFilterItemsComponent = 'filterItemPopup' + StringHelper.randomKey();

    this.startDate = moment().add(1, 'day');
    this.endDate = moment().add(1, 'day');
    this.store = [];
    this.promotionName = '';
    this.docLink = '';
    this.docCode = '';
    this.active = '';
    this.partnerList = [{ codeName: '', codeValue: '' }];
    this.dayOfWeeks = [];
    this.discountBill = '';

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

  componentDidMount = () => {
    this.handleUpdateState();
    this.context.onGetItems();
  };

  handleUpdateState = async () => {
    if (this.orderCode !== '') {
      let model = new PromotionModel();
      await model.getPromotion('discountitem', this.orderCode).then((res) => {
        if (res.status && res.data) {
          if (res.data.promotion) {
            this.infoPromotion = res.data.promotion;

            this.promotionName = !this.isCopyType ? res.data.promotion.promotionName : '';
            this.docLink = res.data.promotion.docLink;
            this.docCode = res.data.promotion.docCode;

            this.fieldSelected.store = this.infoPromotion.storeCode;
            this.store = this.infoPromotion.storeCode;

            this.fieldSelected.startDate = !this.isCopyType
              ? this.infoPromotion.fromDate
                ? new Date(this.infoPromotion.fromDate)
                : moment().add(1, 'day')
              : moment().add(1, 'day');
            this.fieldSelected.endDate = !this.isCopyType
              ? this.infoPromotion.toDate
                ? new Date(this.infoPromotion.toDate)
                : moment().add(1, 'day')
              : moment().add(1, 'day');
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

            this.active = !this.isCopyType ? (this.infoPromotion.active === 0 ? 2 : this.infoPromotion.active) : '';

            // res.data.promotionDetail && this.convertItemsResponse(res.data.promotionDetail);
            this.items = this.infoPromotion.promotionDetails?.map((el) => {
              return {
                ...el,
                imageKey: ImageHelper.getImageUrlByPromotion(this.infoPromotion.promotionCode, el.itemCode),
              };
            });

            for (let index in this.items) {
              this.items[index].key = index;
            }
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
          // this.targetLink("/promotion-discount-item");
          message.error(res.message);
        }
      });
    } else {
      // this.refreshAction();
      super.getActionMenu().showHideActionItem(['save'], this.isAllowSave);
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
  handleToDetailCopy = () => {
    this.targetLink('/promotion-discount-item/' + this.infoPromotion.promotionCode + '/copy');
  };
  handleSave = async () => {
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

    console.log({
      diff: DateHelper.diffDate(new Date(), new Date(this.startDate)),
      start: moment(this.startDate).format(),
    });
    if (!this.isCreate && DateHelper.diffDate(new Date(), new Date(this.startDate)) <= 0) {
      message.error('Apply date must be greater than or equal to current date');
      return;
    }

    if (!this.isCreate && this.active === '' && !this.isCopyType) {
      message.error('Please choose status');
      return;
    }
    if (!this.docCode) {
      message.error('Please add docs code');
      return;
    }

    if (this.items.length === 0) {
      message.error('Item not found');
      return;
    }

    let arrList = [];

    this.items.map((elm, index) =>
      arrList.push({
        itemCode: elm.itemCode,
        discountAmount: elm.discountAmount,
      })
    );

    let model = new PromotionModel();

    let params = {
      promotionName: this.promotionName,
      startDate: DateHelper.displayDateFormatMinus(this.startDate),
      endDate: DateHelper.displayDateFormatMinus(this.endDate) + 'T23:59:59',
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
      model.putPromotion('discountitem', this.orderCode, params).then(async (res) => {
        if (res.status && res.data) {
          if (res.data.promotionCode && res.data.promotionCode !== '') {
            await this.handleUploadImage(res.data.promotionCode, this.items);
            this.targetLink('/promotion-discount-item/' + res.data.promotionCode, '/promotion-discount-item');
          }
          message.success('Save successfully!', 3);
        } else {
          message.error(res.message);
        }
      });
    } else {
      params.status = 1;
      model.postPromotion('discountitem', params).then(async (res) => {
        if (res.status && res.data) {
          await this.handleUploadImage(res.data.promotionCode, this.items);

          if (res.data.promotionCode && res.data.promotionCode !== '') {
            this.targetLink('/promotion-discount-item/' + res.data.promotionCode, '/promotion-discount-item');
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
    let page = 'discountitem' + type;
    model.putPromotion(page, this.infoPromotion.promotionCode).then((res) => {
      if (res.status && res.data) {
        message.success('Save successfully!', 3);
      } else {
        message.error(res.message);
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
    if (this.isEdit) return false;
    this.isEdit = true;
    this.editListItem = [];
    this.editListItem = [...this.items];

    this.editListItem.forEach((object, index) => {
      // object.key = index;
      object.isDelete = false;
    });

    this.idControlItemRef.current.handleEditItemsParent(this.editListItem, true);
    this.isLoading = true;
    this.refresh();
  };

  handleUpdateDataGroupPromo = (arr, isUpdate) => {
    this.isLoading = false;
    if (isUpdate) {
      this.items = [];
    }

    const newArr = [...arr];

    const isDuplicate = hasDuplicateObject(newArr, this.items, 'itemCode');

    if (isDuplicate) {
      message.error('Item is exist in list promotion');
      return false;
    }

    for (const item of newArr) {
      const obj = {
        key: this.items.length.toString(),
        discountAmount: item.discountAmount,
        itemCode: item.itemCode,
        itemName: item.itemName,
        imageKey: item.imageKey,
      };

      this.items.push(obj);
    }

    this.isEdit = false;
    // this.isAddSuccess = true;

    this.refresh();
  };

  handleUpdateIsEdit = (value) => {
    this.isEdit = value;
    this.isLoading = false;
    this.refresh();
  };

  handleRenderImage = (val, key, item) => {
    const img = item.imageKey
      ? item.imageKey
      : ImageHelper.getImageUrlByPromotion(this.infoPromotion.promotionCode, item.itemCode);

    return (
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
    );
  };

  renderComp = () => {
    const fields = this.fieldSelected;

    const columns = [
      { field: 'index', label: `STT` },
      { field: 'itemCode', label: `Item`, colSpanHead: 2 },
      {
        field: 'itemName',
        label: '',
        colSpanHead: 0,
        styleBody: { maxWidth: 200 },
        formatBody: (val, key, item) => (
          <Tooltip
            overlayInnerStyle={{ fontSize: 10 }}
            arrow={{ pointAtCenter: true }}
            title={item.itemName}
            color={'black'}
          >
            {item.itemName}
          </Tooltip>
        ),
      },
      { field: 'imageKey', label: 'Image', formatBody: this.handleRenderImage },
      {
        field: 'discountAmount',
        label: 'Discount amount',
        classHead: 'text-right',
        classBody: 'text-right',
        formatBody: (val) => StringHelper.formatValue(val),
      },
    ];

    const data = createDataTable(this.items || [], columns)?.map((el, index) => {
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
    const isRunning = this.isRunning;
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
                    - Tên của khuyến mãi phải rõ ràng, chi tiết, thể hiện được mục đích của khuyến mãi. <br />- Chương
                    trình khuyến mãi sẽ được cập nhật qua ngày. <br />
                    - Loại khuyến mãi giảm giá theo từng sản phẩm. <br />
                    - Thời gian áp dụng phải sau ngày hiện tại. <br />- Danh sách sản phẩm khuyến mãi trong một chương
                    trình không được trùng lặp với chương trình khác (ví dụ items đã chạy C.trình discount items thì
                    không chạy cũng với mix&match). <br />
                    - Dept. of I&T note: cập nhật thông tin đã đăng ký với cơ quan, tổ chức nhà nước. <br />- Upload
                    hình ảnh để thể hiện trên màn hình khách hàng. <br />
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
            isRunning={this.isRunning && !this.isCopyType && !this.isCreate}
            ref={this.idControlItemRef}
            isCreate={this.isCreate}
            infoPromotion={this.infoPromotion}
            updateStartDate={this.updateStartDate}
            updateEndDate={this.updateEndDate}
            updateStore={this.updateStore}
            updatePromotionName={this.updatePromotionName}
            promotionName={this.promotionName}
            updateActive={this.updateActive}
            active={this.active}
            updateDate={this.updateDate}
            allItems={items}
            // columnsTableAdd={columnsTableAdd}
            handleUpdateDataGroupPromo={this.handleUpdateDataGroupPromo}
            startDate={this.fieldSelected.startDate}
            endDate={this.fieldSelected.endDate}
            editListItem={this.editListItem}
            type={this.isCopyType}
            handleUpdateIsEdit={this.handleUpdateIsEdit}
            items={this.items}
            imageList={this.imageList}
            // isAddSuccess={this.isAddSuccess}
          />
        ) : null}
        <div className="section-block">
          <Row>
            <Col xl={24}>
              <h4>List promotion preview</h4>
            </Col>
          </Row>
          {this.items?.length > 0 ? (
            <Row gutter={16} className="mrt-5 mrb-5">
              <Col xl={12}>
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
              {this.isRunning ? null : (
                <Col xl={12}>
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

SearchDetailDiscountItem.contextType = AppContext;
