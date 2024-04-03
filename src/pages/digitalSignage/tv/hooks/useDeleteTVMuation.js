import { message } from 'antd';
import { DigitalSignageTVApi } from 'api';
import { useMutation, useQueryClient } from 'react-query';

const useDeleteTVMuation = () => {
  const queryClient = useQueryClient();
  const handleAddGroupTV = async (tvCode) => {
    if (!tvCode) {
      throw new Error('TV code is  required');
    }
    const res = await DigitalSignageTVApi.deleteTV(tvCode);
    if (res.status) {
      await DigitalSignageTVApi.socketAction(tvCode, 'setup', 'Back to setup');
      return tvCode;
    } else {
      throw new Error(res.message);
    }
  };

  const deleteTVMutation = useMutation(handleAddGroupTV, {
    onSuccess: () => {
      message.success('Delete tv successfully');
      queryClient.invalidateQueries(['tv']);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });
  return deleteTVMutation;
};

export default useDeleteTVMuation;
