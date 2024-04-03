import $ from 'jquery';
import React from 'react';
import BaseComponent from 'components/BaseComponent';
import { DateHelper, StringHelper } from 'helpers';
import ItemMasterModel from 'models/ItemMasterModel';
import ControlIMDetail from 'components/mainContent/itemMaster/controlIMDetail';
import ItemOrder from 'components/mainContent/itemMaster/items/itemOrder';
import ItemRegion from 'components/mainContent/itemMaster/items/itemRegion';
import SearchItems from 'components/mainContent/itemMaster/items/searchItems';
import ListIMDetail from 'components/mainContent/itemMaster/listIMDetail';
import ListImOrderDetail from 'components/mainContent/itemMaster/listImOrderDetail';
import ListImRegionDetail from 'components/mainContent/itemMaster/listImRegionDetail';
import { changeTab } from 'helpers/FuncHelper';
import CommonModel from 'models/CommonModel';
import Moment from 'moment';
import ItemDetailsInfo from '../itemDetailsInfo';
import ItemMasterNav from '../nav/ItemMasterNav';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import SubmitBottomButton from '../../../common/buttons/submitBottomButton/SubmitBottomButton';
import AppMessage from 'message/reponse.message';

export default class searchIMDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.code = this.props.code || '';

    this.isUpdateForm = this.code !== '';
    this.isAllowShowForm = true;
    this.isAllowSave = true;

    this.items = [];
    this.im = {};
    this.imOrder = [];
    this.imRegion = [];

    //Default data
    this.data.units = [];
    this.data.suppliers = {};
    this.data.groups = {};

    this.data.categorySubClasses = {};
    this.data.divisions = {};
    this.data.regions = [];

    this.idSearchItemsComponent = 'searchItemPopup' + StringHelper.randomKey();
    this.idItemOrderComponent = 'itemOrderPopup' + StringHelper.randomKey();
    this.idItemRegionComponent = 'itemRegionPopup' + StringHelper.randomKey();
    this.idFilterItemsComponent = 'filterItemPopup' + StringHelper.randomKey();

    this.searchComponentRef = React.createRef();
    this.controlIMDetailRef = React.createRef();
    this.itemOrderComponentRef = React.createRef();
    this.itemRegionComponentRef = React.createRef();
    this.listIMDetailRef = React.createRef();

    this.fieldSelected = this.assignFieldSelected({
      barCode: '',
      itemName: '',
      unit: '',
      supplier: '',
      division: '',
      group: '',
      subClass: '',
      type: this.code === '' ? 2 : 0,
      vatInput: '',
      vatOutput: '',
      vatInputType: '',
      vatOutputType: '',
      costPrice: '',
      sellingPrice: '',
      note: '',
      firstOrderDate: '',
      firstSalesDate: '',
      imagePath: '',
      imageBinary: '',
      plu: false,
      originOfGoods: '',
      staffUpdateName: '',
      updatedDate: '',
      selfDeclaration: '',
      storageTemp: '',
      shelfLife: '',
      storageTemp1: '',
      storageTemp2: '',
    });

    this.funcHotKey = {
      ppAddItem: () => this.handleShowSearchItems(),

      addItem:
        this.isAllowShowForm && !this.isUpdateForm ? () => this.searchComponentRef.current.handleAddItems() : undefined,
      addAll:
        this.isAllowShowForm && !this.isUpdateForm
          ? () => this.searchComponentRef.current?.handleAddAllItems()
          : undefined,
    };

    this.isRender = true;
  }

  componentDidMount = () => {
    this.handleUpdateState();
    this.hanldeLoadCommon();
    if (this.code === '') {
      let curTime = DateHelper.displayFormat(new Date());
      let startBlockTime = DateHelper.displayDateFormat(new Date()) + ' ' + '9:28:00';
      let endBlockTime = DateHelper.displayDateFormat(new Date()) + ' ' + '19:30:00';
      if (new Date().getDay() === 2 || new Date().getDay() === 4) {
        document.getElementById('content-updating').style.display = 'none';
      } else {
        document.getElementById('content-updating').style.display = 'none';
      }
    }
  };

  hanldeLoadCommon = async () => {
    let commonModel = new CommonModel();
    await commonModel.getData('supplier,division,subclass,group,itemUnit,region').then((response) => {
      if (response.status) {
        if (response.data.suppliers) {
          this.data.suppliers = response.data.suppliers || {};
        }
        if (response.data.itemUnits) {
          this.data.units = response.data.itemUnits || [];
        }
        if (response.data.divisions) {
          this.data.divisions = response.data.divisions || {};
        }
        if (response.data.subclasses) {
          this.data.categorySubClasses = response.data.subclasses || {};
        }

        if (response.data.groups) {
          this.data.groups = response.data.groups;
        }
        if (response.data.regions) {
          this.data.regions = response.data.regions;
        }
      }
    });

    this.refresh();
  };

  handleUpdateState = async () => {
    if (this.code !== '') {
      let imModel = new ItemMasterModel();
      await imModel.getIMdetail(this.code).then((res) => {
        if (res.status && res.data.itemMaster) {
          if (res.data.itemMaster) {
            this.im = res.data.itemMaster;
            this.fieldSelected.barCode = res.data.itemMaster.barCode;
            this.fieldSelected.itemName = res.data.itemMaster.name;
            this.fieldSelected.supplier = res.data.itemMaster.supplierCode;
            this.fieldSelected.division = res.data.itemMaster.divisionCode;
            this.fieldSelected.group = res.data.itemMaster.groupCode;
            this.fieldSelected.subClass = res.data.itemMaster.subClassCode;
            this.fieldSelected.vatInput = res.data.itemMaster.vatInputType === 1 ? -1 : res.data.itemMaster.vatInput;
            this.fieldSelected.vatOutput = res.data.itemMaster.vatOutputType === 1 ? -1 : res.data.itemMaster.vatOutput;
            this.fieldSelected.vatInputType = res.data.itemMaster.vatInputType;
            this.fieldSelected.vatOutputType = res.data.itemMaster.vatOutputType;
            this.fieldSelected.costPrice = res.data.itemMaster.costPrice;
            this.fieldSelected.note = res.data.itemMaster.note;
            this.fieldSelected.unit = res.data.itemMaster.unit;
            this.fieldSelected.firstOrderDate =
              res.data.itemMaster.firstOrderDate === '' ? '' : new Date(res.data.itemMaster.firstOrderDate);
            this.fieldSelected.firstSalesDate =
              res.data.itemMaster.firstSalesDate === '' ? '' : new Date(res.data.itemMaster.firstSalesDate);
            this.fieldSelected.imagePath = res.data.itemMaster.imagePath;
            this.fieldSelected.plu = res.data.itemMaster.plu;
            this.fieldSelected.originOfGoods = res.data.itemMaster.originOfGoods;
            this.fieldSelected.staffUpdateName = res.data.itemMaster.staffUpdateName;
            this.fieldSelected.updatedDate = res.data.itemMaster.updatedDate;
            this.fieldSelected.selfDeclaration = res.data.itemMaster.selfDeclaration;
            this.fieldSelected.storageTemp = res.data.itemMaster.storageTemp;
            this.fieldSelected.shelfLife = res.data.itemMaster.shelfLife;
            this.fieldSelected.distributionAddress = res.data.itemMaster.distributionAddress;
            this.fieldSelected.storageTemp1 =
              res.data.itemMaster.storageTemp === ''
                ? ''
                : res.data.itemMaster.storageTemp.substring(0, res.data.itemMaster.storageTemp.indexOf(','));
            this.fieldSelected.storageTemp2 =
              res.data.itemMaster.storageTemp === ''
                ? ''
                : res.data.itemMaster.storageTemp.substring(
                    res.data.itemMaster.storageTemp.indexOf(',') + 1,
                    res.data.itemMaster.storageTemp.length
                  );
            // this.fieldSelected.firstOrderDate = "";
            // this.fieldSelected.firstSalesDate = "";
            if (res.data.itemMaster.type === 0 && res.data.itemMaster.level === 0) {
              this.fieldSelected.type = 0;
            } else if (res.data.itemMaster.type === 0 && res.data.itemMaster.level === 1) {
              this.fieldSelected.type = 1;
            } else if (res.data.itemMaster.type === 1 && res.data.itemMaster.level === 1) {
              this.fieldSelected.type = 2;
            } else {
              this.fieldSelected.type = '';
            }
          }

          if (res.data.subItems) {
            let newArrItem = [...res.data.subItems];
            for (var i = 0; i < newArrItem.length; i++) {
              newArrItem[i].itemID = newArrItem[i].itemID2;
            }
            this.items = newArrItem;
          }

          if (res.data.itemOrders) {
            this.imOrder = res.data.itemOrders;
          }

          if (res.data.itemRegions) {
            this.imRegion = res.data.itemRegions;
            this.fieldSelected.sellingPrice = res.data.itemRegions[0].salePrice;
          }

          this.isAllowShowForm = true;
          // this.isAllowSave = !this.isUpdateForm || (!this.im.approved && !this.im.canceled);

          this.refresh();
        } else {
          // this.targetLink('/item-master');
          AppMessage.error(res.message);
        }
      });
      this.handleHotKey(this.funcHotKey);
    } else {
      this.handleHotKey(this.funcHotKey);
    }
    this.refresh();
  };

  handleSave = () => {
    if (window.confirm('Are you sure?') === false) {
      return;
    }
    let fields = this.fieldSelected;

    // if (fields.barCode === undefined || fields.barCode === "") {
    //     AppMessage.error("Please enter Barcode");
    //     return;
    // }

    if (fields.itemName === undefined || fields.itemName === '') {
      AppMessage.error('Please enter item name');
      return;
    }
    if (!fields.distributionAddress) {
      AppMessage.error('Please enter item distribution address');
      return;
    }

    if (fields.unit === undefined || fields.unit === '') {
      AppMessage.error('Please choose unit');
      return;
    }

    if (fields.supplier === undefined || fields.supplier === '') {
      AppMessage.error('Please choose supplier');
      return;
    }

    if (fields.division === undefined || fields.division === '') {
      AppMessage.error('Please choose division');
      return;
    }

    if (fields.group === undefined || fields.group === '') {
      AppMessage.error('Please choose group');
      return;
    }

    if (fields.subClass === undefined || fields.subClass === '') {
      AppMessage.error('Please choose subClass');
      return;
    }

    if (fields.vatInput === undefined || fields.vatInput === '') {
      AppMessage.error('Please enter VAT input');
      return;
    }

    if (fields.costPrice === undefined || fields.costPrice === '') {
      AppMessage.error('Please enter cost price');
      return;
    }
    if (isNaN(fields.costPrice.toString().replaceAll(',', '').trim())) {
      AppMessage.error('Cost price format incorrect');
      return;
    }

    if (fields.sellingPrice === undefined || fields.sellingPrice === '') {
      AppMessage.error('Please enter selling price');
      return;
    }
    if (isNaN(fields.sellingPrice.toString().replaceAll(',', '').trim())) {
      AppMessage.error('Cost price format incorrect');
      return;
    }
    if (fields.type === undefined || fields.type === '') {
      AppMessage.error('Please choose type');
      return;
    }

    if (fields.vatOutput === undefined || fields.vatOutput === '') {
      AppMessage.error('Please enter VAT output');
      return;
    }

    if (fields.type > 0) {
      if (fields.type < 2) {
        if (this.items.length === 0) {
          AppMessage.error('Please add at one item');
          return;
        }

        if (this.items.length > 1) {
          AppMessage.error('Convert item with only one sub item');
          return;
        }
      } else {
        if (this.items.length === 0) {
          AppMessage.error('Please add at least one item');
          return;
        }
      }
    } else {
      if (this.items.length > 0) {
        AppMessage.error('Please remove all items');
        return;
      }
    }

    let orderDetails = [];

    for (var i in this.items) {
      var item = this.items[i];

      if (item.quantity != 0) {
        orderDetails.push({
          ItemID: item.itemID2 || item.itemID,
          Quantity: StringHelper.escapeQtyDecimal(item.quantity),
        });
      }
    }

    // if(orderDetails.length === 0){
    //     AppMessage.error("Please enter qty");
    //     return;
    // }

    var inforSaved = {
      BarCode: fields.barCode,
      Name: fields.itemName,
      SupplierCode: fields.supplier,
      DivisionCode: fields.division,
      GroupCode: fields.group,
      SubClassCode: fields.subClass,
      VATInput: fields.vatInput === -1 ? 0 : StringHelper.escapeQtyDecimal(fields.vatInput),
      VATOutput: fields.vatOutput === -1 ? 0 : StringHelper.escapeQtyDecimal(fields.vatOutput),
      CostPrice: StringHelper.escapeQtyDecimal(fields.costPrice.toString().replaceAll(',', '').trim()),
      SellingPrice: StringHelper.escapeQtyDecimal(fields.sellingPrice.toString().replaceAll(',', '').trim()),
      Note: fields.note,
      Unit: fields.unit,
      VATInputType: fields.vatInput === -1 ? 1 : 0,
      VATOutputType: fields.vatOutput === -1 ? 1 : 0,
      Type: fields.type,
      SubItems: orderDetails,
      FirstOrderDate: fields.firstOrderDate !== '' ? Moment(fields.firstOrderDate).format('YYYY-MM-DD') : '',
      FirstSalesDate: fields.firstSalesDate !== '' ? Moment(fields.firstSalesDate).format('YYYY-MM-DD') : '',
      ImageBinary: this.controlIMDetailRef.current.getImageBinary(),
      PLU: fields.plu,
      OriginOfGoods: fields.originOfGoods,
      SelfDeclaration: fields.selfDeclaration,
      StorageTemp: fields.storageTemp1 + ',' + fields.storageTemp2,
      ShelfLife: fields.shelfLife,
      DistributionAddress: fields.distributionAddress,
    };
    if (this.code !== '') {
      inforSaved['itemOrders'] = this.imOrder;
      inforSaved['itemRegions'] = this.imRegion;
    }
    let imModel = new ItemMasterModel();
    if (this.code === '') {
      imModel.createIM(inforSaved).then((res) => {
        if (res.status) {
          AppMessage.success('Save successfully!', 'success');
          super.targetLink('/item-master/' + (res.data && res.data.itemID ? res.data.itemID : ''), '/item-master');
        } else {
          AppMessage.error(res.message);
        }
      });
    } else {
      imModel.updateIM(this.code, inforSaved).then((res) => {
        if (res.status) {
          AppMessage.success('Save successfully!', 'success');
          // super.targetLink("/item-master/"+ (res.data && res.data.itemID ? res.data.itemID : ""), "/item-master");
        } else {
          AppMessage.error(res.message);
        }
      });
    }
  };

  handleAddItemsToList = (results) => {
    var tempItems = {};
    for (var i = 0; i < this.items.length; i++) {
      tempItems[this.items[i].itemID] = this.items[i];
    }

    for (var itemCode in results) {
      if (tempItems[itemCode] !== undefined) {
        var sum =
          StringHelper.escapeQtyDecimal(tempItems[itemCode].quantity) +
          StringHelper.escapeQtyDecimal(results[itemCode].quantity);
        tempItems[itemCode].quantity = sum;
      } else {
        results[itemCode].item.quantity = StringHelper.escapeQtyDecimal(results[itemCode].quantity);
        this.items.unshift(results[itemCode].item);
      }
    }

    this.refresh();
  };

  handleUpdateItemOrder = (results) => {
    if (results) {
      let target = results[0];
      let lstItem = [...this.imOrder];
      let index = lstItem.findIndex((el) => el.regionCode === target.regionCode);
      if (target.regionCode === '') {
        for (var i = 0; i < lstItem.length; i++) {
          lstItem[i].quantityOrderMin = target.quantityOrderMin;
          lstItem[i].quantityOrderMax = target.quantityOrderMax;
          lstItem[i].arithmeticProgression = target.arithmeticProgression;
        }

        this.imOrder = lstItem;
        this.refresh();
      } else {
        if (index !== -1) {
          lstItem[index].quantityOrderMin = target.quantityOrderMin;
          lstItem[index].quantityOrderMax = target.quantityOrderMax;
          lstItem[index].arithmeticProgression = target.arithmeticProgression;

          this.imOrder = lstItem;
          this.refresh();
        }
      }
    }
  };

  handleUpdateItemRegion = (results) => {
    if (results) {
      let target = results[0];
      let lstItem = [...this.imRegion];
      let index = lstItem.findIndex((el) => el.regionCode === target.regionCode);
      if (target.regionCode === '') {
        for (var i = 0; i < lstItem.length; i++) {
          lstItem[i].capitalGainYield = target.capitalGainYield;
          lstItem[i].costPriceRegion = target.costPriceRegion;
          lstItem[i].entryPrice = target.entryPrice;
          lstItem[i].entryPriceMax = target.entryPriceMax;
          lstItem[i].entryPriceMin = target.entryPriceMin;
          lstItem[i].exitPrice = target.exitPrice;
          lstItem[i].isAllowEntryOrder = target.isAllowEntryOrder;
          lstItem[i].isAllowPayingBack = target.isAllowPayingBack;
          lstItem[i].isCalculateInventory = target.isCalculateInventory;
          lstItem[i].isSold = target.isSold;
          lstItem[i].payingBackDay = target.payingBackDay;
          lstItem[i].quantityInventoryMax = target.quantityInventoryMax;
          lstItem[i].quantityInventoryMin = target.quantityInventoryMin;
          lstItem[i].quantitySaleMax = target.quantitySaleMax;
          lstItem[i].quantitySaleMin = target.quantitySaleMin;
          lstItem[i].retailMargin = target.retailMargin;
          lstItem[i].salePrice = target.salePrice;
          lstItem[i].sellingGainYield = target.sellingGainYield;
          lstItem[i].supplierCodeRegion = target.supplierCodeRegion;
          lstItem[i].updatedDate = target.updatedDate;
          lstItem[i].wholesaleMargin = target.wholesaleMargin;
          lstItem[i].wholesalePrice = target.wholesalePrice;
        }
        this.imRegion = lstItem;
        this.refresh();
      } else {
        if (index !== -1) {
          lstItem[index].capitalGainYield = target.capitalGainYield;
          lstItem[index].costPriceRegion = target.costPriceRegion;
          lstItem[index].entryPrice = target.entryPrice;
          lstItem[index].entryPriceMax = target.entryPriceMax;
          lstItem[index].entryPriceMin = target.entryPriceMin;
          lstItem[index].exitPrice = target.exitPrice;
          lstItem[index].isAllowEntryOrder = target.isAllowEntryOrder;
          lstItem[index].isAllowPayingBack = target.isAllowPayingBack;
          lstItem[index].isCalculateInventory = target.isCalculateInventory;
          lstItem[index].isSold = target.isSold;
          lstItem[index].payingBackDay = target.payingBackDay;
          lstItem[index].quantityInventoryMax = target.quantityInventoryMax;
          lstItem[index].quantityInventoryMin = target.quantityInventoryMin;
          lstItem[index].quantitySaleMax = target.quantitySaleMax;
          lstItem[index].quantitySaleMin = target.quantitySaleMin;
          lstItem[index].retailMargin = target.retailMargin;
          lstItem[index].salePrice = target.salePrice;
          lstItem[index].sellingGainYield = target.sellingGainYield;
          lstItem[index].supplierCodeRegion = target.supplierCodeRegion;
          lstItem[index].updatedDate = target.updatedDate;
          lstItem[index].wholesaleMargin = target.wholesaleMargin;
          lstItem[index].wholesalePrice = target.wholesalePrice;

          this.imRegion = lstItem;
          this.refresh();
        }
      }
    }
  };

  handleShowSearchItems = () => {
    if (this.fieldSelected.type === '') {
      AppMessage.error('Please choose type for item');
      return;
    }

    if (this.fieldSelected.type === 0) {
      AppMessage.error('Normal items cannot be added');
      return;
    }

    if (this.fieldSelected.type === 1 && this.items.length === 1) {
      AppMessage.error('Convert items cannot be added more than one item');
      return;
    }
    $('.popup-form').hide();
    $('#' + this.idSearchItemsComponent).show();
    $('#' + this.idSearchItemsComponent)
      .find('[name=keywordbarcode]')
      .focus()
      .select();
  };

  handleShowItemOrder = () => {
    $('.popup-form').hide();
    $('#' + this.idItemOrderComponent).show();
    $('#' + this.idItemOrderComponent)
      .find('[name=keywordbarcode]')
      .focus()
      .select();
  };

  handleShowItemRegion = () => {
    $('.popup-form').hide();
    $('#' + this.idItemRegionComponent).show();
    $('#' + this.idItemRegionComponent)
      .find('[name=keywordbarcode]')
      .focus()
      .select();
  };

  handleUpdateIMItems = (items) => {
    this.items = items;
    this.refresh();
  };

  handleChangeField = (key, value) => {
    this.fieldSelected[key] = value;
    this.refresh();
  };

  renderComp() {
    return (
      <ItemMasterNav>
        <section className="wrap-section section-block mt-15">
          <div className="row header-detail">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div className="flex items-center gap-10">
                <h3
                  style={{
                    margin: 10,
                    display: 'inline-block',
                    verticalAlign: 'middle',
                  }}
                >
                  {!this.isUpdateForm ? '#New item FF' : '#' + this.fieldSelected.barCode}
                </h3>
                <h6
                  style={{
                    display: 'inline-block',
                    verticalAlign: 'top',
                    fontSize: 12,
                  }}
                >
                  {!this.isUpdateForm
                    ? ''
                    : 'Last updated: ' + this.fieldSelected.updatedDate + ' ' + this.fieldSelected.staffUpdateName}
                </h6>
              </div>
            </div>
          </div>
          <div className="floating-btn" style={{ paddingTop: 0 }}>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                {this.code !== '' && (
                  <>
                    <button type="button" onClick={this.handleShowItemOrder} className="btn btn-success btn-showpp">
                      STORE ORDER
                    </button>
                    <button type="button" onClick={this.handleShowItemRegion} className="btn btn-success btn-showpp">
                      REGION PRICE
                    </button>
                  </>
                )}

                {this.fieldSelected.type !== 0 && (
                  <button type="button" onClick={this.handleShowSearchItems} className="btn btn-success btn-showpp">
                    ADD ITEMS GM
                  </button>
                )}
              </div>
            </div>
          </div>
          {this.isAllowShowForm ? (
            <ControlIMDetail
              ref={this.controlIMDetailRef}
              im={this.im}
              items={this.items}
              type={this.fieldSelected.type}
              barCode={this.fieldSelected.barCode}
              itemName={this.fieldSelected.itemName}
              unit={this.fieldSelected.unit}
              supplier={this.fieldSelected.supplier}
              division={this.fieldSelected.division}
              group={this.fieldSelected.group}
              subClass={this.fieldSelected.subClass}
              vatInput={this.fieldSelected.vatInput}
              vatOutput={this.fieldSelected.vatOutput}
              vatInputType={this.fieldSelected.vatInputType}
              vatOutputType={this.fieldSelected.vatOutputType}
              costPrice={this.fieldSelected.costPrice}
              sellingPrice={this.fieldSelected.sellingPrice}
              note={this.fieldSelected.note}
              changeField={this.handleChangeField}
              firstOrderDate={this.fieldSelected.firstOrderDate}
              firstSalesDate={this.fieldSelected.firstSalesDate}
              imagePath={this.fieldSelected.imagePath}
              units={this.data.units}
              suppliers={this.data.suppliers}
              groups={this.data.groups}
              imageBinary={this.fieldSelected.imageBinary}
              categorySubClasses={this.data.categorySubClasses}
              divisions={this.data.divisions}
              plu={this.fieldSelected.plu}
              originOfGoods={this.fieldSelected.originOfGoods}
              selfDeclaration={this.fieldSelected.selfDeclaration}
              storageTemp={this.fieldSelected.storageTemp}
              shelfLife={this.fieldSelected.shelfLife}
              storageTemp1={this.fieldSelected.storageTemp1}
              storageTemp2={this.fieldSelected.storageTemp2}
              distributionAddress={this.fieldSelected.distributionAddress}
            />
          ) : null}
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-12">
                  <div className="tt-tbtab" style={{ padding: 0, backgroundColor: 'transparent' }}>
                    {this.fieldSelected.type !== 0 && (
                      <button
                        className="btn-title-tab active"
                        style={{ background: 'rgb(0,154,255)' }}
                        onClick={(e) => changeTab('detail-tab', 'item-combine', e, 'btn-title-tab')}
                      >
                        Combine
                      </button>
                    )}
                    {this.code !== '' && (
                      <>
                        <button
                          className="btn-title-tab"
                          style={{ background: 'rgb(0,212,233)' }}
                          onClick={(e) => changeTab('detail-tab', 'item-region-price', e, 'btn-title-tab')}
                        >
                          Region Price
                        </button>
                        <button
                          className="btn-title-tab"
                          style={{ background: 'rgb(0,154,255)' }}
                          onClick={(e) => changeTab('detail-tab', 'item-store-order', e, 'btn-title-tab')}
                        >
                          Store Order
                        </button>
                        <button
                          className="btn-title-tab"
                          style={{ background: 'rgb(0,154,255)' }}
                          onClick={(e) => changeTab('detail-tab', 'item-info', e, 'btn-title-tab')}
                        >
                          Items info
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="item-combine" className={this.fieldSelected.type !== 0 ? 'detail-tab row' : 'detail-tab row d-none'}>
            <div className="col-md-12">
              <div
                className="wrap-block-table css-detail-tab"
                style={{ borderColor: 'rgb(0,154,255)', overflow: 'initial' }}
              >
                {this.isAllowShowForm ? (
                  <ListIMDetail
                    im={this.im}
                    items={this.items}
                    // showSearchItems={this.handleShowSearchItems}
                    // showItemOrder={this.handleShowItemOrder}
                    // showItemRegion={this.handleShowItemRegion}
                    updateIMItems={this.handleUpdateIMItems}
                    ref={this.listIMDetailRef}
                    type={this.fieldSelected.type}
                  />
                ) : null}
              </div>
            </div>
          </div>

          <div
            id="item-region-price"
            className={this.fieldSelected.type === 0 ? 'detail-tab row' : 'detail-tab row d-none'}
          >
            <div className="col-md-12">
              <div
                className="wrap-block-table css-detail-tab"
                style={{ borderColor: 'rgb(0,154,255)', overflow: 'initial' }}
              >
                {this.isUpdateForm ? (
                  <ListImRegionDetail
                    items={this.imRegion}
                    regions={this.data.regions}
                    suppliers={this.data.suppliers}
                  />
                ) : null}
              </div>
            </div>
          </div>

          <div id="item-store-order" className="detail-tab row d-none">
            <div className="col-md-12">
              <div
                className="wrap-block-table css-detail-tab"
                style={{ borderColor: 'rgb(0,154,255)', overflow: 'initial' }}
              >
                {this.isUpdateForm ? <ListImOrderDetail items={this.imOrder} regions={this.data.regions} /> : null}
              </div>
            </div>
          </div>
          <div id="item-info" className="detail-tab row d-none">
            <div className="col-md-12">
              <div
                className="wrap-block-table css-detail-tab"
                style={{ borderColor: 'rgb(0,154,255)', overflow: 'initial' }}
              >
                <ItemDetailsInfo itemCode={this.fieldSelected?.barCode} />
              </div>
            </div>
          </div>

          {this.isAllowShowForm ? (
            <SearchItems
              idComponent={this.idSearchItemsComponent}
              ref={this.searchComponentRef}
              addItemsToList={this.handleAddItemsToList}
              selectedItems={this.items}
              suppliers={this.data.suppliers}
              groups={this.data.groups}
              categorySubClasses={this.data.categorySubClasses}
              divisions={this.data.divisions}
              type={this.fieldSelected.type}
            />
          ) : null}

          {this.isUpdateForm ? (
            <ItemOrder
              idComponent={this.idItemOrderComponent}
              ref={this.itemOrderComponentRef}
              items={this.imOrder}
              regions={this.data.regions}
              updateItemOrder={this.handleUpdateItemOrder}
            />
          ) : null}

          {this.isUpdateForm ? (
            <ItemRegion
              idComponent={this.idItemRegionComponent}
              ref={this.itemRegionComponentRef}
              items={this.imRegion}
              suppliers={this.data.suppliers}
              regions={this.data.regions}
              updateItemRegion={this.handleUpdateItemRegion}
            />
          ) : null}
          <div className="row">
            <div
              id="content-updating"
              className="detail-tab d-none pos-absolute"
              style={{
                width: '100%',
                height: '100%',
                top: 0,
                bottom: 0,
                background: 'white',
                position: 'absolute',
              }}
            >
              <h6 className="cl-red pos-relative" style={{ padding: '0 15px' }}>
                New item được mở vào thứ 3 và thứ 5. Vui lòng quay lại sau.
                <button onClick={() => super.back('/item-master')} type="button" className="btn btn-back">
                  Back
                </button>
              </h6>
            </div>
          </div>
          <SubmitBottomButton onClick={this.handleSave} title="Save" />
        </section>
      </ItemMasterNav>
    );
  }
}
