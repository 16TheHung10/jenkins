//Plugin
import React from "react";

class ControlComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.refresh = this.refresh.bind(this);
    this.isRender = false;
  }

  refresh() {
    this.isRender = true;
    if (this.state.countRender === undefined) {
      this.setState({
        countRender: 0,
      });
    } else {
      this.setState({ countRender: this.state.countRender + 1 });
    }
  }

  render() {
    if (this.isRender) {
      return this.renderComp();
    }
    return null;
  }

  renderComp() {
    return null;
  }
}

export default ControlComponent;
