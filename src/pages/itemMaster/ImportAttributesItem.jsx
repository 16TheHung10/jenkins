import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { message } from 'antd';
import { ItemsMasterApi } from 'api';
import MainTable from 'components/common/Table/UI/MainTable';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { useAppContext } from 'contexts';
import { TableImportAttributeItemData } from 'data/render/table';
import { useImportExcel } from 'hooks';
import React, { useEffect, useMemo, useState } from 'react';
import ItemMasterNav from 'components/mainContent/itemMaster/nav/ItemMasterNav';

const ImportAttributesItem = () => {
  const { ComponentImport, dataImported } = useImportExcel();
  const [error, setError] = useState('');
  const { state: AppState, onGetItems } = useAppContext();
  const [payloadImport, setPayloadImport] = useState([]);

  const payloadRow = (data, key) => {
    return {
      ItemID: data.itemID,
      AttributeCode: key,
      Value: data[key],
    };
  };

  const formatedData = useMemo(() => {
    const payloadKey = [
      'allowStoreTF',
      'returnCondition',
      'returnGoodAt',
      'weight',
      'sizeLength',
      'sizeWidth',
      'sizeHeight',
      'pack',
      'carton',
      'pallet',
    ];
    const payload = [];
    for (let item of dataImported || []) {
      if (!['WH0004', 'WH0011'].includes(item.returnGoodAt)) {
        message.error("The value of Return Good At must be equal 'WH0004' or 'WH0011'");
        return null;
      }
      if (!AppState.items[item.itemCode]) {
        setError('Invalid item code, please check your data');
      } else {
        for (let attrKey of Object.keys(item)) {
          if (payloadKey.includes(attrKey) && item[attrKey]) {
            payload.push(payloadRow({ ...item, ...AppState.items[item.itemCode] }, attrKey));
          }
        }
      }
    }
    setPayloadImport(payload);
    if (!dataImported || dataImported.length === 0) {
      return null;
    }

    return dataImported.map((item) => ({
      ...item,
      AttributeCode: item.itemCode,
      Value: item.allowStoreTF,
      ...(AppState.items[item.itemCode]
        ? { ...AppState.items[item.itemCode], isItemValid: true }
        : { isItemValid: false }),
      itemCode: item.itemCode,
    }));
  }, [dataImported, AppState.items]);

  const handleImport = async () => {
    if (!formatedData || formatedData.length === 0) {
      message.error('Data import is empty');
      return;
    }
    if (error) {
      message.error(error);
      return;
    }
    if (formatedData) {
      const res = await ItemsMasterApi.importAttributeItem(payloadImport);
      if (res.status) {
        message.success('Import data successfully');
      } else {
        message.error(res.message);
      }
    }
  };

  useEffect(() => {
    if (!AppState.items) {
      onGetItems();
    }
  }, [AppState.items]);

  return (
    <ItemMasterNav>
      <div className="section-block mt-15">
        <div className="flex items-end gap-10 mb-10">
          <div className="flex flex-col items-start">
            <a
              title="Download file xls"
              href="https://api.gs25.com.vn:8091/storemanagement/share/template/itemMaster/ItemAttribute.xls"
              target="_blank"
            >
              <FontAwesomeIcon icon={faQuestionCircle} />
              Download File xls
            </a>
            <ComponentImport />
          </div>

          <BaseButton iconName="send" color="green" onClick={handleImport}>
            Save
          </BaseButton>
        </div>
        <MainTable
          className="w-full"
          columns={TableImportAttributeItemData.columns({
            items: AppState.items,
          })}
          dataSource={formatedData || []}
        />
      </div>
    </ItemMasterNav>
  );
};

export default ImportAttributesItem;
