//Plugin
import React from "react";
import $ from "jquery";

class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.closeAlert = this.closeAlert.bind(this);
  }

  closeAlert() {
    window.setTimeout(function () {
      $(".alert")
        .fadeTo(500, 0)
        .slideUp(500, function () {
          $(this).remove();
        });
    }, 4000);
  }

  render() {
    let { message } = this.props;
    return (
      <div className="row">
        <div className="alert alert-success" role="alert">
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
          {message}
        </div>
      </div>
    );
  }
}

export default Alert;
