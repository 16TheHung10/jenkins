import { Col, Row } from 'antd';
import Header from 'components/layouts/header/Header';
import SidebarMenu from 'components/layouts/sidebar/SidebarMenu';
import { UrlHelper } from 'helpers';
import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const RenderRoute = ({ isShowSlideBar, isShowHeader, children, pageName, preLoad }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  const refreshToken = params.get('refreshToken');

  useEffect(() => {
    if (token) {
      localStorage.setItem('accessToken', token);
    }
  }, [token]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }, [refreshToken]);

  const searchObject = useMemo(() => {
    return UrlHelper.getSearchParamsObject();
  }, [location.search]);

  return (
    <div className="wrap-main ">
      <Row>
        <Col span={24}>
          {searchObject.iframeMode === 'true' ? (
            <div className="flex">
              <div className="flex flex-col flex-1 relative" style={{ background: '#f0f2f5' }}>
                {children}
              </div>
            </div>
          ) : (
            <div className="flex">
              {isShowSlideBar ? <SidebarMenu /> : null}
              <div className="flex flex-col flex-1 relative" style={{ background: '#f0f2f5' }}>
                {isShowHeader ? <Header pageName={pageName} preLoad={preLoad} /> : null}
                <div className="flex-1" style={{ marginTop: 46 }}>
                  {children}
                </div>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default RenderRoute;
