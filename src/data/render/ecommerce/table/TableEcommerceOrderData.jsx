import moment from 'moment';
import { StringHelper } from 'helpers';
import { Link } from 'react-router-dom';
import Icons from 'images/icons';
import React from 'react';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { routerRef } from 'App';
import { Tag } from 'antd';
const TableEcommerceOrderData = {
  columns: () => [
    { title: 'Order Code', dataIndex: 'orderCode', key: 'orderCode', render: (text) => text || ' - ' },
    { title: 'Bill Code', dataIndex: 'billCode', key: 'billCode', render: (text) => text || ' - ' },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      format: 'DD/MM/YYYY',
      render: (text) => (text ? moment(text).format('DD/MM/YYYY HH:mm') : ' - '),
    },
    { title: 'Qty', dataIndex: 'totalQty', key: 'totalQty', render: (text) => text || ' - ' },
    {
      title: 'Order Value',
      dataIndex: 'totalValue',
      key: 'totalValue',
      render: (text) => StringHelper.formatPrice(text) || ' - ',
    },
    {
      title: 'FeeShip',
      dataIndex: 'feeShip',
      key: 'feeShip',
      render: (text) => StringHelper.formatPrice(text) || ' - ',
    },
    { title: 'Payment', dataIndex: 'paymentTypeName', key: 'paymentTypeName', render: (text) => text || ' - ' },
    { title: 'Customer Name', dataIndex: 'customerName', key: 'customerName', render: (text) => text || ' - ' },
    { title: 'Customer Phone', dataIndex: 'customerPhone', key: 'customerPhone', render: (text) => text || ' - ' },
    {
      title: 'Order Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) =>
        text === 0 ? <Tag color="red">Processing</Tag> : text === 1 ? <Tag color="green">Success</Tag> : '-',
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (text) =>
        text === 0 ? <Tag color="red">Waiting</Tag> : text === 1 ? <Tag color="green">Success</Tag> : '-',
    },
    { title: 'Trans ID', dataIndex: 'transID', key: 'transID', render: (text) => text || ' - ' },
    { title: 'Shipping Note', dataIndex: 'shippingNote', key: 'shippingNote', render: (text) => text || ' - ' },
    {
      title: 'Delivery',
      dataIndex: 'delivery',
      key: 'delivery',
      render: (text) => {
        return text
          ? `${text.toString().slice(6)}/${text.toString().slice(4, 6)}/${text.toString().slice(0, 4)}`
          : ' - ';
      },
    },
    {
      title: 'Actions',
      dataIndex: '',
      key: '',
      render: (text, record) => (
        <BaseButton
          iconName="search"
          onClick={() => routerRef.current?.history.push(`/ecommerce/orders/details/${record.orderCode}`)}
        />
      ),
    },
    // { title: 'brand', dataIndex: 'brand', key: 'brand', render: (text) => text || ' - ' },
  ],
};
export default TableEcommerceOrderData;
