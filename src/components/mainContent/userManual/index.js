import React from "react";
import BaseComponent from "components/BaseComponent";
import Iframe from "helpers/Iframe";

class UserManual extends BaseComponent {
  constructor(props) {
    super(props);

    this.isRender = true;
    this.url = "https://wiki.gs25.com.vn/";
  }

  renderComp() {
    const iframe =
      '<iframe src="' +
      this.url +
      '" style="width: 100%; height:100%" ></iframe>';
    return (
      <section className="dashboard-weather">
        <Iframe iframe={iframe} />
      </section>
    );
  }
}

export default UserManual;
