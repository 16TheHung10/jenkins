import Moment from "moment";
import { DateHelper } from "helpers";
import AlertHelper from "./AlertHelper";

export function removeDuplicatesArr(originalArray, prop, newGroup) {
  let newArray = [];
  let lookupObject = {};

  for (let i in originalArray) {
    if (newGroup) {
      lookupObject[originalArray[i][prop]][newGroup] = originalArray[i];
    } else {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }
  }

  for (let i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return newArray;
}
export function showAlert(msg, type = "error") {
  AlertHelper.showAlert(msg, type);
}
export function increaseDate(number) {
  let date = number
    ? new Date(new Date().setDate(new Date().getDate() + number))
    : new Date();

  return date;
}

export function decreaseDate(number) {
  let date = number
    ? new Date(new Date().setDate(new Date().getDate() - number))
    : new Date();

  return date;
}

export function minDateInMonth(strDate) {
  let date = new Date(strDate);
  let year = date.getFullYear();
  let month = date.getMonth();
  return new Date(year, month, 1);
}

export function changeTab(classTarget, idTarget, e, classBtn) {
  var i;
  var x = document.getElementsByClassName(classTarget);
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(idTarget).style.display = "block";

  if (classBtn) {
    var x = document.getElementsByClassName(classBtn);
    for (i = 0; i < x.length; i++) {
      x[i].classList.remove("active");
    }
  }
  if (e) {
    e.currentTarget.classList.add("active");
  }
}

export function convertToLocalTime(stringDate) {
  //"2022-07-01T10:59:38Z"
  let d = new Date(stringDate);
  return d;
}

export function fnObjGroup(list, mainKey, listField) {
  var lst = {};

  if (list) {
    for (let k in list) {
      let item = list[k];

      if (mainKey && mainKey !== "") {
        if (!lst[item[mainKey]]) {
          lst[item[mainKey]] = {};
        }

        if (listField) {
          for (let k2 in listField) {
            let itemField = listField[k2];

            if (typeof itemField === "number") {
              if (!lst[item[mainKey]][k2]) {
                lst[item[mainKey]][k2] = 0;
              }
              lst[item[mainKey]][k2] += parseFloat(item[k2] || 0);
            } else if (typeof itemField === "string") {
              if (!lst[item[mainKey]][k2]) {
                lst[item[mainKey]][k2] = item[k2];
              }
            } else if (typeof itemField == "boolean") {
              if (!lst[item[mainKey]][k2]) {
                lst[item[mainKey]][k2] = item[k2];
              }
            } else if (Array.isArray(itemField)) {
              if (!lst[item[mainKey]][k2]) {
                lst[item[mainKey]][k2] = [];
              }
              lst[item[mainKey]][k2].push(item);
            } else {
              if (!lst[item[mainKey]][k2]) {
                lst[item[mainKey]][k2] = {};
              }
            }
          }
        } else {
          lst[item[mainKey]] = item;
        }
      }
    }
  }

  return lst;
}

export function createListOption(list, keyCode, keyName) {
  let arr = [];
  let objs = {};

  if (list) {
    for (let k in list) {
      let item = list[k];

      if (keyCode && keyCode !== "") {
        let mainKey = item[keyCode];

        if (mainKey !== undefined && mainKey !== "" && mainKey !== null) {
          if (!objs[mainKey]) {
            let keyValue = mainKey;
            let keyLabel = keyName ? mainKey + " - " + item[keyName] : mainKey;

            objs[mainKey] = {
              value: keyValue,
              label: keyLabel,
              count: 0,
            };
          }

          objs[mainKey].count += 1;
        }
      }
    }

    arr = Object.values(objs);
  }

  return arr;
}

export function createListOptionFilterAntD(list, keyCode, keyName) {
  let arr = [];
  let objs = {};

  if (list) {
    for (let k in list) {
      let item = list[k];

      if (keyCode && keyCode !== "") {
        let mainKey = item[keyCode];

        if (mainKey !== undefined && mainKey !== "" && mainKey !== null) {
          if (!objs[mainKey]) {
            let keyValue = mainKey;
            let keyLabel = keyName ? mainKey + " - " + item[keyName] : mainKey;

            objs[mainKey] = {
              value: keyValue,
              text: keyLabel,
              count: 0,
            };
          }

          objs[mainKey].count += 1;
        }
      }
    }

    arr = Object.values(objs);
  }

  return arr;
}

export function hanldeExportAutoField(arrExport, nameFile, arrKeyDelete) {
  let arr = [];
  for (let k in arrExport) {
    let item = arrExport[k];

    if (arrKeyDelete && arrKeyDelete.length > 0) {
      for (let k2 in arrKeyDelete) {
        delete item[arrKeyDelete[k2]];
      }
    }

    let arrItemObjKey = Object.keys(item);

    for (let i in arrItemObjKey) {
      if (!isNaN(item[arrItemObjKey[i]])) {
        item[arrItemObjKey[i]] =
          item[arrItemObjKey[i]] !== null &&
          item[arrItemObjKey[i]] !== undefined
            ? item[arrItemObjKey[i]].toString()
            : "";
      } else if (
        Date.parse(item[arrItemObjKey[i]]) &&
        Moment(item[arrItemObjKey[i]]).isValid()
      ) {
        item[arrItemObjKey[i]] = DateHelper.displayDateFormatMinus(
          item[arrItemObjKey[i]],
        );
      } else {
        item[arrItemObjKey[i]] = item[arrItemObjKey[i]];
      }
    }

    arr.push(item);
  }

  let params = {
    values: arr,
    type: nameFile,
  };

  return params;
}

export function mapData(arr1, arr2, keyMap, lstKeyMap) {
  let newArr = [];

  for (let k1 in arr1) {
    let item1 = arr1[k1];

    for (let k2 in arr2) {
      let item2 = arr2[k2];

      if (keyMap) {
        if (
          item1[keyMap] &&
          item2[keyMap] &&
          item2[keyMap].toLowerCase() === item1[keyMap].toLowerCase()
        ) {
          if (lstKeyMap) {
            for (let k3 in lstKeyMap) {
              item1[lstKeyMap[k3]] = item2[lstKeyMap[k3]];
            }
          }
        }
      }
    }
  }

  newArr = arr1;

  return newArr;
}

export function sortColumn(lst, arrColPos) {
  let result = [];

  for (let key in lst) {
    let item = lst[key];

    let obj = {};
    let arr = [];

    for (let prop in item) {
      let o = {};
      o[prop] = item[prop];
      o.isSort = arrColPos.indexOf(prop);

      arr.push(o);
    }

    arr.sort((a, b) => a.isSort - b.isSort);

    for (let prop in arr) {
      let el = arr[prop];

      for (let c in el) {
        if (c !== "isSort") {
          obj[c] = el[c];
        }
      }
    }

    result.push(obj);
  }

  return result;
}

export function getTop(lst, keyGet, numGetTop, order = false) {
  let arr = [];
  if (Array.isArray(lst)) {
    if (order) {
      arr = lst.sort((a, b) => b[keyGet] - a[keyGet]);
    } else {
      arr = lst.sort((a, b) => a[keyGet] - b[keyGet]);
    }
  } else {
    if (order) {
      arr = Object.values(lst).sort((a, b) => b[keyGet] - a[keyGet]);
    } else {
      arr = Object.values(lst).sort((a, b) => a[keyGet] - b[keyGet]);
    }
  }

  arr = arr.splice(0, numGetTop);

  return arr;
}

export function fnSum(lst, key, lstNeedSum) {
  let arr = lst;
  let obj = {};

  for (let k in arr) {
    let item = arr[k];

    if (!obj[item[key]]) {
      obj[item[key]] = {};
    }

    for (let i in lstNeedSum) {
      let el = lstNeedSum[i];

      if (!obj[item[key]][el]) {
        obj[item[key]][el] = 0;
      }
      obj[item[key]][el] += item[el];
    }
  }

  for (let n in arr) {
    let itemN = arr[n];

    for (let a in obj) {
      let abc = obj[a];
      if (itemN[key] === a) {
        for (let e in abc) {
          itemN["total" + e] = abc[e];
        }
      }
    }
  }

  return arr;
}

export function checkNotExistItem(arr1, arr2, key) {
  let a = arr1 || [];
  let b = arr2 || [];

  let c = [];
  for (let i in a) {
    let item = a[i];

    let isAdd = true;

    let arr = b.filter((el) => el[key] === item[key]);
    if (arr.length > 0) {
      isAdd = true;
    } else {
      isAdd = false;
    }

    if (!isAdd) {
      c.push(item);
    }
  }

  return c;
}

export function convertArrayObjectToObjectKey(arr, key) {
  let obj = arr.reduce((arr, cur) => {
    arr[cur[key]] = cur;
    return arr;
  }, {});

  return obj;
}

export function createDataTable(arr, arrColumn) {
  let results = [];

  let list = [...arr];

  for (let index in list) {
    let item = list[index];

    let newObj = {};

    for (let key in item) {
      for (let indexColumn in arrColumn) {
        let targetColumn = arrColumn[indexColumn];

        if (targetColumn.field === key) {
          newObj[key] = item[key];
        } else {
          if (targetColumn.children && targetColumn.children.length > 0) {
            for (let child in targetColumn.children) {
              if (targetColumn.children[child].field === key) {
                newObj[key] = item[key];
              }
            }
          }
          if (targetColumn.mainKey && targetColumn.field === "privateKey") {
            newObj["privateKey"] = item[targetColumn.mainKey];
          }
        }
      }
    }

    results.push(newObj);
  }

  return results;
}

export const orderKeyArr = (arr, keyOrder) => {
  const rearrangedArray = arr.map((obj) => {
    const rearrangedObj = {};
    keyOrder.forEach((key) => {
      if (obj.hasOwnProperty(key)) {
        rearrangedObj[key] = obj[key];
      }
      if (key === "statusKey") {
        rearrangedObj["locked"] = obj["locked"];
        rearrangedObj["approved"] = obj["approved"];
        rearrangedObj["deleted"] = obj["deleted"];
      }
    });
    return rearrangedObj;
  });
  return rearrangedArray;
};

export function checkDuplicate(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i].name === arr[j].name) {
        return true;
      }
    }
  }
  return false;
}

export const hasDuplicateObject = (arr1, arr2, key) => {
  return arr1.some((obj1) => arr2.some((objs2) => objs2[key] === obj1[key]));
};

export const getBase64 = (file, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(file);
};

export const replaceUndefinedWithEmptyString = (array) => {
  return array.map((item) => {
    const updatedItem = { ...item };
    for (let key in updatedItem) {
      if (updatedItem[key] === undefined) {
        updatedItem[key] = "";
      }
    }
    return updatedItem;
  });
};

export const cloneDeep = (targetClone) => {
  return JSON.parse(JSON.stringify(targetClone));
};

export const addMissingKeys = (arr) => {
  const allKeys = new Set();
  for (let obj of arr) {
    Object.keys(obj).forEach((key) => allKeys.add(key));
  }
  for (let obj of arr) {
    allKeys.forEach((key) => {
      if (!obj.hasOwnProperty(key)) {
        obj[key] = "";
      }
    });
  }

  return arr;
};
