const FcMasterNavData = {
  actiionLeft: (isDetails, taxCode, storeCode) => {
    let res = [
      {
        name: "Fc master",
        pathName: `/fc-master`,
        actionType: "link",
      },
      {
        name: "Create",
        pathName: `/fc-master/create`,
        actionType: "link",
      },
      {
        name: "Import",
        pathName: `/fc-master/import`,
        actionType: "link",
      },
    ];
    if (!isDetails) return res;
    res.push({
      name: "Details",
      pathName: `/fc-master/details/${taxCode}/${storeCode}`,
      actionType: "link",
      disabled: true,
    });
    return res;
  },
  actiionRight: () => {
    return [];
  },
};
export default FcMasterNavData;
