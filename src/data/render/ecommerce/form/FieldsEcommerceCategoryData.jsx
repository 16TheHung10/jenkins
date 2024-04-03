import * as yup from 'yup';

const FieldsEcommerceCategoryData = {
  fieldsSearch: () => {
    return [{ name: 'categoryName', label: 'Categroy name', type: 'text', placeholder: 'Enter category name', span: 6 }];
  },
  fieldsInputsDetails: ({ isUpdate }) => {
    const fields = [
      {
        name: 'typeName',
        label: 'Category name',
        type: 'text',
        labelClass: 'required',
        rules: yup.string().required('Category name required'),
        placeholder: 'Category name',
        span: 24,
      },
    ];
    // if (isUpdate) {
    //   fields.push({
    //     name: 'active',
    //     label: 'Status',
    //     type: 'select',
    //     options: [
    //       { value: 0, label: 'In-active' },
    //       { value: 1, label: 'Active' },
    //     ],
    //     labelClass: 'required',
    //     rules: yup.string().required('Category status required'),
    //     span: 24,
    //   });
    // }
    return fields;
  },
};
export default FieldsEcommerceCategoryData;
