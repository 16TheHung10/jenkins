const LoyaltyItemRedeemNavData = {
  actiionLeft: (isDetails, itemCode) => {
    let res = [
      {
        name: 'Item redeems',
        pathName: `/loyalty/item-redeems/search`,
        actionType: 'link',
      },
      {
        name: 'Create',
        pathName: `/loyalty/item-redeems/create`,
        actionType: 'link',
      },
    ];
    if (!isDetails) return res;
    res.push({
      name: 'Details',
      pathName: `/loyalty/item-redeems/details/${itemCode}`,
      actionType: 'link',
      disabled: true,
    });
    return res;
  },
  actiionRight: () => {
    return [];
  },
};
export default LoyaltyItemRedeemNavData;
