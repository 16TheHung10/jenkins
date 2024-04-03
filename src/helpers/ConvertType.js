export const arrayToObject = (itemList, key, value) => {
  if (!Array.isArray(itemList) && itemList.length === 0) return;
  return itemList.reduce((itemMap, item) => {
    if (item[key] !== "" || item[value] !== "") {
      itemMap[item[key]] = item[value];
      return itemMap;
    }
  }, {});
};

export const objectToArray = (objectList, key, value) => {
  if (typeof objectList !== "object" && objectList === null) return;
  return Object.keys(objectList).reduce((itemMap, item) => {
    itemMap.push({
      id: item,
      value: objectList[item],
    });
    return itemMap;
  }, []);
};
