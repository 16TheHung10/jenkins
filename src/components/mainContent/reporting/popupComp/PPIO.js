//Plugin
import Paging from "external/control/pagination";
import React from "react";

//Custom
import BaseComponent from "components/BaseComponent";
import { DateHelper, StringHelper } from "helpers";
// import StockTakeModel from 'models/StockTakeModel';
import IconDownTrend from "images/arrow-trend-down-solid.svg";
import IconUpTrend from "images/arrow-trend-up-solid.svg";

class PPIO extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent =
      this.props.idComponent || "ppEdit" + StringHelper.randomKey();

    //Default data
    this.itemEdit = [];
    this.io = {};

    this.isRender = true;
    this.page = 1;
    this.isUpdateForm = (this.io.orderCode || "") !== "";
    this.isAllowUpdate =
      !this.isUpdateForm || (!this.io.approved && !this.io.canceled);
  }

  componentDidMount() {
    // this.handleUpdateState();
  }

  componentWillReceiveProps(newProps) {
    if (this.itemEdit !== newProps.itemEdit) {
      this.itemEdit = newProps.itemEdit;
      // this.fieldSelected.stockDateEdit = this.itemEdit && this.itemEdit.date && this.itemEdit.time ? new Date(this.itemEdit.date+"T"+this.itemEdit.time) : "";
      // this.fieldSelected.note = this.itemEdit && this.itemEdit.note ? this.itemEdit.note : "";
    }
    if (this.io !== newProps.io) {
      this.io = newProps.io;
    }
    this.page = 1;
  }

  // handleLoadItemsResult = () => {
  // 	let params = {
  // 		id: this.itemEdit.id || "",
  // 		date: this.fieldSelected.stockDateEdit !== "" ? DateHelper.displayDateFormatMinus(this.fieldSelected.stockDateEdit) : "",
  // 		time: this.fieldSelected.stockDateEdit !== "" ? DateHelper.displayTime(this.fieldSelected.stockDateEdit) : "",
  // 		note: this.fieldSelected.note || ""
  // 	}

  // 	let model = new StockTakeModel();
  // 	model.editStockSchedulerDetail(params).then(res=>{
  // 		if (res.status && res.data) {
  // 			this.showAlert(res.message, 'success');
  // 			this.props.updateItemEdit(params);
  // 		}
  // 		else {
  // 			this.showAlert(res.message);
  // 		}

  // 		this.refresh();
  // 	});
  // }

  // handleSave = (e) => {
  // 	this.handleLoadItemsResult();
  // }

  handleClickPaging = (page) => {
    this.page = page;
    // this.props.updatePaging(page);
    this.refresh();
  };

  highLightText = (txt) => {
    if (txt === "A") {
      return "hl-red";
    } else if (txt === "B") {
      return "hl-yellow";
    } else {
      return "";
    }
  };

  handleHighlight = (qty) => {
    if (qty != 0) {
      return "bg-cl-org";
    }
    return "";
  };

  showIconTrend = (classType) => {
    if (classType === "A" || classType === "B") {
      return <img src={IconUpTrend} alt="up trend" width={20} />;
    } else {
      return <img src={IconDownTrend} alt="down trend" width={20} />;
    }
  };

  renderComp() {
    let itemsIndex = this.itemEdit.filter(
      (el, i) => i >= (this.page - 1) * 30 && i < this.page * 30,
    );

    return (
      <section
        id={this.idComponent}
        className="popup-form popup-form-additem"
        style={{ minHeight: 300 }}
      >
        {this.itemEdit.length !== 0 && (
          <div className="row">
            <div className="col-md-12 text-right">
              <div style={{ display: "inline-block" }}>
                <Paging
                  page={this.page}
                  onClickPaging={this.handleClickPaging}
                  onClickSearch={() => {}}
                  itemCount={this.itemEdit.length}
                />
              </div>
            </div>
          </div>
        )}

        <table
          className={
            "table table-hover" + (this.itemEdit.length > 0 && "mH-370")
          }
          style={{
            maxHeight: "calc(100vh - 230px)",
            overflow: "auto",
            display: "block",
          }}
        >
          <thead>
            <tr className="tr-sticky">
              {/* <th className="no-sticky">Barcode</th> */}

              <th className="fs-10 no-sticky" style={{ maxWidth: 230 }}>
                Item
              </th>
              <th className="fs-10 no-sticky">Supplier</th>
              <th className="fs-10 no-sticky text-center">
                Last <br />
                sales
              </th>
              <th className="fs-10 no-sticky text-center">OOS</th>
              <th className="fs-10 no-sticky text-center">
                Disposal <br />
                qty
              </th>
              {/* {this.isAllowUpdate ? <th className="no-sticky text-center">POG</th> : null}
                                    {this.isAllowUpdate ? <th className="no-sticky text-center">SOH</th> : null} */}
              <th className="fs-10 no-sticky text-center">
                Est.Qty.
                <br />
                RCV
              </th>
              <th
                className="fs-10 no-sticky text-center"
                style={{ background: "orange" }}
              >
                Today <br />
                order
              </th>
              <th className="fs-10 no-sticky">Unit</th>
              <th className="fs-10 no-sticky text-center">ADQ</th>
              <th className="fs-10 no-sticky">Class</th>
              <th className="fs-10 no-sticky"></th>
              {/* <th className="fs-10 no-sticky text-center" style={{background:'orange'}}>MOV</th> */}
              <th className="fs-10 no-sticky text-center">Delivery Date</th>
              <th className="fs-10 no-sticky">
                Next <br />
                order
              </th>
            </tr>
          </thead>
          <tbody>
            {itemsIndex.map((item, i) =>
              (!this.isShowMOVInvalid || item.movCal != 0) &&
              (!this.isShowMOQInvalid || item.qty % item.moq != 0) ? (
                <tr
                  key={i + item.itemCode}
                  data-group="itemGroup"
                  data-warehouse={item.supplierCode}
                  data-itemtype={item.itemTypeName}
                  className={
                    " eachItem" + (item.isError ? " item-highlight-red" : "")
                  }
                  data-itemid={item.itemID}
                >
                  <td className="fs-10">
                    <b>
                      <i>{item.itemCode}</i>
                    </b>{" "}
                    <br />
                    {item.itemName}
                  </td>
                  <td className="fs-10">{item.supplierName}</td>
                  <td className="fs-10 text-center">
                    {StringHelper.formatPrice(item.lastSales)}
                  </td>
                  <td className="fs-10 text-center">
                    {item.outOfStock !== null &&
                      StringHelper.formatQty(item.outOfStock)}
                  </td>
                  <td className="fs-10 text-center">
                    {StringHelper.formatQty(item.disposalQty)}
                  </td>
                  {/* {
                                                this.isAllowUpdate ? 
                                                <td className={"fs-10 text-center " + StringHelper.highLightNegative(item.soh)} style={{background: "ivory"}}>
                                                    {
                                                        StringHelper.formatValue(item.pog)
                                                    }
                                                </td> : null
                                            }
                                            {
                                                this.isAllowUpdate ? 
                                                <td className={"fs-10 text-center " + StringHelper.highLightNegative(item.soh)} style={{background: "ivory"}}>
                                                    {
                                                        this.isHasSOH ?
                                                        StringHelper.formatValue(item.soh)
                                                        : 
                                                        <>
                                                            <div className="spinner-border text-primary" role="status">
                                                                <span className="sr-only">Loading...</span>
                                                            </div>
                                                        </>
                                                    }
                                                </td> : null
                                            } */}

                  <td className="fs-10 text-center">
                    {StringHelper.formatQty(item.estRCV)}
                  </td>

                  <td className="fs-10 rule-number">
                    {StringHelper.escapeQty(item.qty)}
                  </td>
                  <td className="fs-10">{item.unit}</td>
                  <td className="fs-10 text-center">
                    {item.adq ? StringHelper.formatValue(item.adq) : " - "}
                  </td>
                  <td
                    className={
                      "fs-10 text-center " + this.highLightText(item.class)
                    }
                  >
                    {item.class}{" "}
                  </td>
                  <td className={"fs-10 text-center "}>
                    {this.showIconTrend(item.class)}{" "}
                  </td>
                  {/* <td className={"fs-10 text-center " + this.handleHighlight(item.movCal)}>{StringHelper.formatPrice(item.movCal)}</td> */}
                  <td className="fs-10 text-center">
                    {DateHelper.displayDate(item.deliveryDate)}
                  </td>
                  <td className="fs-10">
                    {DateHelper.nextDate(this.io.orderDate, item.orderDays)}
                  </td>
                </tr>
              ) : null,
            )}
          </tbody>
        </table>
      </section>
    );
  }
}

export default PPIO;
