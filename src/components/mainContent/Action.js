import React, { Fragment } from "react";
import $ from "jquery";
import { StringHelper, PageHelper } from "helpers";
import BaseComponent from "components/BaseComponent";
import { message, Popconfirm } from "antd";

class Action extends BaseComponent {
  constructor(props) {
    super(props);
    this.action = this.action.bind(this);
    this.className = {
      save: "btn btn-success btn-search-po",
      update: "btn btn-primary btn-search-rcv",
      info: "btn btn-info btn-search-rcv",
      approve: "btn btn-success btn-search-rcv",
      delete: "btn btn-danger btn-search-rcv",
    };
    this.idComponent =
      this.props.idComponent || "action" + StringHelper.randomKey();
    this.isRender = true;
    this.leftInfo = this.props.leftInfo || [];
    this.rightInfo = this.props.rightInfo || [];
    PageHelper.getInstance().addFetch("action", this);
  }

  action(func) {
    func();
  }

  getActionItem(name) {
    return $("[data-group='action-" + name + "']");
  }

  showHideActionItem(attrs, isShow = true) {
    for (var item in attrs) {
      if (isShow) {
        this.getActionItem(attrs[item]).show();
      } else {
        this.getActionItem(attrs[item]).hide();
      }
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.props.leftInfo !== newProps.leftInfo) {
      this.leftInfo = newProps.leftInfo;
    }

    if (this.props.rightInfo !== newProps.rightInfo) {
      this.rightInfo = newProps.rightInfo;
    }
  }

  confirm = (e) => {
    message.success("Click on Yes");
  };

  cancel = (e) => {
    message.error("Click on No");
  };

  renderComp() {
    if (this.leftInfo.length !== 0 || this.rightInfo.length !== 0) {
      return (
        <div className="row top-menu" id={this.idComponent}>
          <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8 h-full flex items-end">
            {this.leftInfo.map((item, key) => {
              if (item.isConfirm) {
                return (
                  <Fragment key={key}>
                    <Popconfirm
                      placement="topLeft"
                      title={item.titlePopconfirm}
                      onConfirm={() => this.action(item.action)}
                      // onCancel={this.cancel}
                      okText="Yes"
                      cancelText="No"
                    >
                      <button
                        data-group={"action-" + item.actionName}
                        style={item.hide ? { display: "none" } : {}}
                        key={key}
                        type="button"
                        // className={this.className[item.actionType]}
                        className={
                          this.className[item.actionType] +
                          " " +
                          (item.classActive ? item.classActive : "")
                        }
                      >
                        {item.name}
                      </button>
                    </Popconfirm>
                    {/* <button data-group={"action-" + item.actionName} style={ item.hide ? {display: 'none'} : {} } key={key} onClick={() => this.action(item.action)}  type="button" className={this.className[item.actionType]}>{item.name}</button> */}
                  </Fragment>
                );
              } else {
                return (
                  <button
                    data-group={"action-" + item.actionName}
                    style={item.hide ? { display: "none" } : {}}
                    key={key}
                    onClick={() => this.action(item.action)}
                    type="button"
                    className={
                      this.className[item.actionType] +
                      " " +
                      (item.classActive ? item.classActive : "")
                    }
                  >
                    {item.name}
                  </button>
                );
              }
            })}
          </div>

          <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 text-right pull-right h-full flex items-center justify-end">
            {this.rightInfo.map((item, key) => (
              <button
                data-group={"action-" + item.actionName}
                style={item.hide ? { display: "none" } : {}}
                key={key}
                onClick={() => this.action(item.action)}
                type="button"
                className={this.className[item.actionType]}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Action;
