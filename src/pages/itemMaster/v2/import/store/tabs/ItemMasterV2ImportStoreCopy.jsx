import { ItemsMasterApi } from 'api';
import AppMessage from 'message/reponse.message';
import ItemMasterV2ImportStoreCopyForm from 'pages/itemMaster/v2/import/store/form/ItemMasterV2ImportStoreCopyForm';
import React from 'react';

const ItemMasterV2ImportStoreCopy = () => {
  const handleImport = async (dataImported, storeCodes, callback) => {
    const payload = { itemMasterImports: dataImported, storeApply: storeCodes };
    const res = await ItemsMasterApi.importItemByStore(payload);
    if (res.status) {
      AppMessage.success('Import data successfully');
      callback();
    } else {
      AppMessage.error(res.message);
    }
  };
  return (
    <>
      <ItemMasterV2ImportStoreCopyForm onImport={handleImport} />
    </>
  );
};

export default ItemMasterV2ImportStoreCopy;
