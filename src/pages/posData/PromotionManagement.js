import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import Action from "components/mainContent/Action";
import ListPromotionComp from "components/mainContent/posData/listPromotion/ListPromotion";
export default class PromotionManagement extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.listPromotionRef = React.createRef();
    this.partners = props.partners;
    this.handleCreate = this.handleCreate.bind(this);
    this.isExistPromotion = false;
    // this.handleGetPromotion();
  }

  //   handleGetPromotion = async () => {
  //     let posDataModel = new PosDataModel();
  //     let params = {
  //       partners: this.partners,
  //     };
  //     await posDataModel.getPromotion(params).then((response) => {
  //       if (response.status) {
  //         if (response.data.promotion != null) {
  //           this.isExistPromotion = response.data.promotion.data.length > 0;
  //           this.refresh();
  //         }
  //       }
  //     });
  //   };
  handleCreate() {
    super.targetLink("/paymentpromotion/" + this.partners + "/create");
  }

  renderAction() {
    let actionLeftInfo = [
      {
        name: "New",
        actionType: "info",
        action: this.handleCreate,
        isConfirm: this.isExistPromotion,
        titlePopconfirm:
          "Đã tồn tại chương trình khuyến mãi nếu tạo mới chương trình khuyến mãi cũ sẽ được ghi đè.",
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
        <div id="listPromotionComp" className="container-table hContainerTable">
          <ListPromotionComp
            partners={this.props.partners}
            ref={this.listPromotionRef}
          />
        </div>
      </>
    );
  }
}
