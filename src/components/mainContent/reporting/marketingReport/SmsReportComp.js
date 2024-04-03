//Plugin
import React from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
// import moment from 'moment';

//Custom
import BaseComponent from 'components/BaseComponent';
import PageHelper from 'helpers/PageHelper';
import CommonModel from 'models/CommonModel';
import ReportingModel from 'models/ReportingModel';

// import StringHelper from 'helpers/StringHelper';
import DateHelper from 'helpers/DateHelper';
import StringHelper from 'helpers/StringHelper';
import TableSms from './table/TableSms';
import DownloadModel from 'models/DownloadModel';
import Paging from 'external/control/pagination';
import { handleExportAutoField } from 'helpers/ExportHelper';
import { Space } from 'antd';

class SmsReportComp extends BaseComponent {
  constructor(props) {
    super(props);

    this.list = [];
    this.itemCount = 0;

    let dateDefault = new Date();

    this.fieldSelected = this.assignFieldSelected({
      startDate: dateDefault,
      endDate: dateDefault,
      page: 1,
      pageSize: 100,
    });

    this.isAutoload = true;

    PageHelper.updateFilters(this.fieldSelected, (filters) => {
      const arrList = ['startDate', 'endDate'];

      const handleUpdateField = () => {
        for (let i = 0; i < arrList.length; i++) {
          if (filters[arrList[i]]) {
            if (filters[arrList[i]] !== '') {
              filters[arrList[i]] = new Date(filters[arrList[i]]);
            } else {
              filters[arrList[i]] = '';
            }
          }
        }
      };

      handleUpdateField();

      return true;
    });

    this.isRender = true;
  }

  handleSearch = async () => {
    const fields = this.fieldSelected;
    PageHelper.pushHistoryState(fields);

    const params = {
      type: 'sms',
      startDate: DateHelper.displayDateFormat(fields.startDate) ?? '',
      endDate: DateHelper.displayDateFormat(fields.endDate) ?? '',
      page: fields.page,
      pageSize: fields.pageSize,
    };

    let model = new ReportingModel();
    let response = await model.getSmsReport(params);

    if (response.status) {
      this.list = response.data.sms.voucherList;
      this.itemCount = response.data.sms.total;
    }

    this.refresh();
  };

  handleExport = async () => {
    const fields = this.fieldSelected;

    const params = {
      type: 'sms',
      startDate: DateHelper.displayDateFormat(fields.startDate) ?? '',
      endDate: DateHelper.displayDateFormat(fields.endDate) ?? '',
    };

    let model = new ReportingModel();
    let response = await model.exportReportSms(params);
    if (response.status) {
      let downloadModel = new DownloadModel();
      downloadModel.get(response.data.downloadUrl, null, null, '.xls');
    } else {
      this.showAlert(response.message);
    }
  };

  handleClickPaging = (page) => {
    let fields = this.fieldSelected;
    fields.page = page;
    PageHelper.pushHistoryState('page', page);
  };

  renderComp() {
    let fields = this.fieldSelected;

    return (
      <>
        <div className="container-table pd-0">
          <div className="col-md-12">
            <div className="section-block mt-15">
              <div className="row mrt-10">
                <div className="col-md-8">
                  <div className="row">
                    <div className="col-md-8">
                      <div className="form-group">
                        <label>Date:</label>
                        <div className="row">
                          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                            <DatePicker
                              placeholderText="Start date"
                              selected={fields.startDate}
                              onChange={(value) => {
                                this.handleChangeFieldCustom('page', 1);
                                this.handleChangeFieldCustom('startDate', value);
                              }}
                              dateFormat="dd/MM/yyyy"
                              className="form-control"
                              autoComplete="off"
                              isClearable={fields.startDate ? true : false}
                            />
                          </div>
                          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                            <DatePicker
                              placeholderText="End date"
                              selected={fields.endDate}
                              onChange={(value) => {
                                this.handleChangeFieldCustom('page', 1);
                                this.handleChangeFieldCustom('endDate', value);
                              }}
                              dateFormat="dd/MM/yyyy"
                              className="form-control"
                              autoComplete="off"
                              isClearable={fields.endDate ? true : false}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="/" className="w100pc">
                        &nbsp;
                      </label>
                      <Space size={'small'}>
                        <button
                          type="button"
                          onClick={this.handleSearch}
                          style={{
                            height: '38px',
                          }}
                          className="btn btn-danger"
                        >
                          Search
                        </button>
                        <button
                          type="button"
                          onClick={() => handleExportAutoField(this.list, 'SMSExport')}
                          style={{
                            height: '38px',
                          }}
                          className="btn btn-danger"
                        >
                          Export
                        </button>
                      </Space>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <table className="table-hover d-block" style={{ width: 'auto', float: 'right', overflow: 'auto' }}>
                    <thead>
                      <tr>
                        {/* <th className="fs-10 pd-5 bd-none rule-number">&nbsp;</th> */}
                        <th className="fs-10 pd-5 bd-none rule-number">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {/* <td  className="fs-10 pd-5 bd-none rule-number" style={{background: 'ivory'}}>&nbsp;</td> */}
                        <td className="fs-10 pd-5 bd-none rule-number" style={{ background: 'aliceblue' }}>
                          {StringHelper.formatQty(this.itemCount) || 0}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="section-block mt-15">
              <TableSms list={this.list} />
            </div>
            {this.list.length !== 0 ? <Paging page={fields.page} onClickPaging={this.handleClickPaging} onClickSearch={this.handleSearch} itemCount={this.itemCount} pageSize={fields.pageSize} /> : ''}
          </div>
        </div>
      </>
    );
  }
}

export default SmsReportComp;
