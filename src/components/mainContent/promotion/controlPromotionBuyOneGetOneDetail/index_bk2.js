//Plugin
import React from "react";
// import DatePicker from "react-datepicker";
//Custom
import BaseComponent from "components/BaseComponent";
import { StringHelper } from "helpers";
import CommonModel from "models/CommonModel";

import AutocompleteBarcode from "components/mainContent/promotion/autocompleteBarcode";

import {
  CaretRightOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Collapse,
  InputNumber,
  message,
  Modal,
  Row,
  Space,
  Tag,
} from "antd";

import InputComp from "utils/input";
import InputNumberComp from "utils/inputNumber";
import RadioComp from "utils/radio";
import RangePicker from "utils/rangePicker";
import SelectBox from "utils/selectBox";
import TableComp from "utils/table";

const { Panel } = Collapse;

export default class ControlPromotionBuyOneGetOneDetail extends BaseComponent {
  constructor(props) {
    super(props);

    this.idBarcodeItemRef = React.createRef();
    this.idBarcodeItem = "idBarcodeItem" + StringHelper.randomKey();

    this.idQtyItemRef = React.createRef();
    this.idTypeItemRef = React.createRef();
    this.idStatusRef = React.createRef();

    this.isCopyType = this.props.type || false;

    this.isCreate = this.props.isCreate;
    this.infoPromotion = this.props.infoPromotion || {};

    this.isUpdateForm = (this.infoPromotion.poCode || "") !== "";
    this.isAllowUpdate =
      !this.isUpdateForm ||
      (!this.infoPromotion.approved && !this.infoPromotion.cancel);

    /*----------------------------------------*/
    /*----------------------------------------*/

    this.data.stores = [];

    if (this.infoPromotion.storeCode) {
      this.fieldSelected.storeCode = !this.isCopyType
        ? this.infoPromotion.storeCode
        : "";
      this.data.storeName = !this.isCopyType
        ? this.infoPromotion.storeName
        : "";
    }

    this.fieldSelected.promotionName = !this.isCopyType
      ? this.props.promotionName
      : "";

    this.fieldSelected.createdDate = !this.isCopyType
      ? this.infoPromotion.createdDate
        ? new Date(this.infoPromotion.createdDate)
        : new Date()
      : "";
    this.fieldSelected.startDate = !this.isCopyType
      ? this.infoPromotion.fromDate
        ? new Date(this.infoPromotion.fromDate)
        : new Date()
      : new Date();
    this.fieldSelected.endDate = !this.isCopyType
      ? this.infoPromotion.toDate
        ? new Date(this.infoPromotion.toDate)
        : new Date()
      : new Date();

    this.fieldSelected.group = "";

    this.fieldSelected.orderStatus = !this.isCopyType
      ? this.infoPromotion.active === 0
        ? 2
        : this.infoPromotion.active
      : "";
    this.listGroup = this.props.group || [];

    /* --------- */
    this.allItems = this.props.allItems || {};
    this.dataTableAdd = [];

    this.itemAdd = {};
    this.itemAdd.qty = 0;
    this.itemAdd.type = "";
    // this.itemAdd.discountAmount = 0;
    this.newRow = {};

    this.dataAddGroup = [];
    this.isEditting = false;
    this.fieldSelected.itemEdit = null;
    this.indexGroup = "";

    this.items = [];

    this.isRender = true;
  }

  componentDidMount() {
    this.handleUpdateState();
  }

  componentWillReceiveProps(newProps) {
    let isPoChange = this.props.infoPromotion !== newProps.infoPromotion;
    if (isPoChange) {
      this.infoPromotion = newProps.infoPromotion;
      this.fieldSelected.orderStatus =
        newProps.infoPromotion.active === 0 ? 2 : newProps.infoPromotion.active;
      this.refresh();
    }

    if (this.isCreate !== newProps.isCreate) {
      this.isCreate = newProps.isCreate;
      this.refresh();
    }

    if (newProps.group) {
      this.listGroup = newProps.group;
      this.refresh();
    }

    if (newProps.promotionName !== this.fieldSelected.promotionName) {
      this.fieldSelected.promotionName = newProps.promotionName;
      this.refresh();
    }

    if (newProps.allItems !== this.allItems) {
      this.allItems = newProps.allItems;
      // this.refresh();
    }
    if (newProps.listItem !== this.items) {
      this.items = newProps.listItem;
    }
  }

  async handleUpdateState() {
    if (
      !this.isUpdateForm ||
      (!this.infoPromotion.approved && !this.infoPromotion.cancel)
    ) {
      let commonModel = new CommonModel();
      await commonModel.getData("store").then((response) => {
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

  handleAddItemToList = () => {
    // console.log(this.dataAddGroup)
    let itemCode = this.idBarcodeItemRef.current.getBarcodeSelected();
    let qty = this.itemAdd.qty;
    let type = this.itemAdd.type;
    // let discountAmount = this.itemAdd.discountAmount;

    let item = this.allItems[itemCode];

    if (type === undefined || type === "") {
      message.error("Please choose type");
      return false;
    }

    if (itemCode === "") {
      message.error("Please insert barcode");
      return false;
    }

    let typeGet = 0;
    let typeBuy = 0;
    for (let index in this.dataAddGroup) {
      let target = this.dataAddGroup[index];
      if (target.itemCode === itemCode && target.type === type) {
        message.error("Barcode exists", 1);
        return false;
      }

      if (target.type === 0) {
        typeBuy = 1;
      }
      if (target.type === 1) {
        typeGet = 1;
      }
    }

    if (typeBuy === 1 && type === 0) {
      message.error("Type 'Buy' is exist", 1);
      return false;
    }

    if (typeGet === 1 && type === 1) {
      message.error("Type 'Get' is exist", 1);
      return false;
    }

    for (let index in this.items) {
      let elm = this.items[index];

      for (let index2 in elm) {
        let elm2 = elm[index2];

        if (elm2.itemCode === itemCode && type === 0 && elm2.type === 0) {
          message.error(
            "Barcode exists in group " + (parseFloat(index) + 1),
            1,
          );
          return false;
        }
      }
    }

    if (qty === undefined || qty === 0) {
      message.error("Please insert qty");
      return false;
    }

    // if (discountAmount === undefined || discountAmount === 0) {
    //     message.error("Please insert discount amount");
    //     return false;
    // }

    let obj = {
      key: this.dataAddGroup.length,
      itemCode: item.itemCode,
      itemName: item.itemName,
      qty: qty,
      // discountAmount: discountAmount,
      type: type,
      isDelete: false,
    };
    this.newRow = {};
    this.newRow = obj;

    this.handleCancelAddItemToList();
  };

  handleDeleteRowTableAdd = (record) => {
    this.newRow = { ...record };
    this.newRow.isDelete = true;

    this.refresh();
  };

  handleEditRowTableAdd = (record) => {
    this.isEditting = true;
    this.fieldSelected.itemEdit = record;
    this.refresh();
  };

  handleCancelAddItemToList = () => {
    this.idBarcodeItemRef.current.setNewValue("");
    this.itemAdd.qty = 0;
    this.itemAdd.type = "";
    // this.itemAdd.discountAmount = 0;
    this.refresh();
  };

  handleAddGroupPromotion = () => {
    if (this.dataAddGroup.length === 0) {
      message.error("Please add item to create group");
      return false;
    }

    let isBuy, isGet;
    isBuy = isGet = false;

    for (let key in this.dataAddGroup) {
      let item = this.dataAddGroup[key];

      if (item.type === 0) {
        isBuy = true;
      }

      if (item.type === 1) {
        isGet = true;
      }
    }

    if (isBuy === false) {
      message.error("Please add item 'BUY' to create group");
      return false;
    }

    if (isGet === false) {
      message.error("Please add item 'GET' to create group");
      return false;
    }

    this.props.handleUpdateDataGroupPromo(this.dataAddGroup, this.indexGroup);

    this.dataAddGroup = [];
    this.dataTableAdd = [];
    this.newRow = {};
    this.indexGroup = "";

    this.refresh();
  };

  handleUpdateGroupPromo = (arr) => {
    this.dataAddGroup = arr;

    this.refresh();
  };

  handleEditItemsParent = (list, isUpdate, index) => {
    this.newRow = {};
    this.newRow = list;

    this.isUpdate = isUpdate;
    this.dataAddGroup = [];
    this.dataAddGroup = [...list];
    this.indexGroup = index;
    this.refresh();
  };

  // handleUpdateStatusApi = (val) => {
  //     this.handleUpdateField(val,'orderStatus');

  //     // let model = new PromotionModel();
  //     // let type = val === 1 ? '/active' : '/inactive';
  //     // let page = 'buygift' + type;
  //     // model.putPromotion(page, this.infoPromotion.promotionCode).then(res => {
  //     //     if (res.status && res.data) {
  //     //         message.success("Save successfully!", 3);
  //     //     } else {
  //     //         message.error(res.message);
  //     //     }
  //     // });
  // }

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
        label: this.data.storeCode + " - " + this.data.storeName,
      };
      storeOptions.push(obj);
    } else {
      storeOptions = Object.keys(orderStore).map((key) => {
        let obj = {
          value: stores[key].storeCode,
          label: stores[key].storeCode + " - " + stores[key].storeName,
        };
        return obj;
      });
    }

    let statusOptions = [
      { value: 1, label: "Active" },
      { value: 2, label: "Inactive" },
    ];
    let dataType = [
      { value: 0, label: "Buy" },
      { value: 1, label: "Get" },
    ];
    let dataTableAdd = this.dataTableAdd;

    const columnsTableAdd = [
      {
        title: "Item",
        dataIndex: "itemCode",
        key: "itemCode",
        colSpan: 2,
        align: "left",
      },
      {
        title: "",
        dataIndex: "itemName",
        key: "itemName",
        colSpan: 0,
        align: "left",
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        align: "center",
        render: (val) => (
          <>
            <Tag color={val === 0 ? "green" : "geekblue"} key={val}>
              {val === 0 ? "Buy" : "Get"}
            </Tag>
          </>
        ),
      },
      {
        title: "Qty",
        dataIndex: "qty",
        key: "qty",
        align: "right",
        render: (val) => StringHelper.formatValue(val),
      },
      // {
      //     title: 'Discount amount',
      //     dataIndex: 'discountAmount',
      //     key: 'discountAmount',
      //     align: 'right'
      // },
      {
        title: "Actions",
        key: "action",
        align: "right",
        render: (record) => {
          return (
            <>
              <EditOutlined
                onClick={() => this.handleEditRowTableAdd(record)}
              />
              <DeleteOutlined
                onClick={() => this.handleDeleteRowTableAdd(record)}
                style={{ color: "red", marginLeft: 12 }}
              />
            </>
          );
        },
      },
    ];

    return (
      <section>
        <div className="form-filter">
          <Row>
            <Col xl={24}>
              <div className="section-block">
                <Row gutter={16}>
                  <Col xl={16}>
                    <Row gutter={16}>
                      <Col xl={8} xxl={4}>
                        <label htmlFor="promotionName" className="w100pc">
                          <span className="required">Promotion name:</span>
                          <InputComp
                            func={this.handleUpdateField}
                            funcCallback={this.props.updatePromotionName}
                            keyField="promotionName"
                            text={fields.promotionName}
                          />
                        </label>
                      </Col>

                      <Col xl={8} xxl={4}>
                        <label htmlFor="date" className="w100pc">
                          <span className="required"> Apply Date:</span>
                          <div>
                            {/* <RangePicker start={fields.startDate} end={fields.endDate} func={this.handleUpdateDate} funcCallback={this.props.updateDate} disabledDate={new Date()}/> */}
                            <RangePicker
                              start={fields.startDate}
                              end={fields.endDate}
                              func={this.handleUpdateDate}
                              funcCallback={this.props.updateDate}
                            />
                          </div>
                        </label>
                      </Col>

                      <Col xl={8} xxl={4}>
                        <label htmlFor="storeCode" className="w100pc">
                          Apply store:
                          <SelectBox
                            data={storeOptions}
                            placeholder={"All store"}
                            func={this.handleUpdateStore}
                            keyField="storeCode"
                            value={fields.storeCode}
                            isMode={"multiple"}
                            funcCallback={this.props.updateStore}
                          />
                        </label>
                      </Col>
                      {!this.isCopyType && (
                        <>
                          {!this.isCreate && (
                            <Col xl={8} xxl={4}>
                              <label htmlFor="orderStatus" className="w100pc">
                                Status:
                                {/* <Tag color={fields.orderStatus === 1 ? 'green' : 'red'}> {fields.orderStatus === 1 ? 'Active' : 'Inactive'}</Tag> */}
                                {/* <SelectBox data={statusOptions} func={this.handleUpdateField} funcCallback={this.props.updateActive} keyField={'orderStatus'} value={fields.orderStatus} isMode={''} /> */}
                                <RadioComp
                                  data={statusOptions}
                                  value={fields.orderStatus}
                                  ref={this.idStatusRef}
                                  // funcCallback={this.handleUpdateStatusApi}
                                  funcCallback={this.props.updateActive}
                                />
                              </label>
                            </Col>
                          )}
                        </>
                      )}
                    </Row>
                  </Col>
                  <Col xl={8}>
                    <div className="cl-red bg-note">
                      <strong>Lưu ý:</strong> <br />
                      - Chương trình khuyến mãi sẽ được cập nhật qua ngày.{" "}
                      <br />
                      - Loại khuyến mãi tặng một sản phẩm khi mua đủ điều kiện
                      số lượng sản phẩm <br />
                      - Thời gian áp dụng phải sau ngày hiện tại. <br />- Một
                      chương trình khuyến mãi phải có ít nhất một sản phẩm mua
                      và một sản phẩm tặng.
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <Row className="mt-15">
            <Col xl={24}>
              <div className="section-block">
                <Collapse
                  bordered={false}
                  defaultActiveKey={this.isCreate ? ["1"] : ""}
                  expandIcon={({ isActive }) => (
                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                  )}
                  className="site-collapse-custom-collapse"
                >
                  <Panel
                    header="Add items to the list"
                    key="1"
                    className="site-collapse-custom-panel"
                  >
                    <Row xl={24} gutter={16} className="fs-12">
                      <Col xl={12}>
                        <Row xl={24} gutter={16}>
                          <Col xl={12} xxl={8}>
                            <label htmlFor="itemCode" className="w100pc">
                              Type:
                              <div style={{ paddingTop: 5 }}>
                                <RadioComp
                                  data={dataType}
                                  value={this.itemAdd.type}
                                  ref={this.idTypeItemRef}
                                  funcCallback={(val) => {
                                    this.itemAdd.type = val;
                                    this.refresh();
                                  }}
                                />
                              </div>
                            </label>
                          </Col>
                        </Row>
                        <Row xl={24} gutter={16}>
                          <Col xl={12} xxl={8}>
                            <label htmlFor="itemCode" className="w100pc">
                              Barcode:
                              <AutocompleteBarcode
                                idComponent={this.idBarcodeItem}
                                ref={this.idBarcodeItemRef}
                                barCodes={this.allItems}
                              />
                            </label>
                          </Col>
                        </Row>
                        <Row xl={24} gutter={16}>
                          <Col xl={12} xxl={8}>
                            <label htmlFor="qty" className="w100pc">
                              Qty:
                              <div>
                                <InputNumberComp
                                  value={this.itemAdd.qty}
                                  funcCallback={(val) => {
                                    this.itemAdd.qty = val;
                                    this.refresh();
                                  }}
                                />
                              </div>
                            </label>
                          </Col>
                        </Row>
                        {/* <Row xl={24} gutter={16}>
                                                    <Col xl={12} xxl={8}>
                                                        <label htmlFor="discountAmount" className="w100pc">
                                                            Discount amount:
                                                            <div>
                                                                <InputNumberComp value={this.itemAdd.discountAmount} funcCallback={(val) => { this.itemAdd.discountAmount = val; this.refresh() }} />
                                                            </div>
                                                        </label>
                                                    </Col>
                                                </Row> */}
                        <Row>
                          <Col xl={24} style={{ marginTop: 10 }}>
                            <Space size={"small"}>
                              <Button
                                type="button"
                                className="btn btn-success h-30"
                                style={{ background: "black" }}
                                onClick={this.handleCancelAddItemToList}
                              >
                                Clear
                              </Button>
                              <Button
                                type="button"
                                className="btn btn-success h-30"
                                style={{ background: "black" }}
                                onClick={this.handleAddItemToList}
                              >
                                Add list
                              </Button>
                              {/* <Button type="button" className="btn btn-success h-30" style={{ background: 'black' }} onClick={this.handleAddGroupPromotion}>
                                                                Create group
                                                            </Button > */}
                            </Space>
                          </Col>
                        </Row>
                      </Col>
                      <Col xl={12}>
                        <Modal
                          title={
                            "#" +
                            fields.itemEdit?.itemCode +
                            " - " +
                            fields.itemEdit?.itemName
                          }
                          open={this.isEditting}
                          okText="Update"
                          onCancel={() => {
                            this.isEditting = false;
                            fields.itemEdit = null;
                            this.refresh();
                          }}
                          onOk={() => {
                            this.newRow = fields.itemEdit;
                            this.newRow.isUpdate = true;

                            this.isEditting = false;
                            fields.itemEdit = null;

                            this.refresh();
                          }}
                        >
                          <label className="w100pc">
                            Qty:
                            <div>
                              {/* <InputNumberComp func={this.handleUpdateField} funcCallback={() => console.log('')} keyField='itemEdit' value={fields.itemEdit?.discountAmount} /> */}
                              <InputNumber
                                value={fields.itemEdit?.qty || ""}
                                formatter={(value) =>
                                  `${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ",",
                                  )
                                }
                                parser={(value) =>
                                  value.replace(/\$\s?|(,*)/g, "")
                                }
                                onChange={(e) => {
                                  let edit = fields.itemEdit && {
                                    ...fields.itemEdit,
                                    qty: e,
                                  };
                                  fields.itemEdit = edit;
                                  this.refresh();
                                }}
                                min={1}
                                max={999999}
                              />
                            </div>
                          </label>
                        </Modal>
                        <TableComp
                          columns={columnsTableAdd}
                          dataSource={dataTableAdd}
                          newRow={this.newRow}
                          funcCallback={this.handleUpdateGroupPromo}
                          page={false}
                        />

                        <Row>
                          <Col xl={24} style={{ marginTop: 10 }}>
                            <Space size={"small"}>
                              <Button
                                type="button"
                                className="btn btn-success h-30"
                                style={{ background: "black" }}
                                onClick={this.handleAddGroupPromotion}
                              >
                                Apply promotion
                              </Button>
                            </Space>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Panel>
                </Collapse>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    );
  }
}
