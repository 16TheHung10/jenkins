const EcommerceItemNavData = {
  actiionLeft: (isDetails, itemCode) => {
    let res = [
      {
        name: 'Items',
        pathName: `/ecommerce/items/search`,
        actionType: 'link',
      },
      {
        name: 'Create',
        pathName: `/ecommerce/items/create`,
        actionType: 'link',
      },
      {
        name: 'Import',
        pathName: `/ecommerce/items/import`,
        actionType: 'link',
      },
    ];
    if (!isDetails) return res;
    res.push({
      name: 'Details',
      pathName: `/ecommerce/items/details/${itemCode}`,
      actionType: 'link',
      disabled: true,
    });
    return res;
  },
  actiionRight: () => {
    return [];
  },
};
export default EcommerceItemNavData;
