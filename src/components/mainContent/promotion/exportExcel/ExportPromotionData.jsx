import React from 'react';
import { message } from 'antd';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import CONSTANT from 'constant';
import { APIHelper } from 'helpers';
import DownloadModel from 'models/DownloadModel';
import moment from 'moment';

const ExportPromotionData = ({ promotionType, params, title = 'Export' }) => {
  const handleExport = async () => {
    const model = new DownloadModel();
    if (!params.startDate) {
      message.error('Please select start date');
      return;
    }

    if (!params.endDate) {
      message.error('Please select end date');
      return;
    }
    let payload = {
      promotionName: params.promotionCode || params.name,
      stores: params.storeCode ? [params.storeCode] : [],
      status: params.orderStatus !== '' ? (params.orderStatus === 2 ? 0 : params.orderStatus) : '',
      startDate: moment(new Date(params.startDate)).format(CONSTANT.FORMAT_DATE_PAYLOAD),
      endDate: moment(new Date(params.endDate)).format(CONSTANT.FORMAT_DATE_PAYLOAD),
      fileName: `promotion_export_data_${Date.now()}.xlsx`,
    };
    if (+params.status === 0 || +params.status === 1) {
      payload = { ...payload, status: +params.status };
    }
    const res = await APIHelper.post(`/promotion/${promotionType}/export`, payload, null, null, 30000);
    if (res.data?.downloadUrl) {
      const resDownload = await model.get(res.data?.downloadUrl, null, null, '');
    } else {
      message.error(res.messsage);
    }
  };
  return (
    <BaseButton iconName="export" color="green" onClick={handleExport}>
      {title}
    </BaseButton>
  );
};

export default ExportPromotionData;

