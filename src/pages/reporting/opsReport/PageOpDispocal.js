import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";

import OpReportComp from "components/mainContent/reporting/opsReport/search/SalesopDisposal";
import Action from "components/mainContent/Action";

export default class PageOpDispocal extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.state = {};
    this.type = this.props.type || "";
  }

  handleMoveSalesOpDetail = () => {
    super.targetLink("/salesop");
  };

  handleMoveDisposal = () => {
    super.targetLink("/page-op-disposal");
  };

  handleMoveSalesByCategory = () => {
    super.targetLink("/page-op-salebycategory");
  };

  handleMovePaymentSalesByStore = () => {
    super.targetLink("/page-op-paymentbystore");
  };

  handleMoveSummaryByPayment = () => {
    super.targetLink("/page-op-summarybypayment");
  };

  handleMoveDetail = () => {
    super.targetLink("/page-op-detail-month");
  };

  handleMoveCombineItem = () => {
    super.targetLink("/page-op-combine-item");
  };

  handleMoveCustomerType = () => {
    super.targetLink("/customer-type");
  };

  renderAction() {
    let actionLeftInfo = [
      {
        name: "Sales op",
        actionType: "info",
        action: this.handleMoveSalesOpDetail,
      },
      {
        name: "Disposal",
        actionType: "info",
        classActive: "active",
        action: this.handleMoveDisposal,
      },
      {
        name: "Sales by cate",
        actionType: "info",
        action: this.handleMoveSalesByCategory,
      },
      {
        name: "Payment sale by store",
        actionType: "info",
        action: this.handleMovePaymentSalesByStore,
      },
      {
        name: "Summary payment",
        actionType: "info",
        action: this.handleMoveSummaryByPayment,
      },
      {
        name: "Detail 2M",
        actionType: "info",
        action: this.handleMoveDetail,
      },
      {
        name: "Recipe by items Sales",
        actionType: "info",
        action: this.handleMoveCombineItem,
      },
      {
        name: "Customer type",
        actionType: "info",

        action: this.handleMoveCustomerType,
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
