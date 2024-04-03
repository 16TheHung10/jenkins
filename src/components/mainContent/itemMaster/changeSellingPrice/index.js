import React from 'react';
import BaseComponent from 'components/BaseComponent';
import $ from 'jquery';
import { FileHelper, StringHelper, ExportHelper } from 'helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import ItemMasterModel from 'models/ItemMasterModel';
import Moment from 'moment';
import DownloadModel from 'models/DownloadModel';

export default class ItemMasterChangeSalePrice extends BaseComponent {
  constructor(props) {
    super(props);
    this.idComponent = 'itemImportSelling' + StringHelper.randomKey();
    this.importData = [];
    this.itemMasterChangeSalePriceImports = [];
    this.isValidateSuccess = true;
    this.priceItemMaster = [];
    this.suppliers = {};
    this.divisions = {};
    this.groups = {};
    this.subclasses = {};
    this.disabledImport = true;
    this.itemsPromotionMarketing = [];
    this.isRender = true;
  }
  componentWillReceiveProps(newProps) {
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

    this.refresh();
  }
  uploadXlsxFile = (event) => {
    let result = FileHelper.uploadXlsxFile(event, this.finishUploadFile);
    if (!result) {
      this.itemMasterChangeSalePriceImports = [];
      this.disabledImport = true;
    }
    this.refresh();
  };
  finishUploadFile = (textFile) => {
    this.importData = textFile;
    if (this.importData.length > 100) {
      this.showAlert('Import tối đa 100 item mỗi lần.');
      return;
    }

    let itemMasterChangeSalePriceImports = [];
    if (this.importData.length > 0) {
      let itemMasterChangeSalePrice = {};
      for (var i in this.importData) {
        let item = this.importData[i];
        let index = parseInt(i);

        if (Object.keys(this.importData[i]).length === 3) {
          // if (Moment(this.importData[i].AppliedDate, 'DD/MM/YYYY') < Moment()) {
          //     this.showAlert("Applied date line " + (index + 1) + " is smaller than now");
          //     this.disabledImport = true;
          //     this.itemMasterChangeSalePriceImports = [];
          //     this.refresh();
          //     return;
          // }
          itemMasterChangeSalePrice = {
            BarCode: item.Barcode,
          };
          itemMasterChangeSalePriceImports.push(itemMasterChangeSalePrice);
        } else {
          this.showAlert('Line ' + (index + 1) + ' do not enough column');
          this.itemMasterChangeSalePriceImports = [];
          this.disabledImport = true;
          this.refresh();
          return;
        }
      }
    }
    let valueArr = itemMasterChangeSalePriceImports.map(function (item) {
      return item.BarCode;
    });
    let isDuplicate = valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) !== idx;
    });
    this.disabledImport = isDuplicate;
    if (isDuplicate) {
      this.showAlert('File import duplicate item');
    }
    this.itemMasterChangeSalePriceImports = [];
    this.refresh();
  };
  // componentDidMount() {
  //     this.handleGetDataCommon();
  // }
  handleGetPriceItemMaster = async (barcode) => {
    let model = new ItemMasterModel();
    let params = { barCode: barcode };
    await model.getPriceIM(params).then((response) => {
      if (response.status && response.data.priceItemMaster) {
        this.priceItemMaster = response.data.priceItemMaster;
      }
    });
  };
  handleGetItemPromotionMarketing = async (fromDate) => {
    let model = new ItemMasterModel();
    let params = { fromDate: fromDate };
    await model.getItemsPromotionMarketing(params).then((response) => {
      if (response.status && response.data.itemPromotionMarketings) {
        this.itemsPromotionMarketing = response.data.itemPromotionMarketings;
      }
    });
  };
  // handleGetDataCommon = async () => {
  //     let commonModel = new CommonModel();
  //     await commonModel.getData("supplier,division,group,subclass").then((response) => {
  //         if (response.status) {
  //             this.suppliers = response.data.suppliers;
  //             this.divisions = response.data.divisions;
  //             this.groups = response.data.groups;
  //             this.subclasses = response.data.subclasses;

  //         }
  //     });
  // }
  handleImportChangeCost = async () => {
    this.itemMasterChangeSalePriceImports = [];
    if (this.importData.length > 0) {
      let itemMasterChangeSalePrice = {};
      for (var i in this.importData) {
        let item = this.importData[i];
        itemMasterChangeSalePrice = {
          BarCode: item.Barcode.trim(),
          Name: '',
          WholesaleNew: item.SellingPrice,
          RetailsaleNew: item.SellingPrice,
          AppliedDate: Moment(item.AppliedDate, 'DD/MM/YYYY').format('YYYY/MM/DD'),
        };
        this.itemMasterChangeSalePriceImports.push(itemMasterChangeSalePrice);
      }
      await this.handleGetPriceItemMaster(
        this.itemMasterChangeSalePriceImports
          .map((i) => {
            return i.BarCode;
          })
          .join()
      );
      await this.handleGetItemPromotionMarketing(
        Moment(
          Math.min(
            ...this.itemMasterChangeSalePriceImports.map((i) => {
              return Moment(i.AppliedDate);
            })
          )
        ).format('YYYY-MM-DD')
      );
      this.refresh();
    }
  };
  checkExistItemPromotionMarketing = (barcode, dateApplied) => {
    let valueTemp = this.itemsPromotionMarketing.filter((i) => i.barcode === barcode);
    if (valueTemp.length === 0) {
      return false;
    }
    for (let i = 0; i < valueTemp.length; i++) {
      if (Moment(dateApplied) >= Moment(valueTemp[i].fromDate) && Moment(dateApplied) <= Moment(valueTemp[i].toDate)) {
        return true;
      }
    }
    return false;
  };
  handleSave = () => {
    if (this.itemMasterChangeSalePriceImports.length > 0) {
      if (this.itemMasterChangeSalePriceImports.filter((i) => i.IsValidate === false).length > 0) {
        this.showAlert('Import file invalid');
        return;
      }
      let model = new ItemMasterModel();
      model
        .importChangeSalePriceIM({
          SalePriceItemMasterImports: this.itemMasterChangeSalePriceImports,
        })
        .then((response) => {
          if (response.status && response.status === 1) {
            this.showAlert('Import successfully!', 'success');
          } else {
            this.showAlert('Import Fail');
          }
          this.refresh();
        });
    } else {
      this.showAlert('Please import file');
    }
  };
  validateDate(value, format = '') {
    if (Moment(value, format).format(format) === 'Invalid date' || Moment(value, format) < Moment()) {
      return false;
    }
    return true;
  }
  validatePrice(value) {
    let reg = new RegExp('^([0-9]*[.])?[0-9]+$');
    if (!reg.test(value)) {
      return false;
    }
    return true;
  }

  getItemName(barcode) {
    if (this.priceItemMaster.length > 0) {
      let temp = this.priceItemMaster.reduce((a, v) => ({ ...a, [v.barcode]: v }), {});
      return temp[barcode] ? temp[barcode].itemName : 'Unknow';
    }
    return 'Unknow';
  }

  getSupplier(barcode) {
    if (Object.keys(this.suppliers).length > 0) {
      let temp = this.priceItemMaster.reduce((a, v) => ({ ...a, [v.barcode]: v }), {});
      let supplierCode = temp[barcode] ? temp[barcode].supplierCode : '';
      if (supplierCode === '') {
        return 'Unknow';
      }
      return (
        (this.suppliers['S' + supplierCode] ? this.suppliers['S' + supplierCode].supplierCode : '') +
        '-' +
        (this.suppliers['S' + supplierCode] ? this.suppliers['S' + supplierCode].supplierName : '')
      );
    }
    return 'Unknow';
  }

  getDivision(barcode) {
    if (Object.keys(this.divisions).length > 0) {
      let temp = this.priceItemMaster.reduce((a, v) => ({ ...a, [v.barcode]: v }), {});
      let divisionCode = temp[barcode] ? temp[barcode].divisionCode : '';
      if (divisionCode === '') {
        return 'Unknow';
      }

      return (
        (this.divisions[divisionCode] ? this.divisions[divisionCode].divisionCode : '') +
        '-' +
        (this.divisions[divisionCode] ? this.divisions[divisionCode].divisionName : '')
      );

      // return this.divisions[this.priceItemMaster.filter(i => i.barcode === barcode).map(i => i.divisionCode).join()].divisionCode
      //     + '-' +
      //     this.divisions[this.priceItemMaster.filter(i => i.barcode === barcode).map(i => i.divisionCode).join()].divisionName
    }
    return 'Unknow';
  }

  getCategory(barcode) {
    if (Object.keys(this.groups).length > 0) {
      let temp = this.priceItemMaster.reduce((a, v) => ({ ...a, [v.barcode]: v }), {});
      let groupCode = temp[barcode] ? temp[barcode].groupCode : '';
      if (groupCode === '') {
        return 'Unknow';
      }

      return (
        (this.groups[groupCode] ? this.groups[groupCode].groupCode : '') +
        '-' +
        (this.groups[groupCode] ? this.groups[groupCode].groupName : '')
      );

      // return this.groups[this.priceItemMaster.filter(i => i.barcode === barcode).map(i => i.groupCode).join()].groupCode
      //     + '-' +
      //     this.groups[this.priceItemMaster.filter(i => i.barcode === barcode).map(i => i.groupCode).join()].groupName
    }
    return 'Unknow';
  }

  getSubCategory(barcode) {
    if (Object.keys(this.subclasses).length > 0) {
      let temp = this.priceItemMaster.reduce((a, v) => ({ ...a, [v.barcode]: v }), {});
      let subCategoryCode = temp[barcode] ? temp[barcode].subCategoryCode : '';
      if (subCategoryCode === '') {
        return 'Unknow';
      }

      return (
        (this.subclasses[subCategoryCode] ? this.subclasses[subCategoryCode].subClassCode : '') +
        '-' +
        (this.subclasses[subCategoryCode] ? this.subclasses[subCategoryCode].subClassName : '')
      );

      // return this.subclasses[this.priceItemMaster.filter(i => i.barcode === barcode).map(i => i.subCategoryCode).join()].subClassCode
      //     + '-' +
      //     this.subclasses[this.priceItemMaster.filter(i => i.barcode === barcode).map(i => i.subCategoryCode).join()].subClassName
    }
    return 'Unknow';
  }

  getSalePriceOld(barcode) {
    if (this.priceItemMaster.length > 0) {
      let temp = this.priceItemMaster.reduce((a, v) => ({ ...a, [v.barcode]: v }), {});
      return temp[barcode] ? temp[barcode].salesPrice : 'Unknow';
    }
    return 'Unknow';
  }

  handleDeleteItem = () => {
    let itemOptionChecked = $('#' + this.idComponent).find("[name='itemOption']:checked");
    if ($(itemOptionChecked).length > 0) {
      for (var k = 0; k < $(itemOptionChecked).length; k++) {
        for (var k2 = 0; k2 < this.itemMasterChangeSalePriceImports.length; k2++) {
          if (this.itemMasterChangeSalePriceImports[k2].BarCode === $(itemOptionChecked[k]).val()) {
            this.itemMasterChangeSalePriceImports.splice(k2, 1);
            $(itemOptionChecked[k]).prop('checked', false);
            break;
          }
        }
      }

      $('#' + this.idComponent)
        .find("[name='optAll']")
        .prop('checked', false);

      this.refresh();
    } else {
      this.showAlert('Please select at least one item');
    }
  };
  handleClickMarketing = () => {
    this.itemMasterChangeSalePriceImports.sort((x, y) =>
      x.IsDuplicateItemPromotionMarketing === y.IsDuplicateItemPromotionMarketing
        ? 0
        : x.IsDuplicateItemPromotionMarketing
        ? -1
        : 1
    );
    this.refresh();
  };
  handleExportItemConflictMarketing = () => {
    let dataExportTemp = this.itemMasterChangeSalePriceImports.filter((i) => i.IsDuplicateItemPromotionMarketing);
    let dataExport = [];
    for (let i in dataExportTemp) {
      let item = dataExportTemp[i];
      let temp = {
        Barcode: item.BarCode,
        Name: item.Name,
        Supplier: item.Supplier,
        Division: item.Division,
        Category: item.Category,
        SubCategory: item.SubCategory,
        SellingPriceOld: String(item.SalePriceOld),
        SellingPriceNew: String(item.RetailsaleNew),
        SellingPromotion: String(
          item.SalePriceOld - this.itemsPromotionMarketing.filter((i) => i.barcode === item.BarCode)[0].discount
        ),
        FromDate: Moment(this.itemsPromotionMarketing.filter((i) => i.barcode === item.BarCode)[0].fromDate).format(
          'DD/MM/YYYY'
        ),
        ToDate: Moment(this.itemsPromotionMarketing.filter((i) => i.barcode === item.BarCode)[0].toDate).format(
          'DD/MM/YYYY'
        ),
        PromotionName: String(this.itemsPromotionMarketing.filter((i) => i.barcode === item.BarCode)[0].promotionName),
      };
      dataExport.push(temp);
    }

    let params = {
      values: dataExport,
      type: 'ItemConflictMarketing',
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
    for (let i in this.itemMasterChangeSalePriceImports) {
      this.itemMasterChangeSalePriceImports[i]['Name'] = this.getItemName(
        this.itemMasterChangeSalePriceImports[i].BarCode
      );
      this.itemMasterChangeSalePriceImports[i]['Supplier'] = this.getSupplier(
        this.itemMasterChangeSalePriceImports[i].BarCode
      );
      this.itemMasterChangeSalePriceImports[i]['Division'] = this.getDivision(
        this.itemMasterChangeSalePriceImports[i].BarCode
      );
      this.itemMasterChangeSalePriceImports[i]['Category'] = this.getCategory(
        this.itemMasterChangeSalePriceImports[i].BarCode
      );
      this.itemMasterChangeSalePriceImports[i]['SubCategory'] = this.getSubCategory(
        this.itemMasterChangeSalePriceImports[i].BarCode
      );
      this.itemMasterChangeSalePriceImports[i]['SalePriceOld'] = this.getSalePriceOld(
        this.itemMasterChangeSalePriceImports[i].BarCode
      );
      this.itemMasterChangeSalePriceImports[i]['IsDuplicateItemPromotionMarketing'] =
        this.checkExistItemPromotionMarketing(
          this.itemMasterChangeSalePriceImports[i].BarCode,
          this.itemMasterChangeSalePriceImports[i].AppliedDate
        );
      this.itemMasterChangeSalePriceImports[i]['IsValidate'] =
        this.validatePrice(this.itemMasterChangeSalePriceImports[i].RetailsaleNew) &&
        this.validateDate(this.itemMasterChangeSalePriceImports[i].AppliedDate, 'YYYY/MM/DD') &&
        this.itemMasterChangeSalePriceImports.filter((i) => i.IsDuplicateItemPromotionMarketing).length === 0;
    }
    return (
      <>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <label className="w100pc">
                    <span style={{ paddingRight: 10 }}>File xls:</span>
                    <a
                      title="Download file csv"
                      href="https://api.gs25.com.vn:8091/storemanagement/share/template/itemMaster/SalePrice.xls"
                      target="_blank"
                    >
                      <FontAwesomeIcon icon={faQuestionCircle} />
                      Download File xls
                    </a>
                  </label>
                  <input
                    type="file"
                    className="form-control form-control-file"
                    id={this.idImport}
                    onChange={(e) => this.uploadXlsxFile(e)}
                    accept=".xls"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group" style={{ marginTop: 28 }}>
                  <button
                    type="button"
                    className="btn btn-success"
                    disabled={this.disabledImport}
                    onClick={this.handleImportChangeCost}
                  >
                    Import
                  </button>
                </div>
              </div>
              <div className="col-md-6">
                <div className="bg-note cl-red">
                  <p style={{ margin: 0 }}>Ngày áp dụng đổi giá phải sau ngày hiện tại</p>
                  <p style={{ margin: 0 }}>Item có thông tin "Unknow": Barcode không tồn tại trong hệ thống</p>
                  <p style={{ margin: 0 }}>Đỗi giá bán chỉ apply vào ngày thứ 3 tuần tiếp theo</p>
                  <p style={{ margin: 0 }}>Item có thông tin Màu đỏ: sai format</p>
                  <p style={{ margin: 0 }}>
                    Item có thông tin Màu vàng: item đang trong chung trình promotion của marketing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <button type="button" className="btn btn-success" onClick={this.handleDeleteItem}>
              Delete Item
            </button>
            {this.itemMasterChangeSalePriceImports.filter((i) => i.IsDuplicateItemPromotionMarketing).length > 0 && (
              <button type="button" className="btn btn-success" onClick={this.handleExportItemConflictMarketing}>
                Export Conflict
              </button>
            )}
          </div>

          <div className="col-md-3">
            {this.itemMasterChangeSalePriceImports.filter((i) => i.IsDuplicateItemPromotionMarketing).length > 0 && (
              <a href="#" onClick={this.handleClickMarketing}>
                Item conflict promotion marketing:{' '}
                {this.itemMasterChangeSalePriceImports.filter((i) => i.IsDuplicateItemPromotionMarketing).length}
              </a>
            )}
          </div>
          <div className="col-md-6">
            <p style={{ float: 'right' }}>Total Item(s): {this.itemMasterChangeSalePriceImports.length}</p>
          </div>
        </div>
        <div className="row" id={this.idComponent} style={{ paddingTop: '10px' }}>
          <div className="col-md-12">
            <div className="wrap-table htable w-fit" style={{ maxHeight: 'calc(100vh - 290px)' }}>
              <table className="table table-hover detail-search-rcv w-fit" style={{ fontSize: 11 }}>
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox" onClick={this.handleCheckAll} name="optAll" />
                    </th>
                    <th className="w10">No.</th>
                    <th>BarCode</th>
                    <th>Name</th>
                    <th>Supplier</th>
                    <th>Division</th>
                    <th>Category</th>
                    <th>Sub Category</th>
                    <th className="text-center">
                      Old <br /> Selling
                    </th>
                    <th className="text-center">
                      New <br /> Selling
                    </th>
                    <th>Applied Date</th>
                  </tr>
                </thead>
                <tbody>
                  {this.itemMasterChangeSalePriceImports.map((item, i) => (
                    <tr
                      key={i}
                      style={{
                        color: item.IsDuplicateItemPromotionMarketing ? '#DAA520' : '',
                      }}
                    >
                      <td className="w10">
                        <input type="checkbox" name="itemOption" value={item.BarCode} />
                      </td>
                      <td>{i + 1}</td>
                      <td>{item.BarCode}</td>
                      <td>
                        <p>{item.Name}</p>
                      </td>
                      <td>{item.Supplier}</td>
                      <td>{item.Division}</td>

                      <td>{item.Category}</td>
                      <td>{item.SubCategory}</td>
                      <td className="text-center" style={{ background: 'ivory' }}>
                        {item.SalePriceOld !== 'Unknow' ? StringHelper.formatPrice(item.SalePriceOld) : 'Unknow'}
                      </td>
                      <td
                        className="text-center"
                        style={{
                          background: this.validatePrice(item.RetailsaleNew) ? 'ivory' : 'red',
                        }}
                      >
                        {this.validatePrice(item.RetailsaleNew)
                          ? StringHelper.formatPrice(item.RetailsaleNew)
                          : item.RetailsaleNew}
                      </td>
                      <td
                        className="text-center"
                        style={{
                          color: this.validateDate(item.AppliedDate, 'YYYY/MM/DD') ? '' : 'red',
                        }}
                      >
                        {Moment(item.AppliedDate).format('MM/DD/YYYY')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  }
}
