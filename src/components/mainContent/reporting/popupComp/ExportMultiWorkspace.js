//Plugin
import $ from 'jquery';
import React from 'react';
import DatePicker from 'react-datepicker';

//Custom
import BaseComponent from 'components/BaseComponent';
import StoreSelect from 'components/mainContent/store/StoreSelect';
import { DateHelper, StringHelper } from 'helpers';
import { handleExportWorkspacesDetail2 } from 'helpers/ExportHelper';
import { decreaseDate } from 'helpers/FuncHelper';
import Select from 'react-select';

export default class ExportMultiWorkspace extends BaseComponent {
  constructor(props) {
    super(props);

    this.storeOptions = this.props.storeOptions || [];
    this.items = this.props.items || [];
    this.idComponent = this.props.id || 'detailPopup' + StringHelper.randomKey();

    this.fieldSelected.storeCodeDetailExport = '';
    this.fieldSelected.startExport = '';
    this.fieldSelected.dateExport = decreaseDate(1);

    this.storeCodeDetailExport = [];

    this.type = this.props.type || '';

    this.isRender = true;
  }

  componentWillReceiveProps(newProps) {
    if (this.items !== newProps.items) {
      this.items = newProps.items;
    }

    if (this.storeOptions !== newProps.storeOptions) {
      this.storeOptions = newProps.storeOptions;
    }

    if (this.type !== newProps.type) {
      this.type = newProps.type;
    }
  }

  handleExport = () => {
    let store = '';

    if (this.fieldSelected.storeCodeDetailExport === '') {
      this.showAlert('Please choose store to export');
      return false;
    }

    if (this.storeCodeDetailExport.length === 0) {
      this.showAlert('Please select at least one store to export');
      return false;
    }

    store = this.storeCodeDetailExport.toString();

    let params = {
      // type: this.type,
      // method: "email",
      startDate: this.fieldSelected.startExport ? DateHelper.displayDateFormatMinus(this.fieldSelected.startExport) : '',
      endDate: this.fieldSelected.dateExport ? DateHelper.displayDateFormatMinus(this.fieldSelected.dateExport) : '',
      listStore: store,
    };

    // let model = new ReportingModel();
    // model.exportAnalyticreport(params).then(res=>{
    //     if (res.status && res.data) {
    //         let ml = res.data.receiver || "";
    //         this.showAlert("File sent successfully, please check your mail " + ml + " in 15 minutes",'success', false);

    //         this.fieldSelected.storeCodeDetailExport = "";
    //         this.refresh();
    //     }
    //     else {
    //         this.showAlert(res.message);
    //     }
    // });

    handleExportWorkspacesDetail2(this.type, params);
  };

  handleUpdateStoreCodeDetailExport = (value) => {
    this.storeCodeDetailExport = [];
    this.storeCodeDetailExport = value;
    this.refresh();
  };

  renderComp() {
    let storeOptions = this.storeOptions;

    this.storeShowExport = {};
    let groupStore = [];
    let count = 1;
    const chunkSize = 100;
    for (let i = 0; i < storeOptions.length; i += chunkSize) {
      const chunk = storeOptions.slice(i, i + chunkSize);

      var obj = {};
      for (let a = 0; a < chunk.length; a++) {
        if (a === 0) {
          obj.value = count;
          obj.label = chunk[a].value;
          obj.openedDate = chunk[a].openedDate;
        }
        if (a === chunk.length - 1) {
          obj.label += ' - ' + chunk[a].value;
        }
      }

      this.storeShowExport[count] = chunk;

      groupStore.push(obj);

      count++;
    }

    return (
      <section
        id={this.props.id}
        className="popup-form"
        style={{
          minHeight: 300,
          minWidth: 500,
          maxWidth: '65%',
          width: 'auto',
        }}
      >
        <div className="row" style={{ paddingTop: 10 }}>
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="storeCodeDetailExport" className="w100pc">
                Store export:
              </label>
              <Select
                isClearable
                classNamePrefix="select"
                maxMenuHeight={260}
                placeholder="-- Store --"
                value={groupStore.filter((option) => option.value === this.fieldSelected.storeCodeDetailExport)}
                options={groupStore}
                onChange={(e) => this.handleChangeFieldCustom('storeCodeDetailExport', e ? e.value : '')}
                // isMulti
              />
            </div>
          </div>
          <div className="col-md-4 ">
            <div className="form-group">
              <label className="w100pc">Start date:</label>
              <DatePicker
                placeholderText="Start date"
                selected={this.fieldSelected.startExport}
                onChange={(value) => this.handleChangeFieldCustom('startExport', value)}
                dateFormat="dd/MM/yyyy"
                maxDate={decreaseDate(1, this.fieldSelected.dateExport)}
                minDate={decreaseDate(60, this.fieldSelected.dateExport)}
                className="form-control"
                autoComplete="off"
                isClearable={this.fieldSelected.startExport ? true : false}
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label className="w100pc">Date:</label>
              <DatePicker
                placeholderText="Date"
                selected={this.fieldSelected.dateExport}
                onChange={(value) =>
                  this.handleChangeFieldCustom('dateExport', value, () => {
                    this.fieldSelected.startExport = '';
                  })
                }
                dateFormat="dd/MM/yyyy"
                maxDate={decreaseDate(1)}
                minDate={decreaseDate(60)}
                className="form-control"
                autoComplete="off"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <button onClick={this.handleExport} type="button" className="btn btn-danger" style={{ height: '38px' }}>
              Export
            </button>
            <button
              onClick={() => {
                $('#' + this.props.id).hide();
                this.fieldSelected.storeCodeDetailExport = '';
                this.refresh();
              }}
              type="button"
              className="btn btn-danger"
              style={{ height: '38px', marginRight: 0 }}
            >
              Close
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <StoreSelect
              date={this.fieldSelected.dateExport}
              store={this.storeShowExport[this.fieldSelected.storeCodeDetailExport] || []}
              updateStoreCodeExport={this.handleUpdateStoreCodeDetailExport}
            />
          </div>
        </div>
      </section>
    );
  }
}
