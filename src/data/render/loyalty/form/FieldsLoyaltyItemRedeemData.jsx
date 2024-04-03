import moment from 'moment';
import * as yup from 'yup';

const FieldsLoyaltyItemRedeemData = {
  fieldsSearch: () => {
    return [
      { name: 'keyword', label: 'Item', type: 'text', placeholder: 'Enter search value', span: 6 },
      { name: 'point', label: 'Point (min value)', type: 'number', min: 0, placeholder: 'Enter poin value', span: 6 },
      {
        name: 'active',
        label: 'Status',
        type: 'select',
        options: [
          {
            value: 0,
            label: 'In-active',
          },
          {
            value: 1,
            label: 'Active',
          },
        ],
        allowClear: true,
        placeholder: '-- All --',
        span: 6,
      },
    ];
  },
  fieldsInputsDetails: ({ itemOptions, setSearch, isDetails, ListFileRender }) => {
    const fields = [
      {
        name: 'itemCode',
        label: 'Item',
        onSearch: (value) => {
          setSearch(value);
        },
        labelClass: 'required',
        rules: yup.string().required('Item is required'),
        type: 'select',
        disabled: isDetails,
        options: itemOptions,
        placeholder: 'Enter item',
        span: 8,
        group: 1,
      },
      {
        name: 'title',
        label: 'Alternative name',
        labelClass: 'required',
        type: 'text',
        placeholder: 'Enter title value',
        span: 8,
        group: 1,
        maxLength: 250,
        rules: yup.string().required('Item name is required'),
      },
      { name: 'stock', label: 'Stock', type: 'number', min: 0, max: 999, placeholder: 'Enter stick value', span: 8, group: 1 },
      {
        name: 'startDate',
        label: 'Start Date',
        type: 'date-single',
        min: 0,
        placeholder: 'Enter stick value',
        span: 8,
        group: 1,
        disabledDate: (current) => {
          return current && current < moment().subtract(1, 'day');
        },
      },
      {
        name: 'endDate',
        label: 'End Date',
        type: 'date-single',
        min: 0,
        placeholder: 'Enter stick value',
        span: 8,
        disabledDate: (current) => {
          return current && current < moment().subtract(1, 'day');
        },
        group: 1,
      },
      { name: 'type', label: 'Type', type: 'text', min: 0, defaultValue: 'Product', disabled: true, span: 8, group: 1 },
      {
        name: 'description',
        labelClass: 'required',
        label: 'Description',
        type: 'ck-editor',
        placeholder: 'Enter description value',
        span: 24,
        isAllowImage: false,
        group: 1,
        showCount: true,
        maxLength: 2000,
        autoSize: { minRows: 5, maxRows: 15 },
      },
      {
        name: 'logo',
        label: 'Logo',
        type: 'file',
        multiple: false,
        labelClass: 'required',
        maxCount: 1,
        accept: 'image/png, image/jpeg, image/webp',
        rules: yup.array().required('Image is required').min(1, 'Image is required'),
        placeholder: 'Input group logo',
        span: 24,
        disabledDelete: true,
        group: 1,
      },

      {
        name: 'banner',
        label: 'Banner',
        type: 'file',
        multiple: false,
        maxCount: 1,
        accept: 'image/png, image/jpeg, image/webp',
        placeholder: 'Input group banner',
        span: 24,
        group: 2,
        ratio: '16/9',
        isCustomImageList: true,
        imageContainerHeightProps: 'max-content',
        ListFileRender: ListFileRender,
      },
    ];
    return fields;
  },
};
export default FieldsLoyaltyItemRedeemData;
