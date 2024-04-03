import { Col, Row } from 'antd';
import React from 'react';

const ComponentLayout = ({
  Header,
  SideBar,
  MainContent,
  Footer,
  spanSideBar,
  spanMainContent,
}) => {
  return (
    <Row gutter={[16, 16]}>
      {Header && (
        <Col span={24}>
          <Header />
        </Col>
      )}

      {SideBar && (
        <Col span={spanSideBar || 6}>
          <SideBar />
        </Col>
      )}
      {MainContent && (
        <Col span={spanMainContent || 18}>
          <MainContent />
        </Col>
      )}
      {Footer && (
        <Col span={24}>
          <Footer />
        </Col>
      )}
    </Row>
  );
};

export default ComponentLayout;

