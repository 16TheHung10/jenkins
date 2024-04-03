import PageWithNav from 'components/layouts/pageWithNav/PageWithNav';
import React, { useMemo } from 'react';

const StoreTargetKPINav = ({ children }) => {
  const actionLeft = useMemo(() => {
    return [
      {
        name: 'StoreKPI',
        pathName: `/store-target-kpi`,
        actionType: 'link',
      },
      {
        name: 'Import KPI',
        pathName: `/store-target-kpi/import`,
        actionType: 'link',
      },
    ];
  }, []);
  return (
    <PageWithNav className="relative" actionLeft={actionLeft}>
      {children}
    </PageWithNav>
  );
};

export default StoreTargetKPINav;
