import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import moment from 'moment';
import React from 'react';
import { StringHelper } from 'helpers';
import Image from 'components/common/Image/Image';
import { Switch, Tag } from 'antd';
import { routerRef } from 'App';
const TableEcommerceItemData = {
  columns: ({ mutation }) => [
    {
      title: 'Item',
      dataIndex: 'itemName',
      key: 'itemName',
      render: (itemName, record) => (
        <div className="flex gap-10">
          <Image src={record.thumbnail + '?h=100&w=100'} style={{ width: 75, height: 75 }} />
          <div className="flex items-start flex-col justify-content-center">
            <p className="m-0 color-primary">{itemName}</p>
            <span className="hint">{record.itemCode}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'categoryID',
      key: 'categoryID',
      render: (categoryID, record) => `${record.categoryName}`,
    },
    {
      title: 'Sale price',
      dataIndex: 'itemSalePrice',
      key: 'itemSalePrice',
      render: (text) => (text ? StringHelper.formatPrice(text) : 0),
    },
    {
      title: 'Created by',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (text, record) =>
        (
          <div>
            <p className="m-0">{text}</p>
            <p className="hint">{record.createdDate ? moment(record.createdDate).utc().format('DD/MM/YYYY') : null}</p>
          </div>
        ) || '-',
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
    },

    {
      title: 'Updated by',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      render: (text, record) =>
        (
          <div>
            <p className="m-0">{text}</p>
            <p className="hint">{record.updatedDate ? moment(record.updatedDate).utc().format('DD/MM/YYYY') : null}</p>
          </div>
        ) || '-',
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
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
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
      render: (text, record, index) => (
        <Switch
          checkedChildren="Active"
          unCheckedChildren="Active"
          checked={text}
          onChange={(checked) => {
            mutation.mutate({ itemCode: record.itemCode, active: checked, index });
          }}
        />
      ),
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
      render: (text, record) => (
        <BaseButton
          iconName="edit"
          onClick={() => routerRef.current.history.push(`/ecommerce/items/details/${record.itemCode}`)}
        />
      ),
    },
    // { title: 'Status', dataIndex: 'active', key: 'active', render: (text) => (text ? <Tag color="green">Active</Tag> : <Tag color="red">InActive</Tag>) },
  ],
  columnsImport: () => [
    {
      title: 'Item',
      dataIndex: 'itemName',
      key: 'itemName',
      render: (itemName, record) => (
        <div className="flex gap-10">
          <Image src={record.thumbnail + '?h=100&w=100'} style={{ width: 75, height: 75 }} />
          <div className="flex items-start flex-col justify-content-center">
            <p
              className="m-0"
              style={{
                color:
                  record.invalidField?.includes('itemCode') || record.invalidField?.includes('itemExisted')
                    ? 'red'
                    : 'var(--primary-color)',
              }}
            >
              {itemName}
            </p>
            <p className="m-0 cl-red">{record.invalidField?.includes('itemCode') ? ' ITEM DOES NOT EXISTS' : ''}</p>
            <p className="m-0 cl-red">{record.invalidField?.includes('itemExisted') ? ' ITEM ALREADY EXISTS' : ''}</p>
            <span className="hint">{record.itemCode}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (categoryName, record) => {
        return (
          <>
            <p
              className="m-0"
              style={{
                color: record.invalidField?.includes('categoryID') ? 'red' : '',
              }}
            >
              {categoryName}
            </p>
            <p className="m-0 cl-red">
              {record.invalidField?.includes('categoryID') ? ' CATEGORY DOES NOT EXISTS' : ''}
            </p>
          </>
        );
      },
    },
    {
      title: 'Sale price',
      dataIndex: 'itemSalePrice',
      key: 'itemSalePrice',
      render: (text, record) =>
        text ? (
          <>
            <p
              className="m-0"
              style={{
                color: record.invalidField?.includes('salePrice') ? 'red' : '',
              }}
            >
              {StringHelper.formatPrice(text)}{' '}
            </p>
            <p className="m-0 cl-red">
              {record.invalidField?.includes('salePrice') ? 'PRICE GREATER THAN MASTER PRICE' : ''}
            </p>
          </>
        ) : (
          0
        ),
    },

    {
      title: 'Attribute',
      dataIndex: 'attribute',
      key: 'attribute',
      render: (text) => (text ? <div dangerouslySetInnerHTML={{ __html: text }} /> : '-'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (text ? <div dangerouslySetInnerHTML={{ __html: text }} /> : '-'),
    },

    // { title: 'Status', dataIndex: 'active', key: 'active', render: (text) => (text ? <Tag color="green">Active</Tag> : <Tag color="red">InActive</Tag>) },
  ],
};
export default TableEcommerceItemData;
