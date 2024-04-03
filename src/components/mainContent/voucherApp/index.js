//Plugin
import $ from "jquery";
import React from "react";
import Select from "react-select";

//Custom
import BaseComponent from "components/BaseComponent";
import {
  DateHelper,
  FileHelper,
  PageHelper,
  StringHelper,
  OptionsHelper,
} from "helpers";
import CommonModel from "models/CommonModel";
import DownloadModel from "models/DownloadModel";
import VoucherModel from "models/VoucherModel";

import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row, message } from "antd";

class VoucherApp extends BaseComponent {
  constructor(props) {
    super(props);
    this.idComponent = "managementScreen2" + StringHelper.randomKey();
    this.idImport = "import" + StringHelper.randomKey();

    this.data.stores = [];
    this.importData = [];
    this.items = [];
    this.isSuccess = false;
    this.campaigns = null;
    this.divisions = null;
    this.fieldSelected = this.assignFieldSelected(
      {
        aplliedTotalBill: 0,
        details: [],
        campaigns: "",
        divisions: [],
      },
      ["storeCode"],
    );

    this.isAutoload = PageHelper.updateFilters(
      this.fieldSelected,
      function (filters) {
        if (filters["date"]) {
          filters["date"] = new Date(filters["date"]);
        }

        return true;
      },
    );

    this.isRender = true;
  }
  async handleGetCampaign() {
    const model = new CommonModel();
    const res = await model.getCampain();
    if (res.status) {
      this.campaigns = res.data.campaign || {
        11111111: {
          campaignCode: "11111111",
          campaignName: "Tên campaign",
        },
        11111112: {
          campaignCode: "11111112",
          campaignName: "Tên campaign 2",
        },
      };
      this.refresh();
    } else {
      message.error(res.message);
    }
  }
  async handleGetdivisions() {
    const model = new CommonModel();
    const res = await model.getDivisions();
    if (res.status) {
      this.divisions = res.data.divisions;
      this.refresh();
    } else {
      message.error(res.message);
    }
  }
  componentDidMount = () => {
    this.handleUpdateState();
    this.handleGetCampaign();
    this.handleGetdivisions();
  };

  handleUpdateState = async (event) => {
    let commonModel = new CommonModel();
    await commonModel.getData("store").then((res) => {
      if (res.status && res.data.stores) {
        this.data.stores = res.data.stores || [];
      }
    });

    this.refresh();
  };

  finishUploadFile = (textFile) => {
    this.importData = textFile;
    this.refresh();
  };

  cancel = () => {
    this.importData = null;
    $("#" + this.idImport).val(this.importData);
  };

  isValidForSend() {
    return this.importData != null && this.importData.length != 0;
  }

  handleSendImport = () => {
    const fields = this.fieldSelected;
    this.isSuccess = false;

    let appliedStore = fields.storeCode !== "" && fields.storeCode.join(",");
    let stockImport = [];
    if (!this.isValidForSend()) {
      this.showAlert("Please choose file CSV");
      return;
    }

    stockImport = this.importData.map((item) => {
      let itemSplit = item.split(",");
      return itemSplit;
    });

    let obj = {
      apliedTotalBill: parseInt(fields.aplliedTotalBill),
      appliedStore: appliedStore,
      details: stockImport,
      // divisions: fields.divisions,
      // campaign: fields.campaigns,
    };

    var model = new VoucherModel();
    model.postListVoucher(obj).then((response) => {
      if (response.status && response.data && response.data.voucherList) {
        this.isSuccess = true;
        this.items = response.data.voucherList;
        this.showAlert("File was sent", "success");
        this.cancel();

        let downloadModel = new DownloadModel();
        downloadModel.get(response.data.downloadUrl, null, null, ".xls");
      } else {
        this.isSuccess = false;
        this.showAlert(response.message || "Can not import file");
      }

      this.refresh();
    });
  };

  renderFields() {
    const fields = this.fieldSelected;

    let stores = this.data.stores;
    let storeKeys = Object.keys(stores);
    const orderStore = {};
    Object.keys(stores)
      .sort()
      .forEach(function (key) {
        orderStore[key] = stores[key];
      });
    let storeOptions = [];
    if (storeKeys.length === 0) {
      storeOptions.push({
        value: this.data.storeCode,
        label: this.data.storeCode + " - " + this.data.storeName,
      });
    } else {
      storeOptions = Object.keys(orderStore).map((key) => {
        return {
          value: stores[key].storeCode,
          label: stores[key].storeCode + " - " + stores[key].storeName,
        };
      });
    }
    let campOptions = OptionsHelper.convertDataToOptions(
      Object.values(this.campaigns || {}),
      "campaignCode",
      "campaignName",
    );
    let divisionOptions = OptionsHelper.convertDataToOptions(
      Object.values(this.divisions || {}),
      "divisionCode",
      "divisionName",
    );
    return (
      <div className="section-block mt-15 mb-15">
        <div className="form-filter">
          <Row gutter={[16, 16]}>
            <Col span={16}>
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <div className="form-group">
                    <label className="w100pc">
                      <span style={{ paddingRight: 10 }}>Applied store:</span>
                    </label>

                    <Select
                      isDisabled={storeOptions.length === 1}
                      isClearable
                      isMulti
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="--Select store--"
                      value={storeOptions.filter(
                        (option) =>
                          fields.storeCode.indexOf(option.value) !== -1,
                      )}
                      options={storeOptions}
                      onChange={(e) =>
                        this.handleChangeFieldsCustom("storeCode", e ? e : "")
                      }
                    />
                  </div>
                </Col>
                {/* <Col span={6}>
              <div className="form-group">
                <label className="w100pc">
                  <span style={{ paddingRight: 10 }}>Applied campaign:</span>
                </label>

                <Select
                  isDisabled={campOptions.length === 0}
                  isClearable
                  // isMulti
                  classNamePrefix="select"
                  maxMenuHeight={260}
                  placeholder="--Select event--"
                  value={campOptions.filter((option) => option.value === fields.campaigns)}
                  options={campOptions}
                  onChange={(e) => this.handleChangeFieldCustom('campaigns', e ? e.value : '')}
                />
              </div>
            </Col>
            <Col span={6}>
              <div className="form-group">
                <label className="w100pc">
                  <span style={{ paddingRight: 10 }}>Exclude divisions:</span>
                </label>

                <Select
                  isDisabled={divisionOptions.length === 0}
                  isClearable
                  isMulti
                  classNamePrefix="select"
                  maxMenuHeight={260}
                  placeholder="--Select exclude divisions--"
                  value={divisionOptions.filter((option) => fields.divisions?.indexOf(option.value) !== -1)}
                  // value={fields.divisions}
                  options={divisionOptions}
                  onChange={(e) => this.handleChangeFieldsCustom('divisions', e ? e : '')}
                />
              </div>
            </Col> */}
                <Col span={6}>
                  <div className="form-group">
                    <label className="w100pc">
                      <span style={{ paddingRight: 10 }}>
                        Apllied Total Bill:
                      </span>
                    </label>

                    <input
                      type="text"
                      autoComplete="off"
                      name="aplliedTotalBill"
                      onChange={this.handleChangeField}
                      value={fields.aplliedTotalBill}
                      className="form-control"
                    />
                  </div>
                </Col>

                <Col span={6}>
                  <div className="form-group">
                    <label className="w100pc">
                      <span style={{ paddingRight: 10 }}>File csv:</span>
                      <a
                        title="Download file csv"
                        href="https://api.gs25.com.vn:8091/storemanagement/share/template/voucher/VoucherCreateTemplate.csv"
                        target="_blank"
                      >
                        <FontAwesomeIcon icon={faQuestionCircle} />
                        Download File CSV
                      </a>
                    </label>
                    <input
                      type="file"
                      className="form-control form-control-file"
                      id={this.idImport}
                      onChange={(e) =>
                        FileHelper.uploadFiles(e, this.finishUploadFile)
                      }
                      accept=".csv"
                    />
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <div className="cl-red bg-note">
                <span>
                  <strong>Lưu ý chức năng</strong> Gửi tặng voucher đến KH sử
                  dụng APP GS25 VN.
                </span>
                <br />
                1. Upload files mã định danh voucher (voucher code/ Store apply
                sử dụng/ giá trị bill/ items áp dụng/ số lượng,..)
                <br />
                2. Mặc định total bill = 0 cho all giá trị bill.
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  renderTable() {
    let items = this.items;
    return (
      <div className="section-block mb-15  w-fit">
        <div className="wrap-table htable w-fit">
          <table className="table table-hover w-fit">
            <thead>
              <tr>
                <th>Voucher Code</th>
                <th className="rule-number">Amount</th>
                <th>Applied store</th>
                <th>Item code</th>
                <th>Item name</th>
                <th className="rule-number">Applied totalBill</th>
                <th className="rule-date">Expired date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  {/*<td><input type='checkbox' disabled={item.status === 1} name='itemOption' value={item.code} /></td> */}
                  <td>{item.voucherCode}</td>
                  <td className="rule-number">
                    {StringHelper.formatPrice(item.amount)}
                  </td>
                  <td>{item.appliedStore}</td>
                  <td>{item.itemCode}</td>
                  <td>{item.itemName}</td>
                  <td className="rule-number">
                    {StringHelper.formatPrice(item.appliedTotalBill)}
                  </td>
                  <td className="rule-date">
                    {DateHelper.displayDate(item.expiredDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 ? (
            <div className="table-message">Item not found</div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }

  renderComp() {
    return (
      <section id={this.idComponent}>
        {this.renderFields()}
        {/* {this.isSuccess && this.renderTable()} */}
        {this.renderTable()}
      </section>
    );
  }
}

export default VoucherApp;
