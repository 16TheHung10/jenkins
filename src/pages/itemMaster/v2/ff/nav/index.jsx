import PageWithNav from 'components/layouts/pageWithNav/PageWithNav';
import React from 'react';

const ItemMasterByFFNav = ({ children, storeCode }) => {
  return (
    <PageWithNav
      className="relative"
      actionLeft={[
        {
          name: 'FF onsite reporting',
          pathName: `/report/ff-onsite`,
          actionType: 'link',
        },
      ]}
    >
      {children}
    </PageWithNav>
  );
};

export default ItemMasterByFFNav;
