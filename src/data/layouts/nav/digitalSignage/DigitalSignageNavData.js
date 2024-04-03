const DigitalSignageNavData = {
  actiionLeft: () => {
    let res = [
      {
        name: 'Tivi',
        pathName: `/digital-signage/tv`,
        actionType: 'link',
      },
      {
        name: 'Media',
        pathName: `/digital-signage/media`,
        actionType: 'link',
      },
      {
        name: 'Media Group',
        pathName: `/digital-signage/media-group`,
        actionType: 'link',
      },
      {
        name: 'Daily Log',
        pathName: `/digital-signage/daily-log`,
        actionType: 'link',
      },
    ];

    return res;
  },
  actiionRight: () => {
    return [];
  },
};
export default DigitalSignageNavData;
