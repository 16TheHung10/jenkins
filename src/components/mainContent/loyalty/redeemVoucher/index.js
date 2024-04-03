//Plugin
import $ from 'jquery';
import React from 'react';

//Custom
import BaseComponent from 'components/BaseComponent';
import { DateHelper, StringHelper } from 'helpers';
import LoyaltyModel from 'models/LoyaltyModel';

// import SearchItems from "components/mainContent/loyalty/addItems";

export default class RedeemVoucher extends BaseComponent {
  constructor(props) {
    super(props);

    this.idComponent = 'redeemVoucher' + StringHelper.randomKey();
    this.items = [];

    this.optionTop = [
      { label: '30', value: '30' },
      { label: '50', value: '50' },
      { label: '100', value: '100' },
      { label: '200', value: '200' },
      { label: '300', value: '300' },
      { label: '500', value: '500' },
      { label: '1000', value: '1000' },
    ];

    this.fieldSelected = this.assignFieldSelected({
      phone: '',
    });

    this.isRender = true;
  }

  handleSearch = async () => {
    let fields = this.fieldSelected;

    if (fields.phone === '') {
      this.showAlert('Please enter phone number');
      return false;
    }

    let model = new LoyaltyModel();
    let params = {
      phone: fields.phone,
    };

    await model.checkVoucherRedeem(params).then((res) => {
      if (res.status && res.data) {
        this.items = res.data;
        this.refresh();
      } else {
        this.showAlert(res.message);
      }
    });
  };

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.handleSearch();
    }
  };

  handleFocusIp = () => {
    let fields = this.fieldSelected;
    fields.phone = '';
    this.refresh();
  };

  handleCheckAll = () => {
    if (this.items.length === 0) {
      this.showAlert('Item not found', 'error');
      this.refs.itemsOption.checked = false;
      return;
    }

    if (this.refs.itemsOption.checked === true) {
      $('#' + this.idComponent)
        .find('[name=itemOption]')
        .not(':disabled')
        .prop('checked', true);
    } else {
      $('#' + this.idComponent)
        .find('[name=itemOption]')
        .not(':disabled')
        .prop('checked', false);
    }
  };

  handleRedeem = () => {
    if (this.items.length === 0) {
      this.showAlert('Please search to get the voucher list');
      return false;
    }

    let model = new LoyaltyModel();
    let params = [];

    var optChecked = $('#' + this.idComponent).find('[name=itemOption]:checked');

    if ($(optChecked).length > 0) {
      for (var k = 0; k < $(optChecked).length; k++) {
        params.push($(optChecked).val());
      }

      model.lockVoucher(params).then((res) => {
        if (res.status) {
          this.showAlert(res.message, 'success');
          this.handleSearch();
        } else {
          this.showAlert(res.message);
        }
      });
    } else {
      this.showAlert('Please select at least one item');
    }
  };

  renderComp = () => {
    let fields = this.fieldSelected;
    let items = this.items;

    return (
      <section className="wrap-section section-block mt-15">
        {/* <div className="row header-detail">
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <button onClick={() => super.back('/loyalty')} type="button" className="btn btn-back" style={{ background: 'beige', marginTop: 10 }}>
              Back
            </button>
          </div>
        </div> */}

        <div className="form-filter">
          <div className="row">
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="phone">Phone: </label>
                <input
                  type="text"
                  autoComplete="off"
                  name="phone"
                  onChange={(e) => {
                    var pattern = new RegExp(/^[0-9\b]+$/);

                    if (e.target.value && !pattern.test(e.target.value)) {
                      return;
                    }

                    this.handleChangeFieldCustom('phone', e.target.value);
                  }}
                  maxLength="10"
                  value={fields.phone || ''}
                  className="form-control"
                  onKeyDown={this.handleKeyDown}
                  onFocus={this.handleFocusIp}
                />
              </div>
            </div>

            <div className="col-md-4">
              <label className="op0" htmlFor="memberCode">
                Method:{' '}
              </label>
              <button type="button" className="btn btn-success" onClick={this.handleSearch} style={{ height: 38 }}>
                Search
              </button>
              {/* <button type="button" className="btn btn-success" onClick={this.handleExport}>
                                Export
                            </button> */}
            </div>
          </div>
        </div>

        <div className="row" id={this.idComponent}>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div
              className="wrap-table"
              style={{
                marginBottom: 10,
                maxHeight: 'calc(100vh - 260px)',
                overflowY: 'auto',
              }}
            >
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th className="w10">
                      <input type="checkbox" ref="itemsOption" name="itemsOption" onClick={this.handleCheckAll} />
                    </th>
                    <th>Voucher code</th>
                    <th>Name</th>
                    <th className="rule-number">Value</th>
                    <th className="rule-date">Expired date</th>
                    <th>Item code</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, key) => (
                    <tr key={key} data-group="itemContainer" data-voucher={item.voucherCode}>
                      <td>
                        <input key={item.voucherCode} type="checkbox" name="itemOption" value={item.voucherCode} data-code={item.voucherCode} />
                      </td>
                      <td>{item.voucherCode}</td>
                      <td>{item.name}</td>
                      <td className="rule-number">{StringHelper.formatPrice(item.value)}</td>
                      <td className="rule-date">{DateHelper.displayDateTime(item.expiredDate)}</td>
                      <td>{item.itemCode}</td>
                      <td>{item.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {items.length !== 0 ? null : <div className="table-message">Item not found</div>}
            </div>
          </div>

          {items.length > 0 && (
            <div className="col-md-4">
              <button type="button" className="btn btn-success" onClick={this.handleRedeem} style={{ height: 38, background: 'black' }}>
                Claim voucher
              </button>
            </div>
          )}
        </div>
      </section>
    );
  };
}
