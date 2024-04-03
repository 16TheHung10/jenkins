import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import OrderShedule from "components/mainContent/orderSchedule";

export default class OrderSchedulePage extends CustomAuthorizePage {
    renderPage() {
        return (
            <>
                {this.renderAlert()}
                <div className="container-table pd-0">
                    <div className="col-md-12">
                        <OrderShedule />
                    </div>
                </div>
            </>
        );
    }
}
