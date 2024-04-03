//Plugin
import $ from 'jquery';
import React from 'react';

//Custom
import { Tag } from 'antd';
import BaseComponent from 'components/BaseComponent';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { DateHelper, StringHelper } from 'helpers';
import LoyaltyModel from 'models/LoyaltyModel';

export default class ListSearch extends BaseComponent {
  constructor(props) {
    super(props);

    this.items = this.props.items || [];
    this.page = this.props.page || 1;
    this.itemCount = 0;
    this.idComponent = this.props.idComponent;
    this.itemRes = this.props.itemRes || 0;

    this.isRender = true;
  }

  componentDidMount = () => {
    if (this.props.autoload) {
      this.props.handleLoadResult();
    }
  };

  componentWillReceiveProps = (newProps) => {
    if (newProps && newProps.items) {
      this.items = newProps.items;
      this.refresh();
    }
    if (newProps && newProps.itemRes) {
      this.itemRes = newProps.itemRes;
      this.refresh();
    }
  };

  handleLoadResult = () => {
    this.props.handleLoadResult();
  };

  handleToDetail = (codeId) => {
    this.targetLink('/loyalty/' + codeId);
  };

  handleClickPaging = (page) => {
    this.props.handleClickPaging && this.props.handleClickPaging(page);
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

  handleDeleteItems = () => {
    let optChecked = $('#' + this.idComponent).find('[name=itemOption]:checked');
    // let dataParams = [];

    // if (optChecked.length > 0) {
    //     for (let k = 0; k < optChecked.length; k++) {
    //         for (let k2 = 0; k2 < this.items.length; k2++) {
    //             if (this.items[k2].poid === optChecked[k].value) {
    //                 optChecked[k].checked = false;

    //                 dataParams.push({
    //                     ElementID: this.items[k2].poid,
    //                 });

    //                 break;
    //             }
    //         }
    //     }

    //     let model = new LoyaltyModel();
    //     model.deleteMultiPo(dataParams).then((response) => {
    //         if (response.status) {
    //             this.showAlert(response.message, "success");
    //         }
    //     });
    // } else {
    //     this.showAlert("Please select at least one item", "error");
    // }
  };

  handleApproveItems = () => {
    let optChecked = $('#' + this.idComponent).find('[name=itemOption]:checked');
    // let dataParams = [];

    // if (optChecked.length > 0) {
    //     for (let k = 0; k < optChecked.length; k++) {
    //         for (let k2 = 0; k2 < this.items.length; k2++) {
    //             if (this.items[k2].poid === optChecked[k].value) {
    //                 optChecked[k].checked = false;

    //                 dataParams.push({
    //                     ElementID: this.items[k2].poid,
    //                 });

    //                 break;
    //             }
    //         }
    //     }

    //     let model = new LoyaltyModel();
    //     model.approveMultiPo(dataParams).then((response) => {
    //         if (response.status) {
    //             this.showAlert(response.message, "success");
    //         }
    //     });
    // } else {
    //     this.showAlert("Please select at least one item", "error");
    // }
  };

  handleActiveMember(item) {
    let model = new LoyaltyModel();
    let params = { memberCode: item.memberCode };
    if (item.active !== 1) {
      model.activeMember(params).then((res) => {
        if (res.status) {
          item.active = item.active === 1 ? 0 : 1;
        }
        this.refresh();
      });
    } else {
      model.lockMember(params).then((res) => {
        if (res.status) {
          item.active = item.active === 1 ? 0 : 1;
        }
        this.refresh();
      });
    }
  }

  handleLoadMore = () => {
    this.handleLoadResult();
  };

  renderComp = () => {
    let items = this.items;
    let modePaging = true;

    return (
      <section id={this.idComponent} className="section-block w-fit">
        <div className="wrap-table htable w-fit">
          <table className="table table-hover detail-search-rcv w-fit" style={{ fontSize: 11 }}>
            <thead>
              <tr>
                <th className="w10">
                  <input type="checkbox" ref="itemsOption" name="itemsOption" onChange={this.handleCheckAll} />
                </th>
                <th>Member code</th>
                <th>First name</th>
                <th>Last name</th>
                <th>Id No</th>
                {/* <th className="rule-number">Discount</th>
                                <th className="rule-number">Point</th> */}
                <th>Active</th>
                <th className="rule-number">Phone</th>
                {/* <th className="rule-date">BirthDate</th>
                                <th>Email</th>
                                <th>Gender</th>
                                <th>Address</th>
                                <th>Passport</th> */}
                <th className="rule-date">Register date</th>
                <th className="rule-date"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td>
                    <input
                      key={item.memberCode}
                      type="checkbox"
                      // disabled={item.cancel || item.approved}
                      name="itemOption"
                      value={item.memberCode}
                      data-code={item.memberCode}
                    />
                  </td>
                  <td>{item.memberCode}</td>
                  <td>{item.firstName}</td>
                  <td>{item.lastName}</td>
                  <td>{item.idNo}</td>
                  <td>{item.delete ? <Tag color="red">Deleted</Tag> : item.active ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>}</td>
                  <td className="rule-number">{StringHelper.hidePartOfString(item.phone)}</td>
                  <td className="rule-date">{DateHelper.displayDateTimeNo7(item.registerDate)}</td>
                  <td className="rule-date">
                    <BaseButton className="mr-10" iconName="search" onClick={() => this.handleToDetail(item.memberCode)}></BaseButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 ? <div className="table-message">Item not found</div> : ''}
        </div>

        {items.length !== 0 && this.itemRes === 30 ? (
          <div className="text-center">
            <span className="btn btn-loadmore" onClick={this.handleLoadMore}>
              Load more
            </span>
          </div>
        ) : null}
      </section>
    );
  };
}
