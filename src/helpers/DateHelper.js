import moment from 'moment';
import Moment from 'moment';
import CONSTANT from 'constant';

let DateHelper = {
  calcAge(date) {
    var diff_ms = Date.now() - new Date(date).getTime();
    var age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  },
  getDateOfWeekMoment(dateNumber) {
    switch (dateNumber) {
      case 0:
        return 'CN';
      case 1:
        return 'Thứ 2';
      case 2:
        return 'Thứ 3';
      case 3:
        return 'Thứ 4';
      case 4:
        return 'Thứ 5';
      case 5:
        return 'Thứ 6';
      case 6:
        return 'Thứ 7';
      default:
        return '-';
    }
  },
  displayDateNo7(date) {
    return date ? Moment.utc(date).format('DD/MM/YYYY') : '';
  },
  displayDateDateMonth(date) {
    return date ? Moment(date).format('DD/MM') : '';
  },
  displayDateTime2(date) {
    return date ? Moment(date).format('DD/MM/YYYY hh:mm A') : '';
  },
  displayTime(date) {
    return date ? Moment(date).format('HH:mm') : '';
  },
  displayDateTime24(date) {
    return date ? Moment(date).format('DD/MM/YYYY HH:mm:ss') : '';
  },
  displayTimeSecond(date) {
    return date ? Moment(date).format('HH:mm:ss') : '';
  },
  displayDateTime24HM(date) {
    return date ? Moment(date.slice(0, -1)).format('DD/MM/YYYY HH:mm') : '';
  },
  displayDateTime(date) {
    return date ? Moment(date).format('DD/MM/YYYY hh:mm:ss') : '';
  },
  displayDateTimeNo7(date) {
    return date ? Moment.utc(date).format('DD/MM/YYYY HH:mm:ss') : '';
  },
  displayDateTimeFormat(date) {
    return date ? Moment(date).format() : '';
  },
  displayDate(date) {
    return date ? Moment(date).format('DD/MM/YYYY') : '';
  },
  displayFormat(date) {
    return date ? Moment(date).format('YYYY/MM/DD HH:mm:ss') : '';
  },
  displayFormatMinus(date) {
    return date ? Moment(date).format('YYYY-MM-DD HH:mm:ss') : '';
  },
  displayDateStandard(date) {
    return date ? Moment(date).toDate() : '';
  },
  displayDateFormat(date, format = 'YYYY/MM/DD') {
    return date ? Moment(date).format(format) : '';
  },
  displayDateFormatMinus(date, format = 'YYYY-MM-DD') {
    return date ? Moment(date).format(format) : '';
  },
  displayDateFormatDayMonth(date, format = 'MM/DD') {
    return date ? Moment(date).format(format) : '';
  },
  displayDateFormatYearMonthMinus(date, format = 'YYYY-MM') {
    return date ? Moment(date).format(format) : '';
  },
  getFirstDate() {
    var date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  },
  addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },
  displayAddDaysFormat(date, days) {
    return DateHelper.displayDate(DateHelper.addDays(date, days));
  },
  nextDate(date, dateStr) {
    var dayArr1 = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    var dayArr2 = dateStr === 'All' ? dayArr1 : dateStr.split('-');

    var currentDate = new Date(date);
    var currentDay = dayArr1[currentDate.getDay()];

    var index = dayArr2.indexOf(currentDay);

    if (index !== -1) {
      if (index === dayArr2.length - 1) {
        index = 0;
      } else {
        index++;
      }
      return dayArr2[index];
    }
    return currentDay;
  },
  diffDate(date1, date2) {
    var msPerDay = 8.64e7;
    var x0 = new Date(date1);
    var x1 = new Date(date2);
    x0.setHours(0, 0, 0);
    x1.setHours(0, 0, 0);
    return Math.round((x1 - x0) / msPerDay);
  },
  getDateKey(date) {
    return date ? Moment(date).format('YYYYMMDD') : '';
  },
  convertKeyDateToYYYYMMDD(keyDate) {
    let str = keyDate.toString();
    var year = str.substring(0, 4);
    var month = str.substring(4, 6);
    var day = str.substring(6, 8);
    let date = year + '-' + month + '-' + day;

    return date;
  },
  getALlDateInRange(startDate, endDate) {
    if (!startDate || !endDate) return null;
    const dateRange = [];
    const currentDate = moment(startDate);
    while (currentDate.startOf('day').isSameOrBefore(moment(endDate).endOf('day'))) {
      dateRange.push(moment(currentDate));
      currentDate.add(1, 'day');
    }

    return dateRange;
  },
  getALlDateInRangeFormated(startDate, endDate) {
    if (!startDate || !endDate) return null;
    const dateRange = [];
    const currentDate = moment(startDate);
    while (currentDate <= endDate) {
      dateRange.push(moment(currentDate).format(CONSTANT.FORMAT_DATE_IN_USE));
      currentDate.add(1, 'day');
    }
    return dateRange;
  },
  isValidDate(dateString, format = 'YYYY-MM-DD') {
    const isValid = moment(dateString, format, true).isValid();
    return isValid;
  },
};

export default DateHelper;
