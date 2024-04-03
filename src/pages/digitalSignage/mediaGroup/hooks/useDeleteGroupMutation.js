import { DigitalSignageGroupMediaApi } from 'api';
import { useMutation, useQueryClient } from 'react-query';
import ResponseMessage from 'message/reponse.message';
const useDeleteGroupMutation = () => {
  const queryClient = useQueryClient();
  const handleDeleteGroup = async (groupCode) => {
    const res = await DigitalSignageGroupMediaApi.deleteGroup(groupCode);
    if (res.status) {
      return groupCode;
    } else {
      throw new Error(res.message);
    }
  };

  const deleteGroupMutation = useMutation(handleDeleteGroup, {
    onSuccess: (groupCode) => {
      ResponseMessage.success('Delete group successfully');
      queryClient.invalidateQueries(['tv/group']);
      queryClient.invalidateQueries(['tv/details']);
    },
    onError: (err) => {
      ResponseMessage.error(err.message);
    },
  });
  return deleteGroupMutation;
};

export default useDeleteGroupMutation;
