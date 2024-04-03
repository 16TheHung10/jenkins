import React from "react";
const ItemMasterNavData = {
  actiionLeft: () => {
    let res = [];
    res = [
      {
        name: (
          <>
            <i class="fas fa-home cursor-pointer mr-10"></i> Item master
          </>
        ),
        pathName: `/item-master`,
        actionType: "link",
      },
      {
        name: "New list item",
        pathName: `/item-master/import`,
        actionType: "link",
      },
      {
        name: "New one item GM",
        pathName: `/item-master/create/normal`,
        actionType: "link",
      },
      {
        name: "New one item FF",
        pathName: `/item-master/create`,
        actionType: "link",
      },
      {
        name: "Import attributes item",
        pathName: `/item-master/import-attributes`,
        actionType: "link",
      },
    ];
    return res;
  },
  actiionRight: () => {
    return [];
  },
};
export default ItemMasterNavData;
