import { message } from 'antd';
import { DigitalSignageGroupMediaApi } from 'api';
import CONSTANT from 'constant';
import { DateHelper } from 'helpers';
import moment from 'moment';
import { useMutation, useQueryClient } from 'react-query';

const useUpdateGroupMediaMutation = ({ groupCode }) => {
  const queryClient = useQueryClient();

  const handleFormatPayload = (rawData) => {
    const removedDuplicateMedia = new Map();
    for (let media of rawData.medias) {
      if (!removedDuplicateMedia.has(media.mediaCode)) {
        removedDuplicateMedia.set(media.mediaCode, media);
      }
    }
    rawData.medias = Array.from(removedDuplicateMedia.values())?.map((item, index) => ({
      mediaCode: item.mediaCode,
      order: index,
    }));
    return { medias: rawData.medias };
  };
  const handleUpdateGroup = async (rawData) => {
    if (!groupCode) {
      throw new Error('Please select a group');
    }
    const payload = handleFormatPayload(rawData);
    const res = await DigitalSignageGroupMediaApi.updateGroupMedia(groupCode, payload);
    if (res.status) {
      return payload;
    } else {
      throw new Error(res.message);
    }
  };

  const groupMediaMutation = useMutation(handleUpdateGroup, {
    onSuccess: (data) => {
      queryClient.setQueryData(['tv/group/details', groupCode], (currentData) => {
        return { ...currentData, ...data };
      });
      message.success('Update group successfully');
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  return groupMediaMutation;
};

export default useUpdateGroupMediaMutation;
