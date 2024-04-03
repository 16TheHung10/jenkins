import { Col, DatePicker, Form, Modal, Row, message } from 'antd';
import { BillApi } from 'api';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import FieldList from 'components/common/fieldList/FieldList';
import { useImportExcel } from 'hooks';
import moment from 'moment';
import React, { useState } from 'react';
const CancelBillFieldCompFilter = ({ fieldsProps }) => {
  const { formInputsWithSpan: fields, onSubmitHandler: onSearch } = fieldsProps;
  const { onExport } = useImportExcel();
  const [isLoadingExport, setIsLoadingExport] = useState(false);
  const [isModalExportOpen, setIsModalExportOpen] = useState(false);

  const handleGetCanceledBill = async (value) => {
    setIsLoadingExport(true);
    const res = await BillApi.getCanceledBills(value);
    if (res.status) {
      setIsLoadingExport(false);
      return res.data.bill;
    } else {
      message.error(res.message);
    }
    setIsLoadingExport(false);
    return null;
  };

  const handleToggleModalExport = () => {
    setIsModalExportOpen((prev) => !prev);
  };
  const formatExportData = (data) => {
    const res = [];
    for (let item of data) {
      res.push({
        invoiceCode: item.invoiceCode,
        invoiceType: item.invoiceType === 4 ? 'Loại hoá đơn huỷ' : item.invoiceType === 1 ? 'Hoá đơn thành công' : '-',
        totalAmount: item.totalAmount,
        totalAmountBeforeDiscount: item.totalAmountBeforeDiscount,
        storeName: item.storeName,
        invoiceDate: moment(item.invoiceDate).utc().format('DD/MM/YYYY HH:mm:ss'),
        note: item.note,
      });
    }
    return res;
  };
  console.log({ isLoadingExport });
  return (
    <>
      <form onSubmit={onSearch} className="">
        <Row gutter={[16, 0]} className="items-center">
          <FieldList fields={fields} />
          <Col span={8}>
            <div className="flex gap-10">
              <BaseButton iconName="search" htmlType="submit">
                Search
              </BaseButton>
              <BaseButton iconName="export" color="green" onClick={handleToggleModalExport}>
                Export canceled bills
              </BaseButton>
            </div>
          </Col>
        </Row>
      </form>
      <Modal open={isModalExportOpen} onCancel={handleToggleModalExport} footer={false}>
        <Form
          layout="vertical"
          onFinish={async (value) => {
            const payload = {
              date: moment(value.date).endOf('month').format('YYYY-MM-DD'),
              start: moment(value.date).startOf('month').format('YYYY-MM-DD'),
            };
            const canceledBillData = await handleGetCanceledBill(payload);
            const formatedData = formatExportData(canceledBillData);
            onExport(formatedData);
          }}
          style={{ width: '300px', padding: '10px' }}
        >
          <Form.Item className="w-full" name="date" label="Select month ( Or default last 7 days )">
            <DatePicker className="w-full" picker="month" format="MM/YYYYY" />
          </Form.Item>
          <BaseButton loading={isLoadingExport} iconName="export" htmlType="submit">
            Export
          </BaseButton>
        </Form>
      </Modal>
    </>
  );
};

export default CancelBillFieldCompFilter;
