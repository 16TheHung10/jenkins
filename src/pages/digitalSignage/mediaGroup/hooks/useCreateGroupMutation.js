import { message } from 'antd';
import { DigitalSignageGroupMediaApi } from 'api';
import CONSTANT from 'constant';
import { DateHelper } from 'helpers';
import moment from 'moment';
import { useMutation, useQueryClient } from 'react-query';

const useCreateGroupMutation = () => {
  const queryClient = useQueryClient();
  const handleFormatPayload = (rawData) => {
    let allDates = null;
    const applyDatesPayload = [];
    if (rawData.applyDates?.length > 0) {
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
    rawData.medias = rawData.medias?.map((item, index) => ({ mediaCode: item.mediaCode, order: index }));
    rawData.mode = rawData.mode ? rawData.mode : null;
    const { times, ...payload } = rawData;
    return payload;
  };
  const handleCreateGroup = async (rawData) => {
    const payload = handleFormatPayload(rawData);
    const res = await DigitalSignageGroupMediaApi.createGroup(payload);
    if (res.status) {
      return payload;
    } else {
      throw new Error(res.message);
    }
  };

  const groupMutation = useMutation(handleCreateGroup, {
    onSuccess: (data) => {
      message.success('Create group successfully');
      queryClient.invalidateQueries(['tv/group']);
      queryClient.invalidateQueries(['tv/details']);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  return groupMutation;
};

export default useCreateGroupMutation;
