const StoreNavData = {
  actiionLeft: ({ storeCode, type }) => {
    let res = [];
    res = [
      {
        name: "Store management",
        pathName: `/store`,
        actionType: "link",
      },
    ];
    if (storeCode)
      res.push({
        name: "Store details",
        pathName: `/store/${storeCode}`,
        actionType: "link",
      });
    return res;
  },
  actiionRight: () => {
    return [];
  },
};
export default StoreNavData;
