import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "antd";
import BaseComponent from "components/BaseComponent";
import Paging from "external/control/pagination";
import { DateHelper, StringHelper } from "helpers";
import { hanldeExportAutoField } from "helpers/ExportHelper";
import { sortColumn } from "helpers/FuncHelper";
import DownloadModel from "models/DownloadModel";
import ReportingModel from "models/ReportingModel";
import React from "react";
import SelectBox from "utils/selectBox";

export default class StockResultDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.items = [];
    this.idComponent =
      this.props.id || "detailPopup" + StringHelper.randomKey();

    this.lstCat = [];
    this.fieldSelected.cat = "";
    this.lstBarcode = [];
    this.fieldSelected.barcode = "";
    this.fieldSelected.loss = "";

    this.isRun = false;

    this.sum = {
      qtyHave: 0,
      qtyLoss: 0,
    };
    this.startDate = "";
    this.endDate = "";
    this.itemsExport = [];
    this.objGetLossDetail = {};
    this.page = 1;

    this.isRender = true;
  }

  componentWillReceiveProps(newProps) {
    if (this.startDate !== newProps.startDate) {
      this.startDate = newProps.startDate;
    }
    if (this.endDate !== newProps.endDate) {
      this.endDate = newProps.endDate;
    }
    if (this.items !== newProps.items) {
      this.items = newProps.items;

      this.itemsExport = [];
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

      this.page = 1;
    }
    this.refresh();
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
        this.startDate !== ""
          ? DateHelper.displayDateFormatMinus(this.startDate)
          : "",
      endDate:
        this.endDate !== ""
          ? DateHelper.displayDateFormatMinus(this.endDate)
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
    lst =
      this.fieldSelected.loss !== ""
        ? this.fieldSelected.loss === 1
          ? lst.filter((el) => el.lossQty > 0)
          : lst.filter((el) => el.lossQty <= 0)
        : lst;

    // for (let k in lst) {
    // 	let item = lst[k];
    // 	item.stockQty = item.soh;
    // 	delete item.soh;
    // }

    let posCol = [
      "itemCode",
      "itemName",
      "categoryName",
      "registerStock",
      "stockQty",
      "salesQty",
      "lossQty",
      "lossAmount",
      "endOfDay",
    ];

    let newLstSort = sortColumn(lst, posCol);

    this.itemsExport = newLstSort;
    this.handleSumLoss(arrItems);

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

  sortShowLostQty = (e) => {
    if (this.isRun) {
      return false;
    }

    this.isRun = true;
    let btn = document.querySelectorAll(".btn-action-filter");

    if (e.target.classList.contains("active")) {
      for (let i = 0; i < btn.length; i++) {
        btn[i].classList.remove("active");
      }
    } else {
      for (let i = 0; i < btn.length; i++) {
        btn[i].classList.remove("active");
      }
      e.target.classList.add("active");
    }

    this.isRun = false;

    this.refresh();
  };

  handleCheckLostQty = (item) => {
    this.handleShowPp(this.props.idCheckList);
    this.handleCheckItemLoss(item);
  };

  handleCheckItemLoss = (item) => {
    // let firstDateMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    let firstDateMonth = this.startDate;

    let params = {
      storeCode: this.props.storeCode,
      startDate: DateHelper.displayDateFormatMinus(firstDateMonth),
      endDate: DateHelper.displayDateFormatMinus(new Date()),
      itemCode: item.itemCode,
    };

    let model = new ReportingModel();
    if (!this.objGetLossDetail[item.storeCode + item.itemCode]) {
      model.getItemMovement(params).then((res) => {
        if (res.status && res.data) {
          if (res.data.items) {
            this.props.updateLstItemLoss(res.data.items);
            this.objGetLossDetail[item.storeCode + item.itemCode] =
              res.data.items;
          }
        } else {
          this.showAlert("API connect fail");
        }
      });
    } else {
      this.props.updateLstItemLoss(
        this.objGetLossDetail[item.storeCode + item.itemCode],
      );
    }
  };

  handleClickPaging = (page) => {
    this.page = page;
    this.refresh();
  };

  updateFilter = (val, key) => {
    if (key) {
      this.fieldSelected[key] = val;
      this.refresh();
    }
  };

  renderComp() {
    const fields = this.fieldSelected;

    let data = this.handleFilter(this.items);

    let items =
      data.length > 1
        ? data.filter(
            (el, i) => i >= (this.page - 1) * 30 && i < this.page * 30,
          )
        : data;

    return (
      <section
        id={this.idComponent}
        className="popup-form"
        style={{ minWidth: 420, maxWidth: "65%", width: "auto" }}
      >
        <Row className="mrt-10">
          <Col xl={24}>
            <div className="section-block">
              <Row gutter={16}>
                <Col xl={14}>
                  <Row gutter={16}>
                    <Col xl={8}>
                      <label htmlFor="cat" className="w100pc">
                        Category:
                        <SelectBox
                          data={this.lstCat}
                          func={this.updateFilter}
                          funcCallback={() => (this.page = 1)}
                          keyField={"cat"}
                          defaultValue={fields.cat}
                          isMode={""}
                          placeholder={"-- All --"}
                        />
                      </label>
                    </Col>
                    <Col xl={8}>
                      <label className="w100pc">
                        Barcode:
                        <SelectBox
                          data={this.lstBarcode}
                          func={this.updateFilter}
                          funcCallback={() => (this.page = 1)}
                          keyField={"barcode"}
                          defaultValue={fields.barcode}
                          isMode={""}
                          placeholder={"-- All --"}
                        />
                      </label>
                    </Col>
                    <Col xl={8}>
                      <label htmlFor="cat" className="w100pc op-0">
                        .
                      </label>
                      <button
                        onClick={() =>
                          hanldeExportAutoField(
                            this.itemsExport,
                            "exportDetailLoss",
                          )
                        }
                        type="button"
                        className="btn btn-danger h-30"
                      >
                        Export
                      </button>
                    </Col>
                  </Row>
                  <Row className="mrt-10">
                    <Col xl={24}>
                      Check số thiếu:
                      <span
                        className="cl-red mrr-5 btn-action-filter"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          this.fieldSelected.loss = e.target.classList.contains(
                            "active",
                          )
                            ? ""
                            : 1;
                          this.sortShowLostQty(e);
                          this.page = 1;
                          this.refresh();
                        }}
                      >
                        {StringHelper.formatValue(this.sum.qtyLoss)}
                      </span>
                      Check số dư:
                      <span
                        className="cl-red btn-action-filter"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          this.fieldSelected.loss = e.target.classList.contains(
                            "active",
                          )
                            ? ""
                            : 0;
                          this.sortShowLostQty(e);
                          this.page = 1;
                          this.refresh();
                        }}
                      >
                        {StringHelper.formatValue(this.sum.qtyHave)}
                      </span>
                    </Col>
                  </Row>
                </Col>
                <Col xl={10}>
                  <div className="cl-red bg-note">
                    <strong>Lưu ý: (Loss qty)</strong>
                    <br />
                    - Số dương là số lượng bị mất <br />
                    - Số âm là số lượng dư <br />* lossQty = (SOH đầu ngày -
                    Sales trong ngày) - (Count - Sales tại thời điểm kiểm kê đến
                    cuối ngày)
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {data.length > 0 ? (
          <Row className="mrt-10">
            <Col xl={24}>
              <div className="text-right">
                <div style={{ display: "inline-block" }}>
                  <Paging
                    page={this.page}
                    onClickPaging={this.handleClickPaging}
                    onClickSearch={() => {}}
                    itemCount={data.length}
                  />
                </div>
              </div>
            </Col>
          </Row>
        ) : null}
        <div
          style={{
            maxHeight: "calc(100vh - 230px)",
            overflowY: "auto",
            position: "relative",
          }}
        >
          <table className="table">
            <thead style={{ position: "sticky", top: 0 }}>
              <tr>
                <th className="fs-10">Item</th>
                <th className="fs-10">Category</th>
                <th className="fs-10 text-center">
                  Register <br />
                  stock
                </th>
                <th className="fs-10 text-center">
                  Stock count <br />
                  qty
                </th>
                <th className="fs-10 text-center">
                  Sales qty <br />
                  stocktake
                </th>
                <th className="fs-10 text-center">Loss qty</th>
                <th className="fs-10 text-center">
                  Loss <br />
                  amount
                </th>
                <th className="fs-10 text-center">
                  End of <br />
                  Day qty
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={index}
                  data-group="itemContainer"
                  className={item.lossQty > 0 ? "qtyMiss" : "qtyHave"}
                >
                  <td>
                    <span
                      className="fs-10 d-inline-block"
                      style={{ width: 260 }}
                    >
                      {item.itemCode} <br />
                      {item.itemName}
                    </span>
                  </td>
                  <td>
                    <span
                      className="fs-10 d-inline-block"
                      style={{ width: 120 }}
                    >
                      {item.categoryName}
                    </span>
                  </td>
                  <td
                    className={
                      "fs-10 text-center " +
                      this.handleHighlight(item.registerStock)
                    }
                    style={{ background: "ivory" }}
                  >
                    {StringHelper.formatValue(item.registerStock)}
                  </td>
                  <td
                    className={
                      "fs-10 text-center " + this.handleHighlight(item.stockQty)
                    }
                    style={{ background: "ivory" }}
                  >
                    {StringHelper.formatValue(item.stockQty)}
                  </td>
                  <td
                    className={
                      "fs-10 text-center " + this.handleHighlight(item.salesQty)
                    }
                    style={{ background: "ivory" }}
                  >
                    {StringHelper.formatValue(item.salesQty)}
                  </td>
                  <td
                    className={
                      "fs-10 text-center " + this.handleHighlight(item.lossQty)
                    }
                    style={{ background: "ivory" }}
                  >
                    {StringHelper.formatValue(item.lossQty)}{" "}
                    {item.lossQty !== 0 && (
                      <span
                        className="mrl-5 cursor cl-org pd-2 br-2 btn-showpp"
                        style={{ border: "1px solid orange" }}
                        onClick={() => this.handleCheckLostQty(item)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </span>
                    )}
                  </td>
                  <td
                    className={
                      "fs-10 text-center " +
                      this.handleHighlight(item.lossAmount)
                    }
                    style={{ background: "ivory" }}
                  >
                    {StringHelper.formatValue(item.lossAmount)}
                  </td>
                  <td
                    className={
                      "fs-10 text-center " + this.handleHighlight(item.endOfDay)
                    }
                    style={{ background: "ivory" }}
                  >
                    {StringHelper.formatValue(item.endOfDay)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length === 0 ? (
          <div className="table-message">Search ...</div>
        ) : null}
      </section>
    );
  }
}
