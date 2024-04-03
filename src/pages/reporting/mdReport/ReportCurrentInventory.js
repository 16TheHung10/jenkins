import React from 'react';
import CustomAuthorizePage from 'pages/CustomAuthorizePage';

import CurrentInventoryReport from 'components/mainContent/reporting/searchComp/CurrentInventory';
import Action from 'components/mainContent/Action';
import CheckInventory from 'component/checkInventory/CheckInventory';


export default class ReportCurrentInventory extends CustomAuthorizePage {
	constructor(props) {
		super(props);
		this.state = {};
	}

	handleShowInvByStore() {
		super.targetLink("/report-current-inventory-by-store-md");
	}

	// handleShowInvByItem() {
	// 	super.targetLink("/report-current-inventory-by-item-op");
	// }

	handleShowSohEstimate() {
		super.targetLink("/estimate-stock-md");
	}

	handleShowStockmovement() {
		super.targetLink("/stock-movement-md");
	}

	renderAction() {
		let actionLeftInfo = [
			{
				"name": "Stock by store",
				"actionType": "info",
				"classActive": "active",
				"action": this.handleShowInvByStore
			},
			// {
			// 	"name": "Stock by item",
			// 	"actionType": "info",
			// 	"action": this.handleShowInvByItem
			// },
			{
				"name": "SOH & Estimate",
				"actionType": "info",
				"action": this.handleShowSohEstimate
			},
			{
				"name": "Stock movement",
				"actionType": "info",
				"action": this.handleShowStockmovement
			}
		];

		let actionRightInfo = [];
		return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} />
	}

	renderPage() {
		return (
			<>
				{this.renderAlert()}
				{this.renderAction()}
				<CheckInventory>
					<CurrentInventoryReport />
				</CheckInventory>
			</>
		)
	}
};


