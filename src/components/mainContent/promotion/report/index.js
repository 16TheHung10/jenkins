//Plugin
import React from "react";

//Custom
import BaseComponent from "components/BaseComponent";

import { PageHelper } from "helpers";

import ReportingModel from "models/ReportingModel";

import TableGeneral from "./TableGeneral";

export default class ReportMain extends BaseComponent {
  constructor(props) {
    super(props);

    //Default data
    this.dataObj = {};

    //Data Selected
    this.fieldSelected = this.assignFieldSelected({}, ["storeCode"]);

    this.isAutoload = PageHelper.updateFilters(
      this.fieldSelected,
      function (filters) {
        return true;
      },
    );

    this.isRender = true;
  }

  handleLoadReport = async () => {
    let params = {
      type: "itempromotion",
    };

    let model = new ReportingModel();
    await model.getReport(params).then((res) => {
      if (res.status && res.data.promotion) {
        this.dataObj = res.data.promotion;
        this.refresh();
      } else {
        this.showAlert(res.message);
      }
    });
  };

  componentDidMount = () => {
    this.handleLoadReport();
  };

  renderComp = () => {
    return (
      <>
        {Object.keys(this.dataObj).length !== 0 ? (
          <div className="row">
            <div className="tt-tbtab">
              {Object.keys(this.dataObj).map((elm, i) => (
                <button key={i} onClick={() => this.handleTabContent(elm)}>
                  {elm}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>Loading ...</div>
        )}

        {Object.keys(this.dataObj).map((elm, i) => (
          <div
            key={i}
            id={elm}
            className="detail-tab"
            style={i !== 0 ? { display: "none" } : {}}
          >
            <TableGeneral
              type={elm}
              dataTable={this.dataObj[elm] ? this.dataObj[elm] : {}}
            />
          </div>
        ))}
      </>
    );
  };
}
