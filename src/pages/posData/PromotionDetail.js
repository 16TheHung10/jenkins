import React from "react";
import CustomAuthorizePage from "pages/CustomAuthorizePage";
import Action from "components/mainContent/Action";
import DetailPromotionComp from "components/mainContent/posData/detailPromotion/DetailPromotion";

export default class PromotionDetailPage extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.detailPromotionRef = React.createRef();
    this.partners = props.partners;
    this.indexPromotion = props.indexPromotion;
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleSave() {
    this.detailPromotionRef.current.handleSave();
  }

  handleCreate() {
    this.detailPromotionRef.current.handleCreate();
  }

  handleDelete() {
    this.detailPromotionRef.current.handleDelete();
  }

  renderAction() {
    let actionLeftInfo = [
      {
        name: "Save",
        actionType: "save",
        action: this.handleSave,
        hide: false,
        actionName: "save",
      },
    ];

    let actionRightInfo = [
      {
        name: "Delete",
        actionType: "delete",
        action: this.handleDelete,
        hide: false,
        actionName: "delete",
      },
    ];
    return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} />;
  }

  renderPage() {
    return (
      <>
        {this.renderAlert()}
        {this.renderAction()}
        <div className="container-table hContainerTable">
          <DetailPromotionComp
            partners={this.partners}
            indexPromotion={this.indexPromotion}
            ref={this.detailPromotionRef}
          ></DetailPromotionComp>
        </div>
      </>
    );
  }
}
