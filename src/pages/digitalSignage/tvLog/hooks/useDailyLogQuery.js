import { message } from 'antd';
import { DigitalSignageTVApi } from 'api';
import CONSTANT from 'constant';
import moment from 'moment';
import { useQuery } from 'react-query';

const useDailyLogQuery = ({ searchFormValue, role = 'mkt' }) => {
  const handleFormatDataForMKT = (data) => {
    try {
      const formatedData = [];
      for (let item of data) {
        const contents = item.content ? JSON.parse(item.content) : [];
        if (typeof contents !== 'string' && contents.length > 0) {
          for (let index in contents) {
            const content = contents[index];
            formatedData.push({
              ...item,
              ...content,
              content: null,
              rowSpan: +index === 0 ? contents.length : 0,
              colSpan: +index === 0 ? 1 : 0,
            });
          }
        } else {
          formatedData.push({
            ...item,
            videoCode: null,
            firstPeriodShown: null,
            lastPeriodShown: null,
            playCount: null,
            totalDuration: null,
            content: null,
            videoCode: null,
            rowSpan: 1,
            colSpan: 1,
          });
        }
      }
      return formatedData;
    } catch (err) {
      return [];
    }
  };

  const handleGetTVLogs = async () => {
    const { date, ...restParmas } = searchFormValue;
    const payload = {
      startDate: searchFormValue?.date?.[0]
        ? moment(searchFormValue.date?.[0]).format(CONSTANT.FORMAT_DATE_PAYLOAD)
        : null,
      endDate: searchFormValue?.date?.[1]
        ? moment(searchFormValue.date?.[1]).format(CONSTANT.FORMAT_DATE_PAYLOAD)
        : null,
      ...restParmas,
    };

    const res = await DigitalSignageTVApi.getDailyLog(payload);

    if (res.status) {
      const data = role === 'mkt' ? handleFormatDataForMKT(res.data.logs) : res.data.logs;

      return { logs: data, total: res.data.total };
    } else {
      message.error(res.message);
      return [];
    }
  };

  const tvsQuery = useQuery({
    queryKey: ['tv/log', searchFormValue],
    queryFn: handleGetTVLogs,
    enabled: Boolean(searchFormValue?.pageSize) && Boolean(searchFormValue?.date),
  });
  return tvsQuery;
};

export default useDailyLogQuery;
