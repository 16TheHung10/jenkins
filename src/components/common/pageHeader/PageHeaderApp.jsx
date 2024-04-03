import React from "react";
import "./style.scss";
import { PageHeader } from "antd";
import { useHistory } from "react-router-dom";
const PageHeaderApp = (props) => {
  const history = useHistory();
  return (
    <div id="page_header_app">
      <PageHeader
        className="site-page-header"
        onBack={() => history.goBack()}
        {...props}
      />
    </div>
  );
};

export default PageHeaderApp;
