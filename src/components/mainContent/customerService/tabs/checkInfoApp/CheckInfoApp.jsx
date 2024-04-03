import React from "react";
import "./style.scss";
import SuspenLoading from "components/common/loading/SuspenLoading";
const CheckInfoApp = ({ memberCode, isDrawerOpen, appInfo }) => {
  return (
    <div id="check_info_app_container">
      {appInfo ? (
        <ul>
          <li>Số điện thoại</li>
          <li>Mã thành viên</li>
          <li>Ngày tải APP</li>
          <li>Version App đang sử dụng</li>
        </ul>
      ) : (
        <SuspenLoading />
      )}
    </div>
  );
};

export default CheckInfoApp;
