const EcommerceOrderNav = {
  actiionLeft: (isDetails, itemCode) => {
    let res = [
      {
        name: 'Orders',
        pathName: `/ecommerce/orders/search`,
        actionType: 'link',
      },
    ];
    if (!isDetails) return res;
    res.push({
      name: 'Details',
      pathName: `/ecommerce/orders/details/${itemCode}`,
      actionType: 'link',
      disabled: true,
    });
    return res;
  },
  actiionRight: () => {
    return [];
  },
};
export default EcommerceOrderNav;
