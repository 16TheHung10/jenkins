//Plugin
import React from 'react';
import Select from 'react-select';
import BaseComponent from 'components/BaseComponent';
import TableListDetailBillCancel from 'components/mainContent/dashBoard/TableListDetailBillCancel';
import { decreaseDate } from 'helpers/FuncHelper';
import { createListOption } from 'helpers/FuncHelper';

export default class CancelBill extends BaseComponent {
  constructor(props) {
    super(props);

    // chart data
    this.defaultDate = decreaseDate(1);

    this.items = [];
    //Data Selected

    this.optFilInvoiceCancel = [];
    this.optFilEmployeeCancel = [];

    this.fieldSelected = this.assignFieldSelected(
      {
        starCancel: '',
        dateCancel: this.defaultDate,
        invoiceTypeCancel: '',
        methodcodeBillCancel: '',
        employeecodeBillDetailCancel: '',
        invoiceBillDetailCancel: '',
        customerNumberCancel: '',
        counterFCancel: '',
        noteDetailCancel: '',
      },
      ['storeCode']
    );

    this.page = 1;

    this.isRender = true;
  }

  componentDidMount() {}

  componentWillReceiveProps(newProps) {
    if (this.items !== newProps.items) {
      this.items = newProps.items;
    }
  }

  // handleSearchAllDetailBillCancel = async () => {
  //     let storeCode = this.fieldSelected.storeCode;
  //     if (storeCode === "") {
  //         this.showAlert("Please choose store");
  //         return false;
  //     }

  //     let page = "/storesale/"+storeCode+"/transaction/void";
  //     let params = {
  //         start: (this.fieldSelected.starCancel && DateHelper.displayDateFormatMinus(this.fieldSelected.starCancel)) || "",
  //         date: (this.fieldSelected.dateCancel && DateHelper.displayDateFormatMinus(this.fieldSelected.dateCancel)) || ""
  //     }

  //     let model = new ReportingModel();

  //     await model.getAllReviewSale(page,params).then( res =>{
  //         if (res.status && res.data) {
  //             if (res.data.sale) {
  //                 this.items = res.data.sale || [];

  //                 this.optFilInvoiceCancel = createListOption(this.items,'invoiceCode');
  //                 this.optFilEmployeeCancel = createListOption(this.items,'employeeCode','employeeName');
  //             }
  //             else {
  //                 this.showAlert("Empty data!");
  //             }
  //         }
  //         else {
  //             this.showAlert("System busy!");
  //         }
  //     });

  //     let dateDetail = (this.fieldSelected.dateCancel && DateHelper.displayDateFormatMinus(this.fieldSelected.dateCancel)) || "";
  //     model.checkStatusAPIsale(storeCode,dateDetail).then(response=>{
  //         if (response && response.data && response.data.storeStatus) {
  //             if (response.data.note ) {
  //                 this.fieldSelected.noteDetailCancel = response.data.note;
  //                 this.refresh();
  //             }
  //         }
  //     });

  //     this.refresh();
  // };

  handleFilterBillCancel = (lst) => {
    let arr = [];

    arr =
      lst.length > 0 && this.fieldSelected.invoiceBillDetailCancel !== ''
        ? lst.filter((a) => a.invoiceCode === this.fieldSelected.invoiceBillDetailCancel)
        : lst;
    arr =
      arr.length > 0 && this.fieldSelected.employeecodeBillDetailCancel !== ''
        ? arr.filter((a) => a.employeeCode === this.fieldSelected.employeecodeBillDetailCancel)
        : arr;

    return arr;
  };

  // ----------------------------------------------------

  handleClickPaging = (page) => {
    this.page = page;
    this.refresh();
  };

  // ----------------------------------------------------

  renderComp() {
    let items = this.handleFilterBillCancel(this.items);
    this.optFilInvoiceCancel = createListOption(this.items, 'invoiceCode');
    this.optFilEmployeeCancel = createListOption(this.items, 'employeeCode', 'employeeName');

    return (
      <>
        <div className="row mrt-5">
          <div className="col-md-4">
            <label htmlFor="invoiceBillDetailCancel" className="w100pc">
              Invoice code
            </label>
            <Select
              isClearable
              classNamePrefix="select"
              name="invoiceBillDetailCancel"
              maxMenuHeight={260}
              placeholder="--"
              value={this.optFilInvoiceCancel.filter(
                (option) => option.value === this.fieldSelected.invoiceBillDetailCancel
              )}
              options={this.optFilInvoiceCancel}
              onChange={(e) => this.handleChangeFieldCustom('invoiceBillDetailCancel', e ? e.value : '')}
            />
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="employeecodeBillDetailCancel" className="w100pc">
                Employee
              </label>

              <Select
                isClearable
                classNamePrefix="select"
                name="employeecodeBillDetailCancel"
                maxMenuHeight={260}
                placeholder="--"
                value={this.optFilEmployeeCancel.filter(
                  (option) => option.value === this.fieldSelected.employeecodeBillDetailCancel
                )}
                options={this.optFilEmployeeCancel}
                onChange={(e) => this.handleChangeFieldCustom('employeecodeBillDetailCancel', e ? e.value : '')}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <TableListDetailBillCancel items={items} />
          </div>
        </div>
      </>
    );
  }
}
