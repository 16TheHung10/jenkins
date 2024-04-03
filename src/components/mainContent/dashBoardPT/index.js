import React from "react";
import BaseComponent from "components/BaseComponent";
import Iframe from "helpers/Iframe";

class DashBoard extends BaseComponent {
  constructor(props) {
    super(props);
    this.isRender = true;
  }

  renderComp() {
    const iframe =
      '<iframe src="' +
      process.env.REACT_APP_LINK_PWBI +
      '" style="width: 100%;" frameborder="0" allowFullScreen="true"></iframe>';

    return (
      <div className="row">
        <Iframe iframe={iframe} />
      </div>
    );
  }
}

export default DashBoard;
