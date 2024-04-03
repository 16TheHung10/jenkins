import React from 'react';
import CustomAuthorizePage from 'pages/CustomAuthorizePage';

import MDPromotionReport from 'components/mainContent/reporting/searchComp/MDPromotionTrans';
import Action from 'components/mainContent/Action';
import BreadCrumb from 'utils/breadCrumb';

export default class ReportMDPromotion extends CustomAuthorizePage {
	constructor(props) {
		super(props);
		this.state = {};
	}

	// handleShowPagePromotionInfo = () => {
	// 	super.targetLink("/report-mkt-info");
	// }

	handleShowPagePromotionInfoCheckTrans = () => {
		super.targetLink("/report-mkt-info-trans-md");
	}

	handleShowPagePromotionList = () => {
		super.targetLink("/report-mkt-promotion-md");
	}

	handleShowPagePromotionTop = () => {
		super.targetLink("/report-mkt-promotion-top-md");
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
				{this.renderAction()}
				<div className="container-table">
					<BreadCrumb data={dataBreadCrumb} />
					<div className="col-md-12">
						<MDPromotionReport />
					</div>
				</div>
			</>
		)
	}
};


