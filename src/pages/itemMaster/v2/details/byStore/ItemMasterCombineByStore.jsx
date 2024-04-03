import { Form, Input, InputNumber, Modal, Popconfirm } from 'antd';
import MainTable from 'components/common/Table/UI/MainTable';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import SelectItemMaster from 'components/common/selects/SelectItemMaster';
import { mainContentRef } from 'components/mainContent/MainContent';
import { useGetItemMasterCombineQuery, useUpdateItemMasterCombineMutation } from 'hooks';
import Icons from 'images/icons';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ItemMasterCombineByStore = ({ itemData, itemType }) => {
  const { itemCode } = useParams();
  const [isModalAddItemOpen, setIsModalAddItemOpen] = useState(false);
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const [addItemForm] = Form.useForm();

  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record.key);
  };
  const handleCancelRow = () => {
    setEditingKey('');
  };

  const handleSaveRow = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.itemCode);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const itemCombineQuery = useGetItemMasterCombineQuery({
    itemCode,
  });
  const updater = useUpdateItemMasterCombineMutation({
    itemCode,
  });

  const handleDeleteItem = (itemCode) => {
    let clone = JSON.parse(JSON.stringify(data));
    clone = clone.filter((el) => el.itemCode !== itemCode);
    setData(clone);
  };
  const handleAddItem = (itemData) => {
    const clone = JSON.parse(JSON.stringify(data || []));
    clone.unshift(itemData);
    setData(clone);
    setIsModalAddItemOpen(false);
  };

  const columns = [
    {
      title: 'Item',
      dataIndex: 'itemCode',
      key: 'itemCode',
      render: (value, record) => {
        if (!value) return '-';
        return (
          <>
            <p className="m-0">{record.itemName}</p>
            <p className="m-0 hint">{value}</p>
          </>
        );
      },
    },

    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      editable: true,
      width: 100,
      render: (text) => text || +'-',
    },
    {
      title: 'Action',
      dataIndex: '',
      width: 200,

      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <div className="flex gap-10 items-center">
            <BaseButton icon={<Icons.Save />} color="green" onClick={() => handleSaveRow(record.itemCode)} />
            <Popconfirm title="Sure to cancel?" onConfirm={handleCancelRow}>
              <BaseButton icon={<Icons.Cancel />} color="error" />
            </Popconfirm>
          </div>
        ) : (
          <div className="flex items-center gap-10">
            <BaseButton disabled={editingKey !== ''} onClick={() => edit(record)} iconName="edit" />
            {itemType !== 2 ? (
              <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteItem(record.itemCode)}>
                <BaseButton iconName="delete" color="error" />
              </Popconfirm>
            ) : null}
          </div>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  useEffect(() => {
    if (itemCombineQuery.status === 'success') {
      mainContentRef.current.scrollTo({
        top: mainContentRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [itemCombineQuery.status]);

  useEffect(() => {
    setData(itemCombineQuery.data);
  }, [itemCombineQuery.data]);

  return (
    <>
      <Form form={form} component={false}>
        <div className="flex gap-10 items-center mb-15">
          <BaseButton loading={updater.isLoading} iconName="Save" color="green" onClick={() => updater.mutate(data)}>
            Save
          </BaseButton>
          {itemType === 1 && itemCombineQuery.data?.length > 0 ? null : (
            <BaseButton loading={updater.isLoading} iconName="plus" onClick={() => setIsModalAddItemOpen(true)}>
              Add Item
            </BaseButton>
          )}
        </div>
        <MainTable
          rowClassName="editable-row"
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          loading={itemCombineQuery.isLoading}
          className="w-full"
          columns={mergedColumns}
          dataSource={data}
        />
      </Form>
      <Modal
        width={500}
        title="Add item"
        open={isModalAddItemOpen}
        onCancel={() => {
          setIsModalAddItemOpen(false);
        }}
        footer={false}
      >
        <Form form={addItemForm} onFinish={handleAddItem} layout="vertical">
          <Form.Item
            name="itemCode"
            label="Item code"
            rules={[
              {
                required: true,
                message: `Item is required`,
              },
            ]}
          >
            <SelectItemMaster />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[
              {
                required: true,
                message: `Quantity is reuiqred`,
              },
            ]}
          >
            <InputNumber min={0} max={999} className="w-full" />
          </Form.Item>
          <BaseButton iconName="plus" htmlType="submit" className="w-full">
            Add
          </BaseButton>
        </Form>
      </Modal>
    </>
  );
};

export default ItemMasterCombineByStore;
const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
