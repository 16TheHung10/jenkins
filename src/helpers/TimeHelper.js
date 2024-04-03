export const TimeHelper = {
  convertHoursMinutesToTimeStamp: (timeString) => {
    const [hour, minute] = timeString.split(":");
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    const timestamp = date.getTime();
    return timestamp;
  },
};
export default TimeHelper;
