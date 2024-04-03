import React from 'react';
import CustomAuthorizePage from 'pages/CustomAuthorizePage';

import CurrentInventoryReport from 'components/mainContent/reporting/searchComp/CurrentInventory';
import EstimateStockComp from 'components/mainContent/dashBoard/EstimateStock';
import StockMovementReport from 'components/mainContent/reporting/StockMovement';

import Action from 'components/mainContent/Action';
import CheckInventory from 'component/checkInventory/CheckInventory';
import { useHistory } from 'react-router-dom';
import { Row, Tabs } from 'antd';

const EstimateStock = () => {
  const history = useHistory();

  const handleClickChangeTab = (key) => {
    switch (key) {
      case '1':
        history.push('/report-current-inventory-by-store');
        break;
      case '2':
        history.push('/estimate-stock');
        break;
      case '3':
        history.push('/stock-movement');
        break;

      default:
        break;
    }
  };

  const renderTab = () => {
    const tabList = [
      {
        label: <span>Inv by store</span>,
        key: '1',
        children: (
          <div className="container-table pd-0">
            <div className="col-md-12">
              <CheckInventory>
                <CurrentInventoryReport />
              </CheckInventory>
            </div>
          </div>
        ),
      },
      {
        label: <span>SOH & Estimate</span>,
        key: '2',
        children: (
          <div className="container-table pd-0">
            <div className="col-md-12">
              <EstimateStockComp />
            </div>
          </div>
        ),
      },
      {
        label: <span>Stock movement</span>,
        key: '3',
        children: (
          <div className="container-table pd-0">
            <div className="col-md-12">
              <StockMovementReport />
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
            <Tabs defaultActiveKey="2" items={tabList} type="card" onChange={handleClickChangeTab} />
          </div>
          {/* </Col> */}
        </Row>
      </>
    );
  };

  return <>{renderTab()}</>;
};
class EstimateStockCC extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleShowInvByStore() {
    super.targetLink('/report-current-inventory-by-store');
  }

  handleShowInvByItem() {
    super.targetLink('/report-current-inventory-by-item');
  }
  handleShowSohEstimate() {
    super.targetLink('/estimate-stock');
  }
  handleShowStockmovement() {
    super.targetLink('/stock-movement');
  }

  renderAction() {
    let actionLeftInfo = [
      {
        name: 'Inv by store',
        actionType: 'info',
        action: this.handleShowInvByStore,
      },
      // {
      // 	"name" : "Inv by item",
      // 	"actionType": "info",

      // 	"action" : this.handleShowInvByItem
      // },
      {
        name: 'SOH & Estimate',
        actionType: 'info',
        classActive: 'active',
        action: this.handleShowSohEstimate,
      },
      {
        name: 'Stock movement',
        actionType: 'info',
        action: this.handleShowStockmovement,
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
        <div className="container-table">
          <div className="col-md-12">
            <CheckInventory>
              <EstimateStockComp />
            </CheckInventory>
          </div>
        </div>
      </>
    );
  }
}

export default EstimateStock;
