import BaseComponent from "components/BaseComponent";
import Paging from "external/control/pagination";
import { DateHelper, PageHelper } from "helpers";
import CommonModel from "models/CommonModel";
import MessageNotifyModel from "models/MessageNotifyModel";
import React from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import BaseButton from "components/common/buttons/baseButton/BaseButton";

class MessageNotify extends BaseComponent {
  constructor(props) {
    super(props);

    this.isRender = true;
    this.items = [];
    this.page = 1;

    this.handleLoadFieldSelected(props);
    this.data.groupTypes = {};
    this.isAutoload = true;
    this.handleSend = this.handleSend.bind(this);
    this.handleClickPaging = this.handleClickPaging.bind(this);
    this.handleLoadMessageResult = this.handleLoadMessageResult.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.data.groupType != nextProps.groupType ||
      this.data.task != nextProps.task
    ) {
      this.handleLoadFieldSelected(nextProps);
      this.handleLoadMessageResult();
    }
  }

  handleLoadFieldSelected(props) {
    this.data.groupType = props.groupType;
    this.data.task = props.task;
    let dateDefault = new Date();
    this.fieldSelected = this.assignFieldSelected({
      startDate: dateDefault,
      endDate: dateDefault,
      keyword: "",
      page: 1,
    });
    PageHelper.updateFilters(this.fieldSelected, function (filters) {
      if (filters["startDate"]) {
        filters["startDate"] = new Date(filters["startDate"]);
      }
      if (filters["endDate"]) {
        filters["endDate"] = new Date(filters["endDate"]);
      }
      return true;
    });

    if (this.data.groupType) {
      this.fieldSelected.groupType = this.data.groupType;
    }
  }

  handleSearch() {
    if (this.fieldSelected.keyword && this.fieldSelected.keyword.length < 2) {
      this.showAlert("Please enter keyword less equal to 2 characters");
      return;
    }

    this.page = 1;
    this.handleLoadMessageResult();
    PageHelper.pushHistoryState(this.fieldSelected);
  }

  componentDidMount() {
    this.handleUpdateState();
    this.handleLoadMessageResult();
  }

  handleUpdateState = async () => {
    let commonModel = new CommonModel();
    await commonModel.getData("messagegrouptype").then((response) => {
      if (response.status && response.data.groupTypes) {
        this.data.groupTypes = response.data.groupTypes;
        this.refresh();
      }
    });
  };

  handleSend() {
    if (
      this.fieldSelected.message === undefined ||
      this.fieldSelected.message === ""
    ) {
      this.showAlert("Please enter message");
      return;
    }

    if (
      this.fieldSelected.groupType === undefined ||
      this.fieldSelected.groupType === ""
    ) {
      this.showAlert("Please enter group type");
      return;
    }

    if (window.confirm("Are you sure you want to send?")) {
      let model = new MessageNotifyModel();
      var inforSaved = {
        message: this.fieldSelected.message,
        groupType: this.fieldSelected.groupType,
      };

      if (this.isTaskSync()) {
        model.pushMessageSyncTask(inforSaved).then((response) => {
          if (response.status) {
            this.showAlert("Message was sent!", "success");
            this.handleSearch();
          } else {
            this.showAlert(response.message);
          }
        });
      } else {
        model.pushMessage(inforSaved).then((response) => {
          if (response.status) {
            this.showAlert("Message was sent!", "success");
            this.handleSearch();
          } else {
            this.showAlert(response.message);
          }
        });
      }
    }
  }

  handleShowMessageDetail(id) {
    if (this.isGroupPos()) {
      super.targetLink("/pos-notify/" + id);
    } else {
      super.targetLink("/message-notify/" + id);
    }
  }

  handleLoadMessageResult = async () => {
    let model = new MessageNotifyModel();
    model
      .getMessages({
        keyword: this.fieldSelected.keyword,
        startDate: this.fieldSelected.startDate,
        endDate: this.fieldSelected.endDate,
        groupType: this.fieldSelected.groupType,
        page: this.page,
      })
      .then((response) => {
        if (
          response.status &&
          response.data.messages &&
          response.data.messages.length > 0
        ) {
          this.items = response.data.messages;
          this.itemCount = response.data.total;
        } else {
          this.items = [];
        }
        this.refresh();
      });
  };

  handleClickPaging(page) {
    this.page = page;
    PageHelper.pushHistoryState("page", page);
  }

  handleUpdateState() {
    this.handleLoadOrderResult();
  }

  isTaskSync() {
    return this.data.task && this.data.task == "sync";
  }

  isGroupPos() {
    return this.fieldSelected.groupType == "pos";
  }

  renderComp() {
    let types = this.data.groupTypes || {};
    let typeKeys = Object.keys(types);
    let typeOptions = [];
    typeOptions = typeKeys.map((key) => {
      return { value: key, label: types[key] };
    });

    return (
      <section
        className="app_container wrap-section  mt-15"
        id={this.idComponent}
      >
        <div className="row ml-0">
          <div
            className="col-xs-8 col-sm-8 col-md-8 col-lg-8 "
            style={{ paddingLeft: 0 }}
          >
            <div className="section-block mb-15">
              <div className="row header-detail">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <h3
                    style={{ display: "inline-block", verticalAlign: "middle" }}
                  >
                    Notify
                  </h3>
                </div>
              </div>
              <div className="form-filter">
                <div className="row">
                  <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label className="w100pc">Group type</label>
                      <Select
                        classNamePrefix="select"
                        maxMenuHeight={260}
                        name="groupType"
                        isDisabled={this.data.groupType ? true : false}
                        value={typeOptions.filter(
                          (option) =>
                            option.value === this.fieldSelected.groupType,
                        )}
                        options={typeOptions}
                        isClearable={true}
                        onChange={(e) =>
                          this.handleChangeFieldCustom(
                            "groupType",
                            e ? e.value : "",
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
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
                            isClearable={true}
                            autoComplete="off"
                          />
                        </div>
                        <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                          <DatePicker
                            placeholderText="to"
                            selected={this.fieldSelected.endDate}
                            onChange={(value) =>
                              this.handleChangeFieldCustom("endDate", value)
                            }
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            isClearable={true}
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <div className="form-group">
                      <label className="w100pc">Keyword</label>
                      <input
                        type="text"
                        autoComplete="off"
                        name="keyword"
                        value={this.fieldSelected.keyword || ""}
                        onChange={this.handleChangeField}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <BaseButton
                      iconName={"search"}
                      onClick={() => this.handleSearch(true)}
                    >
                      Search
                    </BaseButton>
                  </div>
                </div>
              </div>
              <div
                className="wrap-table htable w-full"
                style={{
                  position: "relative",
                  zIndex: 1,
                  maxHeight: "calc(100vh - 354px)",
                }}
              >
                <table className="table table-hover detail-search-rcv">
                  <thead>
                    <tr>
                      <th>Message</th>
                      <th>Created date</th>
                      <th>Receiver ID</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.items.map((item, i) => (
                      // <tr key={i} onDoubleClick={() => this.handleShowMessageDetail(item.id)}>
                      <tr key={i}>
                        <td>{item.message}</td>
                        <td>{DateHelper.displayDateTime(item.createdDate)}</td>
                        <td>{item.receiverID}</td>
                        <td>{item.groupType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {this.items.length == 0 ? (
                  <div className="table-message">Item not found</div>
                ) : (
                  ""
                )}
              </div>

              {this.items?.length !== 0 ? (
                <div className="w-full text-center">
                  <Paging
                    page={this.page}
                    onClickPaging={this.handleClickPaging}
                    onClickSearch={this.handleLoadMessageResult}
                    itemCount={this.itemCount}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default MessageNotify;
