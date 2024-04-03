import PageWithNav from 'components/layouts/pageWithNav/PageWithNav';
import { EcommerceCategoryNavData } from 'data/layouts/nav';
import React, { useMemo } from 'react';

const EcommerceCategoryNav = ({ children, isDetails, categoryID }) => {
  console.log({ isDetails });
  const actionLeft = useMemo(() => {
    return EcommerceCategoryNavData.actiionLeft(isDetails, categoryID);
  }, [categoryID, isDetails]);
  return (
    <PageWithNav className="relative" actionLeft={actionLeft}>
      {children}
    </PageWithNav>
  );
};

export default EcommerceCategoryNav;

