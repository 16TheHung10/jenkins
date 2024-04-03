import Action from 'components/mainContent/Action';
import GuideLineComp from 'components/mainContent/guideLine/GuideLine';
import ChangeCostPrice from 'components/mainContent/itemMaster/changeCostPrice';
import ChangePromotionCostPrice from 'components/mainContent/itemMaster/changePromotionCostPrice';
import ChangeSellingPrice from 'components/mainContent/itemMaster/changeSellingPrice';
import CommonModel from 'models/CommonModel';
import CustomAuthorizePage from 'pages/CustomAuthorizePage';
import React from 'react';

export default class ItemMasterChangeCostPrice extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.changeCostRef = React.createRef();
    this.changePromotionCostRef = React.createRef();
    this.changeSellingRef = React.createRef();
    this.suppliers = {};
    this.divisions = {};
    this.groups = {};
    this.subclasses = {};
    this.tabSelected = 'change-cost-price';
  }
  componentDidMount() {
    this.handleGetDataCommon();
  }
  changeTab(classTarget, idTarget, e, classBtn) {
    var i;
    var x = document.getElementsByClassName(classTarget);
    for (i = 0; i < x.length; i++) {
      x[i].style.display = 'none';
    }
    document.getElementById(idTarget).style.display = 'block';

    if (classBtn) {
      var x = document.getElementsByClassName(classBtn);
      for (i = 0; i < x.length; i++) {
        x[i].classList.remove('active');
      }
    }
    if (e) {
      e.currentTarget.classList.add('active');
    }
    this.tabSelected = idTarget;
  }
  handleGetDataCommon = async () => {
    let commonModel = new CommonModel();
    await commonModel.getData('supplier,division,group,subclass').then((response) => {
      if (response.status) {
        this.suppliers = response.data.suppliers;
        this.divisions = response.data.divisions;
        this.groups = response.data.groups;
        this.subclasses = response.data.subclasses;
      }
    });
    this.refresh();
  };
  renderAction() {
    let actionLeftInfo = [
      {
        name: 'Save',
        actionType: 'info',
        action: this.handleSave,
      },
    ];

    let actionRightInfo = [];
    return <Action leftInfo={actionLeftInfo} rightInfo={actionRightInfo} />;
  }
  handleSave = () => {
    switch (this.tabSelected) {
      case 'change-cost-price':
        this.changeCostRef.current.handleSave();
        break;
      case 'change-promotion-price':
        this.changePromotionCostRef.current.handleSave();
        break;
      case 'change-selling-price':
        this.changeSellingRef.current.handleSave();
        break;
      default:
        break;
    }
  };
  renderPage() {
    return (
      <>
        <div className="container-table">
          {this.renderAlert()}
          {this.renderAction()}
          <GuideLineComp type="changePrice" />
          <div className="form-filter" style={{ padding: '10px 0 0' }}>
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-12">
                    <div className="tt-tbtab" style={{ padding: 0, backgroundColor: 'transparent' }}>
                      <button
                        className="btn-title-tab active"
                        style={{ background: 'rgb(0,154,255)', width: 175 }}
                        onClick={(e) => this.changeTab('detail-tab', 'change-cost-price', e, 'btn-title-tab')}
                      >
                        Master cost Price
                      </button>
                      <button
                        className="btn-title-tab"
                        style={{ background: 'rgb(0,212,233)', width: 180 }}
                        onClick={(e) => this.changeTab('detail-tab', 'change-promotion-price', e, 'btn-title-tab')}
                      >
                        Promotion Cost Price
                      </button>
                      <button
                        className="btn-title-tab"
                        style={{ background: 'rgb(0,154,255)' }}
                        onClick={(e) => this.changeTab('detail-tab', 'change-selling-price', e, 'btn-title-tab')}
                      >
                        Selling Price
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="change-cost-price" className="detail-tab row">
              <div className="col-md-12">
                <div
                  className="wrap-block-table css-detail-tab"
                  style={{ borderColor: 'rgb(0,154,255)', overflow: 'initial' }}
                >
                  <ChangeCostPrice
                    ref={this.changeCostRef}
                    suppliers={this.suppliers}
                    divisions={this.divisions}
                    groups={this.groups}
                    categorySubClasses={this.subclasses}
                  />
                </div>
              </div>
            </div>
            <div id="change-promotion-price" className="detail-tab row d-none">
              <div className="col-md-12">
                <div
                  className="wrap-block-table css-detail-tab"
                  style={{ borderColor: 'rgb(0,154,255)', overflow: 'initial' }}
                >
                  <ChangePromotionCostPrice
                    ref={this.changePromotionCostRef}
                    suppliers={this.suppliers}
                    divisions={this.divisions}
                    groups={this.groups}
                    categorySubClasses={this.subclasses}
                  />
                </div>
              </div>
            </div>
            <div id="change-selling-price" className="detail-tab row d-none">
              <div className="col-md-12">
                <div
                  className="wrap-block-table css-detail-tab"
                  style={{ borderColor: 'rgb(0,154,255)', overflow: 'initial' }}
                >
                  <ChangeSellingPrice
                    ref={this.changeSellingRef}
                    suppliers={this.suppliers}
                    divisions={this.divisions}
                    groups={this.groups}
                    categorySubClasses={this.subclasses}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
