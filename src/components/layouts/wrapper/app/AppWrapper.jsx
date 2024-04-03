import React, { Fragment, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useAppContext } from 'contexts';
import { useHistory } from 'react-router-dom';
import { UrlHelper } from 'helpers';
const AppWrapper = ({ children }) => {
  // const history = useHistory();
  // const { state } = useAppContext();
  // const title = useMemo(() => {
  //   const pathName = history.location.pathname;

  //   if (['', '/', '/*', '*'].includes(pathName)) return 'Portal GS25';
  //   const currentMenu = state.menuObject?.[pathName];
  //   if (currentMenu) return currentMenu.name;
  //   return 'Portal GS25';
  // }, [state.menuObject]);

  return (
    <Fragment>
      {/* <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet> */}
      {children}
    </Fragment>
  );
};

export default AppWrapper;
