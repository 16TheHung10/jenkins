import * as yup from 'yup';

const FieldsEcommerceGroupData = {
  fieldsSearch: () => {
    return [
      { name: 'groupName', label: 'GroupName', type: 'text', placeholder: 'Enter GroupName value', span: 6 },
      { name: 'groupCode', label: 'GroupCode', type: 'text', placeholder: 'Enter GroupCode value', span: 6 },
    ];
  },
  fieldsInputsDetails: () => {
    const fields = [
      {
        name: 'groupName',
        label: 'Group name',
        type: 'text',
        rules: yup.string().trim().required('Group name is required').min(3, 'Group name must be at least 3 characters long').max(30, 'Group name must be max 30 characters long'),
        placeholder: 'Input group name',
        span: 24,
        group: 1,
      },
    ];
    return fields;
  },

  fieldsInputsGroupItemInsert: ({ itemOptions, setSearch }) => {
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
    ];
    return fields;
  },

  fieldsInputsUpdate: ({ ListFileRender }) => {
    const fields = [
      {
        name: 'groupName',
        label: 'Group name',
        type: 'text',
        rules: yup.string().trim().required('Group name is required').min(3, 'Group name must be at least 3 characters long').max(30, 'Group name must be max 30 characters long'),
        placeholder: 'Input group name',
        span: 24,
        group: 1,
      },
      {
        name: 'groupLogo',
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
        name: 'groupBanner',
        label: 'Banner',
        type: 'file',
        multiple: false,
        maxCount: 1,
        accept: 'image/png, image/jpeg, image/webp',
        rules: yup.array().required('Image is required').min(1, 'Image is required'),
        placeholder: 'Input group banner',
        span: 24,
        group: 2,
        ratio: '16/9',
        ListFileRender: ListFileRender,
        isCustomImageList: true,
        imageContainerHeightProps: 'max-content',
        isWrap: false,
      },
    ];
    return fields;
  },
};
export default FieldsEcommerceGroupData;
