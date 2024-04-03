import React from "react";
import { Route } from "react-router-dom";

const PublicRoute = (pageProps) => {
  const { path, pageTitle, pageComponent, props } = pageProps;

  const renderRoute = ({
    pageTitle,
    content,
    isShowHeader = true,
    isShowSlideBar: isShowSidebar = true,
    preLoad = false,
  }) => {
    return (
      <div className="wrap-main ">
        <Row>
          <Col span={24}>
            <div className="flex">
              {isShowSidebar ? <SidebarMenu /> : null}
              <div
                className="flex flex-col flex-1 relative"
                style={{ background: "#f0f2f5" }}
              >
                {isShowHeader ? (
                  <Header pageName={pageTitle} preLoad={preLoad} />
                ) : null}
                <div className="flex-1" style={{ marginTop: 46 }}>
                  {content}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <Route
      exact
      path={path}
      render={(routeProps) =>
        renderRoute(
          {
            pageTitle,
            content: (
              <MainContent
                page={pageComponent}
                params={routeProps.match.params}
                {...routeProps}
              />
            ),
          },
          { ...props },
        )
      }
    />
  );
};

export default PublicRoute;
