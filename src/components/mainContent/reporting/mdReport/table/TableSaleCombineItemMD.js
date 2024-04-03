import BaseComponent from 'components/BaseComponent';
import BarcodeComp from 'components/mainContent/reporting/autocompleteBarcode';
import Paging from 'external/control/pagination';
import { createListOption } from 'helpers/FuncHelper';
import StringHelper from 'helpers/StringHelper';
import React from 'react';

export default class TableSaleCombineItemMD extends BaseComponent {
  constructor(props) {
    super(props);
    this.idBarcodeItemRef = React.createRef();
    this.idBarcodeItem = 'idBarcodeItem' + StringHelper.randomKey();
    this.idComponent = 'listBillDetail' + StringHelper.randomKey();

    this.items = [];

    this.sumDetail = {
      rate: 0,
      itemQty: 0,
      unitPrice: 0,
      grossSales: 0,
      netSales: 0,
      costPrice: 0,
    };

    this.fieldSelected.barcode = '';
    this.itemsOrder = {};
    this.page = 1;
    this.isHasSOH = this.props.isHasSOH || false;
  }

  handleClickPaging = (page) => {
    this.page = page;
    this.refresh();
  };

  componentWillReceiveProps = (newProps) => {
    if (newProps.items !== this.items) {
      this.items = newProps.items;

      this.itemsOrder = {};
      let objs = {};
      for (let i in this.items) {
        let item = this.items[i];
        // this.itemsOrder combineItemName
        if (!objs[item.combineCode]) {
          objs[item.combineCode] = {};
          objs[item.combineCode].itemCode = item.combineCode;
          objs[item.combineCode].itemName = item.combineItemName;
        }
      }

      this.itemsOrder = objs;
    }
    if (newProps.isHasSOH !== this.isHasSOH) {
      this.isHasSOH = newProps.isHasSOH;
    }
    this.page = 1;
    this.refresh();
  };

  handleUpdateFilterBarcode = (itemCode, isFilter) => {
    if (isFilter) {
      this.fieldSelected.barcode = itemCode;
      this.refresh();
    }
  };

  // handleSortTime = (data) => {

  //     let lstSort = {};
  //     let newArr = Object.values(data).sort((a,b)=> new Date(a.date) - new Date(b.date));
  //     for (let i in newArr) {
  //         let el = newArr[i];
  //         lstSort[el.divisionCode.toString().trim()] = el;
  //     }

  //     return lstSort;
  // }

  // renderContextMenu = () => {
  // 	return (
  //         <div className="context menu">
  //             <ul className="menu-options">
  // 				<li className="menu-option" onClick={ (e) => this.props.checkBill($(this.getCurrentTarget()).attr('data-itemid')) }>
  // 					<i><FontAwesomeIcon icon={faCheck}/></i>Bill detail</li>
  //             </ul>
  //         </div>
  //     )
  // }

  // componentDidMount() {
  // 	this.handleRightClick(this.idComponent);
  // }

  handleSum = (obj) => {
    let newObj = {
      rate: 0,
      itemQty: 0,
      unitPrice: 0,
      grossSales: 0,
      netSales: 0,
      costPrice: 0,
    };
    for (let key in obj) {
      let item = obj[key];

      newObj.rate += item.rate;
      newObj.itemQty += item.itemQty;
      newObj.unitPrice += item.unitPrice;
      newObj.grossSales += item.grossSales;
      newObj.netSales += item.netSales;
      newObj.costPrice += item.costPrice;
    }

    return newObj;
  };

  handleFilter = (arr) => {
    let newArr = arr;

    newArr =
      this.fieldSelected.barcode !== '' ? newArr.filter((el) => el.combineCode === this.fieldSelected.barcode) : newArr;
    newArr = newArr.sort((a, b) => {
      // let keyA1 = a.combineSupplierCode;
      // let keyB1 = b.combineSupplierCode;

      // let keyA2 = a.combineDivisionCode;
      // let keyB2 = b.combineDivisionCode;

      let keyA3 = a.combineCode;
      let keyB3 = b.combineCode;

      // let keyA4 = a.combineDivisionCode;
      // let keyB4 = b.combineDivisionCode;

      // let keyA5 = a.supplierCode;
      // let keyB5 = b.supplierCode;

      // let keyA6 = a.divisionCode;
      // let keyB6 = b.divisionCode;

      let keyA7 = a.categoryCode;
      let keyB7 = b.categoryCode;

      // let keyA8 = a.subCategoryCode;
      // let keyB8 = b.subCategoryCode;

      let keyA9 = a.barcode;
      let keyB9 = b.barcode;

      // let keyA2 = new Date(a.date);
      // let keyB2 = new Date(b.date);

      // if (keyA1 < keyB1) return -1;
      // if (keyA1 > keyB1) return 1;
      // if (keyA2 < keyB2) return -1;
      // if (keyA2 > keyB2) return 1;
      if (keyA3 < keyB3) return -1;
      if (keyA3 > keyB3) return 1;
      // if (keyA4 < keyB4) return -1;
      // if (keyA4 > keyB4) return 1;
      // if (keyA5 < keyB5) return -1;
      // if (keyA5 > keyB5) return 1;
      // if (keyA6 < keyB6) return -1;
      // if (keyA6 > keyB6) return 1;
      if (keyA7 < keyB7) return -1;
      if (keyA7 > keyB7) return 1;
      // if (keyA8 < keyB8) return -1;
      // if (keyA8 > keyB8) return 1;
      if (keyA9 < keyB9) return -1;
      if (keyA9 > keyB9) return 1;
      return 0;
    });

    return newArr;
  };

  showHideRowName = (lst, item, key, index) => {
    let isShow = true;

    if (lst[index - 1] && item[key] === lst[index - 1][key]) {
      return false;
    }

    return isShow;
  };

  showHideRowNum = (lst, item, key, key2, index) => {
    let isShow = true;

    if (lst[index - 1] && item[key] === lst[index - 1][key] && item[key2] === lst[index - 1][key2]) {
      return false;
    }

    return isShow;
  };

  showHideLabel = (lst, item, key, index) => {
    let label = item[key];

    if (lst[index - 1] && label === lst[index - 1][key]) {
      return '';
    }

    if (typeof label === 'number') {
      label = StringHelper.formatValue(label);
    }

    return label;
  };

  countRowSpanName = (lst, key, value) => {
    let count = 0;

    for (let k in lst) {
      let item = lst[k];
      if (item[key] == value) {
        count++;
      }
    }

    return count;
  };

  countRowSpanNum = (lst, key, value, key2, value2) => {
    let count = 0;

    for (let k in lst) {
      let item = lst[k];
      if (item[key] == value) {
        if (item[key2] == value2) {
          count++;
        }
      }
    }

    return count;
  };

  render() {
    let itemsFilter = this.handleFilter(this.items);
    let items =
      itemsFilter.length > 1
        ? itemsFilter.filter((el, i) => i >= (this.page - 1) * 30 && i < this.page * 30)
        : itemsFilter;

    this.sumDetail = this.handleSum(items);
    return (
      <section id={this.idComponent}>
        <div className="row mrb-10">
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="combo1">Item filter:</label>
              <BarcodeComp
                idComponent={this.idBarcodeItem}
                ref={this.idBarcodeItemRef}
                barCodes={this.itemsOrder}
                AddBarcode={this.handleAddBarcode}
                updateFilter={this.handleUpdateFilterBarcode}
              />
            </div>
          </div>
          {/* <div className="col-md-3">
                        <label htmlFor="methodcode" className="w100pc" style={{ opacity: 0 }}>.</label>
                        <button
                            
                            onClick={()=>handleExportAutoField(items,"reportdisposalexport")}
                            type="button"
                            className="btn btn-danger"
                            style={{ height: "38px", marginRight: 0 }}
                        >
                            Export
                        </button>
                    </div> */}
        </div>
        <div className="wrap-tb table-chart">
          {itemsFilter.length > 0 ? (
            <div className="text-right">
              <div style={{ display: 'inline-block' }}>
                <Paging
                  page={this.page}
                  onClickPaging={this.handleClickPaging}
                  onClickSearch={() => console.log()}
                  itemCount={itemsFilter.length}
                />
              </div>
            </div>
          ) : (
            ''
          )}
          {/* <table className={"table table-hover " + (Object.keys(obj).length > 0 && "mH-370")} style={{maxHeight: 'calc(100vh - 183px)', overflow: 'auto', display: 'block'}}> */}
          <table className={'table d-block of-auto  '} style={{ maxHeight: 'calc(100vh - 183px)' }}>
            <thead>
              <tr>
                <th>Item name</th>
                <th className="rule-number">
                  Sales <br />
                  qty
                </th>
                {/* <th className='rule-number'>Open <br/>stock</th> */}
                <th>Category</th>
                <th>Item</th>
                <th className="rule-number">Rate</th>
                <th className="rule-number">Qty</th>
                <th className="rule-number">SOH</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 &&
                items.map((item, index) => (
                  <tr key={index + item.combineCode + item.barcode}>
                    {this.showHideRowName(items, item, 'combineCode', index) && (
                      <td
                        rowSpan={this.countRowSpanName(items, 'combineCode', item.combineCode)}
                        className={'bg-beige'}
                        style={{ background: 'ivory', verticalAlign: 'top', position: 'sticky', top: 39.06 }}
                      >
                        {item.combineCode} <br />
                        {item.combineItemName}
                      </td>
                    )}
                    {this.showHideRowNum(items, item, 'combineCode', 'combineQty', index) && (
                      <td
                        rowSpan={this.countRowSpanNum(
                          items,
                          'combineCode',
                          item.combineCode,
                          'combineQty',
                          item.combineQty
                        )}
                        className={'bg-beige rule-number'}
                        style={{ verticalAlign: 'top', position: 'sticky', top: 39.06 }}
                      >
                        {StringHelper.formatValue(item.combineQty)}{' '}
                      </td>
                    )}
                    {/* <td>{item.openStock} <br/>{item.openStock}</td> */}
                    {/* {
                                            this.showHideRowNum(items,item,'combineCode','combineCostPrice',index) &&
                                            <td rowSpan={this.countRowSpanNum(items,"combineCode",item.combineCode,'combineCostPrice',item.combineCostPrice)} className={'bg-beige rule-number'} style={{verticalAlign:'top',position: "sticky",top:39.06}}>{StringHelper.formatValue(item.combineCostPrice)} </td>
                                        }
                                        {
                                            this.showHideRowNum(items,item,'combineCode','combineGrossSales',index) &&
                                            <td rowSpan={this.countRowSpanNum(items,"combineCode",item.combineCode,'combineGrossSales',item.combineGrossSales)} className={'bg-beige rule-number'} style={{verticalAlign:'top',position: "sticky",top:39.06}}>{StringHelper.formatValue(item.combineGrossSales)} </td>
                                        } */}

                    <td>
                      {item.categoryCode} <br />
                      {item.categoryName}
                    </td>
                    <td>
                      {item.barcode} <br />
                      {item.itemName}
                    </td>
                    <td className="rule-number">{item.rate}</td>
                    <td className="rule-number">{StringHelper.formatValue(item.itemQty)}</td>
                    <td
                      className={'text-center ' + StringHelper.highLightNegative(item.soh)}
                      style={{ background: 'ivory' }}
                    >
                      {this.isHasSOH ? (
                        StringHelper.formatValue(item.soh)
                      ) : (
                        <>
                          <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>

            {items.length > 0 ? (
              <tfoot>
                <tr>
                  <td>Total</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="rule-number">{StringHelper.formatValue(this.sumDetail.rate)}</td>
                  <td className="rule-number">{StringHelper.formatValue(this.sumDetail.itemQty)}</td>
                  <td className="rule-number"></td>
                  {/* <td className='rule-number'>{StringHelper.formatValue(this.sumDetail.unitPrice)}</td>
                                    <td className='rule-number'>{StringHelper.formatValue(this.sumDetail.grossSales)}</td>
                                    <td className='rule-number'>{StringHelper.formatValue(this.sumDetail.netSales)}</td>
                                    <td className='rule-number'>{StringHelper.formatValue(this.sumDetail.costPrice)}</td> */}
                </tr>
              </tfoot>
            ) : null}
          </table>
          {/* { Object.keys(obj).length === 0 ? <div className='fs-12 table-message'>Search ...</div> : "" } */}
        </div>
      </section>
    );
  }
}
