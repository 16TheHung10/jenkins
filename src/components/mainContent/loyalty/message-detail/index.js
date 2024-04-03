import BaseComponent from "components/BaseComponent";
import SelectOption from "external/control/selectOption";
import { DateHelper, MessageHubHelper, StringHelper } from "helpers";
import MessageNotifyModel from "models/MessageNotifyModel";
import React from "react";
import Select from "react-select";

import $ from "jquery";

class MessageDetailNotify extends BaseComponent {
  constructor(props) {
    super(props);
    this.isRender = false;
    this.message = {};
    this.messages = [];
    this.id = 0;
    this.items = [];
    this.activities = {};
    this.comments = {};
    this.feedbacks = {};
    this.pagerOptions = null;
    this.data.statuses = {
      1: "All",
      2: "Done",
      3: "Not yet",
      4: "Error",
    };
    this.idComponent = "messageDetail" + StringHelper.randomKey();
    this.pageSelectRef = React.createRef();

    if (props.groupType == "pos") {
      this.data.cmds = [
        { title: "Clean cache", cmd: "[#possync:'clean']" },
        //{"title" : "Settlement", "cmd": "[#possync:'settlement']"},
        //{"title" : "Alter SQL", "cmd": "[#possync:'altersql']"},
        { title: "Version", cmd: "[#feedback:'version']" },
        { title: "Online", cmd: "[#feedback:'online']" },
        //{"title" : "Disconnect", "cmd": "[#feedback:'disconnect']"}
      ];
    } else {
      this.data.cmds = [];
    }

    this.data.counters = {
      "01": "Counter 1",
      "02": "Counter 2",
      "03": "Counter 3",
      "04": "Counter 4",
    };

    if (props.groupType) {
      this.message.groupType = props.groupType;
    }

    if (props.task) {
      this.message.task = props.task;
    }

    if (props.id) {
      this.id = props.id;
    }

    this.pageSize = StringHelper.escapeNumber(process.env.REACT_APP_PAGE_SIZE);
    this.pageIndex = 0;
    this.pageLastIndex = this.pageIndex + (this.pageSize - 1);
  }

  componentDidMount() {
    this.handleLoadNotification();
    this.handleUpdateState();
  }

  handleLoadNotification() {
    if (process.env.REACT_APP_API_MESSAGE_HUB_URL) {
      this.socket = MessageHubHelper.getInstance().getSocket();
      if (this.socket !== null) {
        var objMe = this;
        this.socket.on("activity_notification_object", function (response) {
          if (
            response &&
            response.activities &&
            response.activities.length > 0
          ) {
            objMe.activities = {};
            for (var i in response.activities) {
              var activity = response.activities[i];
              if (objMe.activities[activity.recipient_id] === undefined) {
                objMe.activities[activity.recipient_id] = [];
              }
              objMe.activities[activity.recipient_id].push(activity);
            }
            objMe.refresh();
          }
        });

        this.socket.on("activity_comment_object", function (response) {
          if (response && response.comments && response.comments.length > 0) {
            objMe.comments = {};
            for (var i in response.comments) {
              var comment = response.comments[i];
              if (objMe.comments[comment.recipient_id] === undefined) {
                objMe.comments[comment.recipient_id] = [];
              }
              objMe.comments[comment.recipient_id].push(comment);
            }
            objMe.refresh();
          }
        });

        this.socket.on("activity_object_read", function (response) {
          if (response && response.activity_read) {
            var activity = response.activity_read;
            if (objMe.activities[activity.recipient_id] === undefined) {
              objMe.activities[activity.recipient_id] = [];
            }
            objMe.activities[activity.recipient_id].push(activity);
            objMe.refresh();
          }
        });

        this.socket.on("new_comment", function (response) {
          if (response && response.comment) {
            var comment = response.comment;
            if (objMe.comments[comment.recipient_id] === undefined) {
              objMe.comments[comment.recipient_id] = [];
            }
            objMe.comments[comment.recipient_id].push(comment);
            objMe.refresh();
          }
        });

        this.socket.on("new_feedback", function (response) {
          if (response && response.feedback) {
            var feedback = response.feedback;
            if (objMe.feedbacks[feedback.recipient_id] === undefined) {
              objMe.feedbacks[feedback.recipient_id] = [];
            }
            objMe.feedbacks[feedback.recipient_id].push(feedback);
            objMe.refresh();
          }
        });

        this.socket.emit("activity_notification_object", {
          objectID: this.id,
          objectType: "task",
        });

        this.socket.emit("activity_comment_object", {
          objectID: this.id,
          objectType: "task",
        });
      }
    }
  }

  handleUpdateState = async (isLoadReceiver = true) => {
    let model = new MessageNotifyModel();
    if (this.id != 0) {
      await model
        .getMessages({
          parent: this.id,
        })
        .then((response) => {
          if (
            response.status &&
            response.data.messages &&
            response.data.messages.length > 0
          ) {
            this.messages = response.data.messages;
          } else {
            this.messages = [];
          }

          if (this.messages.length != 0) {
            this.message.id = this.messages[0].id;
            this.message.message = this.messages[0].message;
            this.message.groupType = this.messages[0].groupType;
            this.message.createdDate = this.messages[0].createdDate;
            this.fieldSelected.message = this.message.message;
          } else {
            super.targetLink(this.getLinkBack());
            this.showAlert("No message existed", "error");
          }
        });
    }

    if (isLoadReceiver && this.message.groupType) {
      await model.getReceivers(this.message.groupType).then((response) => {
        if (
          response.status &&
          response.data.receivers &&
          response.data.receivers.length > 0
        ) {
          this.items = response.data.receivers;
        } else {
          this.items = [];
        }
      });
    }
    this.isUpdateState = true;
    this.refresh();
  };

  handleSend = (code = null, cmd = null) => {
    if (cmd != null) {
      this.fieldSelected.message = cmd;
    }

    if (
      this.fieldSelected.message === undefined ||
      this.fieldSelected.message === ""
    ) {
      this.showAlert("Please enter message");
      return;
    }
    var receivers = [];

    if (code) {
      receivers.push(code);
    } else {
      var itemOptionChecked = $("#" + this.idComponent).find(
        "[name='itemOption']:checked",
      );
      if ($(itemOptionChecked).length > 0) {
        for (var k = 0; k < $(itemOptionChecked).length; k++) {
          receivers.push($(itemOptionChecked[k]).val());
        }
      } else {
        this.showAlert("Please select at least one item");
        return;
      }
    }

    if (window.confirm("Are you sure you want to send?")) {
      let model = new MessageNotifyModel();
      var inforSaved = {
        message: this.fieldSelected.message,
        groupType: this.message.groupType,
        parent: this.id,
        id: this.id,
        receivers: receivers,
      };

      model.pushMessageTask(inforSaved).then((response) => {
        if (response.status) {
          if (this.message.task == "quick" && response.data) {
            this.id = response.data.id;
          } else {
            this.showAlert("Message was sent!", "success");
            this.handleUpdateState(false);
          }
        } else {
          this.showAlert(response.message);
        }
      });
    }
  };

  handleCheckAll = (e) => {
    if (this.items.length === 0) {
      this.showAlert("Item not found");
      $(e.target).prop("checked", false);
      return;
    }

    $("#" + this.idComponent)
      .find("[name='itemOption']:visible")
      .prop("checked", e.target.checked);
  };

  handleChangeMessageStatus(value) {
    this.fieldSelected.status = value;
    this.refreshItemCondition();
  }

  handleChangeCounter = (value) => {
    this.fieldSelected.counter = value;
    this.refreshItemCondition();
  };

  refreshItemsShow() {
    $("#" + this.idComponent)
      .find("[name='itemOption']")
      .prop("checked", false);
    var ele = $("#" + this.idComponent).find("[data-group='receiver']");
    $(ele).removeAttr("data-paging-index");
    var keyword = this.fieldSelected.keyword
      ? this.fieldSelected.keyword.toLocaleLowerCase()
      : "";
    var status = this.fieldSelected.status ? this.fieldSelected.status : 1;
    var counter = this.fieldSelected.counter
      ? this.fieldSelected.counter.toLocaleLowerCase()
      : "";
    var itemIndex = 0;
    $.each(ele, function (key, item) {
      var nameValue = $.trim(
        $(item).find("[data-group='name']").html().toLocaleLowerCase(),
      );
      var codeValue = $.trim(
        $(item).find("[data-group='code']").html().toLocaleLowerCase(),
      );
      var counterValue = nameValue.substring(
        nameValue.length - 2,
        nameValue.length,
      );
      var comment = $.trim($(item).find("[data-group='comment']").html());
      var isError = $(item)
        .find("[data-group='comment']")
        .find("[name='isError']")
        .first()
        .val();
      var isShow =
        (keyword == "" ||
          nameValue.indexOf(keyword) != -1 ||
          codeValue.indexOf(keyword) != -1) &&
        (status == 1 ||
          (comment != "" && status == 2) ||
          (comment != "" && status == 4 && isError == 1) ||
          (comment == "" && status == 3)) &&
        (counter == "" || (nameValue != "" && counterValue == counter));

      if (isShow) {
        $(item).attr("data-paging-group", "itemPagingIndex");
        $(item).attr("data-paging-index", itemIndex);
        $(item).show();
        itemIndex++;
      } else {
        $(item).hide();
      }
    });
  }

  refreshItemPager() {
    var totalRecord = $("#" + this.idComponent).find(
      "[data-group='receiver']:visible",
    ).length;
    this.rebuildPager(totalRecord);
  }

  refreshItemCondition() {
    this.refreshItemsShow();
    this.refreshItemPager();
  }

  refreshItemCombineConditionPager() {
    this.refreshItemsShow();
    this.refreshItemPagination();
  }

  refreshItemPagination() {
    var ele = $("#" + this.idComponent).find(
      "[data-group='receiver'][data-paging-group='itemPagingIndex']:visible",
    );
    var pageIndex = this.pageIndex;
    var pageLastIndex = this.pageLastIndex;
    $.each(ele, function (key, item) {
      var itemIndex = StringHelper.escapeNumber(
        $(item).attr("data-paging-index"),
      );
      var isShow = itemIndex >= pageIndex && itemIndex <= pageLastIndex;
      if (isShow) {
        $(item).show();
      } else {
        $(item).hide();
      }
    });
  }

  getLinkBack() {
    if (this.message.groupType == "pos") {
      return "/pos-notify";
    }
    return "/message-notify";
  }

  backLink() {
    if (this.message.task == "quick") {
      super.targetLink(this.getLinkBack());
    } else {
      super.back(this.getLinkBack());
    }
  }

  handleChangePager = (e) => {
    var page = e ? e.value : null;
    if (page != null) {
      this.pageIndex = this.pageSize * (page - 1);
      this.pageLastIndex = this.pageSize - 1 + this.pageIndex;
      this.refreshItemCombineConditionPager();
    } else {
      this.refreshItemsShow();
    }
  };

  rebuildPager(totalRecord) {
    let totalPage = StringHelper.calPageCount(totalRecord, this.pageSize);
    var pagerOptions = [];
    for (var i = 1; i <= totalPage; i++) {
      pagerOptions.push({ value: i, label: i });
    }
    this.pageSelectRef.current.addOptions(pagerOptions, 0);
    this.pagerOptions = pagerOptions;
  }

  renderComp() {
    let statuses = this.data.statuses || {};
    let statusKeys = Object.keys(statuses);
    let statusOptions = [];
    statusOptions = statusKeys.map((key) => {
      return { value: key, label: statuses[key] };
    });

    let counters = this.data.counters || {};
    let counterKeys = Object.keys(counters);
    let counterOptions = [];
    counterOptions = counterKeys.map((key) => {
      return { value: key, label: counters[key] };
    });

    if (this.pagerOptions == null) {
      let totalPage = StringHelper.calPageCount(
        this.items ? this.items.length : 0,
        this.pageSize,
      );
      let pagerOptions = [];
      for (var i = 1; i <= totalPage; i++) {
        pagerOptions.push({ value: i, label: i });
      }
      this.pagerOptions = pagerOptions;
    }

    return (
      <section className="wrap-section" id={this.idComponent}>
        <div className="row header-detail">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <button
              onClick={() => this.backLink()}
              type="button"
              className="btn btn-back"
            >
              Back
            </button>
            <h2
              style={{
                margin: 10,
                display: "inline-block",
                verticalAlign: "middle",
              }}
            >
              Notify detail
            </h2>
            {this.message.createdDate ? (
              <h6>
                Last edited:{" "}
                {DateHelper.displayDateTime(this.message.createdDate)}
              </h6>
            ) : null}
          </div>
        </div>
        <div className="row">
          <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label className="w100pc">New message:</label>
                  <textarea
                    type="text"
                    autoComplete="off"
                    name="message"
                    style={{ minHeight: "200px" }}
                    onChange={this.handleChangeField}
                    className="form-control"
                    value={this.fieldSelected.message}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => this.handleSend(null)}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                {this.data.cmds.map((item, i) => (
                  <div key={i} className="cmd-block">
                    <div className="form-group">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => this.handleSend(null, item.cmd)}
                      >
                        {item.title}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {this.message.task != "quick" ? (
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group message-notify-detail-last-message">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Last message</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.messages.map((item, i) => (
                          <tr key={i}>
                            <td>{item.message}</td>
                            <td>
                              {DateHelper.displayDateTime(item.createdDate)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {this.messages.length == 0 ? (
                      <div className="table-message">Message not found</div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8">
            <div className="form-filter">
              <div className="row">
                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                  <div className="form-group">
                    <label className="w100pc">Counter</label>
                    <Select
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      options={counterOptions}
                      isClearable={true}
                      onChange={(e) =>
                        this.handleChangeCounter(e ? e.value : "")
                      }
                    />
                  </div>
                </div>
                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                  <div className="form-group">
                    <label className="w100pc">Status</label>
                    <Select
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      options={statusOptions}
                      isClearable={true}
                      onChange={(e) =>
                        this.handleChangeMessageStatus(e ? e.value : "")
                      }
                    />
                  </div>
                </div>
                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                  <div className="form-group">
                    <label className="w100pc">Page</label>
                    <SelectOption
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      isClearable={true}
                      options={this.pagerOptions}
                      ref={this.pageSelectRef}
                      onChange={this.handleChangePager}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                  <div className="form-group">
                    <label>
                      <span>
                        {this.items
                          ? StringHelper.escapeQty(this.items.length)
                          : 0}
                      </span>{" "}
                      total
                    </label>
                  </div>
                </div>
                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                  <div className="form-group">
                    <label>
                      <span data-group="totalReceived">
                        {this.activities
                          ? StringHelper.escapeQty(
                              Object.keys(this.activities).length,
                            )
                          : 0}
                      </span>{" "}
                      received
                    </label>
                  </div>
                </div>
                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                  <div className="form-group">
                    <label>
                      <span data-group="totalFinished">
                        {this.comments
                          ? StringHelper.escapeQty(
                              Object.keys(this.comments).length,
                            )
                          : 0}
                      </span>{" "}
                      finished
                    </label>
                  </div>
                </div>
                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                  <div className="form-group">
                    <label>
                      <span data-group="totalFinished">
                        {this.items && this.comments
                          ? StringHelper.escapeQty(
                              this.items.length -
                                Object.keys(this.comments).length,
                            )
                          : 0}
                      </span>{" "}
                      not yet
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="wrap-table htable">
              <table className="table table-hover detail-search-rcv">
                <thead>
                  <tr>
                    <th className="w10">
                      <input
                        type="checkbox"
                        name="itemsOption"
                        onChange={this.handleCheckAll}
                      />
                    </th>
                    <th>Receiver</th>
                    <th>Code</th>
                    <th>Received date</th>
                    <th>Task finish date</th>
                    <th>Task feedback</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.items.map((item, i) => (
                    <tr key={i} data-group="receiver">
                      <td className="w10">
                        <input
                          type="checkbox"
                          name="itemOption"
                          value={item.name}
                        />
                      </td>
                      <td data-group="name">{item.name}</td>
                      <td data-group="code">{item.code}</td>
                      <td>
                        {this.activities[item.name] ? (
                          <div>
                            {this.activities[item.name].map((activity, j) => (
                              <div key={j}>
                                {DateHelper.displayDateTime(activity.read_date)}
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </td>
                      <td data-group="comment">
                        {this.comments[item.name] ? (
                          <div>
                            {this.comments[item.name].map((comment, j) => (
                              <div
                                className={
                                  comment.comment == "FAILED"
                                    ? "notify-error-text"
                                    : ""
                                }
                                key={j}
                              >
                                {DateHelper.displayDateTime(
                                  comment.comment_date,
                                )}
                                {comment.comment == "FAILED" ? (
                                  <input
                                    type="hidden"
                                    name="isError"
                                    value="1"
                                  />
                                ) : null}
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </td>
                      <td data-group="feedback">
                        {this.feedbacks[item.name] ? (
                          <div>
                            {this.feedbacks[item.name].map((feedback, j) => (
                              <div key={j}>{feedback.comment}</div>
                            ))}
                          </div>
                        ) : null}
                      </td>
                      <td>
                        <button
                          className="btn"
                          onClick={() => this.handleSend(item.name)}
                        >
                          Resend
                        </button>
                      </td>
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
          </div>
        </div>
      </section>
    );
  }
}

export default MessageDetailNotify;
