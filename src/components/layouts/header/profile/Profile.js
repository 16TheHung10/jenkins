import React from 'react';
import UserImg from './images/user.png';
import BaseComponent from 'components/BaseComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBell } from '@fortawesome/free-solid-svg-icons';
import './style.scss';
import $ from 'jquery';

class Profile extends BaseComponent {
  constructor(props) {
    super(props);
    this.isRender = true;
  }

  handleLogout() {
    let accountState = super.getAccountState();
    let accountType = accountState.getProfile('accountType');
    accountState.destroy();
    if (accountType === 1) {
      // super.targetLink('/login');
      window.location.reload();
    }
  }

  renderComp() {
    return (
      <div id="profile" className="right-menu-small">
        <div className="dropdown">
          <a href="/#" className="dropdown-toggle menu_small_div" data-toggle="dropdown">
            <span className="user-name">{this.getAccountState().getProfile('name')}</span>
            <img src={UserImg} className="user-photo" alt="User Profile" />
          </a>
          <ul className="dropdown-menu dropdown-menu-right account vivify flipInY">
            <li>
              <span>Welcome, {this.getAccountState().getProfile('name')}</span>
            </li>
            <li>
              <a href={void 0} onClick={this.handleLogout}>
                <i>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </i>
                Logout
              </a>
            </li>
            <li className="external_link_comp">{this.props.externalLinks}</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Profile;
