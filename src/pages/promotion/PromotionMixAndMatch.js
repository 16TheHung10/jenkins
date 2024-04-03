import React from 'react';
import CustomAuthorizePage from 'pages/CustomAuthorizePage';
import SearchPromotionMixAndMatch from 'components/mainContent/promotion/searchPromotionMixAndMatch';
import Action from 'components/mainContent/Action';

export default class PromotionMixAndMatch extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.searchRef = React.createRef();
  }

  handleCreate = () => {
    super.targetLink('/promotion-mix-and-match/create');
  };

  renderAction() {
    let actionLeftInfo = [
      {
        name: 'New',
        actionType: 'info',
        action: this.handleCreate,
      },
    ];

    let actionRightInfo = [];
    return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} />;
  }

  renderAlert() {
    return <div className="wrap-alert"></div>;
  }

  renderPage() {
    return (
      <>
        {this.renderAlert()}
        {this.renderAction()}
        <div className="container-table">
          <SearchPromotionMixAndMatch ref={this.searchRef} type={this.props.type} />
        </div>
      </>
    );
  }
}
