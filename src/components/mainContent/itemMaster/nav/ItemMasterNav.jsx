import PageWithNav from 'components/layouts/pageWithNav/PageWithNav';
import React, { useMemo } from 'react';

const ItemMasterNav = ({ children, itemCode, version = '1' }) => {
  const actionLeft = useMemo(() => {
    const nav =
      version === '2'
        ? [
            {
              name: 'Item master',
              pathName: `/item-master/v2`,
              actionType: 'link',
            },
            itemCode
              ? {
                  name: 'Item details',
                  pathName: `/item-master/v2/${itemCode}`,
                  actionType: 'link',
                }
              : null,
            {
              name: 'New list item',
              pathName: `/item-master/import`,
              actionType: 'link',
            },
            {
              name: 'New one item GM',
              pathName: `/item-master/create/normal`,
              actionType: 'link',
            },
            {
              name: 'New one item FF',
              pathName: `/item-master/create`,
              actionType: 'link',
            },
            {
              name: 'Import attributes item',
              pathName: `/item-master/import-attributes`,
              actionType: 'link',
            },

            {
              name: 'Import store item',
              pathName: `/item-master/v2/store/import`,
              actionType: 'link',
            },
            // {
            //   name: 'Import item order',
            //   pathName: `/item-master/v2/order/import`,
            //   actionType: 'link',
            // },
          ]
        : [
            {
              name: 'Item master',
              pathName: `/item-master/`,
              actionType: 'link',
            },
            itemCode
              ? {
                  name: 'Item details',
                  pathName: `/item-master/${itemCode}`,
                  actionType: 'link',
                }
              : null,
            {
              name: 'New list item',
              pathName: `/item-master/import`,
              actionType: 'link',
            },
            {
              name: 'New one item GM',
              pathName: `/item-master/create/normal`,
              actionType: 'link',
            },
            {
              name: 'New one item FF',
              pathName: `/item-master/create`,
              actionType: 'link',
            },
            {
              name: 'Import attributes item',
              pathName: `/item-master/import-attributes`,
              actionType: 'link',
            },
          ];

    return nav.filter((el) => el);
  }, [itemCode, version]);

  return (
    <PageWithNav className="relative" actionLeft={actionLeft}>
      {children}
    </PageWithNav>
  );
};

export default ItemMasterNav;
