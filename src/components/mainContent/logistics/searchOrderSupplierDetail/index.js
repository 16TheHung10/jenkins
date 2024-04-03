//Plugin
import React from "react";

//Custom
import BaseComponent from "components/BaseComponent";
import { DateHelper } from "helpers";

import ListDetail from "components/mainContent/logistics/listOrderSupplierDetail";
import LogisticsModel from "models/LogisticsModel";

class SearchOrderSupplierDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.listDetailRef = React.createRef();

    this.poCode = this.props.poCode || "";

    this.items = [];

    this.isRender = true;
  }

  componentDidMount = () => {
    this.handleUpdateState();
  };

  handleUpdateState = async () => {
    if (this.poCode !== "") {
      let model = new LogisticsModel();
      await model.getListDetail(this.poCode).then((res) => {
        if (res.status && res.data && res.data.items) {
          this.items = res.data.items;

          for (var i = 0; i < this.items.length; i++) {
            this.items[i]["qtyConfirm"] = this.items[i].qty;
          }
          this.refresh();
        } else {
          // this.targetLink('/logistics-ordersupplier');
          this.showAlert(res.message);
        }
      });
    }
  };

  handleSave = () => {
    let listItem = [];

    for (var item in this.items) {
      var obj = {
        itemID: this.items[item].itemID,
        qty: this.items[item].qtyConfirm,
      };

      listItem.push(obj);
    }

    let params = {
      poCode: this.poCode,
      receiveDate: DateHelper.displayFormatMinus(new Date()),
      receiptDetails: listItem,
    };

    let model = new LogisticsModel();
    model.qtyConfirm(params).then((res) => {
      if (res.status) {
        this.showAlert("Save successfully!", "success");
      } else {
        this.showAlert(res.message);
      }
    });
  };

  handleUpdateItems = (items) => {
    this.items = items;
    this.refresh();
  };

  handleLoadDefault = () => {
    //   if(!this.fieldSelected.store){
    //     this.showAlert("Please select store");
    //     return;
    //   }
    //   if(!this.fieldSelected.orderDate){
    //     this.showAlert("Please select order date");
    //     return;
    //   }
    //   let dateDefault = this.fieldSelected.orderDate;
    //   dateDefault.setDate(dateDefault.getDate()-7);
    //   let ioModel = new InternalOrderModel();
    //   ioModel.getOrderCodeByLastWeek(this.fieldSelected.store, DateHelper.displayDateFormat(dateDefault)).then(response => {
    //     if(response.data.orderCode){
    //       super.targetLink("/io/"+response.data.orderCode+"/copy");
    //       return;
    //     } else {
    //       this.showAlert("Item not found");
    //     }
    //   });
  };

  renderComp() {
    return (
      <section className="wrap-section">
        <div className="row header-detail">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <button
              onClick={() => super.back("/logistics-ordersupplier")}
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
              {"#" + this.poCode}
            </h2>
          </div>
        </div>

        <ListDetail
          ref={this.listDetailRef}
          items={this.items}
          updateItems={this.handleUpdateItems}
          type={this.props.type}
        />
      </section>
    );
  }
}

export default SearchOrderSupplierDetail;
