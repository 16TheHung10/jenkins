import ObjectHelper from './ObjectHelper';

let ArrayHelper = {
  deepClone(array) {
    return JSON.parse(JSON.stringify([...array]));
  },
  fromRange(start, end, step = 1) {
    let output = [];
    if (typeof end === 'undefined') {
      end = start;
      start = 0;
    } else if (typeof start === 'undefined') {
      start = 0;
    }
    for (let i = start; i <= end; i += step) {
      output.push(i);
    }
    return output;
  },
  swap(array, i1, i2) {
    let temp = array[i1];
    array[i1] = array[i2];
    array[i2] = temp;
  },
  reverse(array) {
    let l = 0;
    let r = array?.length - 1;
    while (l < r) {
      ArrayHelper.swap(array, l, r);
      l++;
      r--;
    }
    return array;
  },
  getFirstDictionary(arrs) {
    let keys = Object.keys(arrs);
    if (keys.length > 0) {
      return keys[0];
    }
    return null;
  },
  convertArrayToObject(array, key) {
    if (!Array.isArray(array)) {
      return null;
    }
    let res = {};
    for (let value of array) {
      res[value[key] === null || value[key] === undefined ? key : value[key]] = value;
    }
    return res;
  },

  convertTreeToObject(array, key) {
    if (!array || array.length === 0 || !key) return null;
    let res = {};
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      res = { ...res, [array[i][key]]: item };
      if (array[i].childrens?.length > 0) {
        const newRes = ArrayHelper.convertTreeToObject(array[i].childrens, key);
        res = { ...res, ...newRes };
      }
    }
    return res;
  },
  convertArrayToMap(arr) {
    let map = new Map();
    for (let item of arr) {
      if (map.get(item)) {
        let currentValue = map.get(item);
        let newtValue = currentValue + 1;
        map.set(item, newtValue);
      } else {
        map.set(item, 1);
      }
    }
    return map;
  },
  multipleFilter(originArray, filterObject) {
    if (!originArray || originArray.length < 0) return;
    let clone = JSON.parse(JSON.stringify(originArray));
    const removedNullValue = ObjectHelper.removeAllNullValue(filterObject);
    clone = clone.filter((item) => {
      let flag = true;
      Object.keys(removedNullValue).forEach((key) => {
        if (!item[key]?.toString().includes(removedNullValue[key])) {
          flag = false;
        }
      });
      return flag;
    });
    return clone;
  },
  compareTwoArray(source, target) {
    if (!source || !target) return false;
    if (source.length !== target.length) return false;
    const map1 = ArrayHelper.convertArrayToMap(source);
    const map2 = ArrayHelper.convertArrayToMap(target);
    for (let item of [...map1.keys()]) {
      if (map2.get(item) !== map1.get(item)) {
        return false;
      }
    }
    return true;
  },
  getDiff(array1, array2) {
    const differentElements = array1.filter((element) => !array2.includes(element));
    return differentElements;
  },

  deleteItemByKeyValue(arr, key, value) {
    return arr.filter((item) => {
      if (item[key] === value) {
        return false;
      } else if (item.children) {
        item.children = ArrayHelper.deleteItemByKeyValue(item.children, key, value);
      }
      return true;
    });
  },

  findChildInNestedArray(arr, target, keyName) {
    if (!arr || !target || !keyName || !Array.isArray(arr)) return null;
    const stack = JSON.parse(JSON.stringify(arr));
    while (stack.length > 0) {
      const current = stack.pop();
      if (current[keyName] == target) {
        return current;
      }
      if (current.children && current.children.length > 0) {
        stack.push(...current.children);
      }
    }
    return null;
  },

  findChildInNestedArray2(arr, target, keyName) {
    if (!arr || !target || !keyName || !Array.isArray(arr)) return [];
    const res = [];
    const stack = JSON.parse(JSON.stringify(arr));
    while (stack.length > 0) {
      const current = stack.pop();
      if (
        current[keyName]?.toLowerCase().includes(target?.toLowerCase()) ||
        target?.toLowerCase().includes(current[keyName]?.toLowerCase())
      ) {
        res.push(current);
      }
      if (current.childrens && current.childrens.length > 0) {
        stack.push(...current.childrens);
      }
    }
    return res;
  },
};

export default ArrayHelper;
