import React from 'react';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { message } from 'antd';
import BaseComponent from 'components/BaseComponent';
import CountDown from 'components/common/countDown/CountDown';
import LogoForm from 'components/layouts/header/navBarBrand/images/logoaboutus.png';
import { useAppContext } from 'contexts';
import AccountModel from 'models/AccountModel';
import { routerRef } from '../../../../App';
import AuthMessage from 'message/auth.message';

class LoginForm extends BaseComponent {
  constructor(props) {
    super(props);
    if (this.getAccountState().hasLogon()) {
      this.targetHome();
    }
    this.isRender = true;
    this.isCapchaVisible = false;
    this.loginFaileCount = 0;
    this.handleClickLogin = this.handleClickLogin.bind(this);
  }
  hangleSetCapchaVisible(value) {
    this.isCapchaVisible = value;
    this.refresh();
  }
  async handleClickLogin() {
    if (!this.fieldSelected.username) {
      this.showAlert('Please enter email');
      return;
    }
    if (!this.fieldSelected.password) {
      this.showAlert('Please enter password');
      return;
    }
    let accountModel = new AccountModel();
    await accountModel
      .getToken({
        username: this.fieldSelected.username,
        password: this.fieldSelected.password,
      })
      .then((response) => {
        if (response.status) {
          if (response.data.storeCode) {
            message.error('Use have no permission to login this site');
            return;
          }
          console.log(' response.data.groupName?.toUpperCase()', response.data.groupName?.toUpperCase());
          // Update login state in app context
          this.getAccountState().updateLogin(
            {
              groupName: response.data.groupName,
              groupID: response.data.groupID,
              name: response.data.name,
              accountType: 1,
              role: response.data.role,
              isFranchise: response.data.franchise,
              storeCode: response.data.storeCode,
              storeName: response.data.storeName,
              isGetAllStore: ![4, 28, 21].includes(+response.data.groupID),
            },
            response.data.token,
            response.data.refreshToken,
            response.data.partner
          );
          routerRef.current.history.replace('/');
        } else {
          this.loginFaileCount += 1;
          if (this.loginFaileCount >= 3) {
            this.hangleSetCapchaVisible(true);
          }
          this.refresh();
          throw new Error('Account is invalid');
        }
      });
  }
  componentDidMount() {
    const localTimer = localStorage.getItem('timer');
    if (+localTimer === 0) localStorage.removeItem('timer');
    if (localTimer !== 'undefined' && localTimer !== 'null' && +localTimer > 0) {
      this.hangleSetCapchaVisible(true);
    }
  }
  renderComp() {
    return (
      <section>
        <form method="POST" onSubmit={(e) => e.preventDefault()} className="w-fit m-auto">
          <h1>
            <img src={LogoForm} alt="gs25" className="logoform" /> Portal
          </h1>
          {this.isCapchaVisible ? (
            <>
              <CountDown time={60} action={() => this.hangleSetCapchaVisible.call(this, false)} />
              <h4 style={{ display: 'inline-block' }}>Bạn đã login sai nhiều lần vui lòng đợi </h4>
            </>
          ) : (
            <>
              <p className="text-muted">Sign In to your account</p>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    onChange={this.handleChangeField}
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <FontAwesomeIcon icon={faLock} />
                  </div>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    onChange={this.handleChangeField}
                    placeholder="Password"
                  />
                </div>
              </div>
              <div className="form-group text-right">
                <ButtonComp onClick={this.handleClickLogin} />
              </div>
            </>
          )}
        </form>
      </section>
    );
  }
}

const ButtonComp = ({ onClick }) => {
  const { dispatch } = useAppContext();
  const handleClick = async () => {
    try {
      await onClick();
    } catch (err) {
      message.error(err.message);
    }
  };
  return (
    <button type="submit" onClick={handleClick} className="btn btn-primary">
      Login
    </button>
  );
};

export default LoginForm;
