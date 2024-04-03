const EcommerceGroupNavData = {
  actiionLeft: (isDetails, groupID) => {
    let res = [
      {
        name: 'Groups',
        pathName: `/ecommerce/groups/search`,
        actionType: 'link',
      },
      {
        name: 'Create',
        pathName: `/ecommerce/groups/create`,
        actionType: 'link',
      },
    ];
    if (!isDetails) return res;
    res.push({
      name: 'Details',
      pathName: `/ecommerce/groups/details/${groupID}`,
      actionType: 'link',
      disabled: true,
    });
    return res;
  },
  actiionRight: () => {
    return [];
  },
};
export default EcommerceGroupNavData;
