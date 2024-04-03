//Plugin
import Paging from "external/control/pagination";
import $ from "jquery";
import React from "react";

//Custom
import BaseComponent from "components/BaseComponent";
import { DateHelper } from "helpers";

export default class ListSearch extends BaseComponent {
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

  handleToDetail = (codeId) => {
    this.targetLink("/promotion/" + codeId);
  };

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

  handleDeleteItems = () => {
    // let optChecked = $("#" + this.idComponent).find("[name=itemOption]:checked");
    // let dataParams = [];
    // if (optChecked.length > 0) {
    //     for (let k = 0; k < optChecked.length; k++) {
    //         for (let k2 = 0; k2 < this.items.length; k2++) {
    //             if (this.items[k2].poid === optChecked[k].value) {
    //                 optChecked[k].checked = false;
    //                 dataParams.push({
    //                     ElementID: this.items[k2].poid,
    //                 });
    //                 break;
    //             }
    //         }
    //     }
    //     let model = new PromotionModel();
    //     model.deleteMultiPo(dataParams).then((response) => {
    //         if (response.status) {
    //             this.showAlert(response.message, "success");
    //         }
    //     });
    // } else {
    //     this.showAlert("Please select at least one item", "error");
    // }
  };

  handleApproveItems = () => {
    // let optChecked = $("#" + this.idComponent).find("[name=itemOption]:checked");
    // let dataParams = [];
    // if (optChecked.length > 0) {
    //     for (let k = 0; k < optChecked.length; k++) {
    //         for (let k2 = 0; k2 < this.items.length; k2++) {
    //             if (this.items[k2].poid === optChecked[k].value) {
    //                 optChecked[k].checked = false;
    //                 dataParams.push({
    //                     ElementID: this.items[k2].poid,
    //                 });
    //                 break;
    //             }
    //         }
    //     }
    //     let model = new PromotionModel();
    //     model.approveMultiPo(dataParams).then((response) => {
    //         if (response.status) {
    //             this.showAlert(response.message, "success");
    //         }
    //     });
    // } else {
    //     this.showAlert("Please select at least one item", "error");
    // }
  };

  getItemsSearch = () => {
    return this.items || [];
  };

  renderComp = () => {
    let items = this.getItemsSearch();

    return (
      <section id={this.idComponent}>
        <div className="wrap-table htable">
          <table className="table table-hover detail-search-rcv">
            <thead>
              <tr>
                <th className="w10">
                  <input
                    type="checkbox"
                    ref="itemsOption"
                    name="itemsOption"
                    onChange={this.handleCheckAll}
                  />
                </th>
                <th>Name</th>
                <th>Code</th>
                <th>Status</th>
                <th className="rule-date">Created date</th>
                <th className="rule-date">From date</th>
                <th className="rule-date">End date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr
                  key={i}
                  onDoubleClick={() => this.handleToDetail(item.promotionCode)}
                >
                  <td>
                    <input
                      key={item.promotionCode}
                      type="checkbox"
                      // disabled={item.cancel || item.approved}
                      name="itemOption"
                      value={item.promotionCode}
                      data-code={item.promotionCode}
                    />
                  </td>
                  <td>{item.promotionName}</td>
                  <td>{item.promotionCode}</td>
                  <td>{item.active === 1 ? "Active" : "Inactive"}</td>
                  <td className="rule-date">
                    {DateHelper.displayDate(item.createdDate)}
                  </td>
                  <td className="rule-date">
                    {DateHelper.displayDate(item.fromDate)}
                  </td>
                  <td className="rule-date">
                    {DateHelper.displayDate(item.toDate)}
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
