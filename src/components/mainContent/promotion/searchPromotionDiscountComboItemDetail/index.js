//Plugin
import { EditOutlined } from '@ant-design/icons';
import { Col, Empty, Row, Tag, message } from 'antd';
import $ from 'jquery';
import React from 'react';

//Custom
import BaseComponent from 'components/BaseComponent';
import { DateHelper, StringHelper } from 'helpers';
import ItemModel from 'models/ItemModel';
import PromotionModel from 'models/PromotionModel';

import ControlDetail from 'components/mainContent/promotion/controlPromotionDiscountComboItem';

import TableComp from 'utils/table';
import moment from 'moment';

export default class SearchPromotionDiscountComboItemDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.idControlItemRef = React.createRef();

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
    this.idSearchItemsComponent = 'searchItemPopup' + StringHelper.randomKey();
    this.idFilterItemsComponent = 'filterItemPopup' + StringHelper.randomKey();

    this.startDate = this.infoPromotion.fromDate ? new Date(this.infoPromotion.fromDate) : moment().add(1, 'day');
    this.endDate = this.infoPromotion.toDate ? new Date(this.infoPromotion.toDate) : moment().add(1, 'day');
    this.store = [];
    this.promotionName = '';
    this.active = this.infoPromotion.active || '';
    this.partnerList = [{ codeName: '', codeValue: '' }];
    this.dayOfWeeks = [];
    this.discountBill = '';

    this.indexAddMore = -1;

    this.qtyBuy = '';
    this.qtyGet = '';

    this.idListComponentRef = React.createRef();
    this.addItemRef = React.createRef();

    this.allItems = {};

    this.editListItem = [];
    // this.isExpand = false;
    this.isEdit = false;

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
  updatePromotionName = (value) => {
    this.promotionName = value;
    this.refresh();
  };
  updateActive = (value) => {
    this.active = value;
    this.refresh();
  };
  updatePartnerList = (value) => {
    this.partnerList = value;
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
    this.handleGetAllItem();
  };

  handleGetAllItem = async () => {
    let model = new ItemModel();
    await model.getAllItems().then((res) => {
      if (res.status && res.data) {
        if (res.data.items) {
          this.allItems = res.data.items;
          this.refresh();
        }
      } else {
        message.error(res.message);
      }
    });
  };

  handleUpdateState = async () => {
    if (this.orderCode !== '') {
      let model = new PromotionModel();
      await model.getPromotion('combo', this.orderCode).then((res) => {
        if (res.status && res.data) {
          if (res.data.promotion) {
            this.infoPromotion = res.data.promotion;
            this.promotionName = res.data.promotion.promotionName;
            this.fieldSelected.store = this.infoPromotion.storeCode || '';
            this.store = this.infoPromotion.storeCode || '';

            this.startDate = this.infoPromotion.fromDate
              ? new Date(this.infoPromotion.fromDate)
              : moment().add(1, 'day');
            this.endDate = this.infoPromotion.toDate ? new Date(this.infoPromotion.toDate) : moment().add(1, 'day');

            this.qtyBuy = this.infoPromotion.quantityBuy || '';
            this.qtyGet = this.infoPromotion.quantityReceiving || '';

            // res.data.promotionDetail && this.convertItemsResponse(res.data.promotionDetail);
            this.active = this.infoPromotion.active === 0 ? 2 : this.infoPromotion.active;
            this.items = this.infoPromotion.promotionDetails;
          }

          this.refreshAction();
          this.refresh();
        } else {
          // this.targetLink("/promotion-mix-and-match");
          message.error(res.message);
        }
      });
      // this.handleHotKey(this.funcHotKey);
    } else {
      this.refreshAction();
      // this.handleHotKey(this.funcHotKey);
    }
  };

  refreshAction = () => {
    super.getActionMenu().showHideActionItem(['save', 'loadDefault'], this.isAllowSave);
    super.getActionMenu().showHideActionItem(['approve', 'delete'], this.isAllowUpdateStatus);
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

  handleSave = () => {
    if (this.promotionName === '') {
      message.error('Please enter promotion name');
      return;
    }

    if (this.startDate === '' || this.startDate === null || this.endDate === '' || this.endDate === null) {
      message.error('Please select date');
      return;
    }

    if (this.isCreate && DateHelper.diffDate(new Date(), new Date(this.startDate)) <= 0) {
      message.error('Please select date more than current date');
      return;
    }

    if (!this.isCreate && DateHelper.diffDate(new Date(), new Date(this.startDate)) <= 0) {
      message.error('Apply date must be greater than or equal to current date');
      return;
    }

    if (this.qtyBuy === '' || this.qtyBuy == 0) {
      message.error('Please insert quantity buy for apply promotion');
      return;
    }

    if (this.qtyGet === '' || this.qtyGet == 0) {
      message.error('Please insert quantity get for apply promotion');
      return;
    }

    if (this.items.length === 0) {
      message.error('Item not found');
      return;
    }

    // let typeBuy = 0;
    // let typeGet = 0;

    // for (let i in this.items) {
    //     let item = this.items[i];
    //     for (let i2 in item) {
    //         let item2 = item[i2];

    //         if (i2 === 'type') {
    //             if (item2 === 0) {
    //                 typeBuy++;
    //             }

    //             if (item2 === 1) {
    //                 typeGet++;
    //             }
    //         }

    //     }
    // }

    // if (typeBuy === 0 || typeGet === 0) {
    //     message.error("Please add product couple buy and get");
    //     return;
    // }

    let arrList = [];

    this.items.map((elm, index) =>
      arrList.push({
        itemCode: elm.itemCode,
        discountAmount: elm.discountAmount,
        type: elm.type,
      })
    );

    let model = new PromotionModel();

    let params = {
      promotionName: this.promotionName,
      startDate: DateHelper.displayDateFormatMinus(this.startDate),
      endDate: DateHelper.displayDateFormatMinus(this.endDate) + 'T23:59:59',
      quantityBuy: parseInt(this.qtyBuy),
      quantityReceiving: parseInt(this.qtyGet),
      storeCode: this.store.length > 0 ? this.store : [],
      promotionDetails: arrList,
    };

    if (this.orderCode !== '') {
      params.status = parseInt(this.active === 2 ? 0 : this.active);
      if (this.store.length === 0) {
        message.error('Please choose store');
        return;
      }

      model.putPromotion('combo', this.orderCode, params).then((res) => {
        if (res.status && res.data) {
          if (res.data.promotionCode && res.data.promotionCode !== '') {
            this.targetLink('/promotion-mix-and-match/' + res.data.promotionCode, '/promotion-mix-and-match');
          }
          message.success('Save successfully!', 3);
        } else {
          message.error(res.message);
        }
      });
    } else {
      params.status = 1;
      model.postPromotion('combo', params).then((res) => {
        if (res.status && res.data) {
          if (res.data.promotionCode && res.data.promotionCode !== '') {
            this.targetLink('/promotion-mix-and-match/' + res.data.promotionCode, '/promotion-mix-and-match');
          }
          message.success('Save successfully!', 3);
        } else {
          message.error(res.message);
        }
      });
    }
  };

  handleAddItemsToList = (results, index) => {
    let arrGroup = [];

    for (let elm in results) {
      let objElm = results[elm].item;
      // objElm["qtyReceiving"] = results[elm].qtyReceiving;
      objElm['discountAmount'] = results[elm].discountAmount;

      // arrGroup.push(objElm);
      this.items.push(objElm);
    }

    // if (index !== -1) {

    //     for (let k in arrGroup) {
    //         let item = arrGroup[k];
    //         this.items[index].push(item);
    //     }

    // }
    // else {
    //     this.items.push(arrGroup);
    // }

    // for (let k in results) {
    //     let item = results[k];
    //     this.items.push(item);
    // }

    this.refresh();
  };

  numberGroupUpdate = (num) => {
    this.numberGroup = this.numberGroup + 1;
    this.refresh();
  };

  handleShowSearchItems = (indexAddMore) => {
    $('.popup-form').hide();
    $('#' + this.idSearchItemsComponent).show();
    $('#' + this.idSearchItemsComponent)
      .find('[name=keywordbarcode]')
      .focus()
      .select();

    if (indexAddMore !== -1) {
      this.indexAddMore = indexAddMore;
    } else {
      this.indexAddMore = -1;
    }

    this.refresh();
  };

  handleShowFilterItems = () => {
    $('.popup-form').hide();
    $('#' + this.idFilterItemsComponent).show();
  };

  handleUpdateOrderDateState = (orderDate, controlField = null) => {
    this.fieldSelected.orderDate = orderDate;
    if (controlField != null) {
      controlField.orderDate = orderDate;
    }
    this.refresh();
  };

  handleChangeOrderDate = (orderDate, fields = null) => {
    this.handleUpdateOrderDateState(fields.orderDate);
  };

  handleChangeStoreCode = (storeCode) => {
    this.fieldSelected.store = storeCode;
    this.refresh();
  };

  handleChangeSupplierCode = (supplier) => {
    this.fieldSelected.supplier = supplier;
    this.refresh();
  };

  handleChangeSupplierCode = (storeCode) => {
    this.fieldSelected.supplier = storeCode;
    this.refresh();
  };

  handleFilterListPoDetail = (filter) => {
    this.filterListPoDetail = filter;
    this.refresh();
  };

  handleUpdateItems = (items) => {
    this.items = items;
    this.refresh();
  };

  groupUpdate = (list) => {
    this.group = list;
    this.refresh();
  };

  handleUpdateDataGroupPromo = (arr) => {
    // let newArr = []
    // let group = this.items.length + 1;

    // for (let index in arr) {
    //     let item = arr[index];
    //     let obj = {
    //         group: group,
    //         // qty: item.qty,
    //         discountAmount: item.discountAmount,
    //         itemCode: item.itemCode,
    //         itemName: item.itemName,
    //     }

    //     newArr.push(obj);
    // }

    // this.items.push(newArr);

    this.items = [];
    this.items = [...arr];

    this.isEdit = false;

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

    // this.isExpand = true;

    this.idControlItemRef.current.handleEditItemsParent(this.editListItem, true);
    // this.refresh()
  };

  renderComp = () => {
    this.funcHotKey = {
      ppAddItem: () => this.handleShowSearchItems(),
      ppFilter: () => this.handleShowFilterItems(),
      addItem:
        this.isAllowShowForm && (!this.isUpdateForm || (!this.infoPromotion.approved && !this.infoPromotion.cancel))
          ? () => this.addItemRef.current.handleAddItems()
          : undefined,
    };

    const columnsTableAdd = [
      {
        title: 'Item',
        dataIndex: 'itemCode',
        key: 'itemCode',
        colSpan: 2,
        align: 'left',
      },
      {
        title: '',
        dataIndex: 'itemName',
        key: 'itemName',
        colSpan: 0,
        align: 'left',
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        render: (val) => (
          <>
            <Tag color={val === 0 ? 'green' : 'geekblue'} key={val}>
              {val === 0 ? 'Buy' : 'Get'}
            </Tag>
          </>
        ),
      },
      // {
      //     title: 'Qty',
      //     dataIndex: 'qty',
      //     key: 'qty',
      //     align: 'right'
      // },
      {
        title: 'Discount amount',
        dataIndex: 'discountAmount',
        key: 'discountAmount',
        align: 'right',
        render: (val) => StringHelper.formatValue(val),
      },
    ];

    return (
      <section className="wrap-section">
        <div className="row header-detail">
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <button
              onClick={() => super.back('/promotion-mix-and-match')}
              type="button"
              className="btn btn-back"
              style={{ background: 'beige' }}
            >
              Back
            </button>
            <h2 className="name-target">{!this.isUpdateForm ? 'New promotion' : '#' + this.orderCode}</h2>
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
          </div>
        </div>

        {this.isAllowShowForm ? (
          <ControlDetail
            ref={this.idControlItemRef}
            isCreate={this.isCreate}
            infoPromotion={this.infoPromotion}
            group={this.group}
            groupUpdate={this.groupUpdate}
            updateStartDate={this.updateStartDate}
            updateEndDate={this.updateEndDate}
            updateStore={this.updateStore}
            updatePromotionName={this.updatePromotionName}
            promotionName={this.promotionName}
            updateActive={this.updateActive}
            active={this.active}
            updatePartnerList={this.updatePartnerList}
            updateDayOfWeeks={this.updateDayOfWeeks}
            updateDiscountBill={this.updateDiscountBill}
            updateQtyBuy={this.updateQtyBuy}
            updateQtyGet={this.updateQtyGet}
            qtyBuy={this.qtyBuy}
            qtyGet={this.qtyGet}
            updateDate={this.updateDate}
            allItems={this.allItems}
            columnsTableAdd={columnsTableAdd}
            handleUpdateDataGroupPromo={this.handleUpdateDataGroupPromo}
            editListItem={this.editListItem}
            // isExpand={this.isExpand}
          />
        ) : null}

        {/* {this.isAllowShowForm ? (
                    <ListDetail
                        infoPromotion={this.infoPromotion}
                        items={this.items}

                        filter={this.filterListPoDetail}
                        showFilterItems={this.handleShowFilterItems}
                        showSearchItems={this.handleShowSearchItems}
                        updateItems={this.handleUpdateItems}
                        type={this.props.type}

                        ref={this.idListComponentRef}
                        isCreate={this.isCreate}
                        group={this.group}
                    />
                ) : null} */}

        {/* {
                    this.isCreate &&
                    <SearchItems
                        type={'combo'}
                        idComponent={this.idSearchItemsComponent}
                        storeCode={this.fieldSelected.store}
                        orderDate={this.fieldSelected.orderDate}
                        supplierCode={this.fieldSelected.supplier}
                        orderCode={this.orderCode}
                        infoPromotion={this.infoPromotion}
                        ref={this.addItemRef}
                        selectedItems={this.items}
                        addItemsToList={this.handleAddItemsToList}
                        numberGroup={this.numberGroup}
                        numberGroupUpdate={this.numberGroupUpdate}
                        indexAddMore={this.indexAddMore}
                    />
                } */}
        {/* <SearchItems
                    type={'combo'}
                    idComponent={this.idSearchItemsComponent}
                    storeCode={this.fieldSelected.store}
                    orderDate={this.fieldSelected.orderDate}
                    supplierCode={this.fieldSelected.supplier}
                    orderCode={this.orderCode}
                    infoPromotion={this.infoPromotion}
                    ref={this.addItemRef}
                    selectedItems={this.items}
                    addItemsToList={this.handleAddItemsToList}
                    numberGroup={this.numberGroup}
                    numberGroupUpdate={this.numberGroupUpdate}
                    indexAddMore={this.indexAddMore}
                /> */}
        <Row>
          <Col xl={24}>
            <h4>List promotion preview</h4>
          </Col>
        </Row>
        {this.items.length > 0 ? (
          <Row gutter={16} className="mrt-5 mrb-5">
            <Col xl={12}>
              <div className="section-block">
                <TableComp columns={columnsTableAdd} dataSource={this.items} page={false} />
              </div>
            </Col>
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
              {/* <Row>
                                <Col>
                                    <div style={{ cursor: "pointer", color: "#1890ff", width: 30, height: 30, borderRadius: "100%", background: 'red', display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <span style={{ color: '#fff', fontSize: 16 }}><DeleteOutlined onClick={this.handleRemoveTable} /></span>
                                    </div>
                                </Col>
                            </Row> */}
            </Col>
          </Row>
        ) : (
          <Empty />
        )}
      </section>
    );
  };
}
