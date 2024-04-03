//Plugin
import React, { Fragment } from 'react';
import Moment from 'moment';
import { ExportHelper, StringHelper } from 'helpers';
import DownloadModel from 'models/DownloadModel';
import BaseComponent from 'components/BaseComponent';
export default class CostPrice extends BaseComponent {
  constructor(props) {
    super(props);
    this.fieldSelected = this.assignFieldSelected({
      fromDate: new Date().setDate(new Date().getDate() - 90),
      toDate: new Date(),
    });
    this.type = props.type;
    this.historyContent = props.historyContent || [];
    this.historyContentRender = [];
    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate());
    this.minDate = this.tomorrow.setDate(this.today.getDate() - 90);
    this.suppliers = {};
    this.divisions = {};
    this.groups = {};
    this.subclasses = {};
    this.isRender = true;
  }

  componentWillReceiveProps(newProps) {
    if (this.historyContent !== newProps.historyContent) {
      this.historyContentRender = newProps.historyContent;
    }
    if (this.suppliers !== newProps.suppliers) {
      this.suppliers = newProps.suppliers;
    }

    if (this.divisions !== newProps.divisions) {
      this.divisions = newProps.divisions;
    }
    if (this.groups !== newProps.groups) {
      this.groups = newProps.groups;
    }
    if (this.subclasses !== newProps.categorySubClasses) {
      this.subclasses = newProps.categorySubClasses;
    }
    if (this.type !== newProps.type) {
      this.type = newProps.type;
    }

    this.refresh();
  }

  getSupplier(supplierCode) {
    if (this.suppliers['S' + supplierCode]) {
      return this.suppliers['S' + supplierCode].supplierCode + '-' + this.suppliers['S' + supplierCode].supplierName;
    }
    return 'Unknow';
  }

  getDivision(divisionCode) {
    if (this.divisions[divisionCode]) {
      return this.divisions[divisionCode].divisionCode + '-' + this.divisions[divisionCode].divisionName;
    }
    return 'Unknow';
  }

  getCategory(groupCode) {
    if (this.groups[groupCode]) {
      return this.groups[groupCode].groupCode + '-' + this.groups[groupCode].groupName;
    }
    return 'Unknow';
  }

  getSubCategory(subCategoryCode) {
    if (this.subclasses[subCategoryCode]) {
      return this.subclasses[subCategoryCode].subClassCode + '-' + this.subclasses[subCategoryCode].subClassName;
    }
    return 'Unknow';
  }
  handleExport = () => {
    let dataExportTemp = this.historyContentRender;

    let dataExport = [];
    for (let i in dataExportTemp) {
      let item = dataExportTemp[i];

      if (this.type === 'cost') {
        let temp = {
          Barcode: item.barcode,
          Name: item.itemName,
          Supplier: this.getSupplier(item.supplierCode),
          Division: this.getDivision(item.divisionCode),
          Category: this.getCategory(item.groupCode),
          SubCategory: this.getSubCategory(item.subCategoryCode),
          OldCost: String(item.costOld),
          NewCost: String(item.costChange),
          AppliedDate: Moment(item.appliedDateCostPriceChange).format('DD/MM/YYYY'),
          CreateBy: item.createBy,
        };
        dataExport.push(temp);
      }
      if (this.type === 'cost-promotion') {
        let temp = {
          Barcode: item.barcode,
          Name: item.itemName,
          Supplier: this.getSupplier(item.supplierCode),
          Division: this.getDivision(item.divisionCode),
          Category: this.getCategory(item.groupCode),
          SubCategory: this.getSubCategory(item.subCategoryCode),
          OriginCost: String(item.originalCost),
          PromotionCost: String(item.fixAmount),
          NormalCost: String(item.costReturn),
          FromDate: Moment(item.fromDate).format('DD/MM/YYYY'),
          ToDate: Moment(item.toDate).format('DD/MM/YYYY'),
          CreateBy: item.createBy,
        };
        dataExport.push(temp);
      }
      if (this.type === 'selling') {
        let temp = {
          Barcode: item.barcode,
          Name: item.itemName,
          Supplier: this.getSupplier(item.supplierCode),
          Division: this.getDivision(item.divisionCode),
          Category: this.getCategory(item.groupCode),
          SubCategory: this.getSubCategory(item.subCategoryCode),
          OldSelling: String(item.salesPriceOld),
          NewSelling: String(item.salesPriceNew),
          AppliedDate: Moment(item.appliedDateSalesPriceChange).format('DD/MM/YYYY'),
          CreateBy: item.createBy,
        };
        dataExport.push(temp);
      }
    }
    let params = {
      values: dataExport,
      type: 'history-' + this.type,
    };
    ExportHelper.getInstance()
      .exportFileXLS(params)
      .then((res) => {
        if (res.status) {
          let downloadModel = new DownloadModel();
          downloadModel.get(res.data.downloadUrl, null, null, '.xls');
        } else {
          this.showAlert(res.message);
        }
      });
  };
  renderComp() {
    return (
      <section>
        <div className="col-md-12">
          <div className="wrap-table htable w-fit" style={{ maxHeight: 'calc(100vh - 310px)' }}>
            <Fragment>
              {this.type === 'cost' && (
                <table className="table table-hover detail-search-rcv w-fit" style={{ fontSize: 11 }}>
                  <thead>
                    <tr>
                      <th className="w10">No.</th>
                      <th>BarCode</th>
                      <th>Name</th>
                      <th>Supplier</th>
                      <th>Division</th>
                      <th>Category</th>
                      <th>Sub Category</th>
                      <th className="text-center">
                        Old <br />
                        Cost
                      </th>
                      <th className="text-center">
                        New
                        <br />
                        Cost
                      </th>
                      <th className="text-center">Applied Date</th>
                      <th className="text-center">
                        Changed <br /> By
                      </th>
                      <th className="text-center">
                        Apply <br /> Franchise
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.historyContentRender
                      .sort((a, b) => Moment(b.appliedDateCostPriceChange) - Moment(a.appliedDateCostPriceChange))
                      .map((item, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{item.barcode}</td>
                          <td>
                            <p>{item.itemName}</p>
                          </td>
                          <td>{this.getSupplier(item.supplierCode)}</td>
                          <td>{this.getDivision(item.divisionCode)}</td>
                          <td>{this.getCategory(item.groupCode)}</td>
                          <td>{this.getSubCategory(item.subCategoryCode)}</td>
                          <td className="text-center">{StringHelper.formatPrice(item.costOld)}</td>
                          <td className="text-center" style={{ background: 'ivory' }}>
                            {StringHelper.formatPrice(item.costChange)}
                          </td>
                          <td className="text-center">
                            {Moment(item.appliedDateCostPriceChange).format('DD/MM/YYYY')}
                          </td>
                          <td>{item.createBy}</td>
                          <td className="text-center">{item.applyFranchise ? 'Y' : 'N'}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </Fragment>
            <Fragment>
              {this.type === 'cost-promotion' && (
                <table className="table table-hover detail-search-rcv" style={{ fontSize: 11 }}>
                  <thead>
                    <tr>
                      <th className="w10">No.</th>
                      <th>BarCode</th>
                      <th>Name</th>
                      <th>Supplier</th>
                      <th>Division</th>
                      <th>Category</th>
                      <th>Sub Category</th>
                      <th className="text-center">
                        Master
                        <br />
                        Cost
                      </th>

                      <th className="text-center">
                        Current <br /> Cost
                      </th>
                      <th className="text-center">
                        Promotion
                        <br />
                        Cost
                      </th>
                      <th className="text-center">From Date</th>
                      <th className="text-center">To Date</th>
                      <th className="text-center">
                        Create <br /> By
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.historyContentRender
                      .sort((a, b) => Moment(b.fromDate) - Moment(a.fromDate))
                      .map((item, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{item.barcode}</td>
                          <td>
                            <p>{item.itemName}</p>
                          </td>
                          <td>{this.getSupplier(item.supplierCode)}</td>
                          <td>{this.getDivision(item.divisionCode)}</td>
                          <td>{this.getCategory(item.groupCode)}</td>
                          <td>{this.getSubCategory(item.subCategoryCode)}</td>
                          <td className="text-center" style={{ background: 'ivory' }}>
                            {StringHelper.formatPrice(item.originalCost)}
                          </td>

                          <td className="text-center" style={{ background: 'ivory' }}>
                            {StringHelper.formatPrice(item.costReturn)}
                          </td>
                          <td className="text-center" style={{ background: 'ivory' }}>
                            {StringHelper.formatPrice(item.fixAmount)}
                          </td>
                          <td>{Moment(item.fromDate).format('DD/MM/YYYY')}</td>
                          <td>{Moment(item.toDate).format('DD/MM/YYYY')}</td>
                          <td>{item.createBy}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </Fragment>
            <Fragment>
              {this.type === 'selling' && (
                <table className="table table-hover detail-search-rcv" style={{ fontSize: 11 }}>
                  <thead>
                    <tr>
                      <th className="w10">No.</th>
                      <th>BarCode</th>
                      <th>Name</th>
                      <th>Supplier</th>
                      <th>Division</th>
                      <th>Category</th>
                      <th>Sub Category</th>
                      <th className="text-center">
                        Old
                        <br />
                        Selling
                      </th>
                      <th className="text-center">
                        New
                        <br />
                        Selling
                      </th>
                      <th className="text-center">Applied Date</th>
                      <th className="text-center">
                        Changed <br /> By
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.historyContentRender
                      .sort((a, b) => Moment(b.appliedDateSalesPriceChange) - Moment(a.appliedDateSalesPriceChange))
                      .map((item, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{item.barcode}</td>
                          <td>
                            <p style={{ margin: 0, width: 200 }}>{item.itemName}</p>
                          </td>
                          <td>{this.getSupplier(item.supplierCode)}</td>
                          <td>{this.getDivision(item.divisionCode)}</td>
                          <td>{this.getCategory(item.groupCode)}</td>
                          <td>{this.getSubCategory(item.subCategoryCode)}</td>
                          <td className="text-center" style={{ background: 'ivory' }}>
                            {StringHelper.formatPrice(item.salesPriceOld)}
                          </td>
                          <td className="text-center" style={{ background: 'ivory' }}>
                            {StringHelper.formatPrice(item.salesPriceNew)}
                          </td>
                          <td>{Moment(item.appliedDateSalesPriceChange).format('DD/MM/YYYY')}</td>
                          <td>{item.createBy}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </Fragment>
          </div>
        </div>
      </section>
    );
  }
}
