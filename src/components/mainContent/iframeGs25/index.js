import React from "react";
import BaseComponent from "components/BaseComponent";
import Iframe from "helpers/Iframe";

class IframeGs25 extends BaseComponent {
  constructor(props) {
    super(props);

    this.isRender = true;
    this.url = "https://gs25.com.vn/";
  }

  handleStop = (e) => {
    e.preventDefault();
    return false;
  };

  compWeather = () => {
    return (
      <a
        className="weatherwidget-io"
        href="https://forecast7.com/en/10d82106d63/ho-chi-minh-city/"
        data-label_1="HỒ CHÍ MINH"
        data-label_2="WEATHER"
        data-theme="original"
        data-icons="Climacons Animated"
      >
        HỒ CHÍ MINH WEATHER
      </a>
    );
  };

  hanldeWeather = () => {
    let js = document.createElement("script");
    let fjs = document.getElementsByTagName("script")[0];
    js.id = "weatherwidget-io-js";
    js.src = "https://weatherwidget.io/js/widget.min.js";
    fjs.parentNode.insertBefore(js, fjs);
  };

  renderComp() {
    const iframe =
      '<iframe src="' + this.url + '" style="width: 100%;" ></iframe>';
    return (
      <section className="dashboard-weather">
        {this.compWeather()}
        {this.hanldeWeather()}

        <Iframe iframe={iframe} nameClass="iframeGs25" />
      </section>
    );
  }
}

export default IframeGs25;
