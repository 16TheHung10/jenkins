import Paging from "external/control/pagination";
import React from "react";
import BaseComponent from "components/BaseComponent";
import { DateHelper } from "helpers";
export default class ListSearchStoreOrder extends BaseComponent {
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
      this.handleLoadResult();
    }
  };

  componentWillReceiveProps = (newProps) => {
    if (newProps && newProps.items) {
      this.items = newProps.items;
      this.itemCount = newProps.itemCount;
      this.refresh();
    }
  };

  handleLoadResult = () => {
    this.props.handleLoadResult();
  };

  handleToDetail = (codeId) => {
    this.targetLink("/logistics-storeorder/" + codeId);
  };

  handleClickPaging = (page) => {
    this.props.handleClickPaging && this.props.handleClickPaging(page);
  };

  renderComp = () => {
    let items = this.items;

    return (
      <section
        id={this.idComponent}
        style={{ zIndex: 0, position: "relative" }}
      >
        <div className="section-block app_container mt-15">
          <div
            className="wrap-table htable"
            style={{ maxHeight: "calc(100vh - 400px)" }}
          >
            <table
              className="table table-hover detail-search-rcv "
              style={{ fontSize: 11 }}
            >
              <thead>
                <tr>
                  <th>Store code</th>
                  <th>Store name</th>
                  <th>PO code</th>
                  {/* <th>PO id</th> */}
                  <th className="rule-date">Delivery date</th>
                  <th className="rule-date">Order date</th>
                  <th>Supplier code</th>
                  <th>Supplier name</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr
                    key={i}
                    onDoubleClick={() => this.handleToDetail(item.poCode)}
                  >
                    <td>{item.storeCode}</td>
                    <td>{item.storeName}</td>
                    <td>{item.poCode}</td>
                    {/* <td>{item.poid}</td> */}
                    <td className="rule-date">
                      {DateHelper.displayDate(item.deliveryDate)}
                    </td>
                    <td className="rule-date">
                      {DateHelper.displayDate(item.orderDate)}
                    </td>
                    <td>{item.supplierCode}</td>
                    <td>{item.supplierName}</td>
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
            <div className="w-full text-center">
              <Paging
                page={this.page}
                onClickPaging={this.handleClickPaging}
                onClickSearch={this.handleLoadResult}
                itemCount={this.itemCount}
                listItemLength={this.items.length}
              />
            </div>
          ) : null}
        </div>
      </section>
    );
  };
}
