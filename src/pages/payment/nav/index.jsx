import PageWithNav from 'components/layouts/pageWithNav/PageWithNav';
import React from 'react';

const PaymentMethodNav = ({ children, isDetails, taxCode }) => {
  return (
    <PageWithNav
      className="relative"
      actionLeft={[
        {
          name: 'Payment methods',
          pathName: `/payment-method`,
          actionType: 'link',
        },
      ]}
    >
      {children}
    </PageWithNav>
  );
};

export default PaymentMethodNav;
