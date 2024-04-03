import { message } from 'antd';
import { DigitalSignageTVApi } from 'api';
import { useMutation, useQueryClient } from 'react-query';

const useAddGroupTVMuation = ({ tvCode, storeCode }) => {
  const queryClient = useQueryClient();
  const handleAddGroupTV = async (data) => {
    const payload = {
      groupCodes: data.groupMedias.map((item) => item.groupCode),
      defaultMedia: data.defaultMedia,
    };
    if (!tvCode) {
      throw new Error('TV code is  required');
    }
    const res = await DigitalSignageTVApi.addGroupsMedia(tvCode, payload);
    if (res.status) {
      await DigitalSignageTVApi.socketAction(tvCode, 'update_data', {});
      return data;
    } else {
      throw new Error(res.message);
    }
  };

  const groupMutation = useMutation(handleAddGroupTV, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['tv/details', tvCode]);
      // -----------------------------------------------------------------------------------------
      const currentGroupDetailsQueries = queryClient.getQueryCache().findAll('tv/group/details');
      currentGroupDetailsQueries.forEach((query) => {
        console.log({ query, data });
        if (query.state.data?.stores?.includes(storeCode)) {
          queryClient.invalidateQueries(query.queryKey);
        }
      });

      message.success('Add group successfully');
    },
    onError: (err) => {
      queryClient.invalidateQueries(['tv/details', tvCode]);
      message.error(err.message);
    },
  });
  return groupMutation;
};

export default useAddGroupTVMuation;
