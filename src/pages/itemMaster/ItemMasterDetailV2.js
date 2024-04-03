import React from 'react';
import CustomAuthorizePage from 'pages/CustomAuthorizePage';
import Action from 'components/mainContent/Action';

import SearchIMDetail from 'components/mainContent/itemMaster/searchIMDetailV2';

export default class ItemMasterDetailV2 extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.code = this.props.code || '';
    this.searchIMDetailRef = React.createRef();
  }

  handleSave = () => {
    this.searchIMDetailRef.current.handleSave();
  };

  renderPage() {
    return (
      <>
        <div className="container-table">
          {/* { this.renderAction() }\ */}
          <SearchIMDetail type={this.props.type} code={this.code} ref={this.searchIMDetailRef} />
        </div>
      </>
    );
  }
}
