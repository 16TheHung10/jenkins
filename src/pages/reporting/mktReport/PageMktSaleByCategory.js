import React from 'react';
import SalesByCategory from 'components/mainContent/reporting/mktReport/search/SaleByCategory';
import SummaryPayment from 'components/mainContent/reporting/mktReport/search/SummaryByPayment';
import { Row, Tabs } from 'antd';
import DetailMonth from 'components/mainContent/dashBoard/dailySalesSettlement/DetailMonth';

const PageMktSaleByCategory = () => {
  const renderTab = () => {
    const tabList = [
      {
        label: <span>Sales by category</span>,
        key: '1',
        children: (
          <div className="container-table pd-0">
            <div className="col-md-12">
              <SalesByCategory />
            </div>
          </div>
        ),
      },
      {
        label: <span>Summary payment</span>,
        key: '2',
        children: (
          <div className="container-table pd-0">
            <div className="col-md-12">
              <SummaryPayment />
            </div>
          </div>
        ),
      },
      {
        label: <span>Detail (2 months)</span>,
        key: '3',
        children: (
          <div className="container-table pd-0">
            <div className="col-md-12">
              <DetailMonth />
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
            <Tabs defaultActiveKey="1" items={tabList} type="card" />
          </div>
          {/* </Col> */}
        </Row>
      </>
    );
  };
  return <>{renderTab()}</>;
};
// class PageMktSaleByCategoryCC extends CustomAuthorizePage {
// 	constructor(props) {
// 		super(props);
// 		this.state = {};
// 		this.type = this.props.type || "";
// 	}

// 	handleMoveMktSaleByCate = () => {
// 		super.targetLink("/page-mkt-salebycategory")
// 	}

// 	handleMoveMktSummaryPayment = () => {
// 		super.targetLink("/page-mkt-summarybypayment")
// 	}

// 	renderAction() {
// 		let actionLeftInfo = [
// 			{
// 				"name": "Sales by cate",
// 				"actionType": "info",
// 				"classActive": "active",
// 				"action": this.handleMoveMktSaleByCate
// 			}, {
// 				"name": "Summary payment",
// 				"actionType": "info",
// 				"action": this.handleMoveMktSummaryPayment
// 			},
// 		];

// 		let actionRightInfo = [];
// 		return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} />
// 	}

// 	renderPage() {
// 		return (
// 			<>
// 				{this.renderAlert()}
// 				{this.renderAction()}
// 				<OpReportComp type={this.type} />

// 			</>
// 		);
// 	}
// };
export default PageMktSaleByCategory;
