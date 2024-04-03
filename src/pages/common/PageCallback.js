import React from 'react';
import CustomPage from 'pages/CustomPage';
import MSAzureHelper from 'helpers/MSAzureHelper';
import AccountModel from 'models/AccountModel';

class PageCallback extends CustomPage {
  componentDidMount() {
    if (this.props.type === 'login') {
      MSAzureHelper.getInstance();
      if (!MSAzureHelper.getInstance().isCallbackWorked) {
        this.targetHome();
      }
    } else if (this.props.type === 'switch') {
      var query = new URLSearchParams(this.props.location.search);
      var token = query.get('token');

      if (token) {
        this.fetchAccountFromToken(token);
      }
      let obj = {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        request: {},
      };

      return JSON.stringify(obj);
    } else {
      this.targetHome();
    }
  }

  fetchAccountFromToken = (token) => {
    let accountModel = new AccountModel();
    accountModel.getAccount(token).then((response) => {
      if (response.status) {
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
        this.refresh();
        this.targetHome();
      } else {
        this.showAlert('Account is invalid');
        this.targetHome();
      }
    });
  };

  renderPage() {
    return (
      <div className="overlay">
        <div className="container">
          <div className="justify-content-center row">
            <div className="col-md-5">
              <div className="card-group">
                <div className="card">
                  <div className="card-body">Loading...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PageCallback;
