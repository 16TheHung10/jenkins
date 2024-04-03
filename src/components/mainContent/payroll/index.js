//Plugin
import $ from "jquery";
import React from "react";

//Custom
import BaseComponent from "components/BaseComponent";
import { FileHelper, StringHelper } from "helpers";
import PayrollModel from "models/PayrollModel";

class Payroll extends BaseComponent {
  constructor(props) {
    super(props);
    this.idComponent = "payroll" + StringHelper.randomKey();
    this.idImportPayroll = "importPayroll" + StringHelper.randomKey();
    this.idImportEmployee = "importEmployee" + StringHelper.randomKey();
    this.isRender = true;
    this.isUseSMS = props.type == "ho";
    this.payrollContent = null;
    this.employeeContent = null;
  }

  componentWillReceiveProps(newProps) {
    if (this.props.type !== newProps.type) {
      this.isUseSMS = newProps.type == "ho";
    }
    this.refresh();
  }

  handleFinishUploadPayrollFile = (csvContent, msg) => {
    if (csvContent === null) {
      this.showAlert(msg);
    }
    this.payrollContent = csvContent || [];
  };

  handleFinishUploadEmployeeFile = (csvContent, msg) => {
    if (csvContent === null) {
      this.showAlert(msg);
    }
    this.employeeContent = csvContent || [];
  };

  handleNextImportEmployee = () => {
    if (this.payrollContent == null || this.payrollContent.length == 0) {
      this.showAlert("Please upload file");
      return;
    }
    var parent = $("#" + this.idComponent);
    parent.find("[data-group='payroll-form']").hide();
    parent.find("[data-group='employee-form']").show();
  };

  handleCancelPayroll = () => {
    this.cancel();
  };

  cancel = () => {
    this.employeeContent = null;
    this.payrollContent = null;
    $("#" + this.idImportEmployee).val(this.employeeContent);
    $("#" + this.idImportPayroll).val(this.payrollContent);
    var parent = $("#" + this.idComponent);
    parent.find("[data-group='payroll-form']").show();
    parent.find("[data-group='employee-form']").hide();
  };

  isValidForSend() {
    if (this.isUseSMS) {
      return (
        this.payrollContent != null &&
        this.payrollContent.length != 0 &&
        this.employeeContent != null &&
        this.employeeContent.length != 0
      );
    } else {
      return this.payrollContent != null && this.payrollContent.length != 0;
    }
  }

  handleSendPayroll = () => {
    if (!this.isValidForSend()) {
      this.showAlert("Please upload file");
      return;
    }

    var model = new PayrollModel();
    model
      .importPayroll({
        payrollContent: this.payrollContent,
        employeeContent: this.employeeContent,
        isSMS: this.isUseSMS ? 1 : 0,
      })
      .then((response) => {
        if (response.status) {
          this.showAlert("File was sent", "success");
          this.cancel();
        } else {
          this.showAlert(response.message || "Can not import file");
        }
      });
  };

  renderFilter() {
    if (this.isUseSMS) {
      return this.renderFilterHO();
    } else {
      return this.renderFilterStore();
    }
  }

  renderFilterStore() {
    return (
      <div className="form-filter bgpayroll">
        <div className="row">
          <div className="col-md-4" data-group="payroll-form">
            <div className="form-group">
              <label className="w100pc">Upload payrol:</label>
              <input
                type="file"
                className="form-control form-control-file"
                id={this.idImportPayroll}
                onChange={(e) =>
                  FileHelper.uploadExcelFiles(
                    e,
                    this.handleFinishUploadPayrollFile,
                  )
                }
                accept=".xlsx"
              />
              .XLS Format (include header)
            </div>
            <button
              type="button"
              className="btn btn-success"
              onClick={this.handleSendPayroll}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderFilterHO() {
    return (
      <div className="form-filter bghopayroll">
        <div className="row">
          <div className="col-md-4" data-group="payroll-form">
            <div className="form-group">
              <label className="w100pc">Upload payrol:</label>
              <input
                type="file"
                className="form-control form-control-file"
                id={this.idImportPayroll}
                onChange={(e) =>
                  FileHelper.uploadExcelFiles(
                    e,
                    this.handleFinishUploadPayrollFile,
                  )
                }
                accept=".xlsx"
              />
              .XLS Format (include header)
            </div>
            <div className="form-group">
              <button
                type="button"
                className="btn btn-success"
                onClick={this.handleNextImportEmployee}
              >
                Next
              </button>
            </div>
          </div>
          <div
            className="col-md-4"
            style={{ display: "none" }}
            data-group="employee-form"
          >
            <div className="form-group">
              <label className="w100pc">
                Upload employee to receive access code:
              </label>
              <input
                type="file"
                className="form-control form-control-file"
                id={this.idImportEmployee}
                onChange={(e) =>
                  FileHelper.uploadExcelFiles(
                    e,
                    this.handleFinishUploadEmployeeFile,
                  )
                }
                accept=".xlsx"
              />
              .XLS Format (include header)
            </div>
            <div className="form-group">
              <button
                type="button"
                className="btn btn-success"
                onClick={this.handleSendPayroll}
              >
                Send
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={this.handleCancelPayroll}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderComp() {
    return <section id={this.idComponent}>{this.renderFilter()}</section>;
  }
}

export default Payroll;
