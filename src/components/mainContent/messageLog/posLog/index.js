import BaseComponent from "components/BaseComponent";
import { ArrayHelper, DateHelper, MessageHubHelper } from "helpers";
import CommonModel from "models/CommonModel";
import MessageNotifyModel from "models/MessageNotifyModel";
import React from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import BaseButton from "components/common/buttons/baseButton/BaseButton";
import FormatData from "../FormatData/FormatData";

class PosLog extends BaseComponent {
  constructor(props) {
    super(props);
    this.isRender = true;
    this.data.counters = {};
    this.data.partners = {};
    this.data.types = {
      0: "EPayload",
      1: "EPayload check transaction",
      2: "Payload voucher scanned",
      3: "Payload voucher locked",
      4: "Payload voucher error",
    };
    this.fieldSelected.type = "0";
    this.fieldSelected.startDate = new Date();
    this.message = "";
    this.result = "No result found";
    this.isAutoload = true;
    this.handleSearch = this.handleSearch.bind(this);
    this.formatedData = [];
    this.formatedDataConst = [];
  }

  handleSearch() {
    if (
      this.fieldSelected.partner &&
      this.fieldSelected.counter &&
      this.fieldSelected.type &&
      this.fieldSelected.startDate
    ) {
      var dateFormat = DateHelper.displayDateFormat(
        this.fieldSelected.startDate,
        "YYYY-MM-DD",
      );
      var messagem =
        "[#feedback:'payloadtracking " +
        this.fieldSelected.partner +
        " " +
        dateFormat +
        " " +
        this.fieldSelected.type +
        "']";

      this.result = "No result found";
      let model = new MessageNotifyModel();
      var inforSaved = {
        message: messagem,
        groupType: "pos",
        parent: 0,
        id: 0,
        receivers: [this.fieldSelected.counter],
      };

      model.pushMessageTask(inforSaved).then((response) => {
        if (response.status) {
          this.showAlert("Message was sent, please wait response!", "success");
        } else {
          this.showAlert(response.message);
        }
      });
    } else {
      this.showAlert("Please select filter");
      return;
    }
  }

  componentDidMount() {
    this.handleLoadNotification();
    this.handleUpdateState();
  }

  handleUpdateState = async () => {
    let commonModel = new CommonModel();
    await commonModel.getData("terminalpartners").then((response) => {
      if (response.status && response.data.terminalpartners) {
        this.data.partners = response.data.terminalpartners;
      }
    });

    let messageModel = new MessageNotifyModel();
    await messageModel.getReceivers("pos").then((response) => {
      if (
        response.status &&
        response.data.receivers &&
        response.data.receivers.length > 0
      ) {
        this.data.counters = response.data.receivers;
      }
    });
    this.refresh();
  };
  formatPosData = (data) => {
    const arr = [];
    for (let item of data) {
      const commasIndex = [];
      for (let charIndex in item) {
        if (item[charIndex] === ",") {
          if (commasIndex.length <= 3) {
            commasIndex.push(charIndex);
          } else {
            break;
          }
        }
      }
      const lastCommaIndex = item.lastIndexOf(",");
      const invoiceID = item.slice(0, +commasIndex[0]);

      const value = item.slice(+commasIndex[0] + 1, +commasIndex[1]);
      const request = item.slice(+commasIndex[1] + 1, +commasIndex[2]);
      const response = item.slice(+commasIndex[2] + 1, +lastCommaIndex);
      const requestDate = item.slice(lastCommaIndex);
      let object = {
        invoiceID,
        value,
        request,
        response,
        requestDate,
        lastCommaIndex,
        item,
        commasIndex,
      };
      arr.push(object);
    }
    this.formatedData = arr.filter((el) => Object.keys(el).length > 0);
    this.formatedDataConst = arr.filter((el) => Object.keys(el).length > 0);
    this.refresh();
  };
  handleLoadNotification() {
    if (process.env.REACT_APP_API_MESSAGE_HUB_URL) {
      this.socket = MessageHubHelper.getInstance().getSocket();
      if (this.socket !== null) {
        var objMe = this;
        this.socket.on("new_feedback_pos", function (response) {
          if (response && response.feedback) {
            objMe.message = response.feedback.comment;
            var messageLine = response.feedback.comment.split("\n");
            objMe.formatPosData(messageLine);
            objMe.refresh();
          }
        });
      }
    }
  }

  handleFindInvoiceDetail() {
    if (this.fieldSelected.invoiceCode == "") {
      this.showAlert("Please enter invoice code");
      return;
    }

    if (this.message == "") {
      this.showAlert("No result found");
      return;
    }
    this.result = "";
    var messageLine = this.message.split("\n");
    for (var line in messageLine) {
      if (
        messageLine[line] != "" &&
        messageLine[line].indexOf(this.fieldSelected.invoiceCode) != -1
      ) {
        this.result += messageLine[line] + "\n\n";
      }
    }

    if (this.result == "") {
      this.result = "No result found";
    }

    this.refresh();
  }
  handleFilter = (value) => {
    const filterd = ArrayHelper.multipleFilter(this.formatedDataConst, {
      invoiceID: value,
    });
    this.formatedData = filterd;
    this.refresh();
  };

  renderComp() {
    let counters = this.data.counters || {};
    let counterKeys = Object.keys(counters);
    let counterOptions = [];
    counterOptions = counterKeys.map((key) => {
      return { value: counters[key].name, label: counters[key].name };
    });

    let types = this.data.types || {};
    let typeKeys = Object.keys(types);
    let typeOptions = [];
    typeOptions = typeKeys.map((key) => {
      return { value: key, label: types[key] };
    });

    let partners = this.data.partners || {};
    let partnerKeys = Object.keys(partners);
    let partnerOptions = [];
    partnerOptions = partnerKeys.map((key) => {
      return { value: partners[key].key, label: partners[key].value };
    });
    return (
      <section className="wrap-section" id={this.idComponent}>
        <div className="section-block mt-15 mb-15">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div className="form-filter">
                <div className="row">
                  <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                      <label className="w100pc">Counter</label>
                      <Select
                        classNamePrefix="select"
                        maxMenuHeight={260}
                        name="counter"
                        value={counterOptions.filter(
                          (option) =>
                            option.value === this.fieldSelected.counter,
                        )}
                        options={counterOptions}
                        onChange={(e) =>
                          this.handleChangeFieldCustom(
                            "counter",
                            e ? e.value : "",
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                      <label className="w100pc">Partner</label>
                      <Select
                        classNamePrefix="select"
                        maxMenuHeight={260}
                        name="partner"
                        value={partnerOptions.filter(
                          (option) =>
                            option.value === this.fieldSelected.partner,
                        )}
                        options={partnerOptions}
                        onChange={(e) =>
                          this.handleChangeFieldCustom(
                            "partner",
                            e ? e.value : "",
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                      <label className="w100pc">Type</label>
                      <Select
                        classNamePrefix="select"
                        maxMenuHeight={260}
                        name="type"
                        value={typeOptions.filter(
                          (option) => option.value === this.fieldSelected.type,
                        )}
                        options={typeOptions}
                        onChange={(e) =>
                          this.handleChangeFieldCustom("type", e ? e.value : "")
                        }
                      />
                    </div>
                  </div>
                  <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                      <label className="w100pc">Date</label>
                      <div className="row date-row-ft">
                        <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                          <DatePicker
                            placeholderText="From"
                            selected={this.fieldSelected.startDate}
                            onChange={(value) =>
                              this.handleChangeFieldCustom("startDate", value)
                            }
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <BaseButton
                      iconName="detail"
                      onClick={() => this.handleSearch(true)}
                    >
                      View
                    </BaseButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="section-block">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="w100pc">Message log</label>
                    <FormatData
                      constData={this.formatedDataConst}
                      data={this.formatedData}
                      onFilter={this.handleFilter}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default PosLog;
