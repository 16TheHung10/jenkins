import React, { Component, Fragment } from 'react';
import $ from 'jquery';
import BaseComponent from 'components/BaseComponent';
import StringHelper from 'helpers/StringHelper';
import DateHelper from 'helpers/DateHelper';
import Paging from 'external/control/pagination';
import { convertToLocalTime } from 'helpers/FuncHelper';

export default class TableMDPromotionCombo extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent = 'listDetail' + StringHelper.randomKey();
    this.items = [];

    this.fieldSelected = '';

    this.page = 1;
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.items !== this.items) {
      this.items = newProps.items;
    }

    if (newProps.fieldSelected !== this.fieldSelected) {
      this.fieldSelected = newProps.fieldSelected;
    }

    this.page = 1;
    this.refresh();
  };

  handleHighlight = (qty) => {
    if (qty < 0) {
      return 'cl-red';
    }
    return '';
  };

  handleClickPaging = (page) => {
    this.page = page;
    this.refresh();
  };

  handleReturnType = (value) => {
    if (value == 0) {
      return (
        <span
          className="d-inline-block cl-white"
          style={{
            padding: 2,
            borderRadius: 2,
            margin: 2,
            background: 'orange',
          }}
        >
          Uncompleted
        </span>
      );
    }
    if (value == 1) {
      return (
        <span
          className="d-inline-block cl-white"
          style={{
            padding: 2,
            borderRadius: 2,
            margin: 2,
            background: 'green',
          }}
        >
          Completed
        </span>
      );
    }
    if (value == 3) {
      return (
        <span className="d-inline-block cl-white" style={{ padding: 2, borderRadius: 2, margin: 2, background: 'blue' }}>
          Returnd
        </span>
      );
    }
    if (value == 4) {
      return (
        <span className="d-inline-block cl-white" style={{ padding: 2, borderRadius: 2, margin: 2, background: 'red' }}>
          Cancelled
        </span>
      );
    }
  };

  handleExpandItems = (e) => {
    if ($(e.target).hasClass('active')) {
      $('.tb-child-items').addClass('d-none');
      $('.btn-expand-tr-items').text('+');
      $('.btn-expand-tr-items').removeClass('active');
      return false;
    }

    $('.tb-child-items').addClass('d-none');
    $('.btn-expand-tr-items').text('+');
    $('.btn-expand-tr-items').removeClass('active');

    $(e.target).parents('.tb-parent').next('.tb-child-items').removeClass('d-none');
    $(e.target).text('-');
    $(e.target).addClass('active');
  };

  handleItemShow = (arr) => {
    if (arr.length === 0) {
      return false;
    }

    // let sortArr = arr.sort(function (a, b) { return new Date(b.invoiceDate) - new Date(a.invoiceDate) });
    let sortArr = arr.sort((a, b) => {
      let keyA1 = a.storeCode;
      let keyB1 = b.storeCode;

      let keyA2 = new Date(a.invoiceDate);
      let keyB2 = new Date(b.invoiceDate);

      if (keyA1 < keyB1) return -1;
      if (keyA1 > keyB1) return 1;
      if (keyA2 < keyB2) return -1;
      if (keyA2 > keyB2) return 1;
      return 0;
    });
    let result = sortArr.filter((el, i) => i >= (this.page - 1) * 30 && i < this.page * 30);

    return result;
  };

  render() {
    const fields = this.fieldSelected;

    let items = this.items;

    let itemsIndex = this.handleItemShow(items);

    return (
      <section id={this.idComponent}>
        <div className="wrap-table table-chart" style={{ overflow: 'initial' }}>
          {items.length > 0 ? (
            <div className="row">
              <div className="col-md-12 text-left">
                <div style={{ display: 'inline-block' }}>
                  <Paging page={this.page} onClickPaging={this.handleClickPaging} onClickSearch={() => console.log()} itemCount={items.length} />
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
          <table
            className="table table-hover d-block"
            style={{
              width: 'auto',
              maxHeight: 'calc(100vh - 278px)',
              overflow: 'auto',
            }}
          >
            <thead>
              <tr>
                <th>Date</th>
                <th>Invoice code</th>
                <th>Type</th>
                <th>Store code</th>
                {fields.type !== '' && <th>Item 1 (Buy)</th>}
                {fields.type === 'Buy' && (
                  <th className="text-center">
                    Qty <br />
                    buy
                  </th>
                )}
                {fields.type !== 'Discount' && fields.type !== '' && <th>Item 2 {fields.type === 'Buy' ? '(Get)' : '(Buy)'}</th>}
                {fields.type === 'Buy' && (
                  <th className="text-center">
                    Qty <br />
                    get
                  </th>
                )}
                {(fields.type === 'Discount' || fields.type === 'Combo') && <th>Discount</th>}
              </tr>
            </thead>
            <tbody>
              {itemsIndex.length > 0 &&
                itemsIndex.map((item, index) => (
                  <Fragment key={index}>
                    <tr className="tb-parent">
                      <td>{DateHelper.displayDateTime2(item.invoiceDate)}</td>
                      <td>{item.invoiceCode}</td>
                      <td>{this.handleReturnType(item.invoiceType)}</td>
                      <td>{item.storeCode}</td>
                      {fields.type !== '' && (
                        <td style={{ background: 'ivory' }}>
                          {item.itemPromotionCode} <br />
                          {item.itemPromotionName}
                        </td>
                      )}
                      {fields.type === 'Buy' && <td className={'text-center ' + this.handleHighlight(item.discount1)}>{StringHelper.formatValue(item.discount1)}</td>}
                      {fields.type !== 'Discount' && fields.type !== '' && (
                        <td style={{ background: 'aliceblue' }}>
                          {item.itemPromotionCodeGet} <br />
                          {item.itemPromotionNameGet}
                        </td>
                      )}
                      {fields.type === 'Buy' && <td className={'text-center ' + this.handleHighlight(item.discount2)}>{StringHelper.formatValue(item.discount2)}</td>}
                      {(fields.type === 'Discount' || fields.type === 'Combo') && <td className={'text-center ' + this.handleHighlight(item.discount)}>{StringHelper.formatValue(item.discount)}</td>}
                    </tr>
                  </Fragment>
                ))}
            </tbody>
          </table>
          {itemsIndex.length === 0 ? <div className="table-message">Item not found</div> : ''}
        </div>
      </section>
    );
  }
}
