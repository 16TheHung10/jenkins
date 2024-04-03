//Plugin
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Col, Input, InputNumber, Row, Tag, message } from 'antd';
import $ from 'jquery';
import React from 'react';

//Custom
import BaseComponent from 'components/BaseComponent';
import { DateHelper, ImageHelper, StringHelper } from 'helpers';
import ItemModel from 'models/ItemModel';
import PromotionModel from 'models/PromotionModel';

import ControlDetail from 'components/mainContent/promotion/controlPromotionBuyOneGetOneDetail';

import { AppContext } from 'contexts/AppContext';
import { createDataTable } from 'helpers/FuncHelper';
import IconProduct from 'images/logo.png';
import UploadMediaModel from 'models/UploadMediaModel';
import moment from 'moment';
import TableCustom from 'utils/tableCustom';
import Block from 'components/common/block/Block';
import Highlighter from 'react-highlight-words';
import WarningNote from 'components/common/warningNote/WarningNote';
export default class SearchPromotionBuyOneGetOneDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.idControlItemRef = React.createRef();
    this.searchCreatedItemsRef = null;
    this.orderCode = this.props.orderCode || '';
    this.isCreate = this.orderCode === '';
    this.isCopyType = this.props.type === 'copy';
    this.docLink = '';
    this.docCode = '';
    this.group = [];
    this.numberGroup = 1;

    this.isUpdateForm = this.orderCode !== '';
    this.isAllowShowForm = true;
    this.isAllowSave = true;
    this.isAllowUpdateStatus = false;
    this.items = [];
    this.itemsConst = [];
    this.infoPromotion = {};
    this.idSearchItemsComponent = 'searchItemPopup' + StringHelper.randomKey();
    this.idFilterItemsComponent = 'filterItemPopup' + StringHelper.randomKey();

    this.selectedGroupIndex = -1;
    this.isRunning = false;
    this.startDate = this.infoPromotion.fromDate ? new Date(this.infoPromotion.fromDate) : moment().add(1, 'day');
    this.endDate = this.infoPromotion.toDate ? new Date(this.infoPromotion.toDate) : moment().add(1, 'day');
    this.store = [];
    this.promotionName = '';
    this.active = '';

    this.dayOfWeeks = [];
    this.discountBill = '';

    this.indexAddMore = -1;

    this.idListComponentRef = React.createRef();
    this.addItemRef = React.createRef();

    this.allItems = {};
    this.editListItem = [];
    this.isEdit = false;

    this.imageList = [];
    this.isLoading = false;

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
  updateStore = (store) => {
    this.store = store;
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
      await model.getPromotion('buygift', this.orderCode).then((res) => {
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
                : new Date()
              : new Date();
            this.endDate = !this.isCopyType
              ? this.infoPromotion.toDate
                ? new Date(this.infoPromotion.toDate)
                : new Date()
              : new Date();

            this.active = !this.isCopyType ? (this.infoPromotion.active === 0 ? 2 : this.infoPromotion.active) : '';

            res.data.promotion.promotionDetails && this.convertItemsResponse(res.data.promotion.promotionDetails);
            // this.isRunning = !this.isCopyType
            //   ? (moment(this.startDate).isBefore(moment()) &&
            //       moment(moment()).isBefore(this.endDate)) ||
            //     moment(this.endDate).isBefore(moment())
            //   : false;
            this.isRunning = false;
            this.props.onUpdateIsRunning(
              (moment(this.startDate).isBefore(moment()) && moment(moment()).isBefore(this.endDate)) ||
                moment(this.endDate).isBefore(moment())
            );
            this.props.onUpDateState(
              !this.isCopyType ? (this.infoPromotion.active === 0 ? 2 : this.infoPromotion.active) : ''
            );
            this.refreshAction();
            this.refresh();
          }
        } else {
          this.targetLink('/promotion-buy-one-get-one');
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
      let item = group[el];

      for (let k in item) {
        item[k].key = k;
      }

      arr.push(group[el]);
    }

    this.items = arr;
    this.itemsConst = arr;
    this.refresh();
  };
  handleUploadImage = async (promotionCode, tableData) => {
    const model = new UploadMediaModel();
    if (tableData && tableData.length > 0) {
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
    }
  };
  handleToDetailCopy = () => {
    this.targetLink('/promotion-buy-one-get-one/' + this.infoPromotion.promotionCode + '/copy');
  };
  handleSave = () => {
    try {
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

      if (!this.isCreate && DateHelper.diffDate(new Date(), new Date(this.startDate)) <= 0) {
        message.error('Apply date must be greater than or equal to current date');
        return;
      }

      if (this.items.length === 0) {
        message.error('Item not found');
        return;
      }
      if (!this.docCode) {
        message.error('Please add docs code');
        return;
      }
      let arrList = [];

      this.items.map((elm, index) =>
        elm.map((item, itemIndex) =>
          arrList.push({
            // key: index+"_"+itemIndex,
            itemCode: item.itemCode,
            qty: item.qty,
            // discountAmount: item.discountAmount,
            group: index + 1,
            type: item.type,
          })
        )
      );

      let model = new PromotionModel();
      let params = {
        promotionName: this.promotionName,
        // startDate: DateHelper.displayDateFormatMinus(this.startDate),
        // endDate: DateHelper.displayDateFormatMinus(this.endDate) + 'T23:59:59',
        startDate: moment(this.startDate)?.clone().format('YYYY-MM-DD'),
        endDate: moment(this.endDate)?.clone().format('YYYY-MM-DD') + 'T23:59:59',
        storeCode: this.store?.length > 0 ? this.store : [],
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
        model.putPromotion('buygift', this.orderCode, params).then(async (res) => {
          if (res.status && res.data) {
            if (res.data.promotionCode && res.data.promotionCode !== '') {
              await this.handleUploadImage(res.data.promotionCode, this.items[this.selectedGroupIndex]);
              this.targetLink('/promotion-buy-one-get-one/' + res.data.promotionCode, '/promotion-buy-one-get-one');
            }
            message.success('Save successfully!', 3);
          } else {
            message.error(res.message);
          }
        });
      } else {
        params.status = 1;
        model.postPromotion('buygift', params).then(async (res) => {
          if (res.status && res.data) {
            if (res.data.promotionCode && res.data.promotionCode !== '') {
              await this.handleUploadImage(res.data.promotionCode, this.items[this.selectedGroupIndex]);
              this.targetLink('/promotion-buy-one-get-one/' + res.data.promotionCode, '/promotion-buy-one-get-one');
            }
            message.success('Save successfully!', 3);
          } else {
            message.error(res.message);
          }
        });
      }
    } catch (err) {
      message.error(err);
    }
  };

  handleUpdateStatus = () => {
    let model = new PromotionModel();
    let type = this.active === 1 ? '/active' : '/inactive';
    let page = 'buygift' + type;
    model.putPromotion(page, this.infoPromotion.promotionCode).then((res) => {
      if (res.status && res.data) {
        message.success('Save successfully!', 3);
      } else {
        message.error(res.message);
      }
    });
  };

  numberGroupUpdate = (num) => {
    this.numberGroup = this.numberGroup + 1;
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

  handleUpdateDataGroupPromo = (arr, indexGroup) => {
    this.isLoading = false;

    let newArr = [];
    let newArrConst = [];

    if (indexGroup?.toString()) {
      const groupCode = this.items.find((el, index) => index === indexGroup)?.[0].group;
      newArr = this.items.map((obj, i) => {
        if (i == indexGroup) {
          return arr;
        }
        return obj;
      });
      newArrConst = this.itemsConst.map((el, i) => {
        if (el[0].group == groupCode) {
          return arr;
        }
        return el;
      });

      this.items = newArr;
      this.itemsConst = newArrConst;
    } else {
      let group = this.items.length + 1;

      for (let index in arr) {
        let item = arr[index];
        let obj = {
          key: index,
          group: group,
          qty: item.qty,
          imageKey: item.imageKey || '',
          itemCode: item.itemCode,
          itemName: item.itemName,
          type: item.type,
        };

        newArr.push(obj);
      }
      this.items.push(newArr);
    }

    this.isEdit = false;
    this.refresh();
  };

  handleDeleteGroupPromo = (groupCode) => {
    let newListItem = this.items.filter((el, i) => {
      return +el[0].group !== groupCode;
    });
    let newListItemConst = this.itemsConst.filter((el, i) => +el[0].group !== groupCode);
    this.items = newListItem;
    this.itemsConst = newListItemConst;
    this.refresh();
  };

  handleEditTable = (index, groupCode) => {
    this.selectedGroupIndex = index;
    if (this.isEdit) return;
    this.isEdit = true;

    this.editListItem = [];
    this.editListItem = [...this.items].filter((el, i) => i === index);

    this.editListItem.forEach((object, index) => {
      object.forEach((el, i) => {
        el.key = i;
        el.isDelete = false;
      });
    });

    this.idControlItemRef.current.handleEditItemsParent(this.editListItem[0], true, index);

    this.isLoading = true;
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

  returnDataTable = (arr, columns, index) => {
    const lst = [...arr];

    const data = createDataTable(lst, columns)?.map((el) => {
      return {
        ...el,
        imageKey: el.imageKey
          ? el.imageKey
          : ImageHelper.getImageUrlByPromotion(this.infoPromotion.promotionCode, el.itemCode),
      };
    });

    this.imageList[index] = data?.map((el) => {
      return {
        imageKey: el.imageKey
          ? el.imageKey
          : ImageHelper.getImageUrlByPromotion(this.infoPromotion.promotionCode, el.itemCode),
        name: 'Image of item #' + el.itemCode,
        itemCode: el.itemCode,
      };
    });
    const res = data?.sort((a, b) => (a.type >= b.type ? 1 : -1));
    return res;
  };
  componentWillUnmount = () => {
    clearTimeout(this.searchCreatedItemsRef);
  };
  renderComp = () => {
    const fields = this.fieldSelected;

    // const columnsTableAdd = [
    //     {
    //         title: 'Item',
    //         dataIndex: 'itemCode',
    //         key: 'itemCode',
    //         colSpan: 2,
    //         align: 'left'
    //     },
    //     {
    //         title: '',
    //         dataIndex: 'itemName',
    //         key: 'itemName',
    //         colSpan: 0,
    //         align: 'left'
    //     },
    //     {
    //         title: 'Type',
    //         dataIndex: 'type',
    //         key: 'type',
    //         align: 'center',
    //         render: (val) => (
    //             <>
    //                 <Tag color={val === 0 ? 'green' : 'geekblue'} key={val}>{val === 0 ? 'Buy' : 'Get'}</Tag>
    //             </>
    //         ),
    //     },
    //     {
    //         title: 'Qty',
    //         dataIndex: 'qty',
    //         key: 'qty',
    //         align: 'right',
    //         render: (val) => StringHelper.formatValue(val)
    //     },

    // ];
    // ==================
    const columns = [
      { field: 'itemCode', label: 'Item', colSpanHead: 2 },
      {
        field: 'itemName',
        label: '',
        colSpanHead: 0,
        styleBody: { maxWidth: 200 },
      },
      { field: 'type', label: 'Type', formatBody: this.renderType },
      {
        field: 'qty',
        label: 'Qty',
        formatBody: (val) => StringHelper.formatValue(val),
      },
      { field: 'imageKey', label: 'Image', formatBody: this.handleRenderImage },
    ];

    // const data = createDataTable(this.items, columns);

    // this.imageList = data?.map(el => { return { imageKey: el.imageKey, name: 'Image of item #' + el.itemCode, itemCode: el.itemCode } })
    // ==================
    const contextValue = this.context;
    const { items } = contextValue.state;

    return (
      <section className="wrap-section">
        <div className="section-block mt-15">
          <div className="row header-detail ">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 flex items-center gap-10">
              <div className="flex justify-content-between w-full items-center">
                <div className="">
                  <button
                    onClick={() => super.back('/promotion-buy-one-get-one')}
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
                </div>{' '}
                <WarningNote xl={8}>
                  <div className="cl-red bg-note">
                    <strong>Lưu ý chức năng:</strong>
                    <br />
                    - Tên của khuyến mãi phải rõ ràng, chi tiết, thể hiện được mục đích của khuyến mãi.
                    <br />
                    - Chương trình khuyến mãi sẽ được cập nhật qua ngày.
                    <br />
                    - Loại KM tặng một(hoặc qty) sản phẩm khi mua đủ điều kiện số lượng sản phẩm.
                    <br />
                    - Thời gian áp dụng phải sau ngày hiện tại.
                    <br />
                    - Một chương trình khuyến mãi phải có ít nhất một sản phẩm mua và một sản phẩm tặng.
                    <br />
                    - Dept. of I&T note: cập nhật thông tin đã đăng ký với cơ quan, tổ chức nhà nước.
                    <br />- Upload hình ảnh để thể hiện trên màn hình khách hàng.
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
            ref={this.idControlItemRef}
            isRunning={this.isRunning}
            startDate={this.startDate}
            endDate={this.endDate}
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
            updateDayOfWeeks={this.updateDayOfWeeks}
            updateDiscountBill={this.updateDiscountBill}
            updateDate={this.updateDate}
            allItems={this.allItems}
            listItem={this.items}
            handleUpdateDataGroupPromo={this.handleUpdateDataGroupPromo}
            type={this.isCopyType}
            handleUpdateIsEdit={this.handleUpdateIsEdit}
            items={this.items}
            imageList={this.imageList}
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
                        type={'gift'}
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
        <Block>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <div className="w-full">
                <label htmlFor="">Filter by item</label>
                <Input
                  onChange={(e) => {
                    const value = e.target.value;
                    if (this.searchCreatedItemsRef) {
                      clearTimeout(this.searchCreatedItemsRef);
                    }
                    this.searchCreatedItemsRef = setTimeout(() => {
                      if (!value) {
                        this.items = this.itemsConst;
                        this.refresh();
                      }
                      const filteredItems = this.itemsConst.filter((item) =>
                        item.find((subItem) => {
                          const match = `${subItem.itemCode}${subItem.itemName}`
                            ?.toLowerCase()
                            .includes(value.trim().toLowerCase());
                          return match;
                        })
                      );
                      this.items = filteredItems?.map((item) => {
                        return item.map((subItem) => {
                          return {
                            ...subItem,
                            itemCode: subItem.itemCode.includes(value) ? (
                              <Highlighter
                                highlightClassName="highlight"
                                searchWords={value?.split(' ')}
                                autoEscape={true}
                                textToHighlight={subItem.itemCode}
                              />
                            ) : (
                              subItem.itemCode
                            ),

                            itemName: subItem.itemName.toLowerCase().includes(value.trim().toLowerCase()) ? (
                              <Highlighter
                                highlightClassName="highlight"
                                searchWords={value?.split(' ')}
                                autoEscape={true}
                                textToHighlight={subItem.itemName}
                              />
                            ) : (
                              subItem.itemName
                            ),
                          };
                        });
                      });
                      this.refresh();
                    }, 500);
                  }}
                  placeholder="Enter item code or name"
                  style={{ width: 500 }}
                />
              </div>
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="mrt-5 mrb-5" style={{ maxHeight: 'calc(100vh - 555px)', overflow: 'auto' }}>
            {this.items.length > 0 &&
              this.items.map((item, index) => {
                return (
                  <Col span={8}>
                    <div className="section-block" key={index}>
                      <h3 className="name-target">
                        Group: {item[0].group}
                        {this.isRunning ? null : (
                          <>
                            <EditOutlined
                              onClick={() => this.handleEditTable(index, item[0].group)}
                              style={{ color: '#007cff', marginLeft: 20 }}
                            />
                            <DeleteOutlined
                              onClick={() => this.handleDeleteGroupPromo(item[0].group)}
                              style={{ color: 'red', marginLeft: 15 }}
                            />
                          </>
                        )}
                      </h3>

                      <TableCustom
                        data={this.returnDataTable(item, columns, index)}
                        columns={columns}
                        isPaging={false}
                        isLoading={this.isLoading}
                        fullWidth={true}
                      />
                      {/* <TableComp
                                columns={columnsTableAdd}
                                dataSource={item}
                                page={false}
                            /> */}
                    </div>
                  </Col>
                );
              })}
          </Row>
        </Block>
      </section>
    );
  };
}

SearchPromotionBuyOneGetOneDetail.contextType = AppContext;
