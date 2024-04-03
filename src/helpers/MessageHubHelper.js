import $ from "jquery";

import socketIOClient from "socket.io-client";
import AccountState from "helpers/AccountState";

class MessageHubHelper {
  static instance = null;
  static createInstance() {
    var object = new MessageHubHelper();
    if (
      process.env.REACT_APP_MESSAGE_HUB_ENABLE === "1" &&
      process.env.REACT_APP_API_MESSAGE_HUB_URL
    ) {
      var recipient;
      var objectType;
      var storeCode = AccountState.getInstance().getProfile("storeCode");
      if (AccountState.getInstance().isAdmin()) {
        recipient = AccountState.getInstance().getProfile("name");
        objectType = "admin";
      } else if (storeCode) {
        recipient = storeCode;
        objectType = "store";
      }
      if (recipient && objectType) {
        let accessToken = AccountState.getInstance().getAccessToken();
        object.socket = socketIOClient(
          process.env.REACT_APP_API_MESSAGE_HUB_URL,
          {
            query:
              "recipient=" +
              recipient +
              "&type=" +
              objectType +
              "&token=" +
              accessToken,
          },
        );
      }
    }
    return object;
  }

  static getInstance() {
    if (!MessageHubHelper.instance) {
      MessageHubHelper.instance = MessageHubHelper.createInstance();
    }
    return MessageHubHelper.instance;
  }

  socket = null;
  alertIndex = 0;

  url(activity) {
    var message = activity.read
      ? activity.message
      : "<b>" + activity.message + "</b>";
    if (activity.object_type === "order") {
      return (
        "<a target='_blank' href='/productorder/" +
        activity.object_id +
        "'>" +
        message +
        "</a>"
      );
    }
    return "<a>" + message + "</a>";
  }

  getSocket() {
    return this.socket;
  }

  showAlert(message, autoHide = true) {
    let timeOut;
    let elm =
      `<div data-group="noti-alert-item-` +
      this.alertIndex +
      `" class="noti-alert-item" role="alert">
                  <button type="button" class="close" onclick="$(this).parent().fadeOut()" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">×</span>
                  </button>` +
      message +
      `</div>`;

    $(elm).prependTo("#notificationAlert");

    if (autoHide) {
      $(elm).fadeIn();
      timeOut = window.setTimeout(
        function (index) {
          $("#notificationAlert")
            .find("[data-group='noti-alert-item-" + index + "'")
            .last()
            .fadeOut();
        },
        4000,
        this.alertIndex,
      );
    }
    this.alertIndex++;
  }
}

export default MessageHubHelper;
