//Plugin
import React from "react";

//Custom
import BaseComponent from "components/BaseComponent";
import { StringHelper } from "helpers";
// import StockTakeModel from 'models/StockTakeModel';

class PPPO extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent =
      this.props.idComponent || "ppEdit" + StringHelper.randomKey();

    //Default data
    this.itemEdit = [];
    this.po = {};
    // this.fieldSelected.stockDateEdit = this.itemEdit && this.itemEdit.date && this.itemEdit.time ? new Date(this.itemEdit.date+"T"+this.itemEdit.time) : "";
    // this.fieldSelected.note = this.itemEdit && this.itemEdit.note ? this.itemEdit.note : "";

    this.isRender = true;
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
    if (this.po !== newProps.po) {
      this.po = newProps.po;
    }
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

  renderComp() {
    return (
      <section
        id={this.idComponent}
        className="popup-form popup-form-additem"
        style={{ minHeight: 300, width: "auto" }}
      >
        <div className="wrap-tb of-initial">
          <table
            className="table table-hover cl-blue d-block of-auto"
            style={{ width: "auto", maxHeight: "calc(100vh - 254px)" }}
          >
            <thead>
              <tr>
                <th className="w10">Barcode</th>
                <th>Name</th>
                <th>Unit</th>
                {/* <th>Order days</th>
								<th>Class</th> */}
                <th className="rule-number">Qty</th>
                <th className="rule-number">MOQ</th>
                <th className="rule-number">Cost</th>
                <th className="rule-number">Value</th>
                <th className="rule-number">Max qty</th>
                <th className="rule-number">MOV</th>
                {!this.po.approved && !this.po.canCel ? (
                  <th className="rule-number">Discount</th>
                ) : null}
                <th className="rule-number">Total amount</th>
              </tr>
            </thead>
            <tbody>
              {this.itemEdit.map((item, i) => (
                <tr key={i} data-group="itemGroup" data-itemid={item.itemID}>
                  <td>{item.itemCode}</td>
                  <td>{item.itemName}</td>
                  <td>{item.unit}</td>
                  <td className="rule-number">
                    {StringHelper.formatQty(item.qty)}
                  </td>

                  <td className="rule-number">
                    {StringHelper.formatPrice(item.moq)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatPrice(item.costPrice)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatPrice(item.totalPrice)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatQty(item.qtyMax)}
                  </td>
                  <td className="rule-number">
                    {StringHelper.formatPrice(item.movCal)}
                  </td>

                  {!this.po.approved && !this.po.canCel ? (
                    <td className="rule-number">
                      {StringHelper.formatQty(item.discount)}
                    </td>
                  ) : null}

                  <td className="rule-number">
                    {StringHelper.formatPrice(item.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {this.itemEdit.length === 0 ? (
            <div className="table-message">Search ...</div>
          ) : (
            ""
          )}
        </div>
      </section>
    );
  }
}

export default PPPO;
