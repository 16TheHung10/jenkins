//Plugin
import { Col, Row } from "antd";
import BaseComponent from "components/BaseComponent";
import ListSearchCheckin from "components/mainContent/promotion/listSearchCheckin";
import { DateHelper, PageHelper, StringHelper } from "helpers";
import CommonModel from "models/CommonModel";
import PromotionModel from "models/PromotionModel";
import React from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
export default class SearchCheckinPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.listSearchCheckinRef = React.createRef();
    this.idListComponent = "listPromotion" + StringHelper.randomKey();
    this.data.stores = [];
    this.items = [];
    this.isAllowUpdate = true;
    this.fieldSelected = this.assignFieldSelected(
      {
        startDate: "",
        endDate: "",
      },
      ["storeCode"],
    );

    this.isAutoload = PageHelper.updateFilters(
      this.fieldSelected,
      function (filters) {
        if (filters["startDate"]) {
          filters["startDate"] = new Date(filters["startDate"]);
        }
        if (filters["endDate"]) {
          filters["endDate"] = new Date(filters["endDate"]);
        }
        return true;
      },
    );
    this.isRender = true;
  }

  componentDidMount = () => {
    this.handleUpdateState();
  };

  handleSearch = () => {
    let fields = this.fieldSelected;

    if (fields.storeCode === "") {
      this.showAlert("Please select a store");
      return;
    }

    if (fields.startDate === "" || fields.startDate === null) {
      this.showAlert("Please select start date");
      return;
    }

    if (fields.endDate === "" || fields.endDate === null) {
      this.showAlert("Please select end date");
      return;
    }

    PageHelper.pushHistoryState(this.fieldSelected);

    this.handleLoadResult();

    this.refresh();
  };

  handleUpdateState = async (event) => {
    let commonModel = new CommonModel();
    await commonModel.getData("store").then((response) => {
      if (response.status && response.data.stores) {
        this.data.stores = response.data.stores || [];
      }
    });
    this.handleHotKey({});
    this.refresh();
  };

  handleLoadResult = () => {
    let fields = this.fieldSelected;

    let params = {
      storeCode: fields.storeCode,
      startDate: DateHelper.displayDateFormat(fields.startDate),
      endDate: DateHelper.displayDateFormat(fields.endDate),
      history: 1,
    };

    let model = new PromotionModel();

    model.getQrCode(params).then((res) => {
      if (res.status && res.data.qrList) {
        this.items = res.data.qrList;
        this.refresh();
      }
    });
  };

  handleClickPaging = (page) => {
    let fields = this.fieldSelected;
    fields.page = page;
    this.refresh();
  };

  handleChangeStore = () => {
    let fields = this.fieldSelected;
    if (fields.promotionCode != "") {
      // https://gs25.com.vn/register-app?promotionCode=2&storeCode=VN0002
      fields.url =
        "https://gs25.com.vn/register-app?promotionCode=" +
        fields.promotionCode +
        "&storeCode=" +
        fields.storeCode;
    }
    this.refresh();
  };

  handleDownloadQRcode = () => {
    let fields = this.fieldSelected;
    if (fields.storeCode == "") {
      this.showAlert("Please choose store to download", "error");
      return;
    }
    var canvas = document.getElementById("qr-gen");
    var pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${fields.storeCode}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  renderQRcode = () => {
    const fields = this.fieldSelected;

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

    return (
      <div className="form-filter section-block mt-15">
        <Row gutter={[15, 15]}>
          <Col span={16}>
            <Row gutter={[16, 16]}>
              {/* STORE */}
              <Col span={8}>
                <div className="form-group">
                  <label htmlFor="storeCode" className="w100pc">
                    Store:
                  </label>
                  <Select
                    isDisabled={storeOptions.length === 1}
                    isClearable
                    classNamePrefix="select"
                    maxMenuHeight={260}
                    placeholder="-- All --"
                    value={storeOptions.filter(
                      (option) => option.value === fields.storeCode,
                    )}
                    options={storeOptions}
                    // onChange={(e) => this.handleChangeFieldCustom("storeCode", e ? e.value : "", this.handleChangeStore)}
                    onChange={(e) =>
                      this.handleChangeFieldCustom(
                        "storeCode",
                        e ? e.value : "",
                        () => {},
                      )
                    }
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-group">
                  <label className="w100pc">Promotion date: </label>
                  <Row gutter={[16, 16]} className=" date-row-ft">
                    <Col span={12}>
                      <DatePicker
                        placeholderText="Start date"
                        selected={fields.startDate}
                        onChange={(value) =>
                          this.handleChangeFieldCustom("startDate", value)
                        }
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        autoComplete="off"
                        isClearable={fields.startDate ? true : false}
                      />
                    </Col>
                    <Col span={12}>
                      <DatePicker
                        placeholderText="End date"
                        selected={fields.endDate}
                        onChange={(value) =>
                          this.handleChangeFieldCustom("endDate", value)
                        }
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        autoComplete="off"
                        isClearable={fields.endDate ? true : false}
                      />
                    </Col>
                  </Row>
                </div>
              </Col>

              <Col span={4} className="col-md-2">
                <div className="form-group">
                  <label className="w100pc op0">.</label>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={this.handleSearch}
                    style={{ height: 38 }}
                  >
                    Search
                  </button>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <div className="cl-red bg-note">
              <span>
                <strong>Lưu ý chức năng</strong> Promotion Checkin – Áp dụng cho
                new member check in tại store mới được nhận voucher product hoặc
                cash vào tủ quà.
              </span>
              <br />
              1. KH thực hiện scan mã QR đăng ký thành viên (genQR chức năng
              trong setup), và hoàn thành việc đăng ký.
              <br />
              2. KH sẽ nhận được SMS brand name- GS25 VN: thông báo chào mừng
              new member và thông tin tải và đăng nhập GS25 App.
              <br />
              3. KH đăng nhập vào App bằng thông tin đã đăng ký và có thể sử
              dụng voucher trên tủ quà để thực hiện mua hàng tại cửa hàng GS25
              new open.
              <br />
              4. Chức năng có thể thực hiện cross sales giữa các khu vực
              tỉnh/thành phố hoặc Brand partner ngoài GS25.
            </div>
          </Col>
        </Row>
        <Row>{this.renderList()}</Row>
      </div>
    );
  };

  renderList = () => {
    return (
      <ListSearchCheckin
        idComponent={this.idListComponent}
        ref={this.listSearchCheckinRef}
        refresh={this.countSearch}
        page={this.fieldSelected.page}
        items={this.items}
        handleLoadResult={this.handleLoadResult}
        autoload={this.isAutoload}
        // type={this.props.type}
        onClickSearch={this.handleSearch}
        handleClickPaging={this.handleClickPaging}
      />
    );
  };

  renderComp = () => {
    return (
      <div>
        <div className="wrap-section">{this.renderQRcode()}</div>
      </div>
    );
  };
}
