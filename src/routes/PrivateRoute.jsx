import React, { useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  useHistory,
} from "react-router-dom";
import { useAppContext } from "contexts";

const PrivateRoute = (pageProps) => {
  const { path, pageTitle, pageComponent, props } = pageProps;
  const history = useHistory();
  const { state: AppState } = useAppContext();
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
  useEffect(() => {
    const pathName = history.location.pathname;
    const token = localStorage.getItem("accessToken");

    // Check login
    if (!token) history.push("/login");
    // Check permissions
    else if (!AppState.menuObject?.[pathName]) history.push("/login");
  }, []);
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

export default PrivateRoute;
