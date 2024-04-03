//Plugin
import React from 'react';
import Select from 'react-select';

//Custom
import { Button } from 'antd';
import BaseComponent from 'components/BaseComponent';
import BaseButton from 'components/common/buttons/baseButton/BaseButton.jsx';
import cityJson from 'data/json/city.json';
import Paging from 'external/control/pagination';
import { PageHelper } from 'helpers';
import CommonModel from 'models/CommonModel';
import StoreModel from 'models/StoreModel';
import { StoreApi } from 'api';
import AppMessage from 'message/reponse.message';
import DownloadModel from 'models/DownloadModel';
import moment from 'moment';
import CONSTANT from 'constant';
export default class ListStore extends BaseComponent {
  constructor(props) {
    super(props);
    this.data.regions = [];
    this.data.stores = [];
    this.cityJson = cityJson;
    this.fieldSelected = this.assignFieldSelected({
      storeCode: '',
      storeName: '',
      storeStatus: '',
      regionCode: '',
      city: '',
      pageNumber: 1,
      pageSize: 30,
      isFranchise1: null,
    });
    this.isAutoload = PageHelper.updateFilters(this.fieldSelected, function (filters) {
      return true;
    });
    this.isRender = true;
  }

  componentDidMount = () => {
    this.handleUpdateState();
    this.handleGetStores();
  };

  handleUpdateState = async () => {
    let commonModel = new CommonModel();
    await commonModel.getRegion().then((response) => {
      if (response.status) {
        if (response.data.regions != null && response.data.regions.size != 0) {
          this.data.regions = response.data.regions;
        }
        this.isRender = true;
        this.refresh();
      }
    });
  };

  handleClickPaging = (page) => {
    let fields = this.fieldSelected;
    fields.pageNumber = page;
    this.refresh();
  };

  handleSearch = () => {
    let fields = this.fieldSelected;
    fields.pageNumber = 1;

    PageHelper.pushHistoryState(this.fieldSelected);

    this.handleGetStores();

    this.refresh();
  };

  handleExportStore = async () => {
    let fields = this.fieldSelected;
    fields.pageNumber = 1;
    let params = {
      storeCode: this.fieldSelected.storeCode,
      storeName: this.fieldSelected.storeName,
      regionCode: this.fieldSelected.regionCode,
      storeStatus:
        this.fieldSelected.storeStatus === '0'
          ? 'OPEN'
          : this.fieldSelected.storeStatus === '1'
          ? 'CLOSED'
          : this.fieldSelected.storeStatus === '2'
          ? 'HOLD'
          : this.fieldSelected.storeStatus === '3'
          ? 'FC Converted'
          : '',
      city: this.fieldSelected.city,
      isFranchise: this.fieldSelected.isFranchise1,
      fileName: `StoreExport.xlsx`,
    };
    const res = await StoreApi.exportStore(params);
    if (res.status) {
      let downloadModel = new DownloadModel();
      downloadModel.get(res.data.downloadUrl, null, null, '.xlsx');
    } else {
      AppMessage.error(res.message);
    }
    this.refresh();
  };
  handleGetStores = async () => {
    let storeModel = new StoreModel();
    let params = {
      storeCode: this.fieldSelected.storeCode,
      storeName: this.fieldSelected.storeName,
      regionCode: this.fieldSelected.regionCode,
      storeStatus:
        this.fieldSelected.storeStatus === '0'
          ? 'OPEN'
          : this.fieldSelected.storeStatus === '1'
          ? 'CLOSED'
          : this.fieldSelected.storeStatus === '2'
          ? 'HOLD'
          : this.fieldSelected.storeStatus === '3'
          ? 'FC Converted'
          : '',
      city: this.fieldSelected.city,
      pageNumber: this.fieldSelected.pageNumber,
      pageSize: this.fieldSelected.pageSize,
      isFranchise: this.fieldSelected.isFranchise1,
    };
    await storeModel.getListStore(params).then((response) => {
      if (response.status) {
        this.data.stores = response.data.stores;
        this.itemCount = response.data.total;
        this.isRender = true;
        this.refresh();
      }
    });
  };

  handleToDetail = (storeCode) => {
    this.targetLink('/store/' + storeCode);
  };

  renderComp = () => {
    const handleGotoCreate = (storeCode) => {
      window.location.href = `store/convert?initStoreCode=${storeCode}`;
    };

    const fields = this.fieldSelected;
    let stores = this.data.stores || [];
    let statusOption = [
      { value: '0', label: 'Open' },
      { value: '1', label: 'Closed' },
      { value: '2', label: 'Hold' },
      { value: '3', label: 'FC Converted' },
    ];
    let storeTypeOptions = [
      { value: '0', label: 'Direct' },
      { value: '1', label: 'Franchise' },
    ];
    let regionCodeOptions = this.data.regions.map((el) => ({
      value: el.regionCode,
      label: el.regionName,
    }));
    let cityOpt = this.cityJson.map((el) => ({ value: el.name, label: el.name })) || [];
    return (
      <div className="form-filter pt-0">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div className="section-block mt-15">
              <div className="row">
                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="storeCode">Store Code: </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="storeCode"
                      value={fields.storeCode || ''}
                      onChange={this.handleChangeField}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="storeName">Name: </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="storeName"
                      value={fields.storeName || ''}
                      onChange={this.handleChangeField}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="storeName">Store type: </label>
                    <Select
                      isClearable
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- All --"
                      value={storeTypeOptions.filter((option) => option.value == fields.isFranchise1)}
                      options={storeTypeOptions}
                      onChange={(e) => this.handleChangeFieldCustom('isFranchise1', e ? e.value : null)}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="storeStatus" className="w100pc">
                      {' '}
                      Status:
                    </label>
                    <Select
                      isClearable
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- All --"
                      value={statusOption.filter((option) => option.value == fields.storeStatus)}
                      options={statusOption}
                      onChange={(e) => this.handleChangeFieldCustom('storeStatus', e ? e.value : '')}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="regionCode" className="w100pc">
                      {' '}
                      Region:
                    </label>
                    <Select
                      isClearable
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- All --"
                      value={regionCodeOptions.filter((option) => option.value === fields.regionCode)}
                      options={regionCodeOptions}
                      onChange={(e) => this.handleChangeFieldCustom('regionCode', e ? e.value : '')}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="city" className="w100pc">
                      City:
                    </label>
                    <Select
                      isClearable
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- City --"
                      value={cityOpt.filter((option) => option.value === fields.city)}
                      options={cityOpt}
                      onChange={(e) => this.handleChangeFieldCustom('city', e ? e.value : '')}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="flex gap-10">
                    <BaseButton iconName="search" onClick={this.handleSearch}>
                      Search
                    </BaseButton>
                    <BaseButton iconName="export" color="green" onClick={this.handleExportStore}>
                      Export
                    </BaseButton>
                  </div>
                </div>
              </div>
              <div className="row" style={{ paddingTop: '10px' }}>
                <div className="col-md-12">
                  <div className="wrap-table htable" style={{ maxHeight: 'calc(100vh - 303px)' }}>
                    <table className="table table-hover detail-search-rcv" style={{ fontSize: 11 }}>
                      <thead>
                        <tr>
                          {/* <th className="w10"></th> */}
                          <th>Store Code</th>
                          <th>Name</th>
                          <th>Status</th>
                          <th>Region</th>
                          <th>City</th>
                          <th>Phone</th>
                          <th>Email</th>
                          <th style={{ width: '100px' }}>Convert</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stores.map((store, i) => (
                          <tr
                            key={i}
                            onDoubleClick={() => {
                              this.handleToDetail(store.storeCode, store.status);
                            }}
                          >
                            {/* <td>
                            <input
                              key={store.storeCode}
                              type="radio"
                              // disabled={item.cancel || item.approved}
                              name="itemOption"
                              value={store.storeCode}
                            />
                          </td> */}
                            <td>{store.storeCode}</td>
                            <td>{store.storeName}</td>
                            <td>{store.status === 0 ? 'Open' : store.status === 1 ? 'Closed' : 'Hold'}</td>
                            <td>
                              {this.data.regions.find((el) => {
                                return el.regionCode == store.regionCode;
                              }) != null
                                ? this.data.regions.find((el) => {
                                    return el.regionCode == store.regionCode;
                                  }).regionName
                                : ''}
                            </td>
                            <td>{store.city}</td>
                            <td>{store.phone}</td>
                            <td>{store.email}</td>
                            <td style={{ width: 'fit-content' }}>
                              {!store.isFranchise ? (
                                <Button
                                  onClick={() => {
                                    handleGotoCreate(store.storeCode);
                                  }}
                                  style={{
                                    color: 'blue',
                                    borderColor: 'blue',
                                    textAlign: 'left',
                                    width: '100%',
                                  }}
                                  className="cursor-pointer text-underline"
                                >
                                  {/* {store.storeFC === '' ? 'Convert to Store' : 'Convert to FC'} */}
                                  Convert to Franchise
                                </Button>
                              ) : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {stores.length === 0 ? <div className="table-message">Item not found</div> : ''}
                  </div>

                  {stores.length > 0 ? (
                    <div style={{ textAlign: 'center' }}>
                      <Paging
                        page={Number(this.fieldSelected.pageNumber)}
                        onClickPaging={this.handleClickPaging}
                        onClickSearch={this.handleGetStores}
                        itemCount={this.itemCount}
                        listItemLength={stores.length}
                        pageSize={30}
                      />
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}
