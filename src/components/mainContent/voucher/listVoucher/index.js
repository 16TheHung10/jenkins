//Plugin
import $ from "jquery";
import React from "react";

//Custom
import BaseComponent from "components/BaseComponent";
import Paging from "external/control/pagination";
import { DateHelper, PageHelper, StringHelper } from "helpers";
import VoucherModel from "models/VoucherModel";

class ListVoucher extends BaseComponent {
  constructor(props) {
    super(props);
    this.items = [];
    this.page = this.props.page || 1;
    this.itemCount = 0;
    this.idComponent =
      this.props.idComponent || "listVoucher" + StringHelper.randomKey();
    this.handleClickPaging = this.handleClickPaging.bind(this);
    this.handleLoadResult = this.handleLoadResult.bind(this);
    this.handleCheckAll = this.handleCheckAll.bind(this);
    this.isRender = true;
  }

  componentDidMount() {
    if (this.props.autoload) {
      this.handleLoadResult();
    }
  }

  handleLoadResult() {
    let voucherModel = new VoucherModel();
    voucherModel
      .getListVoucher({
        keyword: this.props.voucherCode,
        startDate: this.props.startDate,
        endDate: this.props.endDate,
        sortBy: this.props.sortBy || "",
        sortOrder: this.props.sortOrder || "",
        page: this.page,
      })
      .then((response) => {
        if (
          response.status &&
          response.data.voucherList &&
          response.data.voucherList.length > 0
        ) {
          this.items = response.data.voucherList;
          this.message = "";
          this.itemCount = response.data.total;
        } else {
          this.items = [];
          this.message = "Item not found";
        }
        this.refresh();
      });
  }

  handleSearch() {
    this.page = 1;
    this.handleLoadResult();
  }

  handleClickPaging(page) {
    this.page = page;
    PageHelper.pushHistoryState("page", page);
  }

  handleCheckAll(e) {
    if (this.items.length === 0) {
      this.showAlert("Item not found");
      $(e.target).prop("checked", false);
      return;
    }
    $("#" + this.idComponent)
      .find("[name='itemOption']")
      .not(":disabled")
      .prop("checked", e.target.checked);
  }

  handleGetItemSelected() {
    let listID = [];
    var items = $("#" + this.idComponent).find("[name='itemOption']:checked");
    if (items.length !== 0) {
      for (var i = 0; i < items.length; i++) {
        listID.push($(items[i]).val());
      }
    }
    return listID;
  }

  renderComp() {
    let items = this.items;
    return (
      <section id={this.idComponent}>
        <div
          className="wrap-table htable"
          style={{ maxHeight: "calc(100vh - 275px)" }}
        >
          <table className="table table-hover">
            <thead>
              <tr>
                {/*<th className='w10'><input type='checkbox' name='itemsOption' onClick={this.handleCheckAll}/></th>*/}
                <th>Code</th>
                <th>Value</th>
                <th className="rule-date">Start date</th>
                <th className="rule-date">End date</th>
                <th>Type</th>
                <th>Invoice</th>
                <th>Issued</th>
                <th>Sold</th>
                <th>Used</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  {/*<td><input type='checkbox' disabled={item.status === 1} name='itemOption' value={item.code} /></td> */}
                  <td>{item.code}</td>
                  <td>{StringHelper.formatPrice(item.value)}</td>
                  <td className="rule-date">
                    {DateHelper.displayDate(item.validStartDate)}
                  </td>
                  <td className="rule-date">
                    {DateHelper.displayDate(item.validEndDate)}
                  </td>
                  <td>{item.type}</td>
                  <td>{item.invoice}</td>
                  <td>{item.isIssued ? "Yes" : ""}</td>
                  <td>{item.isSold ? "Yes" : ""}</td>
                  <td>{item.isUsed ? "Yes" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length <= 0 ? (
            <div className="table-message">Item not found</div>
          ) : (
            ""
          )}
        </div>
        {items.length !== 0 ? (
          <div className="w-full text-center">
            <Paging
              page={this.page}
              onClickPaging={this.handleClickPaging}
              onClickSearch={this.handleLoadResult}
              itemCount={this.itemCount}
            />
          </div>
        ) : (
          ""
        )}
      </section>
    );
  }
}

export default ListVoucher;
