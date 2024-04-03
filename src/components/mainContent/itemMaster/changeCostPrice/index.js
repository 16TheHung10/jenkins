import React from 'react';
import $ from 'jquery';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BaseComponent from 'components/BaseComponent';
import { ExportHelper, FileHelper, StringHelper } from 'helpers';
import DownloadModel from 'models/DownloadModel';
import ItemMasterModel from 'models/ItemMasterModel';
import Moment from 'moment';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import AppMessage from 'message/reponse.message';
export default class ChangeCostPrice extends BaseComponent {
  constructor(props) {
    super(props);
    this.idComponent = 'itemImport' + StringHelper.randomKey();
    this.importData = [];
    this.itemMasterChangeCostImports = [];
    this.isValidateSuccess = true;
    this.priceItemMaster = [];
    this.suppliers = props.suppliers || {};
    this.divisions = props.divisions || {};
    this.groups = props.groups || {};
    this.subclasses = props.subclasses || {};
    this.disabledImport = true;
    this.historyCostPormotion = [];
    this.isRender = true;
  }
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
  uploadXlsxFile = (event) => {
    let result = FileHelper.uploadXlsxFile(event, this.finishUploadFile);
    if (!result) {
      this.itemMasterChangeCostImports = [];
      this.disabledImport = true;
    }
    this.refresh();
  };
  finishUploadFile = (textFile) => {
    this.importData = textFile;
    if (this.importData.length > 100) {
      AppMessage.error('Import tối đa 100 item mỗi lần.');
      return;
    }
    let itemMasterChangeCostImports = [];
    if (this.importData.length > 0) {
      let itemMasterChangeCost = {};
      for (var i in this.importData) {
        if (Object.keys(this.importData[i]).length === 4) {
          // if (Moment(this.importData[i].AppliedDate, 'DD/MM/YYYY') < Moment()) {
          //     AppMessage.error("Applied date line " + (i + 1) + " is smaller than now");
          //     this.disabledImport = true;
          //     this.itemMasterChangeCostImports = [];
          //     this.refresh();
          //     return;
          // }
          itemMasterChangeCost = {
            BarCode: this.importData[i].Barcode,
          };
          itemMasterChangeCostImports.push(itemMasterChangeCost);
        } else {
          AppMessage.error('Line ' + (i + 1) + ' do not enough column');
          this.itemMasterChangeCostImports = [];
          this.disabledImport = true;
          this.refresh();
          return;
        }
      }
    }
    let valueArr = itemMasterChangeCostImports.map(function (item) {
      return item.BarCode;
    });
    let isDuplicate = valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) !== idx;
    });
    this.disabledImport = isDuplicate;
    if (isDuplicate) {
      AppMessage.error('File import duplicate item');
    }
    this.itemMasterChangeCostImports = [];
    this.refresh();
  };

  handleImportChangeCost = async () => {
    this.itemMasterChangeCostImports = [];
    this.isValidateSuccess = true;
    if (this.importData.length > 0) {
      let itemMasterChangeCost = {};
      for (var i in this.importData) {
        let item = this.importData[i];
        itemMasterChangeCost = {
          BarCode: item.Barcode.trim(),
          AppliedDate: Moment(item.AppliedDate, 'DD/MM/YYYY').format('YYYY/MM/DD'),
          Cost: item.MasterCost,
          ApplyFranchise: item.ApplyFranchise.trim() === 'Y' ? 'TRUE' : 'FALSE',
        };
        this.itemMasterChangeCostImports.push(itemMasterChangeCost);
      }
      await this.handleGetPriceItemMaster(
        this.itemMasterChangeCostImports
          .map((i) => {
            return i.BarCode;
          })
          .join()
      );
      await this.handleGetHistoryPrice(
        Moment(
          Math.min(
            ...this.itemMasterChangeCostImports.map((i) => {
              return Moment(i.AppliedDate);
            })
          )
        ).format('YYYY-MM-DD')
      );
      this.refresh();
    }
  };

  handleSave = () => {
    if (this.itemMasterChangeCostImports.length > 0) {
      if (this.itemMasterChangeCostImports.filter((i) => i.IsValidate === false).length > 0) {
        AppMessage.error('Import file invalid');
        return;
      }
      let model = new ItemMasterModel();
      model
        .importChangeCostIM({
          CostChangeItemMasterImports: this.itemMasterChangeCostImports,
        })
        .then((response) => {
          if (response.status && response.status === 1) {
            AppMessage.success('Import successfully!', 'success');
          } else {
            AppMessage.error('Import Fail');
          }
          this.refresh();
        });
    } else {
      AppMessage.error('Please import file');
    }
  };

  validateDate(value, format = '') {
    if (Moment(value, format).format(format) === 'Invalid date' || Moment(value, format) < Moment()) {
      this.isValidateSuccess = false;
      return false;
    }
    return true;
  }
  validatePrice(value) {
    let reg = new RegExp('^([0-9]*[.])?[0-9]+$');
    if (!reg.test(value)) {
      this.isValidateSuccess = false;
      return false;
    }
    return true;
  }
  validateBoolean = (value) => {
    let reg = new RegExp('[TRUE]|[FALSE]+$');
    if (!reg.test(value)) {
      this.isValidateSuccess = false;
      return false;
    }
    return true;
  };
  convertBoolToString = (value) => {
    switch (value) {
      case 'FALSE':
        return 'N';
      case 'TRUE':
        return 'Y';
      default:
        return value;
    }
  };
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

  getCostPriceOld(barcode) {
    if (this.priceItemMaster.length > 0) {
      let temp = this.priceItemMaster.reduce((a, v) => ({ ...a, [v.barcode]: v }), {});
      return temp[barcode] ? temp[barcode].costPrice : 'Unknow';
    }
    return 'Unknow';
  }

  handleCheckAll = (e) => {
    if (this.itemMasterChangeCostImports.length === 0) {
      $(e.target).prop('checked', false);
      return;
    }

    $('#' + this.idComponent)
      .find("[name='itemOption']:visible")
      .prop('checked', e.target.checked);
  };

  handleDeleteItem = () => {
    let itemOptionChecked = $('#' + this.idComponent).find("[name='itemOption']:checked");
    if ($(itemOptionChecked).length > 0) {
      for (var k = 0; k < $(itemOptionChecked).length; k++) {
        for (var k2 = 0; k2 < this.itemMasterChangeCostImports.length; k2++) {
          if (this.itemMasterChangeCostImports[k2].BarCode === $(itemOptionChecked[k]).val()) {
            this.itemMasterChangeCostImports.splice(k2, 1);
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
      AppMessage.error('Please select at least one item');
    }
  };
  handleGetHistoryPrice = async (value) => {
    let model = new ItemMasterModel();
    let params = {
      fromDate: Moment(value).add(-3, 'M').format('YYYY/MM/DD'),
      toDate: Moment().add(3, 'M').format('YYYY/MM/DD'),
      barCode: '',
      supplierCode: '',
      divisionCode: '',
      groupCode: '',
      historyType: 'cost-promotion',
    };
    await model.getHistoryPrice(params.historyType, params).then((response) => {
      if (response.status && response.data.historyPriceItemMaster) {
        this.historyCostPormotion = response.data.historyPriceItemMaster;
      }
    });
  };
  checkItemOnPromotion = (barcode, dateApplied) => {
    let valueTemp = this.historyCostPormotion.filter((i) => i.barcode === barcode);
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
  handleClickItemOnPromotion = () => {
    // this.itemMasterChangeCostImports = this.itemMasterChangeCostImports.sort(function (x,y) {  return  Number(x.BarCode) > Number(y.BarCode)} );
    // this.itemMasterChangeCostImports = this.itemMasterChangeCostImports.sort((x,y)=>x.BarCode > y.BarCode);
    this.itemMasterChangeCostImports.sort(function (a, b) {
      if (Number(a.IsItemOnPromotion) < Number(b.IsItemOnPromotion)) {
        return 1;
      }
      if (Number(a.IsItemOnPromotion) > Number(b.IsItemOnPromotion)) {
        return -1;
      }
      return 0;
    });
    this.refresh();
  };
  handleExportItemOnPromotion = () => {
    let dataExportTemp = this.itemMasterChangeCostImports.filter((i) => i.IsItemOnPromotion);
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
        CostPriceOld: item.CostPriceOld,
        CostPriceNew: String(item.Cost),
        CosPromotionPrice: String(
          this.historyCostPormotion.filter(
            (i) =>
              i.barcode === item.BarCode &&
              Moment(item.AppliedDate) >= Moment(i.fromDate) &&
              Moment(item.AppliedDate) <= Moment(i.toDate)
          )[0].fixAmount
        ),
        FromDate: Moment(
          this.historyCostPormotion.filter(
            (i) =>
              i.barcode === item.BarCode &&
              Moment(item.AppliedDate) >= Moment(i.fromDate) &&
              Moment(item.AppliedDate) <= Moment(i.toDate)
          )[0].fromDate
        ).format('DD/MM/YYYY'),
        ToDate: Moment(
          this.historyCostPormotion.filter(
            (i) =>
              i.barcode === item.BarCode &&
              Moment(item.AppliedDate) >= Moment(i.fromDate) &&
              Moment(item.AppliedDate) <= Moment(i.toDate)
          )[0].toDate
        ).format('DD/MM/YYYY'),
      };
      dataExport.push(temp);
    }

    let params = {
      values: dataExport,
      type: 'ItemOnCostPromotion',
    };
    ExportHelper.getInstance()
      .exportFileXLS(params)
      .then((res) => {
        if (res.status) {
          let downloadModel = new DownloadModel();
          downloadModel.get(res.data.downloadUrl, null, null, '.xls');
        } else {
          AppMessage.error(res.message);
        }
      });
  };
  renderComp() {
    for (let i in this.itemMasterChangeCostImports) {
      this.itemMasterChangeCostImports[i]['Name'] = this.getItemName(this.itemMasterChangeCostImports[i].BarCode);
      this.itemMasterChangeCostImports[i]['Supplier'] = this.getSupplier(this.itemMasterChangeCostImports[i].BarCode);
      this.itemMasterChangeCostImports[i]['Division'] = this.getDivision(this.itemMasterChangeCostImports[i].BarCode);
      this.itemMasterChangeCostImports[i]['Category'] = this.getCategory(this.itemMasterChangeCostImports[i].BarCode);
      this.itemMasterChangeCostImports[i]['SubCategory'] = this.getSubCategory(
        this.itemMasterChangeCostImports[i].BarCode
      );
      this.itemMasterChangeCostImports[i]['CostPriceOld'] = this.getCostPriceOld(
        this.itemMasterChangeCostImports[i].BarCode
      );
      this.itemMasterChangeCostImports[i]['IsItemOnPromotion'] = this.checkItemOnPromotion(
        this.itemMasterChangeCostImports[i].BarCode,
        this.itemMasterChangeCostImports[i].AppliedDate
      );
      this.itemMasterChangeCostImports[i]['IsValidate'] =
        this.validatePrice(this.itemMasterChangeCostImports[i].Cost) &&
        this.validateDate(this.itemMasterChangeCostImports[i].AppliedDate, 'YYYY/MM/DD') &&
        this.itemMasterChangeCostImports.filter((i) => i.IsItemOnPromotion).length === 0 &&
        this.validateBoolean(this.itemMasterChangeCostImports[i].ApplyFranchise);
      this.itemMasterChangeCostImports[i]['ApplyFranchise'] = this.itemMasterChangeCostImports[i].ApplyFranchise;
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
                      href="https://api.gs25.com.vn:8091/storemanagement/share/template/itemMaster/MasterCostChange.xls"
                      target="_blank"
                      rel="noopener noreferrer"
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
                <div className="form-group flex items-center gap-10" style={{ marginTop: 28 }}>
                  <BaseButton htmlType="button" disabled={this.disabledImport} onClick={this.handleImportChangeCost}>
                    Import
                  </BaseButton>
                  {this.props.version === '2' ? (
                    <BaseButton
                      htmlType="button"
                      color="green"
                      disabled={this.disabledImport}
                      onClick={this.handleSave}
                    >
                      Submit
                    </BaseButton>
                  ) : null}
                </div>
              </div>
              <div className="col-md-6">
                <div className="bg-note cl-red">
                  <p style={{ margin: 0 }}>Ngày áp dụng đổi giá phải sau ngày hiện tại</p>
                  <p style={{ margin: 0 }}>Item có thông tin "Unknow": Barcode không tồn tại trong hệ thống</p>
                  <p style={{ margin: 0 }}>Item có thông tin Màu đỏ: sai format</p>
                  <p style={{ margin: 0 }}>Item có thông tin Màu vàng: item đang trong chung trình promotion</p>
                  <p style={{ margin: 0 }}>Áp dụng Direct/FC store vào ngày thứ 5 hàng tuần</p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <BaseButton htmlType="button" color="error" onClick={this.handleDeleteItem}>
                  Delete Item
                </BaseButton>
                {this.itemMasterChangeCostImports.filter((i) => i.IsItemOnPromotion).length > 0 && (
                  <BaseButton htmlType="button" color="green" onClick={this.handleExportItemOnPromotion}>
                    Export Conflict
                  </BaseButton>
                )}
              </div>
              <div className="col-md-3">
                {this.itemMasterChangeCostImports.filter((i) => i.IsItemOnPromotion).length > 0 && (
                  <a href="#" onClick={this.handleClickItemOnPromotion}>
                    Item On Promotion: {this.itemMasterChangeCostImports.filter((i) => i.IsItemOnPromotion).length}
                  </a>
                )}
              </div>
              <div className="col-md-6" style={{ float: 'right' }}>
                <p style={{ float: 'right' }}>Total Item(s): {this.itemMasterChangeCostImports.length}</p>
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
                          Old
                          <br />
                          cost
                        </th>
                        <th className="text-center">Master cost</th>
                        <th>Applied Date</th>
                        <th>Apply Franchise</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.itemMasterChangeCostImports.map((item, i) => (
                        <tr
                          key={i}
                          style={{
                            color: item.IsItemOnPromotion ? '#DAA520' : '',
                          }}
                        >
                          <td className="w10">
                            <input type="checkbox" name="itemOption" value={item.BarCode} />
                          </td>
                          <td>{i + 1}</td>
                          <td>{item.BarCode}</td>
                          <td>
                            <p style={{ margin: 0 }}>{item.Name}</p>
                          </td>
                          <td>{item.Supplier}</td>
                          <td>{item.Division}</td>
                          <td>{item.Category}</td>
                          <td>{item.SubCategory}</td>
                          <td style={{ background: 'ivory' }}>
                            {item.CostPriceOld !== 'Unknow' ? StringHelper.formatPrice(item.CostPriceOld) : 'Unknow'}
                          </td>
                          <td
                            className="text-center"
                            style={{
                              background: this.validatePrice(item.Cost) ? 'ivory' : 'red',
                            }}
                          >
                            {this.validatePrice(item.Cost) ? StringHelper.formatPrice(item.Cost) : item.Cost}
                          </td>
                          <td
                            className="text-center"
                            style={{
                              color: this.validateDate(item.AppliedDate, 'YYYY/MM/DD') ? '' : 'red',
                            }}
                          >
                            {Moment(item.AppliedDate).format('DD/MM/YYYY')}
                          </td>
                          <td
                            style={{
                              color: this.validateBoolean(item.ApplyFranchise) ? '' : 'red',
                            }}
                          >
                            {this.convertBoolToString(item.ApplyFranchise)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
