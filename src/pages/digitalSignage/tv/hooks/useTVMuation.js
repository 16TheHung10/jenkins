import { message } from 'antd';
import { DigitalSignageTVApi } from 'api';
import { useMutation, useQueryClient } from 'react-query';

const useTVMuation = ({ tvCode }) => {
  const queryClient = useQueryClient();
  const handleUpdateTV = async (data) => {
    if (!tvCode) {
      throw new Error('TV code is  required');
    }
    const res = await DigitalSignageTVApi.updateTV(tvCode, data);
    if (res.status) {
      return data;
    } else {
      throw new Error(res.message);
    }
  };

  const groupMutation = useMutation(handleUpdateTV, {
    onSuccess: (data) => {
      const currentQueries = queryClient.getQueryCache().findAll('tv');
      currentQueries.forEach((query) => {
        if (query.state.data && query.state.data[tvCode]) {
          const currentData = { ...query.state.data };
          currentData[tvCode] = { ...currentData[tvCode], ...data, tvCode };
          queryClient.setQueryData(query.queryKey, currentData);
        }
      });
      queryClient.setQueryData(['tv/details', tvCode], (currentData) => {
        return { ...currentData, ...data };
      });
      message.success('Update TV successfully');
    },
    onError: (err) => {
      message.error(err.message);
    },
  });
  return groupMutation;
};

export default useTVMuation;
