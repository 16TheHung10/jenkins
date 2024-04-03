import PageWithNav from 'components/layouts/pageWithNav/PageWithNav';
import React, { useMemo } from 'react';

const PromotionMixABMatchCNav = ({ children, promotionCode }) => {
  const actionLeft = useMemo(() => {
    let res = [
      {
        name: 'Mix A,B Match C',
        pathName: `/promotion-mix-ab-match-c`,
        actionType: 'link',
      },
      {
        name: 'New',
        pathName: `/promotion-mix-ab-match-c/create`,
        actionType: 'link',
      },
      promotionCode
        ? {
            name: `Edit ${promotionCode}`,
            pathName: `/promotion-mix-ab-match-c/details/${promotionCode}`,
            actionType: 'link',
          }
        : null,
      promotionCode
        ? {
            name: `Copy ${promotionCode}`,
            pathName: `/promotion-mix-ab-match-c/copy/${promotionCode}`,
            actionType: 'link',
          }
        : null,
    ];
    return res.filter((el) => el);
  }, []);
  return (
    <PageWithNav className="relative" actionLeft={actionLeft}>
      {children}
    </PageWithNav>
  );
};

export default PromotionMixABMatchCNav;
