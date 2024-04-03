import { Col, Row, message } from 'antd';
import FieldList from 'components/common/fieldList/FieldList';
import { FieldsEcommerceItemData } from 'data/render/form';
import { useFormFields } from 'hooks';
import React, { useCallback, useRef, useState } from 'react';
import { useEffect } from 'react';
import SubmitBottomButton from 'components/common/buttons/submitBottomButton/SubmitBottomButton';
import MainTable from 'components/common/Table/UI/MainTable';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { EcommerceItemApi } from 'api';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
const EcommerceRelateItems = ({ isLoading = false, itemCode }) => {
  const queryClient = useQueryClient();
  const [itemOptions, setItemOptions] = useState([]);
  const [searchItemKeyword, setSearchItemKeyword] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const searchRef = useRef();

  const handleGetItemOptions = useCallback(async () => {
    const searchKeywordTrim = searchItemKeyword?.trim();
    if (!searchKeywordTrim || searchKeywordTrim.length < 3) return;
    const res = await EcommerceItemApi.getItems({ searchKeyword: searchKeywordTrim });
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
        console.log({ value, el });

        return el.itemCodeRef === JSON.parse(value.item)?.itemCode;
      }) !== -1
    ) {
      message.info('Item was added');
      return;
    }
    setSelectedItems((prev) => [...prev, { itemName: JSON.parse(value.item).itemName, itemCodeRef: JSON.parse(value.item).itemCode, order: value.order }]);
  };

  const {
    formInputsWithSpan: fields,
    onSubmitHandler,
    reset,
  } = useFormFields({
    fieldInputs: FieldsEcommerceItemData.fieldsInputsAddItemRelate({ itemOptions, setSearch: setSearchItemKeyword }),
    onSubmit: handleAddItemLocal,
  });

  const handleRemoveItemFromGroup = (itemCode) => {
    let clone = JSON.parse(JSON.stringify(selectedItems));
    const newValues = clone.filter((el) => el.itemCodeRef !== itemCode);
    setSelectedItems(newValues);
  };

  const handleSubmitAddRelateItems = async () => {
    if (itemCode == null || itemCode === undefined) {
      message.error('Please provide group identifier');
      return;
    }
    const res = await EcommerceItemApi.addItemRelate(itemCode, { items: selectedItems });
    if (res.status) {
      message.success('Add item to group successfully');
      queryClient.invalidateQueries({ queryKey: ['ecommerce/groups', 'details', itemCode] });
    } else {
      message.error(res.message);
    }
  };

  const handleGetRelateItems = useCallback(async () => {
    const res = await EcommerceItemApi.getItemRelate(itemCode);
    if (res.status) {
      setSelectedItems(res.data.relateItems?.map((item) => ({ itemCodeRef: item.itemCode, itemName: item.itemName, order: item.order || 0 })));
    } else {
      message.error(res.message);
    }
  }, [itemCode]);

  useEffect(() => {
    handleGetRelateItems();
  }, [handleGetRelateItems]);

  return (
    <div className="">
      {selectedItems?.length <= 5 && (
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
      )}

      {selectedItems ? (
        <div className="section-block mt-15">
          <MainTable
            className="w-full"
            columns={[
              {
                title: 'Item',
                dataIndex: 'itemCodeRef',
                key: 'itemCode',
                render: (text, record) => <a target="_blank" href={`/ecommerce/items/details/${text}`}>{`${text}-${record.itemName}`}</a>,
              },
              {
                title: 'Order',
                dataIndex: 'order',
                key: 'order',
                render: (text, record) => +text + 1,
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
                render: (text, record) => <BaseButton iconName="delete" color="error" onClick={() => handleRemoveItemFromGroup(record.itemCodeRef)} />,
              },
            ]}
            dataSource={selectedItems}
          />
          <SubmitBottomButton className="mt-15" title="Save chage" onClick={handleSubmitAddRelateItems} />
        </div>
      ) : null}
    </div>
  );
};

export default EcommerceRelateItems;
