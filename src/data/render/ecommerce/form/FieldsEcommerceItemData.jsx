import * as yup from 'yup';
import React from 'react';
import { Divider, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import WarningNote from 'components/common/warningNote/WarningNote';
const FieldsEcommerceItemData = {
  fieldsSearch: ({ categoryOptions }) => {
    return [
      { name: 'searchKeyword', label: 'Item', type: 'text', placeholder: 'Enter keyword', span: 6 },
      {
        name: 'typeID',
        label: 'Category',
        type: 'select',
        options: categoryOptions,
        placeholder: '-- All --',
        span: 6,
      },
      {
        name: 'active',
        label: 'Status',
        type: 'select',
        options: [
          {
            value: false,
            label: 'InActive',
          },
          {
            value: true,
            label: 'Active',
          },
        ],
        placeholder: '-- All --',
        span: 6,
      },
    ];
  },
  fieldsInputsAddItemRelate: ({ itemOptions, setSearch }) => {
    const fields = [
      {
        name: 'item',
        label: 'Item',
        type: 'select',
        allowClear: true,
        options: itemOptions,
        onSearch: (value) => setSearch(value),
        rules: yup.string().required('Item is required'),
        span: 24,
      },
      {
        name: 'order',
        label: 'Order',
        type: 'select',
        allowClear: true,
        options: [
          {
            value: 0,
            label: 'Order: 1',
          },
          {
            value: 1,
            label: 'Order: 2',
          },
          {
            value: 2,
            label: 'Order: 3',
          },
          {
            value: 3,
            label: 'Order: 4',
          },
          {
            value: 4,
            label: 'Order: 5',
          },
        ],
        rules: yup.string().required('Item order required'),
        span: 24,
      },
    ];
    return fields;
  },
  fieldsInputsDetails: ({
    isUpdate,
    itemOptions,
    categoryOptions,
    onSearchItem,
    defaultItemPrice,
    isLoadingGetTags,
    tagOptions,
  }) => {
    const fields = [
      {
        name: 'categoryID',
        label: 'Category',
        type: 'select',
        labelClass: 'required',
        options: categoryOptions,
        rules: yup.string().required('Category is required'),
        placeholder: 'Please select an category',
        span: 24,
      },
      {
        name: 'tags',
        label: 'Tag',
        type: 'select',
        maxTagCount: null,
        mode: 'tags',
        tokenSeparators: [','],
        disabled: isLoadingGetTags,
        options: tagOptions,
        placeholder: 'Select item tags or enter new one',
        span: 24,
      },
      {
        name: 'itemCode',
        label: 'Item',
        type: 'select',
        disabled: isUpdate,
        labelClass: 'required',
        options: itemOptions,
        onSearch: (value) => {
          onSearchItem(value);
        },
        rules: yup.string().required('Item is required'),
        placeholder: 'Please select an item',
        span: 12,
      },
      {
        name: 'itemName',
        label: 'Alternative Name',
        type: 'text',
        placeholder: "Default value is item's price",
        span: 12,
      },
      // {
      //   name: 'price',
      //   label: 'price',
      //   type: 'number',
      //   max: 10000000,
      //   placeholder: "Default value is item's price",
      //   disabled: true,
      //   span: 12,
      // },
      {
        name: 'itemDefaultPrice',
        label: 'Default price',
        type: 'text',
        disabled: true,
        placeholder: '0',
        span: 12,
      },
      {
        name: 'itemSalePrice',
        label: (
          <div className="items-center flex gap-10">
            <span>Sale price</span>
            <WarningNote>
              <p>Dùng chung delivery grab, shoppe, gojek</p>
            </WarningNote>
          </div>
        ),
        type: 'number',
        min: 0,
        max: defaultItemPrice || 0,
        placeholder: "Default value is item's price",
        span: 12,
      },

      {
        name: 'attribute',
        label: '',
        type: 'ck-editor',
        rules: yup.string().required('Attribute is required...'),
        placeholder: "Input item's info",
        span: 24,
        group: 2,
      },
      {
        name: 'description',
        label: '',
        type: 'ck-editor',
        rules: yup.string().required('Descriptions is required...'),
        placeholder: "Input item's descriptions",
        height: 1500,
        span: 24,
        group: 3,
      },
    ];
    return fields;
  },
};
export default FieldsEcommerceItemData;
