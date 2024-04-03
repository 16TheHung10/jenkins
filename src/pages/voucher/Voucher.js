import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";

import SearchBooking from "components/mainContent/voucher/searchVoucher";
import Action from "components/mainContent/Action";
import VoucherModel from "models/VoucherModel";

class Voucher extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.searchBookingRef = React.createRef();
  }

  renderAction() {
    let actionLeftInfo = [];
    let actionRightInfo = [];
    return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} />;
  }

  renderPage() {
    return (
      <>
        {this.renderAlert()}
        {this.renderAction()}
        <div className="container-table">
          <SearchBooking ref={this.searchBookingRef} />
        </div>
      </>
    );
  }
}

export default Voucher;
