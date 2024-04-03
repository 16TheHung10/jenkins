const EcommerceCategoryNavData = {
  actiionLeft: (isDetails, categoryID) => {
    let res = [
      {
        name: 'Category',
        pathName: `/ecommerce/categories/search`,
        actionType: 'link',
      },
      {
        name: 'Create',
        pathName: `/ecommerce/categories/create`,
        actionType: 'link',
      },
    ];
    if (!isDetails) return res;
    res.push({
      name: 'Details',
      pathName: `/ecommerce/categories/details/${categoryID}`,
      actionType: 'link',
      disabled: true,
    });
    return res;
  },
  actiionRight: () => {
    return [];
  },
};
export default EcommerceCategoryNavData;
