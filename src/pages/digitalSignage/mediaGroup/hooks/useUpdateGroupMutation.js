import { message } from 'antd';
import { DigitalSignageGroupMediaApi } from 'api';
import CONSTANT from 'constant';
import { DateHelper } from 'helpers';
import moment from 'moment';
import { useMutation, useQueryClient } from 'react-query';

const useUpdateGroupMutation = ({ groupCode }) => {
  const queryClient = useQueryClient();
  const handleFormatPayload = (rawData) => {
    let allDates = null;
    const applyDatesPayload = [];
    if (rawData.applyDates?.length > 0 && rawData.mode === 'NORMAL') {
      allDates = DateHelper.getALlDateInRange(moment(rawData.applyDates[0]), moment(rawData.applyDates[1]))?.map(
        (item) => moment(item).format(CONSTANT.FORMAT_DATE_PAYLOAD)
      );
      for (let date of allDates) {
        for (let time of rawData.times) {
          const startTime = moment(time.frame[0]).format('HH:mm');
          const endTime = moment(time.frame[1]).format('HH:mm');
          applyDatesPayload.push({
            applyDate: date,
            startTime,
            endTime,
          });
        }
      }
    } else {
      for (let time of rawData.times) {
        const startTime = moment(time.frame[0]).format('HH:mm');
        const endTime = moment(time.frame[1]).format('HH:mm');
        applyDatesPayload.push({
          startTime,
          endTime,
        });
      }
    }
    rawData.applyDates = applyDatesPayload?.length > 0 ? applyDatesPayload : 0;
    rawData.mode = rawData.mode ? rawData.mode : null;
    const { times, medias, ...payload } = rawData;
    return rawData;
  };
  const handleUpdateGroup = async (rawData) => {
    if (!groupCode) {
      throw new Error('Please select a group');
    }
    const payload = handleFormatPayload(rawData);
    const res = await DigitalSignageGroupMediaApi.updateGroup(groupCode, payload);
    if (res.status) {
      return payload;
    } else {
      throw new Error(res.message);
    }
  };

  const groupMutation = useMutation(handleUpdateGroup, {
    onSuccess: (data) => {
      const currentQueries = queryClient.getQueryCache().findAll('tv/group');
      currentQueries.forEach((query) => {
        if (query.state.data && query.state.data[groupCode]) {
          const currentData = { ...query.state.data };
          currentData[groupCode] = { ...currentData[groupCode], ...data, groupMode: data.mode, groupCode };
          queryClient.setQueryData(query.queryKey, currentData);
        }
      });

      // -----------------------------------------------------------------------------------------
      const currentTVDetailsQueries = queryClient.getQueryCache().findAll('tv/details');
      currentTVDetailsQueries.forEach((query) => {
        if (data?.stores?.includes(query.state.data?.storeCode)) {
          let currentData = { ...query.state.data };
          currentData.groupMedias = {
            ...currentData.groupMedias,
            [groupCode]: { ...data, groupMode: data.mode, groupCode },
          };
          console.log({ currentData });
          queryClient.setQueryData(query.queryKey, currentData);
        }
      });

      queryClient.invalidateQueries(['tv/group/details', groupCode]);
      message.success('Update group successfully');
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  return groupMutation;
};

export default useUpdateGroupMutation;
