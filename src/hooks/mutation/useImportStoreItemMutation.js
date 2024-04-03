import { ItemsMasterApi } from 'api';
import CONSTANT from 'constant';
import AppMessage from 'message/reponse.message';
import { useMutation, useQueryClient } from 'react-query';

const useImportStoreItemMutation = () => {
  const queryClient = useQueryClient();

  const handleImport = async ({ value, dataImported, callback }) => {
    console.log({ value });
    const itemMasterImports = dataImported?.map((item) => ({
      ...item,
      allowReturnSupplier: true,
      moqStore: 1,
      returnGoodsTerm: 1,
    }));
    const payload = {
      itemMasterImports,
      storeApply: value.storeApply,
    };
    const res = await ItemsMasterApi.importItemByStore(payload);
    if (res.status) {
      callback();
      // formImport.resetFields();
      // setDataImported([]);
      return value;
    } else {
      throw new Error(res.message);
    }
  };

  const importStoreItemMutation = useMutation(handleImport, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(CONSTANT.QUERY.STORE.ITEMS);
      AppMessage.success('Import item successfully');
    },
    onError: (err) => {
      AppMessage.error(err.message);
    },
  });

  return importStoreItemMutation;
};

export default useImportStoreItemMutation;
