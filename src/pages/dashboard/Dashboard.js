import React from 'react';
import CustomAuthorizePage from 'pages/CustomAuthorizePage';

// import IframeGs25Comp from "components/mainContent/iframeGs25";
import DashboardCompPage from 'components/mainContent/dashBoard/dashBoardComp';

class Dashboard extends CustomAuthorizePage {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderPage() {
    return (
      // <IframeGs25Comp />
      <DashboardCompPage />
    );
  }
}

export default Dashboard;
