import PageWithNav from 'components/layouts/pageWithNav/PageWithNav';
import React from 'react';

const EcommerceBannerNav = ({ children, isDetails, taxCode }) => {
  return (
    <PageWithNav
      className="relative"
      actionLeft={[
        {
          name: 'Banner',
          pathName: `/ecommerce/banners`,
          actionType: 'link',
        },
      ]}
    >
      {children}
    </PageWithNav>
  );
};

export default EcommerceBannerNav;

