//Plugin
import React from "react";

//Custom
import BaseComponent from "components/BaseComponent";
import { StringHelper } from "helpers";

export default class ItemsList extends BaseComponent {
  constructor(props) {
    super(props);
    this.idComponent = "idList" + StringHelper.randomKey();
    this.items = this.props.itemsSelected || [];
    this.displayType = this.props.displayType;
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.itemsSelected) {
      this.items = newProps.itemsSelected;
    }
    if (this.displayType !== newProps.displayType) {
      this.displayType = newProps.displayType;
    }
    this.refresh();
  };

  handleDeleteItems = (items) => {
    if (this.items.includes(items)) {
      this.items.splice(this.items.indexOf(items), 1);
    } else {
      this.showAlert("Items is not exists", "error");
    }
    this.refresh();
  };

  renderComp = () => {
    let items = this.items;
    return (
      <section id={this.idComponent}>
        {/* {
                    !this.props.isUpdateForm && 
                    <>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <button type="button" className="btn btn-success" onClick={this.handleDeleteItems} style={{height:38,background:'black'}}>
                                        Delete items
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                } */}

        <div
          className="wrap-table htable"
          style={{ maxHeight: "calc(100vh - 305px)" }}
        >
          <table className="table table-hover">
            <thead>
              <tr>
                <th>No.</th>
                <th>{this.displayType === 0 ? "Barcode" : "Suppler Code"}</th>
                <th>Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="col-md-1">{items.length - i}</td>
                  <td className="col-md-3">
                    {this.displayType === 0 ? item.itemCode : item.supplierCode}
                  </td>
                  <td className="col-md-6">
                    {this.displayType === 0 ? item.itemName : item.supplierName}
                  </td>
                  <td className="col-md-3">
                    <button
                      type="button"
                      className="btn btn-success col-md-12"
                      onClick={this.handleDeleteItems.bind(null, item)}
                      style={{ background: "black" }}
                    >
                      Delete
                    </button>
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
      </section>
    );
  };
}
