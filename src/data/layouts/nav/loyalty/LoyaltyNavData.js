const LoyaltyNavData = {
  actiionLeft: () => {
    let res = [];
    res = [
      {
        name: "Loyalty",
        pathName: `/loyalty`,
        actionType: "link",
      },
      {
        name: "Merge",
        pathName: `/loyalty/merge`,
        actionType: "link",
      },
      {
        name: "Notifi",
        pathName: `/loyalty-notify`,
        actionType: "link",
      },
      {
        name: "Claim Voucher",
        pathName: `/loyalty/redeem-voucher`,
        actionType: "link",
      },
      {
        name: "Bill search",
        pathName: `/bill-management`,
        actionType: "link",
      },
    ];
    return res;
  },
  actiionRight: () => {
    return [];
  },
};
export default LoyaltyNavData;
