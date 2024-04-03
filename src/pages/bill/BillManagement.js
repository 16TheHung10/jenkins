import React from 'react';
import CustomAuthorizePage from 'pages/CustomAuthorizePage';
import Action from 'components/mainContent/Action';

import { message } from 'antd';
import AccountState from 'helpers/AccountState';
import BillComp from 'components/mainContent/bill/BillComp';

export default class BillManagement extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCreate = () => {
    this.targetLink('/loyalty');
  };

  handleMoveBillManagement = () => {
    if (AccountState.getInstance().isAdmin()) {
      super.targetLink('/bill-management');
    } else {
      message.error('Permission denied');
    }
  };

  handleMoveRefundOrder = () => {
    if (AccountState.getInstance().isAdmin()) {
      super.targetLink('/refund-order');
    } else {
      message.error('Permission denied');
    }
  };

  handleMerge = () => {
    super.targetLink('/loyalty/merge');
  };

  handleReport = () => {
    super.targetLink('/loyalty/reporting');
  };

  handleNotify = () => {
    super.targetLink('/loyalty-notify');
  };

  handleRedeem = () => {
    super.targetLink('/loyalty/redeem-voucher');
  };

  renderAction() {
    let actionLeftInfo = [
      {
        name: 'Loyalty',
        actionType: 'info',

        action: this.handleCreate,
      },
      {
        name: 'Merge',
        actionType: 'info',
        action: this.handleMerge,
      },

      {
        name: 'Notify',
        actionType: 'info',
        action: this.handleNotify,
      },
      {
        name: 'Claim Voucher',
        actionType: 'info',
        action: this.handleRedeem,
      },
      {
        name: 'Bill search',
        actionType: 'info',
        classActive: 'active',
        action: this.handleMoveBillManagement,
      },
      // {
      //   name: 'Refund order',
      //   actionType: 'info',
      //   action: this.handleMoveRefundOrder,
      // },
    ];
    let actionRightInfo = [];
    return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} />;
  }

  renderPage() {
    return (
      <>
        <div className="container-table">
          {this.renderAlert()}
          {this.renderAction()}
          <BillComp />
        </div>
      </>
    );
  }
}
