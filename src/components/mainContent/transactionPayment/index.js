//Plugin
import $ from "jquery";
import React from "react";
import DatePicker from "react-datepicker";

//Custom
import BaseComponent from "components/BaseComponent";
import { DateHelper, FileHelper, PageHelper, StringHelper } from "helpers";
import TransactionPaymentModel from "models/TransactionPaymentModel";

class TransactionPayment extends BaseComponent {
  constructor(props) {
    super(props);
    this.idComponent = "transactionPayment" + StringHelper.randomKey();
    this.idImport = "import" + StringHelper.randomKey();

    this.content = null;
    this.importData = [];

    this.fieldSelected = this.assignFieldSelected({
      date: new Date(),
    });

    this.isAutoload = PageHelper.updateFilters(
      this.fieldSelected,
      function (filters) {
        if (filters["date"]) {
          filters["date"] = new Date(filters["date"]);
        }

        return true;
      },
    );

    this.isRender = true;
  }

  finishUploadFile = (textFile) => {
    this.importData = textFile;
    this.refresh();
  };

  cancel = () => {
    this.importData = null;
    $("#" + this.idImport).val(this.importData);
  };

  isValidForSend() {
    return this.importData != null && this.importData.length != 0;
  }

  handleSendImport = () => {
    const fields = this.fieldSelected;

    let stockImport = [];
    if (!this.isValidForSend()) {
      this.showAlert("Please choose file CSV");
      return;
    }

    stockImport = this.importData.map((item) => {
      let itemSplit = item.split(",");
      return itemSplit;
    });

    let obj = {
      date: fields.date !== "" ? DateHelper.displayDateFormat(fields.date) : "",
      list: stockImport,
    };

    var model = new TransactionPaymentModel();
    model.importTransaction(obj).then((response) => {
      if (response.status) {
        this.showAlert("File was sent", "success");
        this.cancel();
      } else {
        this.showAlert(response.message || "Can not import file");
      }
    });
  };

  renderFields() {
    return (
      <div className="form-filter">
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label className="w100pc">
                <span style={{ paddingRight: 10 }}>File csv:</span>
                {/* <a title="Download file csv" href="https://api.gs25.com.vn:8091/storemanagement/share/template/io/IOTemplate.csv" target="_blank"><FontAwesomeIcon icon={faQuestionCircle}/>Download File CSV</a> */}
              </label>
              <input
                type="file"
                className="form-control form-control-file"
                id={this.idImport}
                onChange={(e) =>
                  FileHelper.uploadFiles(e, this.finishUploadFile)
                }
                accept=".csv"
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label className="w100pc">Date :</label>
              <DatePicker
                placeholderText="-- --"
                selected={this.fieldSelected.date}
                onChange={(value) =>
                  this.handleChangeFieldCustom("date", value)
                }
                dateFormat="dd/MM/yyyy"
                className="form-control"
                autoComplete="off"
                maxDate={new Date()}
                isClearable={this.fieldSelected.date ? true : false}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderComp() {
    return <section id={this.idComponent}>{this.renderFields()}</section>;
  }
}

export default TransactionPayment;
