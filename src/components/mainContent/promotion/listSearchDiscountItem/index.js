//Plugin
import Paging from 'external/control/pagination';
import $ from 'jquery';
import React from 'react';

//Custom
import BaseComponent from 'components/BaseComponent';
import { DateHelper } from 'helpers';

import { Tag } from 'antd';
import Icons from 'images/icons';

export default class ListSearchDiscountItem extends BaseComponent {
  constructor(props) {
    super(props);

    this.items = this.props.items || [];
    this.page = this.props.page || 1;
    this.itemCount = this.props.itemCount || 0;
    this.pageSize = this.props.pageSize || 15;
    this.idComponent = this.props.idComponent;

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
    }
    if (newProps && newProps.itemCount) {
      this.itemCount = newProps.itemCount;
    }
    if (newProps && newProps.pageSize) {
      this.pageSize = newProps.pageSize;
    }

    this.refresh();
  };

  handleLoadResult = () => {
    this.props.handleLoadResult();
  };

  handleToDetail = (codeId) => {
    this.targetLink('/promotion-discount-item/' + codeId);
  };

  handleToDetailCopy = (codeId) => {
    this.targetLink('/promotion-discount-item/' + codeId + '/copy');
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

  getItemsSearch = () => {
    return this.items || [];
  };

  renderComp = () => {
    let items = this.getItemsSearch();

    return (
      <section id={this.idComponent}>
        <div className="wrap-table table-chart" style={{ overflow: 'initial' }}>
          {items.length > 0 ? (
            <div className="row">
              <div className="col-md-12 text-left">
                <div style={{ display: 'inline-block' }}>
                  <Paging
                    page={this.page}
                    onClickPaging={this.handleClickPaging}
                    onClickSearch={this.handleLoadResult}
                    itemCount={this.itemCount}
                    listItemLength={this.items.length}
                    pageSize={this.pageSize}
                  />
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
          <table className="table d-block w-full" style={{ maxHeight: 'calc(100vh - 230px)', overflow: 'auto' }}>
            <thead>
              <tr className="tr-sticky">
                <th className="fs-12 w10">
                  <input type="checkbox" ref="itemsOption" name="itemsOption" onChange={this.handleCheckAll} />
                </th>
                <th className="fs-12">Name</th>
                <th className="fs-12">Code</th>
                <th className="fs-12">Status</th>
                <th className="fs-12">Dept. of I&T code</th>
                <th className="fs-12 rule-date">Created date</th>
                <th className="fs-12 rule-date">From date</th>
                <th className="fs-12 rule-date">End date</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} onDoubleClick={() => this.handleToDetail(item.promotionCode)}>
                  <td>
                    <input
                      key={item.promotionCode}
                      type="checkbox"
                      // disabled={item.cancel || item.approved}
                      name="itemOption"
                      value={item.promotionCode}
                      data-code={item.promotionCode}
                    />
                  </td>
                  <td className="fs-12">{item.promotionName}</td>
                  <td className="fs-12">{item.promotionCode}</td>
                  <td className="fs-12">
                    {item.active === 1 ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>}
                  </td>
                  <td className="fs-12 rule-date flex items-center justify-end">
                    {item.docCode || '-'}{' '}
                    {item.docLink ? (
                      <a href={item.docLink} target="_blank" className="flex items-center">
                        <Icons.Link style={{ fontSize: '16px' }} />
                      </a>
                    ) : null}
                  </td>
                  <td className="fs-12 rule-date">{DateHelper.displayDate(item.createdDate)}</td>
                  <td className="fs-12 rule-date">{DateHelper.displayDate(item.fromDate)}</td>
                  <td className="fs-12 rule-date">{DateHelper.displayDate(item.toDate)}</td>
                  <td className="fs-12">
                    <Tag
                      color="orange"
                      style={{ cursor: 'pointer', display: 'inline-block' }}
                      onClick={() => this.handleToDetailCopy(item.promotionCode)}
                    >
                      Copy
                    </Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 ? <div className="table-message">Item not found</div> : ''}
        </div>

        {/* {items.length !== 0 ? (
                    <Paging
                        page={this.page}
                        onClickPaging={this.handleClickPaging}
                        onClickSearch={this.handleLoadResult}
                        itemCount={this.itemCount}
                        listItemLength={this.items.length}
                    />
                ) : null} */}
      </section>
    );
  };
}
