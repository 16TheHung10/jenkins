//Plugin
import React from "react";

//Custom
import { Col, Row } from "antd";
import BaseComponent from "components/BaseComponent";
import PromotionPaymentHistory from "components/mainContent/promotion/paymentHistory/PromotionPaymentHistory";
import { StringHelper } from "helpers";
import PosDataModel from "models/PosDataModel";
import Moment from "moment";

export default class ListPromotion extends BaseComponent {
  constructor(props) {
    super(props);
    this.idComponent = "idProList" + StringHelper.randomKey();
    this.items = this.props.promotion || [];
    this.partners = props.partners;
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
  componentDidMount() {
    this.handleGetPromotion();
  }
  componentWillReceiveProps(newProps) {
    if (this.partners !== newProps.partners) {
      this.partners = newProps.partners;
      this.handleGetPromotion();
    }
    this.refresh();
  }
  handleGetDataPromotion = () => {
    return this.fieldSelected.data;
  };
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
          this.refresh();
        }
      }
    });
  };
  handleToDetail = (index) => {
    super.targetLink("/paymentpromotion/" + this.partners + "/update/" + index);
  };
  renderComp = () => {
    let fields = this.fieldSelected;
    return (
      <section id={this.idComponent} className="section-block mt-15">
        <Row gutter={[16, 16]} className="header-detail">
          <Col span={12} style={{ marginBottom: "15px" }}>
            <h2
              style={{
                margin: "10px 0px 0px 0px",
                display: "inline-block",
                verticalAlign: "middle",
              }}
            >
              {"#" + fields.name}
              {!this.isCreate && (
                <span
                  htmlFor="updatedDate"
                  className="w100pc"
                  style={{ fontSize: 14, fontWeight: "normal" }}
                >
                  {" "}
                  Updated Date:{" "}
                  <span>
                    {Moment(fields.updatedDate).format("DD/MM/YYYY HH:mm:ss")}
                  </span>
                </span>
              )}
            </h2>
            <div
              className="wrap-table htable w-fit  mt-15"
              style={{ maxHeight: "calc(100vh - 160px)", zIndex: 0 }}
            >
              <table className="table table-hover w-fit">
                <thead>
                  <tr>
                    <th></th>
                    <th>Title</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Promotion GS25</th>
                    <th>Promotion Partner</th>
                  </tr>
                </thead>
                <tbody>
                  {this.fieldSelected.data.map((item, i) => (
                    <tr
                      key={i}
                      onDoubleClick={this.handleToDetail.bind(null, i)}
                    >
                      <td>
                        <input key={i} type="radio" />
                      </td>
                      <td className="col-md-3">{item.name} </td>
                      <td className="col-md-3">
                        {Moment(item.startDate).format("DD/MM/YYYY")}{" "}
                      </td>
                      <td className="col-md-3">
                        {Moment(item.endDate).format("DD/MM/YYYY")}{" "}
                      </td>
                      <td className="col-md-3">{item.promotionGS25}</td>
                      <td className="col-md-3">{item.promotionPartner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {this.fieldSelected.data.length === 0 ? (
                <div className="table-message">Item not found</div>
              ) : (
                ""
              )}
            </div>
          </Col>
          <Col span={8} offset={4}>
            {fields?.name === "TapTap" ? (
              <div className="cl-red bg-note">
                <span>
                  <strong>Lưu ý chức năng</strong> Promotion link partner TAPTAP
                </span>
                <br />
                1. Member là member của TAP TAP.
                <br />
                2. Nếu có mua list items theo điều kiện partner TAPTAP – yêu
                cầu.
                <br />
                3. Giao dịch thực hiện nếu thỏa điều kiện member link có là
                thành viên của TAPTAP và mua items trong danh sách sản phẩm yêu
                cầu thì gửi info tích điểm cho TAP TAP thực hiện.
                <br />
                4. Chỉ chạy 1 campain 1 lần. GS25 setup list items theo yêu cầu
                và ngày chạy
              </div>
            ) : fields?.name === "Momo" ? (
              <div className="cl-red bg-note">
                <span>
                  <strong>Lưu ý chức năng</strong> Promotion link partner MOMO
                </span>
                <br />
                1. KH đến GS25 mua items trong danh sách sản phẩm MOMO yêu cầu
                và Giao dịch thực hiện nếu thỏa điều kiện Thanh Toán bằng Ví
                MOMO.
                <br />
                2. Chỉ chạy 1 campain 1 lần. GS25 setup list items theo yêu cầu
                và ngày chạy.
              </div>
            ) : null}
          </Col>
          <Col span={24}>
            <PromotionPaymentHistory data={[]} />
          </Col>
        </Row>
      </section>
    );
  };
}
