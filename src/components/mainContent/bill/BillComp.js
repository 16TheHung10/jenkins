import React from "react";
import BaseComponent from "components/BaseComponent";
import BillModel from "models/BillModel";
import { Col, Row, message } from "antd";
import BaseButton from "components/common/buttons/baseButton/BaseButton";
import InfoComp from "./Info";
export default class BillComp extends BaseComponent {
  constructor(props) {
    super(props);

    this.info = {};
    this.list = [];
    this.payment = [];

    this.fieldSelected = this.assignFieldSelected({
      billCode: "",
    });
    this.isInfo = false;
    this.isAutoload = true;
    this.isRender = true;
    this.cancelBills = [];
  }

  handleSearch = async () => {
    const fields = this.fieldSelected;

    if (fields.billCode === "") {
      message.error("Please enter billcode");
      return;
    }

    const params = {
      billCode: fields.billCode,
    };

    let model = new BillModel();
    let response = await model.searchBill(params);

    // if (response.status && response.data.bill && response.data.billDetail && response.data.payment) {
    if (response.status && response.data.bill) {
      this.list = response.data.bill.items || [];
      this.payment = response.data.bill.payments || [];
      this.info = response.data.bill;

      this.isInfo = true;
    } else {
      message.error("Can not find this bill");
    }

    this.refresh();
  };

  hanldeReset = () => {
    const fields = this.fieldSelected;
    fields.billCode = "";
    this.info = {};
    this.list = [];
    this.payment = [];
    this.refresh();
  };

  renderComp() {
    let fields = this.fieldSelected;

    return (
      <>
        <div className="container-table">
          <div className="col-md-12 p-0">
            <Row gutter={[16, 16]} className="mt-15">
              <Col xl={24}>
                <div className="section-block">
                  <Row gutter={16}>
                    <Col xl={19}>
                      <Row gutter={16}>
                        <Col xl={6}>
                          <div className="form-group">
                            <label htmlFor="/" className="w100pc">
                              Billcode:
                            </label>

                            <input
                              type="text"
                              autoComplete="off"
                              name="billCode"
                              value={fields.billCode || ""}
                              onChange={this.handleChangeField}
                              className="form-control"
                            />
                          </div>
                        </Col>
                        <Col xl={4}>
                          <div className="form-group">
                            <label htmlFor="/" className="w100pc op-0">
                              &nbsp;
                            </label>

                            <BaseButton
                              iconName="search"
                              onClick={this.handleSearch}
                            >
                              Search
                            </BaseButton>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="mrt-10">
              <Col span={8}>
                {this.isInfo && this.info && Object.keys(this.info) !== 0 && (
                  <div className="section-block">
                    <InfoComp
                      reset={this.hanldeReset}
                      info={this.info}
                      list={this.list}
                      payment={this.payment}
                    />
                  </div>
                )}
              </Col>
            </Row>
          </div>
        </div>
      </>
    );
  }
}
