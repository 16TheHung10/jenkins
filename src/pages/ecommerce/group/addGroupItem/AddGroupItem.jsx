import { Col, Row, message } from 'antd';
import FieldList from 'components/common/fieldList/FieldList';
import { FieldsEcommerceGroupData } from 'data/render/form';
import { useFormFields } from 'hooks';
import React, { useCallback, useRef, useState } from 'react';
import ItemsMasterApi from '../../../../api/ItemsMasterApi';
import { useEffect } from 'react';
import SubmitBottomButton from 'components/common/buttons/submitBottomButton/SubmitBottomButton';
import MainTable from 'components/common/Table/UI/MainTable';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { EcommerceGroupApi, EcommerceItemApi } from 'api';
import { useQueryClient } from 'react-query';

const AddGroupItem = ({ initialItems = [], isLoading = false, groupID }) => {
  const queryClient = useQueryClient();
  const [itemOptions, setItemOptions] = useState([]);
  const [searchItemKeyword, setSearchItemKeyword] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const searchRef = useRef();

  const handleGetItemOptions = useCallback(async () => {
    if (!searchItemKeyword || searchItemKeyword.length < 3) return;
    const res = await EcommerceItemApi.getItems({ itemCode: searchItemKeyword });
    if (res.status) {
      setItemOptions(res.data?.items?.map((item) => ({ value: JSON.stringify({ ...item, itemCode: item.itemCode }), label: `${item.itemCode} - ${item.itemName}` })) || []);
    } else {
      message.error(res.message);
    }
  }, [searchItemKeyword]);

  useEffect(() => {
    if (searchRef.current) {
      clearTimeout(searchRef.current);
    }
    searchRef.current = setTimeout(() => {
      handleGetItemOptions();
    }, 1000);
  }, [handleGetItemOptions]);

  const handleAddItemLocal = (value) => {
    if (
      selectedItems?.findIndex((el) => {
        return el.itemCode === JSON.parse(value.item)?.itemCode;
      }) !== -1
    ) {
      message.info('Item was added');
      return;
    }
    setSelectedItems((prev) => [...prev, JSON.parse(value.item)]);
  };

  const {
    formInputsWithSpan: fields,
    onSubmitHandler,
    reset,
  } = useFormFields({
    fieldInputs: FieldsEcommerceGroupData.fieldsInputsGroupItemInsert({ itemOptions, setSearch: setSearchItemKeyword }),
    onSubmit: handleAddItemLocal,
  });

  const handleRemoveItemFromGroup = (itemCode) => {
    let clone = JSON.parse(JSON.stringify(selectedItems));
    const newValues = clone.filter((el) => el.itemCode !== itemCode);
    setSelectedItems(newValues);
  };

  const handleSubmitAddItemToGroup = async () => {
    if (groupID == null || groupID === undefined) {
      message.error('Please provide group identifier');
      return;
    }
    const res = await EcommerceGroupApi.addItemToGroup(groupID, { images: selectedItems?.map((item) => item.itemCode) });
    if (res.status) {
      message.success('Add item to group successfully');
      queryClient.invalidateQueries({ queryKey: ['ecommerce/groups', 'details', groupID] });
    } else {
      message.error(res.message);
    }
  };

  useEffect(() => {
    setSelectedItems(initialItems);
  }, [initialItems]);
  return (
    <div className="">
      <form
        onSubmit={(e) => {
          onSubmitHandler(e);
          reset();
        }}
      >
        <div className="section-block w-full">
          <Row gutter={[16, 0]}>
            <FieldList fields={fields} />
            <Col span={24}>
              <SubmitBottomButton loading={isLoading} title="Add" />
            </Col>
          </Row>
        </div>
      </form>
      {selectedItems ? (
        <div className="section-block mt-15">
          <MainTable
            className="w-full"
            columns={[
              {
                title: 'Item',
                dataIndex: 'itemCode',
                key: 'itemCode',
                render: (text, record) => `${text}-${record.itemName}`,
              },
              {
                title: 'Action',
                dataIndex: '',
                key: '',
                width: 50,
                onHeaderCell: () => {
                  return {
                    style: {
                      textAlign: 'center',
                    },
                  };
                },
                onCell: () => {
                  return {
                    style: {
                      textAlign: 'center',
                    },
                  };
                },
                render: (text, record) => <BaseButton iconName="delete" color="error" onClick={() => handleRemoveItemFromGroup(record.itemCode)} />,
              },
            ]}
            dataSource={selectedItems}
          />
          <SubmitBottomButton className="mt-15" title="Save chage" onClick={handleSubmitAddItemToGroup} />
        </div>
      ) : null}
    </div>
  );
};

export default AddGroupItem;
