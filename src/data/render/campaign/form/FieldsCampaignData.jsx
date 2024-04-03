import moment from 'moment';
import * as yup from 'yup';

const FieldsCampaignData = {
  // Step 1

  fieldsCampaignInfo: ({ current, campaignType }) => {
    const res = [
      {
        name: 'campaignName',
        label: 'Campaign Name',
        labelClass: 'required',
        type: 'text',
        rules: yup.string().trim().required('Campaign Name is required'),
        span: 6,
      },
      {
        name: 'campaignTitle',
        label: 'Campaign Description',
        labelClass: 'required',
        type: 'text',
        rules: yup.string().trim().required('Campaign description is required'),
        span: 6,
      },
      // {
      //   name: 'active',
      //   label: 'Campaign Status',
      //   labelClass: 'required',
      //   type: 'select',
      //   options: [
      //     {
      //       value: 'active',
      //       label: 'Active',
      //     },
      //     {
      //       value: 'inActive',
      //       label: 'In-active',
      //     },
      //   ],
      //   rules: yup.string().required('Campaign Title is required'),
      //   span: 5,
      // },
      {
        name: 'date',
        label: 'Apply date',
        labelClass: 'required',
        type: 'date-range',
        format: 'DD/MM/YYYY',
        disabledDate: (current) => current && current < moment().add(1, 'day').startOf('day'),
        rules: yup.array().required('Apply date  is required'),
        span: 6,
      },
    ];
    if (campaignType === 5) {
      res.push(
        {
          name: 'timeFrameQR',
          label: 'Time range',
          labelClass: 'required',
          type: 'time-range',
          showSecond: false,
          format: 'HH',
          rules: yup.array().required("Campaign's Stores  is required"),
          span: 6,
        },
        {
          name: 'dayOfWeek',
          label: 'Day of week',
          labelClass: 'required',
          type: 'select',
          mode: 'multiple',
          options: [
            { value: '1', label: 'Monday' },
            { value: '2', label: 'Tuesday' },
            { value: '3', label: 'Wednesday' },
            { value: '4', label: 'Thursday' },
            { value: '5', label: 'Friday' },
            { value: '6', label: 'Saturday' },
            { value: '0', label: 'Sunday' },
          ],
          rules: yup.array().required('Date of week   is required').min(1, 'Date of week   is required'),
          span: 6,
        }
      );
    }

    return res;
  },

  // Step 2
  fieldsCampaignType: ({ current, params }) => {
    const isAllowValidate = current === 0;
    return [
      {
        name: 'campaignType',
        label: 'Campaign Type',
        labelClass: 'required',
        type: 'select',
        disabled: Boolean(params.id),
        allowClear: false,
        rules: isAllowValidate && yup.string().required('Campaign Type is required'),
        options: [
          // {
          //   value: 1,
          //   label: 'Mua bill được Voucher',
          // },
          // {
          //   value: 2,
          //   label: 'Game quay số trên app',
          // },
          {
            value: 3,
            label: 'Mua bill nhận mã dự thưởng',
          },
          {
            value: 4,
            label: 'Claim quà (POS)',
          },
          {
            value: 5,
            label: 'Scan QR',
          },
        ],
        span: 6,
      },
    ];
  },

  // Voucher campaign (Step 2)
  fieldsCampaignVoucher: ({ storeOptions, current, campaignType }) => {
    const isAllowValidate = current === 0 && campaignType === 1;
    return [
      // Voucher
      {
        name: 'value',
        label: 'Voucher Value',
        labelClass: 'required',
        type: 'number',
        min: 0,
        max: 100000,
        rules: isAllowValidate && yup.number().required('Value  is required'),
        span: 6,
      },
      {
        name: 'appliedStore',
        label: 'Stores (Apply for Voucher)',
        labelClass: 'required',
        type: 'select',
        mode: 'multiple',
        options: storeOptions,
        rules: isAllowValidate && yup.array().required("Voucher's Stores  is required"),
        span: 6,
      },
      {
        name: 'appliedTotalBill',
        label: 'Applied Total Bill',
        labelClass: 'required',
        type: 'number',
        min: 0,
        rules: isAllowValidate && yup.string().required('Applied Total Bill  is required').max(1000000, 'Max value is 1000000'),
        span: 6,
      },
      // End Voucher
    ];
  },

  // Game campaign (Step 2)
  fieldsCreateAward: ({ itemOptions, current, campaignType, setItemSearch }) => {
    let res = [
      {
        name: 'itemCode',
        label: 'Item Code',
        type: 'select',
        options: itemOptions,
        labelClass: 'required',
        span: 6,
        onSearch: (value) => {
          setItemSearch(value);
        },
        rules: yup.string().required('Item Code is required'),
      },
      {
        name: 'stockQty',
        label: 'Stock quantity',
        type: 'number',
        min: 1,
        max: 9999,
        labelClass: 'required',
        span: 6,
        rules: yup.number().required('Stock quantity is required'),
      },
      // {
      //   name: 'maxStockQty',
      //   label: 'Max stock quantity',
      //   type: 'number',
      //   min: 1,
      //   max: 9999,
      //   labelClass: 'required',
      //   span: 6,
      //   rules: yup.number().required('Max stock quantity is required'),
      // },
    ];
    if (campaignType === 5) return [...res];
    res.push(
      ...[
        {
          name: 'qty',
          label: 'Qty',
          type: 'number',
          min: 1,
          max: 1000,
          labelClass: 'required',
          rules: yup.number().required('Qty is required'),
        },
        {
          name: 'awardIndex',
          label: 'AwardIndex',
          type: 'select',
          options: [
            {
              value: 0,
              label: 'Giải đặc biệt',
            },
            {
              value: 1,
              label: 'Giải nhất',
            },
            {
              value: 2,
              label: 'Giải nhì',
            },
            {
              value: 3,
              label: 'Giải ba',
            },
          ],
          labelClass: 'required',
          rules: yup.string().required('AwardIndex is required'),
        },

        {
          name: 'sms',
          label: 'SMS',
          type: 'text-area',
          rows: 10,
          maxLength: 1000,
          showCount: true,
          placeholder: 'Enter sms',
          min: 0,
          labelClass: 'required',
          rules: yup.string().trim().required('SMS is required'),
          span: 24,
        },
      ]
    );

    return res;
  },

  // Campaign loai 4 (Step 2)
  fieldsTransferItem: ({ itemOptions, current, campaignType, setItemSearch }) => {
    const isAllowValidate = current === 0 && campaignType === 4;

    return [
      {
        name: 'itemsCodeA',
        label: 'Item A Code',
        type: 'select',
        labelClass: 'required',
        onSearch: (value) => {
          setItemSearch(value);
        },
        options: itemOptions,
        rules: isAllowValidate && yup.string().required('Item is required'),
        placeholder: 'Enter item code',
        span: 6,
      },

      {
        name: 'itemsCodeB',
        label: 'Item B Code',
        type: 'select',
        onSearch: (value) => {
          setItemSearch(value);
        },
        options: itemOptions,
        rules:
          isAllowValidate &&
          yup.string().when('itemsCodeA', ([itemsCodeA], field) => {
            return itemsCodeA ? field : field.required('Item is required');
          }),
        placeholder: 'Enter item code',
        span: 6,
      },

      {
        name: 'itemsCodeC',
        label: 'Item C Code',
        type: 'select',
        labelClass: 'required',
        onSearch: (value) => {
          setItemSearch(value);
        },
        options: itemOptions,
        rules: isAllowValidate && yup.string().required('Item is required'),
        placeholder: 'Enter item code',
        span: 6,
      },
    ];
  },

  // Campaign loai 5 (Step 2)
  fieldScanQR: ({ storeOptions, current, campaignType, itemOptions }) => {
    const isAllowValidate = current === 0 && campaignType === 5;
    return [
      // {
      //   name: 'timeFrameQR',
      //   label: 'Time frame',
      //   labelClass: 'required',
      //   type: 'time-range',
      //   showSecond: false,
      //   format: 'HH',
      //   rules: isAllowValidate && yup.array().required("Campaign's Stores  is required"),
      //   span: 6,
      // },
    ];
  },

  // Bill condition add item (step 3)
  fieldAddItemBill: ({ itemOptions }) => {
    return [
      {
        name: 'items',
        label: 'Item',
        type: 'select',
        labelClass: 'required',
        options: itemOptions,
        rules: yup.string().required('Item is required'),
        span: 8,
      },
      {
        name: 'maxQty',
        label: 'Max Qty',
        labelClass: 'required',
        type: 'number',
        rules: yup.number().required("Item's qty is required"),
        min: 0,
        span: 8,
      },
    ];
  },
  fieldAddPayment: ({ paymentOptions, current }) => {
    const isAllowValidate = current === 2;
    return [
      {
        name: 'code',
        label: 'Payments',
        labelClass: 'required',
        type: 'select',
        rules: isAllowValidate && yup.string().required("Campaign's payment is required"),
        options: paymentOptions,
        span: 6,
      },
      {
        name: 'value',
        label: 'Payments value',
        labelClass: 'required',
        type: 'number',
        min: 0,
        rules: isAllowValidate && yup.number().required("Campaign's payment amount is required").min(1000, 'Min value is 1000VND'),
        options: paymentOptions,
        span: 6,
      },
    ];
  },
  // Bill condition (step 3)
  fieldsCampaignBillValid: ({ itemOptions, paymentOptions, storeOptions, current, campaignType }) => {
    const isAllowValidate = current === 2;
    return [
      {
        name: 'storeValid',
        label: 'Stores (Apply for Campaign)',
        labelClass: 'required',
        type: 'select',
        mode: 'multiple',
        options: storeOptions,
        rules: isAllowValidate && yup.array().required("Campaign's Stores  is required").min(1, "Campaign's Stores  is required"),
        span: 6,
      },
      {
        name: 'minValueValid',
        label: 'Bill amount ',
        labelClass: 'required',
        type: 'number',
        min: 0,
        rules: isAllowValidate && campaignType !== 5 && yup.number().required('Bill amount is required'),
        span: 6,
      },
      {
        name: 'items',
        label: 'Item',
        type: 'select',
        labelClass: 'required',
        mode: 'multiple',
        options: itemOptions,
        rules: isAllowValidate && campaignType !== 5 && yup.array().required('Item is required').min(1, 'Item is required'),
        span: 6,
      },
      {
        name: 'maxQty',
        label: 'Max Qty',
        labelClass: 'required',
        type: 'number',
        rules: isAllowValidate && campaignType !== 5 && yup.number().required("Item's qty is required"),
        min: 0,
        span: 6,
      },
    ];
  },
};
export default FieldsCampaignData;
