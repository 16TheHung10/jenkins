import React from 'react';
import CustomAuthorizePage from 'pages/CustomAuthorizePage';
import Search from 'components/mainContent/itemMaster/searchIM';
import Action from 'components/mainContent/Action';
import GuideLineComp from 'components/mainContent/guideLine/GuideLine';
import './itemMaster.css';
import ItemMasterNav from '../../components/mainContent/itemMaster/nav/ItemMasterNav';

class ItemMaster extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.searchRef = React.createRef();
    // this.handleDeleteIO = this.handleDeleteIO.bind(this);
    // this.handleApproveIO = this.handleApproveIO.bind(this);
    // this.handleShowCreateNewIO = this.handleShowCreateNewIO.bind(this);
    // this.handleShowDefaultIO = this.handleShowDefaultIO.bind(this);
    // this.handleShowIO = this.handleShowIO.bind(this);
  }

  handleShowCreate = () => {
    super.targetLink('/item-master/import');
  };

  handleShowNewFF = () => {
    super.targetLink('/item-master/create');
  };
  handeImportAttributesItem = () => {
    super.targetLink('/item-master/import-attributes');
  };
  handleShowNewRM = () => {
    super.targetLink('/item-master/create/normal');
  };

  renderAction = () => {
    let actionLeftInfo = [
      {
        name: 'New List Item',
        actionType: 'info',
        action: this.handleShowCreate,
      },
      {
        name: 'New One Item GM',
        actionType: 'info',
        action: this.handleShowNewRM,
      },
      {
        name: 'New One Item FF',
        actionType: 'info',
        action: this.handleShowNewFF,
      },
      {
        name: 'Import attributes item',
        actionType: 'info',
        action: this.handeImportAttributesItem,
      },
    ];

    let actionRightInfo = [];
    return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} />;
  };

  renderPage() {
    return (
      <>
        <div className="container-table">
          {this.renderAlert()}
          {/* {this.renderAction()} */}
          <ItemMasterNav version={this.props.version}>
            <GuideLineComp type="item" />
            <Search ref={this.searchRef} type={this.props.type} />
          </ItemMasterNav>
        </div>
      </>
    );
  }
}

export default ItemMaster;
