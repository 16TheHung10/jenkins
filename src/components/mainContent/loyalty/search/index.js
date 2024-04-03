//Plugin
import $ from 'jquery';
import React from 'react';
//Custom
import BaseComponent from 'components/BaseComponent';
import { PageHelper, StringHelper } from 'helpers';

import { Col, Row, message } from 'antd';
import ListSearch from 'components/mainContent/loyalty/listSearch';
import LoyaltyModel from 'models/LoyaltyModel';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import OnlyGreenSwitch from '../../../common/switch/onlyGreenSwitch/OnlyGreenSwitch';
import { UrlHelper } from 'helpers';
export default class Search extends BaseComponent {
  constructor(props) {
    super(props);

    this.listSearchRef = React.createRef();
    this.idListComponent = 'loyalty' + StringHelper.randomKey();

    //Default data
    this.data.stores = [];
    this.data.orderstatus = [
      { value: '1', label: 'Active' },
      { value: '0', label: 'Inactive' },
    ];
    this.data.types = [];
    this.itemCount = 0;
    this.items = [];
    this.data.partners = {};
    this.indexCurrent = 0;
    this.itemRes = 0;

    this.isExpanded = false;
    //Data Selected
    this.fieldSelected = this.assignFieldSelected({
      memberCode: '',
      phone: '',
    });

    this.isAutoload = PageHelper.updateFilters(this.fieldSelected, function (filters) {
      return true;
    });

    this.exportStore = [];
    this.exportSupplier = [];
    this.isExported = 0;
    this.isRender = true;
  }

  handleDelete = () => {
    var items = $('#' + this.idListComponent).find("[name='itemOption']:checked");
    if (items.length === 0) {
      this.showAlert('Please select at least one item');
      return;
    }

    if (window.confirm('Are you sure you want to delete?')) {
      let list = [];
      for (var i = 0; i < items.length; i++) {
        list.push({
          memberCode: $(items[i]).val(),
        });
      }
    }
  };
  handleInitialData = () => {
    const currentParams = UrlHelper.getSearchParamsObject();
    this.handleLoadResult(currentParams);
  };
  componentDidMount = () => {
    this.handleInitialData();
  };

  handleSearch = () => {
    this.indexCurrent = 0;
    this.items = [];
    this.handleLoadResult();
    this.refresh();
  };

  handleLoadResult = (initialData) => {
    let fields = initialData || this.fieldSelected;
    console.log(fields.phone?.length, this.isExpanded);
    if (!this.isExpanded) {
      // Search by phone
      if (!fields.phone || fields.phone?.length < 3) {
        message.error('Please enter phone more than 3 characters');
        return false;
      }
    } else {
      if (!fields.memberCode || fields.memberCode?.length < 3) {
        message.error('Please enter member code more than 3 characters');
        return false;
      }
    }
    let model = new LoyaltyModel();
    let params = {
      memberCode: fields.memberCode,
      index: this.indexCurrent,
    };
    if (!this.isExpanded) {
      params = {
        phone: fields.phone,
        index: this.indexCurrent,
      };
    }

    model.getList(params).then((res) => {
      if (res.status && res.data) {
        UrlHelper.setSearchParamsFromObject(params);

        let newList = res.data.listMember;
        this.items = this.items.concat(newList);
        if (newList.length === 30) {
          this.indexCurrent = this.indexCurrent + newList.length;
        }

        this.itemRes = res.data.listMember.length;
        this.refresh();
      } else {
        this.showAlert(res.message);
      }
    });
  };

  handleClickPaging = (page) => {
    let fields = this.fieldSelected;
    fields.page = page;
    this.refresh();
  };
  onToggle = () => {
    this.isExpanded = !this.isExpanded;
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

    // PARTNER:
    let partners = this.data.partners;
    let partnersOption = Object.keys(partners).map((elm) => {
      let obj = { value: partners[elm].key, label: partners[elm].value };
      return obj;
    });
    return (
      <div className="section-block mt-15 mb-15">
        <div className="form-filter">
          <Row gutter={[16, 16]}>
            <Col span={16}>
              <Row>
                <Col span={24}> </Col>
                <Col span={12}>
                  <p className=" flex items-center gap-10">
                    Search by{' '}
                    <OnlyGreenSwitch
                      checkedChildren="phone"
                      unCheckedChildren="member code"
                      defaultChecked
                      checked={!this.isExpanded}
                      onChange={() => this.onToggle()}
                    />
                  </p>
                  <div className="flex items-center gap-10">
                    <div className="flex-1">
                      {this.isExpanded ? (
                        <div className="form-group m-0">
                          <input
                            type="text"
                            autoComplete="off"
                            name="memberCode"
                            value={fields.memberCode || ''}
                            onChange={this.handleChangeField}
                            className="form-control w-full"
                          />
                        </div>
                      ) : (
                        <div className="form-group m-0">
                          <input
                            disabled={this.isExpanded}
                            type="text"
                            autoComplete="off"
                            name="phone"
                            value={fields.phone || ''}
                            onChange={this.handleChangeField}
                            className="form-control"
                          />
                        </div>
                      )}
                    </div>
                    <BaseButton iconName="search" onClick={this.handleSearch}>
                      Search
                    </BaseButton>
                  </div>
                </Col>

                {/* PHONE NUMBER */}
              </Row>
            </Col>
            <Col span={8}>
              <div className="cl-red bg-note">
                <strong>Lưu ý chức năng</strong>
                <br />
                <strong>1. Loyalty:</strong> Truy vấn lịch sử membership/Voucher/Point,…
                <br />
                <strong>2. Merge:</strong> Search & gộp tài khoản membership (chú ý quy trình xác mình tài khoản).
                <br />
                <strong>3. Notify:</strong> Gửi notify thông tin đến Mobile App GS25.
                <br />
                <strong>4. Claim Voucher:</strong> search và claim mã voucher trên tủ quà App GS25.
                <br />
                <strong>5. Bill search:</strong> tìm kiếm chi tiết giao dịch qua mã hóa đơn mua hàng.
                <br />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  };

  renderList = () => {
    return (
      <ListSearch
        idComponent={this.idListComponent}
        ref={this.listSearchRef}
        page={this.fieldSelected.page}
        items={this.items}
        handleLoadResult={this.handleLoadResult}
        autoload={this.isAutoload}
        handleClickPaging={this.handleClickPaging}
        itemRes={this.itemRes}
      />
    );
  };

  renderComp = () => {
    return (
      <div>
        {this.renderFilter()}
        {this.renderList()}
      </div>
    );
  };
}
