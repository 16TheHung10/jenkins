//Plugin
import React from "react";

//Custom
import BaseComponent from "components/BaseComponent";
import { DateHelper, StringHelper } from "helpers";
import DownloadModel from "models/DownloadModel";
import ReportingModel from "models/ReportingModel";

export default class SupplierItemDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.items = [];
    this.idComponent =
      this.props.id || "detailPopup" + StringHelper.randomKey();

    this.lstCat = [];
    this.fieldSelected.cat = "";
    this.lstBarcode = [];
    this.fieldSelected.barcode = "";

    this.isRun = false;

    this.sum = {
      qtyHave: 0,
      qtyLoss: 0,
    };

    this.isRender = true;
  }

  componentWillReceiveProps(newProps) {
    if (this.items !== newProps.items) {
      this.items = newProps.items;

      this.lstCat = [];
      let objCategory = {};
      this.lstBarcode = [];
      let objBarcode = {};

      for (let key in this.items) {
        let item = this.items[key];

        if (!objCategory[item.categoryName]) {
          objCategory[item.categoryName] = {
            value: item.categoryName,
            label: item.categoryName,
          };
        }

        if (!objBarcode[item.itemCode]) {
          objBarcode[item.itemCode] = {
            value: item.itemCode,
            label: item.itemCode + " - " + item.itemName,
          };
        }
      }

      this.lstCat = Object.values(objCategory);
      this.lstBarcode = Object.values(objBarcode);
    }
  }

  handleHighlight = (qty) => {
    if (qty < 0) {
      return "cl-red";
    }
    return "";
  };

  handleExport = () => {
    let type = "stocktakeresultdetail";
    let params = {
      storeCode: this.props.storeCode,
      startDate:
        this.props.startDate !== ""
          ? DateHelper.displayDateFormatMinus(this.props.startDate)
          : "",
      endDate:
        this.props.endDate !== ""
          ? DateHelper.displayDateFormatMinus(this.props.endDate)
          : "",
    };

    let model = new ReportingModel();
    model.reportingExport(type, params).then((res) => {
      if (res.status) {
        let downloadModel = new DownloadModel();
        downloadModel.get(res.data.downloadUrl, null, null, ".xls");
      } else {
        this.showAlert(res.message);
      }
    });
  };

  handleFilter = (arrItems) => {
    let lst =
      this.fieldSelected.cat !== ""
        ? arrItems.filter((el) => el.categoryName === this.fieldSelected.cat)
        : arrItems;
    lst =
      this.fieldSelected.barcode !== ""
        ? lst.filter((el) => el.itemCode === this.fieldSelected.barcode)
        : lst;

    this.handleSumLoss(lst);

    return Object.values(lst);
  };

  handleSumLoss = (lst) => {
    if (lst) {
      this.sum = {
        qtyHave: 0,
        qtyLoss: 0,
      };

      for (let key in lst) {
        let item = lst[key];
        if (item.lossQty >= 0) {
          this.sum.qtyLoss += item.lossQty;
        } else {
          this.sum.qtyHave += item.lossQty;
        }
      }
    }
  };

  sortShowLostQty = (e, classShow, classHide) => {
    if (this.isRun) {
      return false;
    }

    this.isRun = true;

    let btn = document.querySelectorAll(".btn-action-filter");

    let trShow = document.querySelectorAll("." + classShow);
    let trHide = document.querySelectorAll("." + classHide);

    if (e.target.classList.contains("active")) {
      e.target.classList.remove("active");
      for (let i = 0; i < trShow.length; i++) {
        trShow[i].classList.remove("hide");
      }

      for (let i = 0; i < trHide.length; i++) {
        trHide[i].classList.remove("hide");
      }
    } else {
      for (let i = 0; i < btn.length; i++) {
        btn[i].classList.remove("active");
      }
      e.target.classList.add("active");
      for (let i = 0; i < trShow.length; i++) {
        trShow[i].classList.remove("hide");
      }

      for (let i = 0; i < trHide.length; i++) {
        trHide[i].classList.add("hide");
      }
    }

    this.isRun = false;

    this.refresh();
  };

  renderComp() {
    let items = this.handleFilter(this.items);

    return (
      <section
        id={this.idComponent}
        className="popup-form"
        style={{ minWidth: 420, maxWidth: "65%", width: "auto" }}
      >
        <div className="wrap-table mrt-5" style={{ overflow: "auto" }}>
          {items.length === 0 ? (
            <div className="table-message">The supplier has no products</div>
          ) : (
            <table
              className="table table-hover"
              style={{
                display: "block",
                overflow: "auto",
                maxHeight: "calc(100vh - 216px)",
              }}
            >
              <thead>
                <tr>
                  <th>Item</th>
                  <th></th>
                  <th>Division</th>
                  <th>Category</th>
                  <th>Sub category</th>
                  <th>Unit</th>
                  <th className="rule-number">Sales price</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} data-group="itemContainer">
                    <td>
                      <span className="d-inline-block">{item.itemCode}</span>
                    </td>
                    <td>
                      <span className="d-inline-block">{item.itemName}</span>
                    </td>
                    <td>
                      <span className="d-inline-block">
                        {item.divitionName}
                      </span>
                    </td>
                    <td>
                      <span className="d-inline-block">
                        {item.categoryName}
                      </span>
                    </td>
                    <td>
                      <span className="d-inline-block">
                        {item.subCategoryName}
                      </span>
                    </td>
                    <td>
                      <span className="d-inline-block">{item.unit}</span>
                    </td>
                    <td
                      className={
                        "text-center " + this.handleHighlight(item.salesPrice)
                      }
                      style={{ background: "ivory" }}
                    >
                      {StringHelper.formatValue(item.salesPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    );
  }
}
