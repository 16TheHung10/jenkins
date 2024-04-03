import React from 'react';
import CustomAuthorizePage from 'pages/CustomAuthorizePage';

import PromotionReport from 'components/mainContent/reporting/marketingReport/MktPromotionTrans';
import PromotionTopComp from 'components/mainContent/reporting/marketingReport/MktPromotionTop';
import PromotionComp from 'components/mainContent/reporting/marketingReport/MktPromotion';
import Action from 'components/mainContent/Action';
import BreadCrumb from 'utils/breadCrumb';
import { Row, Tabs } from 'antd';

export default class ReportMktPromotionTrans extends CustomAuthorizePage {
	constructor(props) {
		super(props);
		this.state = {};
	}

	// handleShowPagePromotionInfo = () => {
	// 	super.targetLink("/report-mkt-info");
	// }

	handleShowPagePromotionInfoCheckTrans = () => {
		super.targetLink("/report-mkt-info-trans");
	}

	handleShowPagePromotionList = () => {
		super.targetLink("/report-mkt-promotion");
	}

	handleShowPagePromotionTop = () => {
		super.targetLink("/report-mkt-promotion-top");
	}

	renderAction() {
		let actionLeftInfo = [
			// {
			// 	"name": "Promotion information",
			// 	"actionType": "info",

			// 	"action": this.handleShowPagePromotionInfo
			// },
			{
				"name": "Promotion transaction",
				"actionType": "info",
				"classActive": "active",
				"action": this.handleShowPagePromotionInfoCheckTrans
			},
			{
				"name": "Promotion running",
				"actionType": "info",
				"action": this.handleShowPagePromotionList
			},
			{
				"name": "Top promotion",
				"actionType": "info",
				"action": this.handleShowPagePromotionTop
			},
		];

		let actionRightInfo = [];
		return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} />
	}

	renderTab = () => {
		const tabList = [
			{
				label: (
					<span>
						Promotion transaction
					</span>
				),
				key: '1',
				children: <div className="container-table pd-0">
					{/* <BreadCrumb data={dataBreadCrumb} /> */}
					<div className="col-md-12">
						<PromotionReport />
					</div>
				</div>
			},
			{
				label: (
					<span>
						Promotion running
					</span>
				),
				key: '2',
				children:
					<div className="container-table pd-0">
						<div className='col-md-12'>
							<PromotionComp />
						</div>
					</div >
			},
			{
				label: (
					<span>
						Top promotion
					</span>
				),
				key: '3',
				children: <div className="container-table pd-0">
					<div className='col-md-12'>
						<PromotionTopComp />
					</div>
				</div>
			}
		];

		return <>

			<Row gutter={30}>
				{/* <Col xl={24}> */}
				<div className="card-container" style={{ width: '100%' }}>
					<Tabs
						defaultActiveKey="1"
						items={tabList}
						type="card"
					/>
				</div >
				{/* </Col> */}
			</Row >
		</>
	}

	renderPage() {
		const dataBreadCrumb = [
			{
				href: '/',
				title: 'Home'
			},
			{
				href: '',
				title: 'Reporting'
			},
			{
				href: '',
				title: 'Promotion information'
			},
		];
		return (
			<>
				{this.renderAlert()}
				{/* {this.renderAction()} */}
				{this.renderTab()}
				{/* <div className="container-table">
					<BreadCrumb data={dataBreadCrumb} />
					<div className="col-md-12">
						<MDPromotionReport />
					</div>
				</div> */}
			</>
		)
	}
};


