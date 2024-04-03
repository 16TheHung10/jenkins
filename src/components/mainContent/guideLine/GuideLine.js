import React from "react";
import $ from "jquery";
import BaseComponent from "components/BaseComponent";
import { StringHelper } from "helpers";
import supplierGuideLine from "external/guideLineContent/supplier.json";
import itemGuideLine from "external/guideLineContent/item.json";
import changePriceGuideLine from "external/guideLineContent/changePrice.json";

export default class GuideLine extends BaseComponent {
  constructor(props) {
    super(props);
    this.type = props.type;
    this.idGuideLine = "idGuideLine" + StringHelper.randomKey();
    this.content = [];
    this.isRender = true;
  }

  showGuideLine = () => {
    $("#" + this.idGuideLine).show();
  };

  componentDidMount = () => {
    switch (this.type) {
      case "supplier":
        this.content = supplierGuideLine;
        break;
      case "store":
        // code block
        break;
      case "item":
        this.content = itemGuideLine;
        break;
      case "changePrice":
        this.content = changePriceGuideLine;
        break;
      default:
        this.content = [];
        break;
    }
    this.refresh();
  };

  renderComp() {
    return (
      <section>
        {this.content.length > 0 && (
          <div>
            <div className="guideline-btn" style={{ paddingTop: 0 }}>
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <button
                    style={{ fontSize: 12, background: "white" }}
                    type="button"
                    className="btn-showpp btn btn-back"
                    onClick={this.showGuideLine}
                  >
                    Guildeline
                    {/* <FontAwesomeIcon icon={faQuestionCircle} className="btn-showpp" onClick={this.showGuideLine} /> */}
                  </button>
                </div>
              </div>
            </div>

            <div
              id={this.idGuideLine}
              className="popup-form"
              style={{ maxWidth: "45%" }}
            >
              <div className="form-filter">
                <div className="row">
                  <div className="col-md-12">
                    {this.content.map((content, i) => (
                      <div key={i}>
                        {content.title && <h4>{content.title}</h4>}
                        <div style={{ paddingLeft: 10, paddingBottom: 0 }}>
                          {" "}
                          {
                            <div
                              dangerouslySetInnerHTML={{
                                __html: content.content,
                              }}
                            />
                          }{" "}
                        </div>
                        <div style={{ textAlign: "center" }}>
                          {content.image !== "" && (
                            <img
                              style={{
                                maxWidth: "100%",
                                display: "inline-block",
                                width: "390px",
                                height: "280px",
                              }}
                              src={content.image}
                              alt={content.title}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }
}
