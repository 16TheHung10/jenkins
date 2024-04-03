import React from 'react';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Popover } from 'antd';
import BaseComponent from 'components/BaseComponent';
import ListNotification from 'components/layouts/header/notification/ListNotification';
import { MessageHubHelper } from 'helpers';
import AccountState from 'helpers/AccountState';
import $ from 'jquery';
import MessageNotifyModel from 'models/MessageNotifyModel';
class Notification extends BaseComponent {
  constructor(props) {
    super(props);
    this.isRender = true;
    this.socket = null;
    this.isLoaded = false;
    this.handleOnNotification = this.handleOnNotification.bind(this);
    this.notiData = null;
    this.newNotiData = null;
    this.notiNumber = 0;
  }

  updateNotificationNumber(number, isAddNew = true) {
    var newNumber = parseInt(number, 10);
    var updateNumber = number;
    if (isAddNew) {
      var currentNumber =
        $('#notificationNumber').text() !== '' && $('#notificationNumber').text() != '0'
          ? parseInt(parseInt($('#notificationNumber').text(), 10))
          : 0;
      updateNumber = currentNumber + newNumber;
    }
    $('#notificationNumber').text(updateNumber);
    if (updateNumber > 0) {
      $('#notificationNumber').show();
    } else {
      $('#notificationNumber').hide();
    }
  }

  getObjectType() {
    if (AccountState.getInstance().isAdmin()) {
      return 'admin';
    } else {
      return 'store';
    }
  }

  getObjectID() {
    if (AccountState.getInstance().isAdmin()) {
      return AccountState.getInstance().getProfile('name');
    } else {
      return AccountState.getInstance().getProfile('storeCode');
    }
  }

  handleLoadMessages = async () => {
    let model = new MessageNotifyModel();
    model.getLastMessages(this.getObjectID(), this.getObjectType()).then((response) => {
      if (response.status && response.data.messages && response.data.messages.length > 0) {
        var messages = response.data.messages;
        this.notiData = messages;
        console.log({ messages });
        this.refresh();
      }
    });
  };

  componentDidMount() {
    if (process.env.REACT_APP_API_MESSAGE_HUB_URL) {
      this.socket = MessageHubHelper.getInstance().getSocket();
      if (this.socket !== null) {
        var objMe = this;

        this.socket.on('notification_number', function (response) {
          if (response) {
            if (response.notificationNumber !== 0) {
              $('#notificationNumber').show();
              objMe.notiNumber = response.notificationNumber;
              objMe.updateNotificationNumber(response.notificationNumber, false);
              objMe.refresh();
            } else {
              $('#notificationNumber').text(0);
              $('#notificationNumber').hide();
            }
          }
        });

        this.socket.on('new_activity', function (response) {
          if (response && response.activities && response.activities.length > 0) {
            objMe.newNotiData = [...(response.activities || []), ...(objMe.newNotiData || [])];
            objMe.refresh();
            objMe.updateNotificationNumber(response.notificationNumber);
          }
        });

        this.socket.emit('activity_notification', { hasActivity: false });
      }
    }
  }

  handleOnNotification() {
    if (this.socket !== null) {
      this.socket.emit('off_notification');
      this.updateNotificationNumber(0, false);
    }

    if (!this.isLoaded) {
      this.handleLoadMessages();
      this.isLoaded = true;
    }
  }

  renderComp() {
    return (
      <div className="right-menu-small">
        <Popover
          className="notification_popover"
          placement="bottomRight"
          title="Notification"
          content={
            <ul id="notificationMessage" style={{ padding: 0, width: 530, minWidth: 530 }}>
              <div style={{ borderRadius: '15px' }}>
                {this.notiData ? (
                  <ListNotification oldData={this.notiData} newData={this.newNotiData} notiNumber={this.notiNumber} />
                ) : (
                  <li>
                    <span>No message</span>
                  </li>
                )}
              </div>
            </ul>
          }
          trigger="click"
        >
          <a
            href="/#"
            onClick={this.handleOnNotification}
            className="dropdown-toggle menu_small_div"
            data-toggle="dropdown"
          >
            <i>
              <FontAwesomeIcon className="notification-photo" icon={faBell} />
            </i>
            <span style={{ display: 'block' }} className="notification-number" id="notificationNumber">
              0
            </span>
          </a>
        </Popover>
        {/* <div className="dropdown">
          <ul id="notificationMessage" className="dropdown-menu notification-message dropdown-menu-right vivify fadeIn">
          </ul>
        </div> */}
      </div>
    );
  }
}

export default Notification;
