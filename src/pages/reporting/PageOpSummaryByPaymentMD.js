import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";

import OpReportComp from "components/mainContent/reporting/mdReport/search/SalesopSummaryByPaymentMD";
import Action from "components/mainContent/Action";

export default class PageOpSummaryByPaymentMD extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.state = {};
    this.type = this.props.type || "";
  }

  handleMoveSalesOpDetail = () => {
    switch (this.type) {
      case "md":
        super.targetLink("/salesop-md");
        return;

      default:
        super.targetLink("/salesop");
        return;
    }
  };

  handleMoveDisposal = () => {
    switch (this.type) {
      case "md":
        super.targetLink("/page-op-disposal-md");
        return;

      default:
        super.targetLink("/page-op-disposal");
        return;
    }
  };

  handleMoveSalesByCategory = () => {
    switch (this.type) {
      case "md":
        super.targetLink("/page-op-salebycategory-md");
        return;

      default:
        super.targetLink("/page-op-salebycategory");
        return;
    }
  };

  handleMovePaymentSalesByStore = () => {
    switch (this.type) {
      case "md":
        super.targetLink("/page-op-paymentbystore-md");
        return;

      default:
        super.targetLink("/page-op-paymentbystore");
        return;
    }
  };

  handleMoveSummaryByPayment = () => {
    switch (this.type) {
      case "md":
        super.targetLink("/page-op-summarybypayment-md");
        return;

      default:
        super.targetLink("/page-op-summarybypayment");
        return;
    }
  };

  handleMoveDetail = () => {
    switch (this.type) {
      case "md":
        super.targetLink("/page-op-detail-month-md");
        return;

      default:
        super.targetLink("/page-op-detail-month");
        return;
    }
  };

  handleMoveCombineItem = () => {
    switch (this.type) {
      case "md":
        super.targetLink("/page-op-combine-item-md");
        return;

      default:
        super.targetLink("/page-op-combine-item");
        return;
    }
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
        classActive: "active",
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
