import BaseComponent from 'components/BaseComponent';
import { DateHelper, MessageHubHelper, StringHelper, ArrayHelper } from 'helpers';
import { cloneDeep, createDataTable, createListOption, decreaseDate, increaseDate } from 'helpers/FuncHelper';
import MessageNotifyModel from 'models/MessageNotifyModel';
import React from 'react';

import { CheckSquareOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Row, message } from 'antd';
import StoreApi from 'api/StoreApi';
import CONSTANT from 'constant';
import $ from 'jquery';
import CommonModel from 'models/CommonModel';
import ReportingModel from 'models/ReportingModel';
import moment from 'moment';
import DatePickerComp from 'utils/datePicker';
import SelectBox from 'utils/selectBox';
import TableCustom from 'utils/tableCustom';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';

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
    this.selectedDate = null;
    this.data.statuses = {
      1: 'All',
      2: 'Done',
      3: 'Not yet',
      4: 'Error',
    };
    this.idComponent = 'messageDetail' + StringHelper.randomKey();
    this.pageSelectRef = React.createRef();
    this.countersOnline = [];
    this.data.counters = {
      '01': 'Counter 1',
      '02': 'Counter 2',
      '03': 'Counter 3',
      '04': 'Counter 4',
    };
    this.oldMessage = '';
    if (props.groupType) {
      this.message.groupType = props.groupType;
    }

    if (props.task) {
      this.message.task = props.task;
    }

    if (props.id) {
      this.id = props.id;
    }
    if (this.props.groupType == 'pos') {
      this.data.cmds = [
        { title: 'Clean cache', cmd: "[#possync:'clean']" },
        //{"title" : "Settlement", "cmd": "[#possync:'settlement']"},
        //{"title" : "Alter SQL", "cmd": "[#possync:'altersql']"},
        { title: 'Version', cmd: "[#feedback:'version']" },
        { title: 'Online', cmd: "[#feedback:'online']" },
        {
          title: 'Settle',
          cmd: "[#possync:'posdailylog']",
        },
        {
          title: 'Sync sales waiting',
          cmd: "[#possync:'invoicelog']",
        },
        //{"title" : "Disconnect", "cmd": "[#feedback:'disconnect']"}
      ];
    } else {
      this.data.cmds = [];
    }

    this.fieldSelected = this.assignFieldSelected(
      {
        counter: '',
        code: [],
        status: '1',
        page: '',
        receiver: '',
        statusSync: '',
        date: increaseDate(0),
        name: [],
        storeWaiting: [],
      },
      ['storeCode']
    );

    this.pageSize = StringHelper.escapeNumber(process.env.REACT_APP_PAGE_SIZE);
    this.pageIndex = 0;
    this.pageLastIndex = this.pageIndex + (this.pageSize - 1);
    this.storeWaiting = false;
    this.data.stores = {};
    this.checkboxlist = [];
    this.waitingStore = [];
  }

  componentDidMount() {
    this.handleGetCommon();
    this.handleLoadNotification();
    this.handleUpdateState();
    this.handleGetCounterOnline();
  }

  handleGetCommon = async () => {
    let commonModel = new CommonModel();
    await commonModel.getData('store').then((response) => {
      if (response.status) {
        this.data.stores = response.data.stores;
      }
    });

    this.refresh();
  };

  handleLoadNotification() {
    if (process.env.REACT_APP_API_MESSAGE_HUB_URL) {
      this.socket = MessageHubHelper.getInstance().getSocket();
      if (this.socket !== null) {
        var objMe = this;
        this.socket.on('activity_notification_pos', function (response) {
          if (response && response.activities && response.activities.length > 0) {
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

        this.socket.on('activity_comment_pos', function (response) {
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

        this.socket.on('activity_pos_read', function (response) {
          if (response && response.activity_read) {
            var activity = response.activity_read;
            if (objMe.activities[activity.recipient_id] === undefined) {
              objMe.activities[activity.recipient_id] = [];
            }
            objMe.activities[activity.recipient_id].push(activity);
            objMe.refresh();
          }
        });

        this.socket.on('new_comment_pos', function (response) {
          if (response && response.comment) {
            var comment = response.comment;
            if (objMe.comments[comment.recipient_id] === undefined) {
              objMe.comments[comment.recipient_id] = [];
            }
            objMe.comments[comment.recipient_id].push(comment);
            objMe.refresh();
          }
        });

        this.socket.on('new_feedback_pos', function (response) {
          if (response && response.feedback) {
            var feedback = response.feedback;
            if (objMe.feedbacks[feedback.recipient_id] === undefined) {
              objMe.feedbacks[feedback.recipient_id] = [];
            }
            objMe.feedbacks[feedback.recipient_id].push(feedback);
            objMe.refresh();
          }
        });

        // this.socket.emit('activity_notification_pos', {
        //   objectID: this.id,
        //   objectType: 'task',
        // });

        // this.socket.emit('activity_comment_pos', {
        //   objectID: this.id,
        //   objectType: 'task',
        // });
      }
    }
  }
  handleGetCounterOnline = async () => {
    // const res = await StoreApi.getCountersOnline();
    // if (res.status) {
    //   const object = ArrayHelper.convertArrayToObject(res.data.online_usrs, 'userId');
    //   this.countersOnline = object;
    //   this.refresh();
    // } else {
    //   message.error(res.message);
    // }
    // return res;
  };
  handleUpdateState = async (isLoadReceiver = true) => {
    let model = new MessageNotifyModel();
    if (this.id != 0) {
      await model
        .getMessages({
          parent: this.id,
        })
        .then((response) => {
          if (response.status && response.data.messages && response.data.messages.length > 0) {
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
            this.showAlert('No message existed', 'error');
          }
        });
    }

    if (isLoadReceiver && this.message.groupType) {
      await model.getReceivers(this.message.groupType).then((response) => {
        if (response.status && response.data.receivers && response.data.receivers.length > 0) {
          this.items = response.data.receivers;

          this.codeOpt = createListOption(this.items, 'code');
          this.receiverOpt = createListOption(this.items, 'name');
        } else {
          this.items = [];
        }
      });
    }
    this.isUpdateState = true;
    this.refresh();
  };

  handleSend = (code = null, cmd = null, type = null, ignoreValidateDate = false) => {
    if (cmd != null) {
      this.fieldSelected.message = cmd;
    }

    if (type !== 'resend' && (this.fieldSelected.message === undefined || this.fieldSelected.message === '')) {
      this.showAlert('Please enter message');
      return;
    }
    if (type === 'resend' && (this.oldMessage === undefined || this.oldMessage === '')) {
      this.showAlert('Nothing to resend');
      return;
    }

    if (type !== 'resend' && !this.selectedDate && !ignoreValidateDate) {
      this.showAlert('Please select date');
      return;
    }
    var receivers = [];

    if (code) {
      receivers.push(code);
    } else {
      // var itemOptionChecked = $('#' + this.idComponent).find("[name='itemOption']:checked");
      // if ($(itemOptionChecked).length > 0) {
      //   for (var k = 0; k < $(itemOptionChecked).length; k++) {
      //     receivers.push($(itemOptionChecked[k]).val());
      //   }
      // } else {
      //   this.showAlert('Please select at least one item');
      //   return;
      // }
      if (this.checkboxlist?.length > 0) {
        receivers = this.checkboxlist;
      } else {
        message.error('Please select at least one item');
        return;
      }
    }

    if (window.confirm('Are you sure you want to send?')) {
      let model = new MessageNotifyModel();
      var inforSaved = {
        message: type === 'resend' ? this.oldMessage : this.fieldSelected.message,
        groupType: this.message.groupType,
        parent: this.id,
        id: this.id,
        receivers: receivers,
      };

      model.pushMessageTask(inforSaved).then((response) => {
        if (response.status) {
          if (this.message.task == 'quick' && response.data) {
            this.id = response.data.id;
          } else {
            this.showAlert('Message was sent!', 'success');
            this.handleUpdateState(false);
          }
          this.oldMessage = this.fieldSelected.message;
          this.fieldSelected.message = '';
          this.selectedDate = null;
          this.refresh();
        } else {
          this.showAlert(response.message);
        }
      });
    }
  };

  // handleCheckAll = (e) => {
  //   if (this.items.length === 0) {
  //     this.showAlert('Item not found');
  //     $(e.target).prop('checked', false);
  //     return;
  //   }

  //   $('#' + this.idComponent)
  //     .find("[name='itemOption']:visible")
  //     .prop('checked', e.target.checked);

  //   this.handleOnChangeCheckbox();
  // };

  handleChangeMessageStatus(value) {
    this.fieldSelected.status = value;
    this.refreshItemCondition();
  }

  handleChangeCounter = (value) => {
    this.fieldSelected.counter = value;
    this.refreshItemCondition();
  };

  refreshItemsShow() {
    const fields = this.fieldSelected;

    $('#' + this.idComponent)
      .find("[name='itemOption']")
      .prop('checked', false);
    var ele = $('#' + this.idComponent).find("[data-group='receiver']");
    $(ele).removeAttr('data-paging-index');
    var keyword = fields.keyword ? fields.keyword.toLocaleLowerCase() : '';
    var status = fields.status !== '' ? fields.status : 1;

    var receiver = fields.receiver.toString() !== '' ? fields.receiver.toLocaleLowerCase() : '';
    // var counter = fields.counter.toString() !== "" ? fields.counter.toLocaleLowerCase() : "";
    var code = fields.code.toString() !== '' ? fields.code.toLocaleLowerCase() : '';
    var itemIndex = 0;
    $.each(ele, function (key, item) {
      var nameValue = $.trim($(item).find("[data-group='name']").html().toLocaleLowerCase());
      var codeValue = $.trim($(item).find("[data-group='code']").html().toLocaleLowerCase());

      var counterValue = nameValue.substring(nameValue.length - 2, nameValue.length);
      var comment = $.trim($(item).find("[data-group='comment']").html());
      var isError = $(item).find("[data-group='comment']").find("[name='isError']").first().val();
      var isShow =
        (keyword == '' || nameValue.indexOf(keyword) != -1 || codeValue.indexOf(keyword) != -1) &&
        (status == 1 ||
          (comment != '' && status == 2) ||
          (comment != '' && status == 4 && isError == 1) ||
          (comment == '' && status == 3)) &&
        // && (counter == ''
        // 	|| (nameValue != "" && counterValue == counter)
        (receiver == '' || (nameValue != '' && nameValue == receiver)) &&
        (code == '' || (codeValue != '' && codeValue == code));
      if (isShow) {
        $(item).attr('data-paging-group', 'itemPagingIndex');
        $(item).attr('data-paging-index', itemIndex);
        $(item).show();
        itemIndex++;
      } else {
        $(item).hide();
      }
    });
  }

  refreshItemPager() {
    var totalRecord = $('#' + this.idComponent).find("[data-group='receiver']:visible").length;
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
    var ele = $('#' + this.idComponent).find("[data-group='receiver'][data-paging-group='itemPagingIndex']:visible");
    var pageIndex = this.pageIndex;
    var pageLastIndex = this.pageLastIndex;
    $.each(ele, function (key, item) {
      var itemIndex = StringHelper.escapeNumber($(item).attr('data-paging-index'));
      var isShow = itemIndex >= pageIndex && itemIndex <= pageLastIndex;
      if (isShow) {
        $(item).show();
      } else {
        $(item).hide();
      }
    });
  }

  getLinkBack() {
    if (this.message.groupType == 'pos') {
      return '/pos-notify';
    }
    return '/message-notify';
  }

  backLink() {
    if (this.message.task == 'quick') {
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
    // this.pageSelectRef.current.addOptions(pagerOptions, 0);
    this.pagerOptions = pagerOptions;
  }

  handleOnChangeCheckbox = () => {
    var target = $('#' + this.idComponent).find("[name='itemOption']:checked");

    $('.countCheck').text(StringHelper.escapeQty(target.length));
  };

  updateFilter = (val, key) => {
    this.fieldSelected[key] = val;
    this.waitingStore = [];

    this.refresh();
    // if (key) {
    //   this.fieldSelected[key] = val;

    //   if (key === 'counter' || key === 'code' || key === 'status') {
    //     this.refreshItemCondition();
    //   } else {
    //     this.refreshItemCombineConditionPager();
    //   }

    //   this.refresh();
    // }
  };

  updateListCheckbox = (lst) => {
    this.checkboxlist = lst;
    this.waitingStore = lst;
    this.refresh();
  };

  handleViewStoreWaiting = () => {
    this.storeWaiting = !this.storeWaiting;
    this.refresh();
  };
  handleCheckStoreWaiting = () => {
    const fields = this.fieldSelected;
    if (fields.statusSync === '') {
      message.error('Please choose status sync');
      return false;
    }
    this.checkStore();
  };

  handleClearStoreWaiting = () => {
    const fields = this.fieldSelected;
    this.storeWaiting = [];
    fields.statusSync = '';
    this.refresh();
  };

  handleListStore = () => {
    let arr = [];
    for (let key in this.data.stores) {
      let item = this.data.stores[key];

      if (item.storeCode.substring(0, 2).toLowerCase() === 'vn') {
        let obj = {
          statusStore: item.status,
          storeCode: key,
        };
        arr.push(obj);
      }
    }

    return arr;
  };
  checkStore = async () => {
    let model = new ReportingModel();
    let params = {
      date: DateHelper.displayDateFormatMinus(this.fieldSelected.date),
    };

    let items = [];
    let allStoreItems = this.handleListStore();
    this.waitingStore = [];
    this.storeWaiting = [];

    let page = '/storestatus/comparesale';
    await model.getAllSummary(page, params).then((response) => {
      if (response.status && response.data && response.data.compareSale) {
        items = response.data.compareSale;

        let storeWait = items?.filter((el) => el.status == 0);
        this.fieldSelected.storeWaiting = storeWait;
        items.sort((a, b) => (a['storeCode'] <= b['storeCode'] ? -1 : 1));

        const list = cloneDeep(this.items);
        const arr = list?.map((item2) => {
          const matchedItem1 = storeWait.find((item1) => item2.name.includes(item1.storeCode));
          if (matchedItem1) {
            return {
              ...item2,
              status: matchedItem1.status,
            };
          } else {
            return {
              ...item2,
              status: 1,
            };
          }
          // return item2;
        });
        // let newList = mapData(allStoreItems, items, "storeCode", ['status', 'dateKey', 'updatedDate', 'note'])?.filter(el => el.status == 0);
        this.items = arr;
        if (arr?.length > 0) {
          items = arr?.filter((el) => el.status === 0);

          let listCheckbox = items?.map((b) => b.name);

          this.waitingStore = listCheckbox;
          this.storeWaiting = listCheckbox;
        } else {
          message.error('No store waiting');
        }
      } else {
        this.showAlert(response.message, 'error', false);
      }
      this.refresh();
    });
  };

  renderReceivedDate = (val, key, item) => {
    return (
      <>
        {this.activities[item.name] ? (
          <div>
            {this.activities[item.name].map((activity, j) => (
              <div key={j}>{DateHelper.displayDateTime(activity.read_date)}</div>
            ))}
          </div>
        ) : null}
      </>
    );
  };

  renderTaskFinishDate = (val, key, item) => {
    return (
      <>
        {this.comments[item.name] ? (
          <div>
            {this.comments[item.name].map((comment, j) => (
              <div className={comment.comment == 'FAILED' ? 'notify-error-text' : ''} key={j}>
                {DateHelper.displayDateTime(comment.comment_date)}
                {comment.comment == 'FAILED' ? <input type="hidden" name="isError" value="1" /> : null}
              </div>
            ))}
          </div>
        ) : null}
      </>
    );
  };

  renderTaskFeedback = (val, key, item) => {
    return (
      <>
        {this.feedbacks[item.name] ? (
          <div>
            {this.feedbacks[item.name].map((feedback, j) => (
              <div key={j}>{feedback.comment}</div>
            ))}
          </div>
        ) : null}
      </>
    );
  };

  renderBtnAction = (val, key, item) => {
    return (
      <Button className="btn btn-danger h-30" onClick={() => this.handleSend(item.name)}>
        Resend
      </Button>
    );
  };

  handleFilter = (arr) => {
    const fields = this.fieldSelected;
    let newList = [];
    let oldList = cloneDeep(arr);

    newList = fields.name
      ? oldList.filter((el) => el.name?.includes(fields.name) || fields.name?.includes(el.name))
      : oldList;

    newList = fields.code
      ? newList.filter((el) => el.code?.includes(fields.code) || fields.code?.includes(el.code))
      : newList;

    if (fields.status === '') {
      newList = newList;
    } else {
      if (fields.status == '1') {
        newList = newList;
      } else if (fields.status == '2') {
        newList = newList.filter((el) => this.comments[el.name] == true);
      } else if (fields.status == '3') {
        newList = newList.filter((el) => this.comments[el.name] == false);
      } else {
        newList = newList.filter(
          (el) => this.comments[el.name] == true && this.comments[el.name]?.some((a) => a.comment == 'FAILED')
        );
      }
    }
    newList = fields.statusSync == '0' ? newList.filter((el) => el.status === 0) : newList;
    return newList;
  };

  removeAccents = (input) => {
    return input
      .normalize('NFD') // Chuyển đổi thành dạng decomposed form
      .replace(/[\u0300-\u036f]/g, ''); // Loại bỏ các dấu
  };

  renderComp() {
    const fields = this.fieldSelected;

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

    let codeOpt = this.codeOpt?.sort((a, b) => (a.code >= b.code ? -1 : 1)) || [];
    let receiverOpt = this.receiverOpt?.sort((a, b) => (a.name >= b.name ? -1 : 1)) || [];

    if (this.pagerOptions == null) {
      let totalPage = StringHelper.calPageCount(this.items ? this.items.length : 0, this.pageSize);
      let pagerOptions = [];
      for (var i = 1; i <= totalPage; i++) {
        pagerOptions.push({ value: i, label: i });
      }
      this.pagerOptions = pagerOptions;
    }
    const statusAsyncOptions = [
      {
        label: 'Waiting',
        value: '0',
      },
    ];

    let items = this.handleFilter(this.items);
    const columns = [
      {
        field: 'privateKey',
        label: '',
        classHead: 'fs-10',
        styleHead: {},
        classBody: 'fs-10',
        styleBody: {},
        mainKey: 'name',
        typeComp: 'checkbox',
      },
      {
        field: 'name',
        label: 'Receiver',
        classHead: 'fs-10',
        styleHead: {},
        classBody: 'fs-10',
        styleBody: {},
      },
      {
        field: 'code',
        label: 'Code',
        classHead: 'fs-10',
        styleHead: {},
        classBody: 'fs-10',
        styleBody: {},
      },
      {
        field: 'read_date',
        label: 'Received date',
        classHead: 'fs-10',
        styleHead: {},
        classBody: 'fs-10',
        styleBody: {},
        formatBody: this.renderReceivedDate,
      },
      {
        field: 'comment_date',
        label: 'Task finish date',
        classHead: 'fs-10',
        styleHead: {},
        classBody: 'fs-10',
        styleBody: {},
        formatBody: this.renderTaskFinishDate,
      },
      {
        field: 'comment',
        label: 'Task feedback',
        classHead: 'fs-10',
        styleHead: {},
        classBody: 'fs-10',
        styleBody: {},
        formatBody: this.renderTaskFeedback,
      },
      {
        field: 'actionBtn',
        label: 'Action',
        classHead: 'fs-10',
        styleHead: {},
        classBody: 'fs-10',
        styleBody: {},
        formatBody: this.renderBtnAction,
      },
      {
        field: 'status',
        label: '',
        colSpanHead: 0,
        colSpanBody: 0,
        notShow: true,
      },
    ];
    const data = createDataTable(items, columns)?.sort((a, b) => (a.name >= b.name ? 1 : -1));
    // const dataCheck = fields.statusSync == '0' ? data.filter(el => el.status === 0)?.map(b => b.name) : data;
    const dataCheck = data;
    return (
      <section className="wrap-section" id={this.idComponent}>
        <div className="row header-detail">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <button onClick={() => this.backLink()} type="button" className="btn btn-back">
              Back
            </button>
            <h2
              className="name-target"
              // style={{ margin: 10, display: 'inline-block', verticalAlign: 'middle' }}
            >
              Notify detail
            </h2>
            {this.message.createdDate ? (
              <h6>Last edited: {DateHelper.displayDateTime(this.message.createdDate)}</h6>
            ) : null}
          </div>
        </div>
        <div className="row">
          <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
            <div className="section-block mb-15">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="w100pc">New message: (*Phiên bản không hỗ trợ Unicode)</label>
                    <textarea
                      type="text"
                      autoComplete="off"
                      name="message"
                      style={{ minHeight: '200px' }}
                      maxLength={500}
                      placeholder="Input message ( max 500 characters )"
                      onChange={(e) => {
                        const normalize = this.removeAccents(e.target.value);
                        e.target.value = normalize;
                        this.handleChangeField(e);
                      }}
                      pattern="[a-zA-Z0-9 ]*"
                      className="form-control"
                      value={this.fieldSelected.message}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <BaseButton iconName="send" color="green" onClick={() => this.handleSend(null, null, null, true)}>
                      Software update notification
                    </BaseButton>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-block">
              <div className="row">
                <h5 className="col-md-12">Check POS Info</h5>
                <div className="col-md-12 flex items-center gap-10">
                  {this.data.cmds?.slice(0, 3).map((item, i) => (
                    <div key={i} className="cmd-block">
                      <div className="form-group ">
                        <BaseButton onClick={() => this.handleSend(null, item.cmd, null, true)}>
                          {item.title}
                        </BaseButton>
                      </div>
                    </div>
                  ))}
                </div>

                <h5 className="col-md-12">Process sales</h5>
                <div className="col-md-12 flex  gap-10 flex-col">
                  <DatePicker
                    value={this.selectedDate}
                    onChange={(e) => {
                      this.selectedDate = e;
                      if (this.props.groupType == 'pos') {
                        this.data.cmds = [
                          { title: 'Clean cache', cmd: "[#possync:'clean']" },
                          //{"title" : "Settlement", "cmd": "[#possync:'settlement']"},
                          //{"title" : "Alter SQL", "cmd": "[#possync:'altersql']"},
                          { title: 'Version', cmd: "[#feedback:'version']" },
                          { title: 'Online', cmd: "[#feedback:'online']" },
                          {
                            title: 'Settle',
                            cmd: `${
                              this.selectedDate
                                ? `[#possync:'posdailylog manual ${moment(e).format(CONSTANT.FORMAT_DATE_PAYLOAD)}']`
                                : "[#possync:'posdailylog']"
                            }`,
                          },
                          {
                            title: 'Sync invoice',
                            cmd: `${
                              this.selectedDate
                                ? `[#possync:'invoicelog manual ${moment(e).format(CONSTANT.FORMAT_DATE_PAYLOAD)}']`
                                : "[#possync:'invoicelog']"
                            }`,
                          },
                          //{"title" : "Disconnect", "cmd": "[#feedback:'disconnect']"}
                        ];
                      } else {
                        this.data.cmds = [];
                      }
                      this.refresh();
                    }}
                  />
                  <div className="flex items-center gap-10" style={{ flexWrap: 'wrap' }}>
                    {this.data.cmds.slice(3, 6).map((item, i) => (
                      <div key={i} className="cmd-block">
                        <div className="form-group">
                          <BaseButton onClick={() => this.handleSend(null, item.cmd)}>{item.title}</BaseButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {this.message.task != 'quick' ? (
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
                            <td>{DateHelper.displayDateTime(item.createdDate)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {this.messages.length == 0 ? <div className="table-message">Message not found</div> : ''}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8" style={{ paddingLeft: 0 }}>
            <div className="section-block mb-15">
              <div className="form-filter">
                <Row>
                  <Col xl={24}>
                    <Row gutter={16}>
                      <Col xl={6}>
                        <label htmlFor="counter" className="w100pc">
                          Receiver:
                          <SelectBox
                            data={receiverOpt}
                            func={this.updateFilter}
                            keyField={'name'}
                            value={fields.name}
                            isMode="multiple"
                          />
                        </label>
                      </Col>
                      <Col xl={6}>
                        <label htmlFor="code" className="w100pc">
                          Code:
                          <SelectBox
                            data={codeOpt}
                            func={this.updateFilter}
                            keyField={'code'}
                            value={fields.code}
                            isMode="multiple"
                          />
                        </label>
                      </Col>
                      <Col xl={6}>
                        <label htmlFor="status" className="w100pc">
                          Status:
                          <SelectBox
                            data={statusOptions}
                            func={this.updateFilter}
                            keyField={'status'}
                            value={fields.status}
                            isMode={''}
                          />
                        </label>
                      </Col>

                      <Col xl={6}>
                        <BaseButton onClick={this.handleViewStoreWaiting}>
                          <CheckSquareOutlined /> &nbsp;Store sale waiting
                        </BaseButton>
                      </Col>
                    </Row>

                    {this.storeWaiting && (
                      <Row gutter={16}>
                        <Col xl={6}>
                          <label htmlFor="date" className="w100pc">
                            Date:
                            <div>
                              <DatePickerComp
                                date={fields.date}
                                minDate={decreaseDate(62)}
                                maxDate={increaseDate(0)}
                                func={this.updateFilter}
                                keyField={'date'}
                                className={'h-38'}
                              />
                            </div>
                          </label>
                        </Col>

                        <Col xl={6}>
                          <label htmlFor="statusSync" className="w100pc">
                            Status async:
                            <SelectBox
                              data={statusAsyncOptions}
                              func={this.updateFilter}
                              keyField={'statusSync'}
                              defaultValue={fields.statusSync}
                              isMode={''}
                            />
                          </label>
                        </Col>
                        <Col className="flex items-end gap-10">
                          <BaseButton onClick={this.handleCheckStoreWaiting}>Check store</BaseButton>
                          <BaseButton iconName={'clear'} onClick={this.handleClearStoreWaiting}>
                            Clear filter
                          </BaseButton>
                        </Col>
                      </Row>
                    )}
                  </Col>
                </Row>

                <Row gutter={16} className="mrt-10">
                  <Col xl={6}>
                    <label>
                      <span className="countCheck">{this.checkboxlist?.length || 0}</span>/
                      <span>{this.items ? StringHelper.escapeQty(this.items.length) : 0}</span> (checked/total)
                    </label>{' '}
                    <br />
                  </Col>
                  <Col xl={6}>
                    <label>
                      <span data-group="totalReceived">
                        {this.activities ? StringHelper.escapeQty(Object.keys(this.activities).length) : 0}
                      </span>{' '}
                      received
                    </label>
                  </Col>
                  <Col xl={6}>
                    <label>
                      <span data-group="totalFinished">
                        {this.comments ? StringHelper.escapeQty(Object.keys(this.comments).length) : 0}
                      </span>{' '}
                      finished
                    </label>
                  </Col>
                  <Col xl={6}>
                    <label>
                      <span data-group="totalFinished">
                        {this.items && this.comments
                          ? StringHelper.escapeQty(this.items.length - Object.keys(this.comments).length)
                          : 0}
                      </span>{' '}
                      not yet
                    </label>
                  </Col>
                </Row>
              </div>
            </div>

            <Row gutter={16}>
              <Col xl={24}>
                <TableCustom
                  data={data}
                  columns={columns}
                  fullWidth={true}
                  updateListCheckbox={this.updateListCheckbox}
                  dataCheckboxAll={dataCheck}
                />
              </Col>
            </Row>

            {/* <div className="section-block mb-15">
              {' '}
              <div style={{ maxHeight: 'calc(100vh - 275px)', overflowY: 'auto', position: 'relative' }} className="">
                <table className="table">
                  <thead style={{ position: 'sticky', top: 0 }}>
                    <tr>
                      <th className="w10">
                        <input type="checkbox" name="itemsOption" onChange={this.handleCheckAll} />
                      </th>
                      <th>Receiver </th>
                      <th>Code</th>
                      <th>Received date</th>
                      <th>Task finish date</th>
                      <th>Task feedback</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.handleFilter(this.items)
                      .sort((a, b) => (a.name >= b.name ? 1 : -1))
                      .map((item, i) => (
                        <tr key={i} data-group="receiver">
                          <td className="w10">
                            <input
                              type="checkbox"
                              name="itemOption"
                              value={item.name}
                              onChange={this.handleOnChangeCheckbox}
                            />
                          </td>
                          <td data-group="name">
                            <div className="flex items-center-gap-10">
                              <span>
                                {this.countersOnline[item.name] ? (
                                  <Icons.Dot color="#5eff5e" />
                                ) : (
                                  <Icons.Dot color="gray" />
                                )}
                              </span>
                              <span>{item.name}</span>
                            </div>
                          </td>
                          <td data-group="code">{item.code}</td>
                          <td>
                            {this.activities[item.name] ? (
                              <div>
                                {this.activities[item.name].map((activity, j) => (
                                  <div key={j}>{DateHelper.displayDateTime(activity.read_date)}</div>
                                ))}
                              </div>
                            ) : null}
                          </td>
                          <td data-group="comment">
                            {this.comments[item.name] ? (
                              <div>
                                {this.comments[item.name].map((comment, j) => (
                                  <div className={comment.comment == 'FAILED' ? 'notify-error-text' : ''} key={j}>
                                    {DateHelper.displayDateTime(comment.comment_date)}
                                    {comment.comment == 'FAILED' ? (
                                      <input type="hidden" name="isError" value="1" />
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
                            <BaseButton iconName={'send'} onClick={() => this.handleSend(item.name, null, 'resend')}>
                              Resend
                            </BaseButton>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {this.items.length == 0 ? <div className="table-message">Item not found</div> : ''}
              </div>
            </div> */}
          </div>
        </div>
      </section>
    );
  }
}

export default MessageDetailNotify;
