//Plugin
import Paging from "external/control/pagination";
import $ from "jquery";
import React from "react";

//Custom
import BaseComponent from "components/BaseComponent";
import { DateHelper } from "helpers";
import PromotionModel from "models/PromotionModel";

export default class ListSearchCheckin extends BaseComponent {
  constructor(props) {
    super(props);

    this.items = this.props.items || [];
    this.page = this.props.page || 1;
    this.itemCount = 0;
    this.idComponent = this.props.idComponent;

    this.isRender = true;
  }

  componentDidMount = () => {
    if (this.props.autoload) {
      this.props.handleLoadResult();
    }
  };

  componentWillReceiveProps = (newProps) => {
    if (newProps && newProps.items) {
      this.items = newProps.items;
      this.refresh();
    }
  };

  handleLoadResult = () => {
    this.props.handleLoadResult();
  };

  // handleToDetail = (codeId) => {
  //     this.targetLink("/promotion/" + codeId);
  // };

  handleClickPaging = (page) => {
    this.props.handleClickPaging && this.props.handleClickPaging(page);
  };

  handleCheckAll = () => {
    if (this.items.length === 0) {
      this.showAlert("Item not found", "error");
      this.refs.itemsOption.checked = false;
      return;
    }

    if (this.refs.itemsOption.checked === true) {
      $("#" + this.idComponent)
        .find("[name=itemOption]")
        .not(":disabled")
        .prop("checked", true);
    } else {
      $("#" + this.idComponent)
        .find("[name=itemOption]")
        .not(":disabled")
        .prop("checked", false);
    }
  };

  getItemsSearch = () => {
    return this.items || [];
  };

  parseItem = (item, key, valKey, field) => {
    let target = JSON.parse(item);

    for (let i = 0; i < target.length; i++) {
      if (target[i][key] === valKey) {
        if (target[i][field]) {
          return target[i][field];
        } else {
          return target[i][key];
        }
      }
    }
  };

  handleActiveItem = (item) => {
    item.active = item.active == 1 ? 0 : 1;

    let params = {
      promotionCode: item.id,
      status: item.active,
    };

    let model = new PromotionModel();
    model.applyPromotion(params).then((res) => {
      if (res.status) {
        this.showAlert("Save success", "success");
      } else {
        this.showAlert(res.message || "error");
      }
    });
    this.refresh();
  };

  renderComp = () => {
    let items = this.getItemsSearch();
    return (
      <section id={this.idComponent}>
        <div className="wrap-table htable w-fit">
          <table className="table table-hover detail-search-rcv w-fit">
            <thead>
              <tr>
                {/* <th className="w10">
                                    <input type="checkbox" ref="itemsOption" name="itemsOption" onChange={this.handleCheckAll} />
                                </th> */}
                <th>Store code</th>
                <th className="rule-number">Promotion code</th>
                <th className="rule-date">Start date</th>
                <th className="rule-date">End date</th>
                <th>Active</th>

                <th style={{ background: "burlywood" }}>Type</th>
                <th style={{ background: "burlywood" }} className="rule-number">
                  Amount
                </th>
                <th style={{ background: "burlywood" }} className="rule-number">
                  Total bill
                </th>
                <th style={{ background: "burlywood" }} className="rule-date">
                  Apply date
                </th>
                <th style={{ background: "burlywood" }} className="rule-number">
                  Expired
                </th>

                <th style={{ background: "cadetblue" }}>Type</th>
                <th style={{ background: "cadetblue" }}>Item code</th>
                <th style={{ background: "cadetblue" }}>Item name</th>
                <th style={{ background: "cadetblue" }} className="rule-date">
                  Apply date
                </th>
                <th style={{ background: "cadetblue" }} className="rule-number">
                  Expired
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                // <tr key={i} onDoubleClick={() => this.handleToDetail(item.promotionCode)}>
                <tr key={i}>
                  {/* <td>
                                        <input
                                            key={item.promotionCode}
                                            type="checkbox"
                                            name="itemOption"
                                            value={item.promotionCode}
                                            data-code={item.promotionCode}
                                        />
                                    </td> */}
                  <td>{item.storeCode}</td>
                  <td className="rule-number">{item.id}</td>
                  <td className="rule-date">
                    {DateHelper.displayDate(item.startDate)}
                  </td>
                  <td className="rule-date">
                    {DateHelper.displayDate(item.endDate)}
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      name="active"
                      onChange={() => this.handleActiveItem(item)}
                      checked={item.active === 1}
                      value={item.active}
                    />
                  </td>

                  <td style={{ background: "burlywood" }}>
                    {this.parseItem(item.voucher, "TypeVoucher", "cash")}
                  </td>
                  <td style={{ background: "burlywood" }}>
                    {this.parseItem(
                      item.voucher,
                      "TypeVoucher",
                      "cash",
                      "Amount",
                    )}
                  </td>
                  <td style={{ background: "burlywood" }}>
                    {this.parseItem(
                      item.voucher,
                      "TypeVoucher",
                      "cash",
                      "TotalBillApprove",
                    )}
                  </td>
                  <td style={{ background: "burlywood" }}>
                    {DateHelper.displayDate(
                      this.parseItem(
                        item.voucher,
                        "TypeVoucher",
                        "cash",
                        "ApplyDate",
                      ),
                    )}
                  </td>
                  <td
                    style={{ background: "burlywood" }}
                    className="rule-number"
                  >
                    {this.parseItem(
                      item.voucher,
                      "TypeVoucher",
                      "cash",
                      "Expired",
                    )}
                  </td>

                  <td style={{ background: "cadetblue" }}>
                    {this.parseItem(item.voucher, "TypeVoucher", "product")}
                  </td>
                  <td style={{ background: "cadetblue" }}>
                    {this.parseItem(
                      item.voucher,
                      "TypeVoucher",
                      "product",
                      "ItemCode",
                    )}
                  </td>
                  <td style={{ background: "cadetblue" }}>
                    {this.parseItem(
                      item.voucher,
                      "TypeVoucher",
                      "product",
                      "ItemName",
                    )}
                  </td>
                  <td style={{ background: "cadetblue" }}>
                    {DateHelper.displayDate(
                      this.parseItem(
                        item.voucher,
                        "TypeVoucher",
                        "product",
                        "ApplyDate",
                      ),
                    )}
                  </td>
                  <td
                    style={{ background: "cadetblue" }}
                    className="rule-number"
                  >
                    {this.parseItem(
                      item.voucher,
                      "TypeVoucher",
                      "product",
                      "Expired",
                    )}
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

        {items.length !== 0 ? (
          <Paging
            page={this.page}
            onClickPaging={this.handleClickPaging}
            onClickSearch={this.handleLoadResult}
            itemCount={this.itemCount}
            listItemLength={this.items.length}
          />
        ) : null}
      </section>
    );
  };
}
