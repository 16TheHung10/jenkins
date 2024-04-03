import { CommonApi } from 'api';
import AppMessage from 'message/reponse.message';
import CommonModel from 'models/CommonModel';
import { useQuery } from 'react-query';

const useGetCommonQuery = ({ type }) => {
  const handleGetCommon = async () => {
    const model = new CommonModel();
    const res = await model.getData(type);
    if (res.status) {
      return res.data;
    } else {
      AppMessage.error(res.message);
    }
    return [];
  };

  const itemMasterDetailsQuery = useQuery({
    queryKey: [...(type ? type.split(',') : [])],
    queryFn: handleGetCommon,
    enabled: Boolean(type),
  });
  return itemMasterDetailsQuery;
};

export default useGetCommonQuery;
