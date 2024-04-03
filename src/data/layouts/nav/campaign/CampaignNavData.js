const CampaignNavData = {
  actiionLeft: (isDetails, campaignID) => {
    let res = [];
    res = [
      {
        name: "Campaigns",
        pathName: `/campaigns`,
        actionType: "link",
      },
      {
        name: "Create",
        pathName: `/campaigns/create`,
        actionType: "link",
      },
    ];
    if (isDetails && campaignID) {
      res.push({
        name: "Details",
        pathName: `/campaigns/details/${campaignID}`,
        actionType: "link",
      });
    }
    return res;
  },
  actiionRight: () => {
    return [];
  },
};
export default CampaignNavData;
