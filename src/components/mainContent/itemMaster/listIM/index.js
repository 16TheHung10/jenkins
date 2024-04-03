import React from 'react';
import BaseComponent from 'components/BaseComponent';
import { StringHelper } from 'helpers';
import { routerRef } from 'App';
import { Tag } from 'antd';
class ListIM extends BaseComponent {
  constructor(props) {
    super(props);
    this.items = this.props.items || [];
    this.data.suppliers = this.props.suppliers || {};
    this.data.divisions = this.props.divisions || {};
    this.data.groups = this.props.groups || {};
    this.data.categorySubClasses = this.props.categorySubClasses || {};

    this.idComponent = this.props.idComponent;
    this.isRender = true;
  }

  componentDidMount() {}

  handleShowIMDetail(code) {
    console.log('routerRef.current.location.pathname', routerRef.current);
    super.targetLink('/item-master/' + code);
  }
  handleShowIMDetailV2(code) {
    super.targetLink('/item-master/v2/' + code);
  }

  componentWillReceiveProps(newProps) {
    if (this.items !== newProps.items) {
      this.items = newProps.items;
    }
    if (this.data.suppliers !== newProps.suppliers) {
      this.data.suppliers = newProps.suppliers;
    }
    if (this.data.divisions !== newProps.divisions) {
      this.data.divisions = newProps.divisions;
    }
    if (this.data.groups !== newProps.groups) {
      this.data.groups = newProps.groups;
    }
    if (this.data.categorySubClasses) {
      this.data.categorySubClasses = newProps.categorySubClasses;
    }
    this.refresh();
  }

  handleGetNameSupplier = (code) => {
    let suppliers = Object.values(this.data.suppliers).filter((item) => item.supplierCode === code);
    let name = suppliers[0] ? suppliers[0].supplierName : '';
    return name;
  };

  handleGetNameDivision = (code) => {
    let divitions = Object.values(this.data.divisions).filter((item) => item.divisionCode === code);
    let name = divitions[0] ? divitions[0].divisionName : '';
    return name;
  };

  handleGetNameGroup = (code) => {
    let groups = Object.values(this.data.groups).filter((item) => item.groupCode === code);

    let name = groups[0] ? groups[0].groupName : '';
    return name;
  };

  handleGetNameSubClass = (code) => {
    let subClass = Object.values(this.data.categorySubClasses).filter((item) => item.subClassCode === code);

    let name = subClass[0] ? subClass[0].subClassName : '';
    return name;
  };

  handleReturnType = (type, level) => {
    if (type === 0 && level === 0) {
      return 'normal';
    }
    if (type === 0 && level === 1) {
      return 'convert';
    }
    if (type === 1 && level === 1) {
      return 'combine';
    }
  };

  renderComp() {
    let items = this.items;

    return (
      <section id={this.idComponent} style={{ fontSize: 11 }}>
        <div className="wrap-table htable " style={{ maxHeight: 'calc(100vh - 407px)' }}>
          <table className="table table-hover ">
            <thead>
              <tr>
                <th>Item</th>
                <th>Supplier</th>
                <th>Division</th>
                <th>Category</th>
                <th>Sub Category</th>
                <th className="rule-number ">Cost price</th>
                {/* <th>Type</th> */}
                {this.props?.isSearchWithStore ? (
                  <>
                    <th>Allow sold</th>
                    <th>Allow return</th>
                    <th>Allow order</th>
                    <th>Selling Price</th>
                  </>
                ) : null}
                {/* <th>Note</th> */}
                <th className="text-center">Type</th>
                <th>Update By</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr
                  key={i}
                  onDoubleClick={() =>
                    routerRef.current.history.location.pathname?.includes('item-master/v2')
                      ? this.handleShowIMDetailV2(item.itemCode)
                      : this.handleShowIMDetail(item.itemID)
                  }
                >
                  <td>
                    <div className="m-0">
                      <p className="m-0">{item.itemName}</p>
                      <span className="hint">{item.itemCode}</span>
                    </div>
                  </td>
                  <td>{this.handleGetNameSupplier(item.supplierCode)}</td>
                  <td>{this.handleGetNameDivision(item.divisionCode)}</td>
                  <td>{item.categoryName}</td>
                  <td>{item.subCategoryName}</td>
                  <td style={{ textAlign: 'end' }}>{StringHelper.formatPrice(item.costPrice)}</td>
                  {/* <td>{this.handleReturnType(item.type,item.level)}</td> */}
                  {this.props?.isSearchWithStore ? (
                    <>
                      <td className="text-center">
                        {item.allowSold === true ? 'Yes' : item.allowSold === false ? 'No' : '-'}
                      </td>
                      <td className="text-center">
                        {item.allowReturn === true ? 'Yes' : item.allowReturn === false ? 'No' : '-'}
                      </td>
                      <td className="text-center">
                        {item.allowOrder === true ? 'Yes' : item.allowOrder === false ? 'No' : '-'}
                      </td>
                      <td className="text-center">
                        {item.sellingPrice ? StringHelper.formatPrice(item.sellingPrice) : '-'}
                      </td>
                    </>
                  ) : null}
                  <td className="text-center">
                    {item.type === 1 ? (
                      <Tag className="m-0" color="blue">
                        Region
                      </Tag>
                    ) : item.type === 2 ? (
                      <Tag className="m-0" color="green">
                        Store
                      </Tag>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="text-center">{item.updatedBy}</td>
                  {/* <td>{item.note}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
          {items.length == 0 ? <div className="table-message">Item not found</div> : ''}
        </div>
      </section>
    );
  }
}

export default ListIM;
