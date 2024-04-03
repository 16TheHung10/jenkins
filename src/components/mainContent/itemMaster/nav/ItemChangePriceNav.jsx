import PageWithNav from 'components/layouts/pageWithNav/PageWithNav';
import React, { useMemo } from 'react';

const ItemChangePriceNav = ({ children }) => {
  const actionLeft = [
    {
      name: 'Change price',
      pathName: `/item-master/v2/price/import`,
      actionType: 'link',
    },
  ];

  return (
    <PageWithNav className="relative" actionLeft={actionLeft}>
      {children}
    </PageWithNav>
  );
};

export default ItemChangePriceNav;
