//Plugin
import React from 'react';
import DatePicker from 'react-datepicker';

//Custom
import BaseComponent from 'components/BaseComponent';
import ListVoucher from 'components/mainContent/voucher/listVoucher';
import { DateHelper, PageHelper } from 'helpers';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';

class SearchVoucher extends BaseComponent {
  constructor(props) {
    super(props);
    this.fieldSelected = this.assignFieldSelected(
      {
        voucherCode: '',
        startDate: DateHelper.getFirstDate(),
        sortBy: '',
        sortOrder: '',
        page: 1,
      },
      ['storeCode']
    );
    this.listVoucherRef = React.createRef();
    this.isRender = true;
    this.isAutoload = PageHelper.updateFilters(this.fieldSelected, function (filters) {
      if (filters['startDate']) {
        filters['startDate'] = new Date(filters['startDate']);
      }
      if (filters['endDate']) {
        filters['endDate'] = new Date(filters['endDate']);
      }
      return true;
    });

    this.handleSearch = this.handleSearch.bind(this);
  }

  handleGetFieldSelected() {
    return this.fieldSelected;
  }

  handleSearch() {
    this.listVoucherRef.current.handleSearch();
    PageHelper.pushHistoryState(this.fieldSelected);
    this.refresh();
  }

  renderFilter() {
    return (
      <div className="form-filter">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="code">Code</label>
                  <input
                    type="text"
                    autoComplete="off"
                    name="voucherCode"
                    value={this.fieldSelected.voucherCode || ''}
                    onChange={this.handleChangeField}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="w100pc">Date</label>
                  <div className="row date-row-ft">
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <DatePicker
                        placeholderText="Start date"
                        selected={this.fieldSelected.startDate}
                        onChange={(value) => this.handleChangeFieldCustom('startDate', value)}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        autoComplete="off"
                      />
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <DatePicker
                        placeholderText="End date"
                        selected={this.fieldSelected.endDate}
                        onChange={(value) => this.handleChangeFieldCustom('endDate', value)}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-sm-6 col-md-6 col-lg-6">
                <BaseButton iconName="search" onClick={this.handleSearch}>
                  Search
                </BaseButton>
              </div>
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <div className="row">
                  <div className="col-md-3"></div>
                  <div className="col-md-3"></div>
                  <div className="col-md-3">
                    <select
                      name="sortBy"
                      value={this.fieldSelected.sortBy || ''}
                      onChange={(e) => this.handleChangeField(e, this.handleSearch)}
                      className="form-control"
                    >
                      <option value="">-Sort by-</option>
                      <option value="code">Code</option>
                      <option value="startdate">Start date</option>
                      <option value="enddate">End date</option>
                      <option value="used">Used</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <select
                      name="sortOrder"
                      value={this.fieldSelected.sortOrder || ''}
                      onChange={(e) => this.handleChangeField(e, this.handleSearch)}
                      className="form-control"
                    >
                      <option value="">-Sort order-</option>
                      <option value="asc">ASC</option>
                      <option value="desc">DESC</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderList() {
    return (
      <ListVoucher
        voucherCode={this.fieldSelected.voucherCode}
        startDate={this.fieldSelected.startDate}
        endDate={this.fieldSelected.endDate}
        sortBy={this.fieldSelected.sortBy}
        sortOrder={this.fieldSelected.sortOrder}
        page={this.fieldSelected.page}
        autoload={this.isAutoload}
        ref={this.listVoucherRef}
      />
    );
  }

  renderComp() {
    return (
      <>
        <div className="section-block mt-15">{this.renderFilter()}</div>
        <div className="section-block mt-15">{this.renderList()}</div>
      </>
    );
  }
}

export default SearchVoucher;
