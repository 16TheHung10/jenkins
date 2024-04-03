import React, { Fragment } from "react";
import { message } from "antd";
import BaseComponent from "components/BaseComponent";
import ContentPromotionComp from "components/mainContent/posData/detailPromotion/ContentPromotion";
import PosDataModel from "models/PosDataModel";
import Moment from "moment";
import PartnerPromotionApi from "api/PartnerPromotionApi";

export default class DetailPromotion extends BaseComponent {
  constructor(props) {
    super(props);
    this.contentPromotionRef = React.createRef();
    this.listPromotionRef = React.createRef();
    this.partners = props.partners;
    this.indexPromotion = props.indexPromotion;
    this.dataPromotionSelected = null;
    this.items = {};
    this.isCreate = false;
    this.isUpdate = false;
    this.fieldSelected = this.assignFieldSelected({
      id: "",
      name: "",
      updatedDate: new Date(),
      groupName: "",
      encryption: false,
      type: "Promotion",
      data: [],
      totalItemValueMin: 0,
    });
  }
  handleCreate = () => {
    this.dataPromotionSelected = {
      name: "",
      image: "",
      startDate: new Date(),
      endDate: new Date(),
      promotionGS25: "",
      promotionPartner: "",
      isOnItem: false,
      items: [],
      totalItemValueMin: 0.0,
      matchedItemMin: 0,
      totalValueMin: 0.0,
    };

    this.refresh();
  };

  handleDelete = async () => {
    let fields = this.fieldSelected;
    this.fieldSelected.data.splice(this.indexPromotion, 1);
    let params = {
      ID: fields.id,
      Name: fields.name,
      UpdatedDate: Moment().format("YYYY/MM/DD HH:mm:ss"),
      GroupName: fields.groupName,
      Encryption: fields.encryption,
      Type: fields.type,
      Data: fields.data,
      ValidStoreCode: "",
    };
    let posDataModel = new PosDataModel();
    await posDataModel.updatePromotion(this.partners, params).then((res) => {
      if (res.status) {
        this.showAlert("Save successfully!", "success");
        super.back("/paymentpromotion/" + this.partners);
      } else {
        this.showAlert(res.message);
      }
    });
  };

  handleSave = async () => {
    if (!this.items || Object.keys(this.items || {}).length === 0) {
      message.info("App is loading, please try again");
      return;
    }
    let fields = this.fieldSelected;
    let dataContent = this.contentPromotionRef.current.getDataContent();
    if (!dataContent) {
      return false;
    }

    this.fieldSelected.data = new Array(dataContent);
    fields.data = this.fieldSelected.data.filter((item) => {
      return (
        Moment(item.endDate).format("YYYY/MM/DD") >=
        Moment().format("YYYY/MM/DD")
      );
    });
    let params = {
      ID: fields.id,
      Name: fields.name,
      UpdatedDate: Moment().format("YYYY/MM/DD HH:mm:ss"),
      GroupName: fields.groupName,
      Encryption: fields.encryption,
      Type: fields.type,
      Data: fields.data,
      ValidStoreCode: "",
    };
    let posDataModel = new PosDataModel();
    await posDataModel.updatePromotion(this.partners, params).then((res) => {
      if (res.status) {
        // Add log
        PartnerPromotionApi.postTraceLog(JSON.stringify(params));
        this.showAlert("Save successfully!", "success");
        super.back("/paymentpromotion/" + this.partners);
      } else {
        this.showAlert(res.message);
      }
    });
  };

  componentDidMount() {
    this.handleGetItems();
    this.handleGetSuppliers();
    this.handleGetPromotion();
    if (this.indexPromotion != undefined) {
      this.isUpdate = true;
    } else {
      this.handleCreate();
      this.isCreate = true;
    }
  }

  handleGetPromotion = async () => {
    let posDataModel = new PosDataModel();
    let params = {
      partners: this.partners,
    };
    await posDataModel.getPromotion(params).then((response) => {
      if (response.status) {
        if (response.data.promotion != null) {
          this.data = response.data;
          this.fieldSelected.id = response.data.promotion.id;
          this.fieldSelected.name = response.data.promotion.name;
          this.fieldSelected.updatedDate = new Date(
            response.data.promotion.updatedDate,
          );
          this.fieldSelected.groupName = response.data.promotion.groupName;
          this.fieldSelected.encryption = response.data.promotion.encryption;
          this.fieldSelected.type = response.data.promotion.type;
          this.fieldSelected.data = response.data.promotion.data;
          this.dataPromotionSelected =
            this.fieldSelected.data[this.indexPromotion];
          this.refresh();
        }
      }
    });
  };

  handleGetItems = async () => {
    let posDataModel = new PosDataModel();
    let params = {};
    await posDataModel.getAllItems(params).then((response) => {
      if (response.status && response.data.items) {
        this.items = response.data.items;
        this.refresh();
      }
    });
  };

  handleGetSuppliers = async () => {
    let posDataModel = new PosDataModel();
    let params = {};
    await posDataModel.getAllSuppliers(params).then((response) => {
      if (response.status && response.data.suppliers) {
        this.suppliers = response.data.suppliers;
        this.refresh();
      }
    });
  };

  renderComp = () => {
    let fields = this.fieldSelected;
    return (
      <section>
        <div className="row header-detail">
          <div className="col-md-6" style={{ marginBottom: "15px" }}>
            {
              <button
                onClick={() => super.back("/paymentpromotion/" + this.partners)}
                type="button"
                className="btn btn-back"
                style={{ background: "beige" }}
              >
                Back
              </button>
            }
            <h2
              style={{
                margin: "10px 0px 0px 0px",
                display: "inline-block",
                verticalAlign: "middle",
              }}
            >
              {"#" + this.partners}
            </h2>
          </div>
          <div className="col-md-6">
            <div className="bg-note cl-red" style={{ marginTop: "5px" }}>
              <p style={{ margin: 0 }}>
                Dữ liệu cập nhật sẽ được đồng bộ xuống POS khi qua ngày
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <ContentPromotionComp
              dataPromotion={this.dataPromotionSelected}
              items={this.items}
              suppliers={this.suppliers}
              ref={this.contentPromotionRef}
            ></ContentPromotionComp>
          </div>
        </div>
      </section>
    );
  };
}
