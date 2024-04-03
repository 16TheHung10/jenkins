import React from 'react';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'antd';
import BaseComponent from 'components/BaseComponent';
import BreadCrumb from 'components/common/breadCrumb/BreadCrumb';
import $ from 'jquery';
import Notification from './notification/Notification';
import Profile from './profile/Profile';
// import LinkToPage from "./linkToPage/LinkToPage";
import './style.scss';
import NavbarBrand from './navBarBrand/NavbarBrand';
class Header extends BaseComponent {
  constructor(props) {
    super(props);
    this.isRender = true;
    this.storeManagement = '';
    this.isPartner = localStorage.getItem('partner') || 0;
  }

  componentDidMount() {
    $('.btn-expand').on('click', function () {
      $('.wrap-main').hasClass('clicked') ? $('.wrap-main').removeClass('clicked') : $('.wrap-main').addClass('clicked');
    });

    this.isPartner = localStorage.getItem('partner');
    // this.refresh();
  }

  handleClickPreload = () => {
    this.targetLink(window.location.pathname);
  };

  renderPreload = () => {
    return (
      <span style={{ fontSize: '14px', display: 'inline-flex' }}>
        <FontAwesomeIcon icon={faRedo} onClick={this.handleClickPreload} />
      </span>
    );
  };

  handleLinktoStoreManagement = () => {
    let token = localStorage.getItem('accessToken');
    let url = 'https://store.gs25.com.vn/callback/switch?token=' + token;
    window.open(url, '_self');
  };

  handleLinktoStoreFC = () => {
    let token = localStorage.getItem('accessToken');
    let url = 'https://storefc.gs25.com.vn/callback/switch?token=' + token;
    window.open(url, '_self');
  };
  externalLinks = () => {
    return this.isPartner == 0 ? (
      <>
        {this.getAccountState().isAdmin() && (
          <a
            href={void 0}
            onClick={this.handleLinktoStoreFC}
            style={{
              cursor: 'pointer',
              fontWeight: 'bold',
              paddingTop: 11,
            }}
          >
            FC support
          </a>
        )}
        <a
          href={void 0}
          onClick={this.handleLinktoStoreManagement}
          style={{
            cursor: 'pointer',
            fontWeight: 'bold',
            paddingTop: 11,
          }}
        >
          Store management
        </a>
        {/* <li>
        <Contribute />
      </li> */}
      </>
    ) : (
      ''
    );
  };
  renderComp() {
    return (
      <nav id="header_nav">
        <div className="container-fluid">
          <Row style={{ background: 'transparent' }}>
            <Col span={20} xl={12}>
              <div className="flex items-center gap-10">
                <NavbarBrand />
                <BreadCrumb />
              </div>
            </Col>
            <Col span={4} xl={12}>
              <ul className="nav navbar-nav w-full flex justify-end">
                {this.isPartner == 0 ? (
                  <>
                    {this.getAccountState().isAdmin() && (
                      <li className="external_link">
                        <a
                          href={void 0}
                          onClick={this.handleLinktoStoreFC}
                          style={{
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            paddingTop: 11,
                          }}
                        >
                          FC support
                        </a>
                      </li>
                    )}
                    <li className="external_link">
                      <a
                        href={void 0}
                        onClick={this.handleLinktoStoreManagement}
                        style={{
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          paddingTop: 11,
                        }}
                      >
                        Store management
                      </a>
                    </li>
                    {/* <li>
                      <Contribute />
                    </li> */}
                  </>
                ) : (
                  ''
                )}

                {process.env.REACT_APP_MESSAGE_HUB_ENABLE === '1' ? (
                  <li>
                    <Notification />
                  </li>
                ) : null}
                <li>
                  <Profile externalLinks={this.externalLinks()} />
                </li>
              </ul>
            </Col>
          </Row>
        </div>
      </nav>
    );
  }
}

export default Header;
