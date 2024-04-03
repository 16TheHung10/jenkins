import { validate } from 'uuid';
import Moment from 'moment';
import ObjectHelper from './ObjectHelper';
import moment from 'moment';
let StringHelper = {
  hidePartOfString(string) {
    if (!string) return '';
    if (string.length === 1) return '*';
    if (!string || string.length <= 5)
      return string?.slice(0, 1) + Array(string?.slice(1, string?.length).length).fill('*').join('');
    const hided =
      string?.toString().slice(0, 2) + Array(string?.slice(2, -2)?.length).fill('*').join('') + string?.slice(-2);
    return hided;
  },
  hideDateOfBirth(time) {
    if (!time) return '';
    const newDate = new Date(time);
    const timeFormated = moment(time).utc().format('DD/MM/YYYY');
    // return '* */ * */' + timeFormated?.slice(-4);
    return timeFormated.slice(0, 6) + '****';
  },
  hidePhoneBumber(phoneNumber) {
    if (!phoneNumber) return '';
    return phoneNumber.slice(0, 4) + '***' + phoneNumber.slice(7, phoneNumber.length);
  },
  hideEmail(email) {
    if (!email) return '';
    const splitEmail = email.split('@');
    const prefix = splitEmail[0];
    const subfix = splitEmail[1];
    const hided = prefix.slice(0, 2) + Array(prefix.slice(2)?.length).fill('* ').join('') + subfix;
    return hided;
  },
  isBase64(base64String) {
    if (!base64String) return false;
    let base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    return base64regex.test(StringHelper.base64Smooth(base64String));
  },
  calPageCount(totalRecord, pageSize) {
    return Math.ceil(parseInt(totalRecord, 10) / parseInt(pageSize, 10));
  },
  normalize(string) {
    let copy = string;
    if (typeof string !== 'string') {
      copy = string?.toString();
    }
    const normalizedString = copy?.normalize('NFD')?.replace(/[\u0300-\u036f]/g, '');
    const updatedString = normalizedString.replace(/\s+/g, ' ').trim();
    return updatedString;
  },
  convertObjectToSearchParams(object) {
    const keys = Object.keys(object || {});
    let stringRes = '';
    for (let key of keys) {
      const value = object[key] || object[key] === 0 ? object[key] : '';
      stringRes += `&${key}=${value}`;
    }
    if (stringRes) {
      stringRes = '?' + stringRes.slice(1);
      return stringRes;
    }
    return '';
  },
  convertSearchParamsToObject(searchString) {
    const searchParams = new URLSearchParams(searchString);
    let object = Object.fromEntries(searchParams?.entries());
    return ObjectHelper.removeAllNullValue(object);
  },
  convertSearchParamsToObjectIncludeNull(searchString) {
    const searchParams = new URLSearchParams(searchString);
    let object = Object.fromEntries(searchParams?.entries());
    return object;
  },
  reverse(string) {
    let res = '';
    let r = string?.length - 1;
    while (r > 0) {
      res += string[r];
      r--;
    }
    return res;
  },
  camelCaseToString(key) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  },

  randomNumber() {
    return Math.floor(Math.random() * 1000);
  },
  formatStringToTime(timeString) {
    const reverseString = StringHelper.reverse(timeString);
    const day = timeString?.substring(6, timeString.length);
    const month = timeString?.substring(4, 6);
    const year = timeString?.substring(0, 4);
    return `${day}/${month}/${year}`;
  },

  randomKey() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < possible.length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  },

  formatPrice(price) {
    return price
      ? StringHelper.escapeQty(price).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })
      : 0;
  },

  formatQty(qty) {
    return qty
      ? StringHelper.escapeQty(qty).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })
      : 0;
  },

  formatQtyControl(qty) {
    return qty
      ? StringHelper.escapeQtyDecimal(qty).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })
      : 0;
  },

  formatValue(qty) {
    return qty
      ? StringHelper.escapeQtyDecimal(qty).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })
      : 0;
  },

  escapeQty(qty) {
    return qty ? parseInt(qty, 10) : 0;
  },

  escapeQtyDecimal(qty) {
    return qty ? parseFloat(qty) : 0;
  },

  escapeNumber(number) {
    return number ? parseInt(number, 10) : 0;
  },

  formatPercent(number) {
    return number ? number.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 0;
  },

  searchLike(str, keyword) {
    return str.toLowerCase().search(keyword ? keyword.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').toLowerCase() : '');
  },

  countValueUsed(params) {
    var i = 0;
    for (var item in params) {
      if (params[item]) {
        i++;
      }
    }
    return i;
  },

  decodeToken(token) {
    return JSON.parse(atob(token.split('.')[1]));
  },

  base64Smooth(src) {
    let res = src.replace(/^data:image\/(png|jpeg|jpg|gif|avif|webp);base64,/, '');
    return res;
  },

  validateStaffCode(type, staffCode) {
    switch (type) {
      case 'FC':
        let reg = new RegExp('^[F][0-9][0-9][0-1][0-9][0-3][0-9][0-9][0-9][0-9]$');
        return reg.test(staffCode);
      case 'DS':
        let regDS = new RegExp('^[0-9][0-9][0-1][0-9][0-3][0-9][0-9][0-9][0-9]$');
        return regDS.test(staffCode);
      default:
      // code block
    }
  },

  validateDate(value, format = '') {
    if (Moment(value, format).format(format) === 'Invalid date') {
      return false;
    }
    return true;
  },
  validatePrice(value) {
    let reg = new RegExp('^([0-9]*[.])?[0-9]+$');
    if (!reg.test(value)) {
      this.isValidateSuccess = false;
      return false;
    }
    return true;
  },
  highLightNegative(qty) {
    if (qty < 0) {
      return 'cl-red';
    }
    return '';
  },
};

export default StringHelper;
