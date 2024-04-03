import BaseComponent from "components/BaseComponent";
import { DateHelper, StringHelper } from "helpers";
import $ from "jquery";
import React from "react";

export default class StoreSelect extends BaseComponent {
  constructor(props) {
    super(props);
    this.isRender = true;
    this.fieldSelected.type = "";
    this.fieldSelected.object = "";
    this.data.permissions = [];
    this.data.functions = [];
    this.data.userTypes = [];
    this.data.objectPermissions = {};
    this.idComponent = "id" + StringHelper.randomKey();

    this.fieldSelected.date = this.props.date || "";
    this.isStore = false;

    this.listStore = this.props.store || []; // [{value: 'storeCode', label:'storeName'}]
  }

  componentWillReceiveProps(newProps) {
    if (this.listStore !== newProps.store) {
      this.listStore = newProps.store;
    }
    if (this.fieldSelected.date !== newProps.date) {
      this.fieldSelected.date = newProps.date;
    }
    if (this.isStore !== newProps.isStore) {
      this.isStore = newProps.isStore;

      if (newProps.isStore) {
        $("#" + this.idComponent)
          .find("[name=itemStore]")
          .not(":disabled")
          .prop("checked", true);
        this.handleChooseInput();
      }
    }

    this.refresh();
  }

  handleCheckAll = () => {
    if (this.listStore.length === 0) {
      this.showAlert("Item not found", "error");
      this.refs.optionAll.checked = false;
      return;
    }

    if (this.refs.optionAll.checked === true) {
      $("#" + this.idComponent)
        .find("[name=itemStore]")
        .not(":disabled")
        .prop("checked", true);
    } else {
      $("#" + this.idComponent)
        .find("[name=itemStore]")
        .not(":disabled")
        .prop("checked", false);
    }

    this.handleChooseInput();
  };

  handleChooseInput = () => {
    let optChecked = $("#" + this.idComponent).find("[name=itemStore]:checked");
    let dataParams = [];

    if (optChecked.length > 0) {
      for (let k = 0; k < optChecked.length; k++) {
        dataParams.push(optChecked[k].value);
      }
    }

    this.props.updateStoreCodeExport(dataParams);
  };

  renderComp() {
    return (
      <section id={this.idComponent}>
        {this.listStore && this.listStore.length > 0 && (
          <>
            <div className="wrap-table w-full">
              <table
                className="table table-checklist d-block"
                style={{ maxHeight: "calc(100vh - 230px)", overflow: "auto" }}
              >
                <thead>
                  <tr>
                    <th>
                      <label>
                        <b>Store</b>
                      </label>
                    </th>
                    <th>
                      <label>All</label>
                      <div>
                        <input
                          disabled={this.isStore}
                          type="checkbox"
                          onChange={this.handleCheckAll}
                          className="ckb-style"
                          ref="optionAll"
                          name="optionAll"
                        />{" "}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.listStore.map((item, i) => (
                    <tr key={i}>
                      <td>
                        {item.label}{" "}
                        <span className="cl-red">
                          {this.listStore.length > 1 &&
                          this.fieldSelected.date !== ""
                            ? DateHelper.diffDate(
                                item.openedDate,
                                this.fieldSelected.date,
                              ) > 0
                              ? null
                              : "Open " +
                                DateHelper.displayDate(item.openedDate)
                            : null}
                        </span>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            this.handleChooseInput();
                          }}
                          className="ckb-style"
                          name="itemStore"
                          value={item.value}
                          disabled={
                            this.fieldSelected.date !== ""
                              ? !this.isStore &&
                                DateHelper.diffDate(
                                  item.openedDate,
                                  this.fieldSelected.date,
                                ) >= 0
                                ? false
                                : true
                              : false
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    );
  }
}
