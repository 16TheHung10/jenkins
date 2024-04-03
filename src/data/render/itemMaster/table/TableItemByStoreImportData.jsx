import { StringHelper } from 'helpers';
import { Tag } from 'antd';
import React from 'react';
const TableItemByStoreImportData = {
  columns: () => [
    {
      title: 'Item',
      dataIndex: 'itemCode',
      key: 'itemCode',
      width: 400,
      render: (text, record) => {
        return (
          <div>
            <p className="m-0">{record.itemName || 'Invalid item'}</p>
            <p className="hint">{text}</p>
          </div>
        );
      },
      onCell: (record) => {
        return {
          style: {
            color: record.isValidItem ? 'black' : 'red',
          },
        };
      },
      // sorter: (a, b) => a.promotionName?.localeCompare(b.promotionName),
    },
    {
      title: 'Sale Price',
      dataIndex: 'salePrice',
      key: 'salePrice',
      render: (text, record) => {
        return text ? (
          <div className="m-0">
            <p className="m-0">{StringHelper.formatPrice(text)}</p>
            {record.serverValue?.sellingPrice ? (
              <p className="hint">Current price: {StringHelper.formatPrice(record.serverValue?.sellingPrice)}</p>
            ) : null}
          </div>
        ) : (
          '-'
        );
      },
    },
    {
      title: 'Allow Order',
      dataIndex: 'allowOrder',
      key: 'allowOrder',
      width: 100,
      render: (text) =>
        text === true ? <Tag color="green">Allow</Tag> : text === false ? <Tag color="red">Not Allow</Tag> : '-',
    },
    {
      title: 'Allow Sold',
      dataIndex: 'allowSold',
      key: 'allowSold',
      width: 100,
      render: (text) =>
        text === true ? <Tag color="green">Allow</Tag> : text === false ? <Tag color="red">Not Allow</Tag> : '-',
    },
    // {
    //   title: 'Allow Return Supplier',
    //   dataIndex: 'allowReturnSupplier',
    //   key: 'allowReturnSupplier',
    //   width: 150,
    //   render: (text) =>
    //     text === true ? <Tag color="green">Allow</Tag> : text === false ? <Tag color="red">Not Allow</Tag> : '-',
    // },
    // {
    //   title: 'Moq Store',
    //   dataIndex: 'moqStore',
    //   key: 'moqStore',
    //   render: (text) => StringHelper.formatPrice(text) || '-',
    // },

    // {
    //   title: 'Return Goods Term',
    //   dataIndex: 'returnGoodsTerm',
    //   key: 'returnGoodsTerm',
    //   render: (text) => StringHelper.formatPrice(text) || '-',
    // },
    {
      title: 'Delivery By',
      dataIndex: 'deliveryBy',
      key: 'deliveryBy',
      width: 150,
      render: (text) => (text ? text : '-'),
    },
  ],
};
export default TableItemByStoreImportData;
