import React from 'react';
import BaseComponent from 'components/BaseComponent';
import $ from 'jquery';
import { FileHelper, StringHelper } from 'helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import ItemMasterModel from 'models/ItemMasterModel';
import Moment from 'moment';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import AppMessage from 'message/reponse.message';

export default class ItemMasterChangePromotionPrice extends BaseComponent {
  constructor(props) {
    super(props);
    this.idComponent = 'itemImportPromotion' + StringHelper.randomKey();
    this.importData = [];
    this.itemMasterChangePromotionImports = [];
    this.isValidateSuccess = true;
    this.priceItemMaster = [];
    this.suppliers = {};
    this.divisions = {};
    this.groups = {};
    this.subclasses = {};
    this.disabledImport = true;
    this.isRender = true;
  }

  // componentDidMount() {
  //     this.handleGetDataCommon();
  // }
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
  handleGetPriceItemMaster = async (barcode) => {
    let model = new ItemMasterModel();
    let params = { barCode: barcode.trim() };
    await model.getPriceIM(params).then((response) => {
      if (response.status && response.data.priceItemMaster) {
        this.priceItemMaster = response.data.priceItemMaster;
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
  uploadXlsxFile = (event) => {
    let result = FileHelper.uploadXlsxFile(event, this.finishUploadFile);
    if (!result) {
      this.itemMasterChangePromotionImports = [];
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
    let itemMasterChangePromotionImports = [];
    this.isValidateSuccess = true;
    if (this.importData.length > 0) {
      let itemMasterChangePromotion = {};
      for (let i in this.importData) {
        let item = this.importData[i];
        let index = parseInt(i);
        if (Object.keys(this.importData[i]).length === 7) {
          if (Moment(this.importData[i].fromDate, 'DD/MM/YYYY') < Moment()) {
            AppMessage.error('From date line ' + (index + 1) + ' is smaller than Now');
            this.itemMasterChangePromotionImports = [];
            this.disabledImport = true;
            this.refresh();
            return;
          }
          if (Moment(this.importData[i].toDate, 'DD/MM/YYYY') < Moment()) {
            AppMessage.error('To date line ' + (index + 1) + ' is smaller than Now');
            this.itemMasterChangePromotionImports = [];
            this.disabledImport = true;
            this.refresh();
            return;
          }
          if (Moment(this.importData[i].toDate, 'DD/MM/YYYY') < Moment(this.importData[i].fromDate, 'DD/MM/YYYY')) {
            AppMessage.error('To date line ' + (index + 1) + ' is smaller than From Date');
            this.itemMasterChangePromotionImports = [];
            this.disabledImport = true;
            this.refresh();
            return;
          }
          itemMasterChangePromotion = {
            BarCode: item.Barcode,
          };
          itemMasterChangePromotionImports.push(itemMasterChangePromotion);
        } else {
          AppMessage.error('Line ' + (index + 1) + ' do not enough column');
          this.itemMasterChangePromotionImports = [];
          this.disabledImport = true;
          this.refresh();
          return;
        }
      }
    }
    let valueArr = itemMasterChangePromotionImports.map(function (item) {
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
    this.itemMasterChangePromotionImports = [];
    this.isValidateSuccess = true;
    if (this.importData.length > 0) {
      let itemMasterChangePromotion = {};
      for (var i in this.importData) {
        let item = this.importData[i];
        itemMasterChangePromotion = {
          BarCode: item.Barcode.trim(),
          Name: '',
          PromotionName: item.PromotionName,
          Description: item.Description,
          FromDate: Moment(item.FromDate, 'DD/MM/YYYY').format('YYYY/MM/DD'),
          ToDate: Moment(item.ToDate, 'DD/MM/YYYY').format('YYYY/MM/DD'),
          Cost: item.MasterCost === '' ? 0 : item.MasterCost,
          DiscountAmount: 0,
          DiscountRate: 0,
          FixAmount: item.PromotionCost === '' ? 0 : item.PromotionCost,
          DiscountRateApplied: 2,
        };
        this.itemMasterChangePromotionImports.push(itemMasterChangePromotion);
      }
      await this.handleGetPriceItemMaster(
        this.itemMasterChangePromotionImports
          .map((i) => {
            return i.BarCode;
          })
          .join()
          .trim()
      );
      this.refresh();
    }
  };

  handleSave = () => {
    if (this.isValidateSuccess && this.itemMasterChangePromotionImports.length > 0) {
      let model = new ItemMasterModel();
      model
        .importChangePromotionIM({
          CostPromotionItemMasterImports: this.itemMasterChangePromotionImports,
        })
        .then((response) => {
          if (response.status && response.status === 1) {
            AppMessage.success('Import successfully!', 'success');
          } else {
            AppMessage.error('Import Fail');
          }
          this.refresh();
        });
    } else if (!this.isValidateSuccess) {
      AppMessage.error('Import file invalid');
    } else if (this.itemMasterChangePromotionImports.length === 0) {
      AppMessage.error('Please import file');
    }
  };

  validateDate(value, format = '') {
    if (Moment(value, format).format(format) === 'Invalid date') {
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
  // getCostPriceOld(barcode) {
  //     if (this.priceItemMaster.length > 0 && this.priceItemMaster.filter(i => i.barcode === barcode).length > 0) {
  //         return this.priceItemMaster.filter(i => i.barcode === barcode).map(i => i.costPrice).join()
  //     }
  //     return "Unknow";
  // }

  handleCheckAll = (e) => {
    if (this.itemMasterChangePromotionImports.length === 0) {
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
        for (var k2 = 0; k2 < this.itemMasterChangePromotionImports.length; k2++) {
          if (this.itemMasterChangePromotionImports[k2].BarCode === $(itemOptionChecked[k]).val()) {
            this.itemMasterChangePromotionImports.splice(k2, 1);
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

  renderComp() {
    for (let i in this.itemMasterChangePromotionImports) {
      this.itemMasterChangePromotionImports[i]['Name'] = this.getItemName(
        this.itemMasterChangePromotionImports[i].BarCode
      );
      this.itemMasterChangePromotionImports[i]['Supplier'] = this.getSupplier(
        this.itemMasterChangePromotionImports[i].BarCode
      );
      this.itemMasterChangePromotionImports[i]['Division'] = this.getDivision(
        this.itemMasterChangePromotionImports[i].BarCode
      );
      this.itemMasterChangePromotionImports[i]['Category'] = this.getCategory(
        this.itemMasterChangePromotionImports[i].BarCode
      );
      this.itemMasterChangePromotionImports[i]['SubCategory'] = this.getSubCategory(
        this.itemMasterChangePromotionImports[i].BarCode
      );
      this.itemMasterChangePromotionImports[i]['CostPriceCurrent'] = this.getCostPriceOld(
        this.itemMasterChangePromotionImports[i].BarCode
      );
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
                      href="https://api.gs25.com.vn:8091/storemanagement/share/template/itemMaster/PromotionCostChange.xls"
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
                <div className="form-group flex gap-10 items-center" style={{ marginTop: 28 }}>
                  <BaseButton
                    htmlType="button"
                    disabled={this.disabledImport}
                    className="btn btn-success"
                    onClick={this.handleImportChangeCost}
                  >
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
                  <p style={{ margin: 0 }}>Ngày áp dụng khuyến mãi phải sau ngày hiện tại</p>
                  <p style={{ margin: 0 }}>Item có thông tin "Unknow": Barcode không tồn tại trong hệ thống</p>
                  <p style={{ margin: 0 }}>
                    Setup giá khuyến mãi không được trùng với đợt đang còn chạy, sau khi kết thúc mới chạy đợt khuyến
                    mãi mới
                  </p>
                  <p style={{ margin: 0 }}>Item có thông tin Màu đỏ: sai format</p>
                  <p style={{ margin: 0 }}>Áp dụng direct store vào ngày thứ 5 hàng tuần</p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-1">
                <BaseButton htmlType="button" color="error" onClick={this.handleDeleteItem}>
                  Delete Item
                </BaseButton>
              </div>
              <div className="col-md-11">
                <p style={{ float: 'right' }}>Total Item(s): {this.itemMasterChangePromotionImports.length}</p>
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
                        <th>From Date</th>
                        <th>To Date</th>
                        <th className="text-center">
                          Old master
                          <br /> cost
                        </th>
                        <th className="text-center">
                          Master
                          <br />
                          cost
                        </th>
                        <th className="text-center">
                          Promotion
                          <br /> cost
                        </th>
                        <th>Supplier</th>
                        <th>Division</th>
                        <th>Category</th>
                        <th>Sub Category</th>
                        <th>Promotion Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.itemMasterChangePromotionImports
                        .sort((a, b) => {
                          return a.Name.length - b.Name.length;
                        })
                        .map((item, i) => (
                          <tr key={i}>
                            <td className="w10">
                              <input type="checkbox" name="itemOption" value={item.BarCode} />
                            </td>
                            <td>{i + 1}</td>
                            <td>{item.BarCode}</td>
                            <td>
                              <p style={{ margin: 0 }}>{item.Name}</p>
                            </td>
                            <td
                              style={{
                                color: this.validateDate(item.FromDate, 'YYYY/MM/DD') ? '' : 'red',
                              }}
                            >
                              {Moment(item.FromDate).format('DD/MM/YYYY')}
                            </td>
                            <td
                              style={{
                                color: this.validateDate(item.ToDate, 'YYYY/MM/DD') ? '' : 'red',
                              }}
                            >
                              {Moment(item.ToDate).format('DD/MM/YYYY')}
                            </td>
                            <td className="text-center" style={{ background: 'yellow' }}>
                              {item.CostPriceCurrent !== 'Unknow'
                                ? StringHelper.formatPrice(item.CostPriceCurrent)
                                : 'Unknow'}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                background: this.validatePrice(item.Cost) ? 'yellow' : 'red',
                              }}
                            >
                              {this.validatePrice(item.Cost) ? StringHelper.formatPrice(item.Cost) : item.Cost}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                background: this.validatePrice(item.FixAmount) ? 'yellow' : 'red',
                              }}
                            >
                              {this.validatePrice(item.FixAmount)
                                ? StringHelper.formatPrice(item.FixAmount)
                                : item.FixAmount}
                            </td>
                            <td>{item.Supplier}</td>
                            <td>{item.Division}</td>
                            <td>{item.Category}</td>
                            <td>{item.SubCategory}</td>

                            <td>{item.PromotionName}</td>
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
