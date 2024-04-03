const DigitalSignageTVNotifyNavData = {
  actiionLeft: () => {
    let res = [
      {
        name: 'Tivi control',
        pathName: `/quick-tv-notify`,
        actionType: 'link',
      },
      {
        name: 'Report',
        pathName: `/monitorreport/tv`,
        actionType: 'link',
      },
    ];

    return res;
  },
  actiionRight: () => {
    return [];
  },
};
export default DigitalSignageTVNotifyNavData;
