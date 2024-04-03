//Plugin
import React from 'react';

import { Col, Row, message } from 'antd';

//Custom
import BaseComponent from 'components/BaseComponent';
import { DateHelper, PageHelper, StringHelper } from 'helpers';

import ListSearch from 'components/mainContent/promotion/listSearchPromotionBuyOneGetOne';
import CommonModel from 'models/CommonModel';
import PromotionModel from 'models/PromotionModel';
import InputComp from 'utils/input';
import RangePicker from 'utils/rangePicker';
import SelectBox from 'utils/selectBox';
import ExportPromotionData from '../exportExcel/ExportPromotionData';

export default class SearchPromotionBuyOneGetOne extends BaseComponent {
  constructor(props) {
    super(props);

    this.listSearchRef = React.createRef();
    this.idListComponent = 'listPromotion' + StringHelper.randomKey();

    //Default data
    this.data.stores = [];

    this.data.types = [];
    this.itemCount = 0;
    this.items = [];

    //Data Selected
    this.fieldSelected = this.assignFieldSelected(
      {
        promotionCode: '',
        startDate: new Date(),
        endDate: new Date(),
        orderStatus: '',
        page: 1,
        type: '',
        pageSize: 15,
      },
      ['storeCode']
    );

    this.isAutoload = PageHelper.updateFilters(this.fieldSelected, function (filters) {
      if (filters['startDate']) {
        filters['startDate'] = new Date(filters['startDate']);
      }
      if (filters['endDate']) {
        filters['endDate'] = new Date(filters['endDate']);
      }

      return true;
    });

    this.exportStore = [];
    this.exportSupplier = [];
    this.isExported = 0;
    this.isRender = true;
  }

  componentDidMount = () => {
    this.handleUpdateState();
  };

  handleSearch = () => {
    PageHelper.pushHistoryState(this.fieldSelected);

    this.handleLoadResult();

    this.refresh();
  };

  handleLoadResult = () => {
    let fields = this.fieldSelected;

    if (fields.startDate === '') {
      message.error('Please select start date');
      return;
    }

    if (fields.endDate === '') {
      message.error('Please select end date');
      return;
    }

    let page = '/promotion/buygift/search';

    let params = {
      name: fields.promotionCode,
      startDate: fields.startDate !== '' ? DateHelper.displayDateFormat(fields.startDate, 'YYYY-MM-DD') : '',
      endDate: fields.endDate !== '' ? DateHelper.displayDateFormat(fields.endDate, 'YYYY-MM-DD') : '',
      pageNumber: fields.page,
      status: fields.orderStatus !== '' ? (fields.orderStatus === 2 ? 0 : fields.orderStatus) : '',
      pageSize: fields.pageSize,
      store: fields.storeCode,
    };

    let model = new PromotionModel();
    model.getList(page, params).then((res) => {
      if (res.status && res.data) {
        if (res.data.promotions) {
          this.itemCount = res.data.total;
          this.items = res.data.promotions;
        }
      }

      this.refresh();
    });
  };

  handleUpdateState = async (event) => {
    let commonModel = new CommonModel();
    await commonModel.getData('store').then((response) => {
      if (response.status && response.data.stores) {
        this.data.stores = response.data.stores || [];
      }
    });
    this.handleHotKey({});
    this.refresh();
  };

  handleClickPaging = (page) => {
    let fields = this.fieldSelected;
    fields.page = page;
    this.refresh();
  };

  handleUpdateStore = (value) => {
    let fields = this.fieldSelected;
    fields.storeCode = value;

    this.refresh();
  };

  handleUpdateDate = (start, end) => {
    let fields = this.fieldSelected;
    fields.startDate = start;
    fields.endDate = end;

    this.refresh();
  };

  handleUpdateField = (value, key) => {
    let fields = this.fieldSelected;
    fields[key] = value;

    this.refresh();
  };

  renderFilter = () => {
    const fields = this.fieldSelected;

    let stores = this.data.stores;
    let orderStore = {};
    let storeOptions = [];

    Object.keys(stores)
      .sort()
      .forEach(function (key) {
        orderStore[key] = stores[key];
      });

    if (Object.keys(stores).length === 0) {
      let obj = {
        value: this.data.storeCode,
        label: this.data.storeCode + ' - ' + this.data.storeName,
      };
      storeOptions.push(obj);
    } else {
      storeOptions = Object.keys(orderStore).map((key) => {
        let obj = {
          value: stores[key].storeCode,
          label: stores[key].storeCode + ' - ' + stores[key].storeName,
        };
        return obj;
      });
    }

    let statusOptions = [
      { value: 1, label: 'Active' },
      { value: 2, label: 'Inactive' },
    ];

    return (
      <div className="form-filter">
        <Row>
          <Col xl={24}>
            <Row gutter={16}>
              <Col xl={6}>
                {/* <div className="form-group"> */}
                <label htmlFor="storeCode" className="w100pc">
                  Store:
                  <SelectBox data={storeOptions} func={this.handleUpdateStore} value={fields.storeCode} isMode={''} />
                </label>
                {/* </div> */}
              </Col>
              <Col xl={6}>
                {/* <div className="form-group"> */}
                <label htmlFor="date" className="w100pc">
                  Apply date:
                  <div>
                    <RangePicker start={fields.startDate} end={fields.endDate} func={this.handleUpdateDate} />
                  </div>
                </label>
                {/* </div> */}
              </Col>
              <Col xl={6}>
                {/* <div className="form-group"> */}
                <label htmlFor="promotionCode" className="w100pc">
                  Promotion name:
                  <InputComp func={this.handleUpdateField} keyField="promotionCode" text={fields.promotionCode} />
                </label>
                {/* </div> */}
              </Col>
              <Col xl={6}>
                {/* <div className="form-group"> */}
                <label htmlFor="orderStatus" className="w100pc">
                  Status:
                  <SelectBox data={statusOptions} func={this.handleUpdateField} keyField={'orderStatus'} defaultValue={fields.orderStatus} isMode={''} />
                </label>
                {/* </div> */}
              </Col>
            </Row>
            <Row className="mrt-10">
              <Col>
                <div className="flex items-center gap-10">
                  <button type="button" className="btn btn-success h-30" onClick={this.handleSearch}>
                    Search
                  </button>
                  {this.items && this.items.length > 0 ? <ExportPromotionData promotionType="buygift" params={fields} /> : null}
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  };

  renderList = () => {
    return (
      <ListSearch
        idComponent={this.idListComponent}
        itemCount={this.itemCount}
        ref={this.listSearchRef}
        refresh={this.countSearch}
        page={this.fieldSelected.page}
        items={this.items}
        handleLoadResult={this.handleLoadResult}
        promotionCode={this.fieldSelected.promotionCode}
        startDate={this.fieldSelected.startDate}
        endDate={this.fieldSelected.endDate}
        storeCode={this.fieldSelected.storeCode}
        suppliers={this.fieldSelected.type}
        orderStatus={this.fieldSelected.orderStatus}
        autoload={this.isAutoload}
        type={this.props.type}
        onClickShowItemSearchRCVtoRCV={this.props.onClickShowItemSearchRCVtoRCV}
        onClickSearch={this.handleSearch}
        exportStore={this.exportStore}
        exportSupplier={this.exportSupplier}
        isExported={this.isExported}
        handleClickPaging={this.handleClickPaging}
        pageSize={this.fieldSelected.pageSize}
      />
    );
  };

  renderComp = () => {
    return (
      <div className="section-block mt-15" style={{ width: '900px', maxWidth: '100%' }}>
        {this.renderFilter()}
        {this.renderList()}
      </div>
    );
  };
}
