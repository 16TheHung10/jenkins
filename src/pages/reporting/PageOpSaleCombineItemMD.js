import React from 'react';
import CustomAuthorizePage from 'pages/CustomAuthorizePage';

// import OpReportComp from "components/mainContent/reporting/mdReport/search/SalesopCombineItemMD";
import Action from 'components/mainContent/Action';

import SalesopDetailComp from 'components/mainContent/reporting/mdReport/search/SalesopDetailMD';
import OpReportComp from 'components/mainContent/reporting/mdReport/search/SalesopDisposalMD';
import SalesopSaleByCategoryComp from 'components/mainContent/reporting/mdReport/search/SalesopSaleByCategoryMD';
import SalesopPaymentByStoreComp from 'components/mainContent/reporting/mdReport/search/SalesopPaymentByStoreMD';
import SalesopSummaryByPaymentComp from 'components/mainContent/reporting/mdReport/search/SalesopSummaryByPaymentMD';
import DetailMonthMktComp from 'components/mainContent/reporting/mdReport/search/SearchDetailMonthMD';
import SalesopCombineItemComp from 'components/mainContent/reporting/mdReport/search/SalesopCombineItemMD';

import { Row, Tabs } from 'antd';
import { useHistory } from 'react-router-dom';

const PageOpSaleCombineItemMD = () => {
  const history = useHistory();
  const handleClickChangeTab = (key) => {
    switch (key) {
      case '1':
        history.push('/salesop-md');
        break;
      case '2':
        history.push('/page-op-disposal-md');
        break;
      case '3':
        history.push('/page-op-salebycategory-md');
        break;
      case '4':
        history.push('/page-op-paymentbystore-md');
        break;
      case '5':
        history.push('/page-op-summarybypayment-md');
        break;
      case '6':
        history.push('/page-op-detail-month-md');
        break;
      case '7':
        history.push('/page-op-combine-item-md');
        break;

      default:
        break;
    }
  };

  const renderTab = () => {
    const tabList = [
      {
        label: <span>Sales OP</span>,
        key: '1',
        children: (
          <div className="container-table pd-0">
            <div className="col-md-12">
              <SalesopDetailComp />
            </div>
          </div>
        ),
      },
      {
        label: <span>Disposal</span>,
        key: '2',
        children: (
          <div className="container-table pd-0">
            <div className="col-md-12">
              <OpReportComp />
            </div>
          </div>
        ),
      },
      {
        label: <span>Sales by cate</span>,
        key: '3',
        children: (
          <div className="container-table pd-0">
            <div className="col-md-12">
              <SalesopSaleByCategoryComp />
            </div>
          </div>
        ),
      },
      {
        label: <span>Payment sale by store</span>,
        key: '4',
        children: (
          <div className="container-table pd-0">
            <div className="col-md-12">
              <SalesopPaymentByStoreComp />
            </div>
          </div>
        ),
      },
      {
        label: <span>Summary payment</span>,
        key: '5',
        children: (
          <div className="container-table pd-0">
            <div className="col-md-12">
              <SalesopSummaryByPaymentComp />
            </div>
          </div>
        ),
      },
      {
        label: <span>Detail (2 months)</span>,
        key: '6',
        children: (
          <div className="container-table pd-0">
            <div className="col-md-12">
              <DetailMonthMktComp />
            </div>
          </div>
        ),
      },
      {
        label: <span>Recipe by items sales</span>,
        key: '7',
        children: (
          <div className="container-table pd-0">
            <div className="col-md-12">
              <SalesopCombineItemComp />
            </div>
          </div>
        ),
      },
    ];

    return (
      <>
        <Row gutter={30}>
          {/* <Col xl={24}> */}
          <div className="card-container" style={{ width: '100%' }}>
            <Tabs defaultActiveKey="7" items={tabList} type="card" onChange={handleClickChangeTab} />
          </div>
          {/* </Col> */}
        </Row>
      </>
    );
  };
  return <>{renderTab()}</>;
};
class PageOpSaleCombineItemMDCC extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.state = {};
    this.type = this.props.type || '';
  }

  handleMoveSalesOpDetail = () => {
    switch (this.type) {
      case 'md':
        super.targetLink('/salesop-md');
        return;

      default:
        super.targetLink('/salesop');
        return;
    }
  };

  handleMoveDisposal = () => {
    switch (this.type) {
      case 'md':
        super.targetLink('/page-op-disposal-md');
        return;

      default:
        super.targetLink('/page-op-disposal');
        return;
    }
  };

  handleMoveSalesByCategory = () => {
    switch (this.type) {
      case 'md':
        super.targetLink('/page-op-salebycategory-md');
        return;

      default:
        super.targetLink('/page-op-salebycategory');
        return;
    }
  };

  handleMovePaymentSalesByStore = () => {
    switch (this.type) {
      case 'md':
        super.targetLink('/page-op-paymentbystore-md');
        return;

      default:
        super.targetLink('/page-op-paymentbystore');
        return;
    }
  };

  handleMoveSummaryByPayment = () => {
    switch (this.type) {
      case 'md':
        super.targetLink('/page-op-summarybypayment-md');
        return;

      default:
        super.targetLink('/page-op-summarybypayment');
        return;
    }
  };

  handleMoveDetail = () => {
    switch (this.type) {
      case 'md':
        super.targetLink('/page-op-detail-month-md');
        return;

      default:
        super.targetLink('/page-op-detail-month');
        return;
    }
  };

  handleMoveCombineItem = () => {
    switch (this.type) {
      case 'md':
        super.targetLink('/page-op-combine-item-md');
        return;

      default:
        super.targetLink('/page-op-combine-item');
        return;
    }
  };

  renderAction() {
    let actionLeftInfo = [
      {
        name: 'Sales op',
        actionType: 'info',
        action: this.handleMoveSalesOpDetail,
      },
      {
        name: 'Disposal',
        actionType: 'info',
        action: this.handleMoveDisposal,
      },
      {
        name: 'Sales by cate',
        actionType: 'info',
        action: this.handleMoveSalesByCategory,
      },
      {
        name: 'Payment sale by store',
        actionType: 'info',
        action: this.handleMovePaymentSalesByStore,
      },
      {
        name: 'Summary payment',
        actionType: 'info',
        action: this.handleMoveSummaryByPayment,
      },
      {
        name: 'Detail 2M',
        actionType: 'info',
        action: this.handleMoveDetail,
      },
      {
        name: 'Recipe by items Sales',
        actionType: 'info',
        classActive: 'active',
        action: this.handleMoveCombineItem,
      },
    ];

    let actionRightInfo = [];
    return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} />;
  }

  renderPage() {
    return (
      <>
        {this.renderAlert()}
        {this.renderAction()}
        <OpReportComp />
      </>
    );
  }
}
export default PageOpSaleCombineItemMD;
