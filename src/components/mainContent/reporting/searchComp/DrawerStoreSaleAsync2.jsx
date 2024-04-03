import { DatePicker, Drawer, Empty, Table, message } from 'antd';
import ReportingModel from 'models/ReportingModel';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import Icons from 'images/icons';
const DrawerStoreSaleAsync2 = ({ date, onSetDate, ...props }) => {
  const queryClient = useQueryClient();
  const handleGetCompareSaleOfMonth = async () => {
    const model = new ReportingModel();
    const startDate = moment(date).startOf('month');
    const endDate = moment(date).endOf('month').isAfter(moment()) ? moment() : moment(date).endOf('month');
    const payload = {
      start: startDate.format('YYYY-MM-DD'),
      date: endDate.format('YYYY-MM-DD'),
    };
    const res = await model.getCompareSalesOfMonth(payload);
    if (res.status) {
      return res.data.compareSale;
    } else {
      message.error(res.message);
      return null;
    }
  };

  const compareSaleQuery = useQuery({
    queryKey: ['compareSaleOfMonth', moment(date).format('YYYY-MM')],
    queryFn: handleGetCompareSaleOfMonth,
    enabled: Boolean(date),
  });
  return (
    <Drawer
      {...props}
      title={
        <div className="flex items-center gap-10">
          <DatePicker
            picker="month"
            disabledDate={(current) => current && current > moment().endOf('day')}
            value={moment(date)}
            onChange={(dateChange, dateString) => {
              onSetDate(new Date(dateChange));
            }}
            format="MM/YYYY"
          />
          {/* {moment(date).format('MM/YYYY')} */}
          <Icons.RotateRight
            onClick={() => {
              queryClient.invalidateQueries(['compareSaleOfMonth', moment(date).format('YYYY-MM')]);
            }}
            style={{ color: 'var(--primary-color)', cursor: 'pointer' }}
          />
        </div>
      }
    >
      {!compareSaleQuery.data || compareSaleQuery.data.length === 0 ? (
        <Empty description={false}>
          <div className="flex items-center justify-content-center gap-10">
            No data{' '}
            <Icons.RotateRight
              onClick={() => {
                queryClient.invalidateQueries(['compareSaleOfMonth', moment(date).format('YYYY-MM')]);
              }}
              style={{ color: 'var(--primary-color)', cursor: 'pointer' }}
            />
          </div>
        </Empty>
      ) : (
        <Table
          loading={compareSaleQuery.isLoading}
          dataSource={compareSaleQuery.data}
          pagination={false}
          onRow={(record, rowIndex) => {
            const valueString = record.dateKey?.toString();
            const dateString = valueString
              ? `${valueString.slice(0, 4)}-${valueString.slice(4, 6)}-${valueString.slice(6)}`
              : null;
            return {
              onClick: (event) => {
                onSetDate(new Date(dateString));
              },
              style: {
                cursor: 'pointer',
              },
            };
          }}
          columns={[
            {
              title: 'Date',
              dataIndex: 'dateKey',
              key: 'dateKey',
              render: (value) => {
                const valueString = value?.toString();
                const dateString = valueString
                  ? `${valueString.slice(6)}/${valueString.slice(4, 6)}/${valueString.slice(0, 4)}`
                  : '-';
                return dateString;
              },
            },
            {
              title: 'Nums of Store Sale Waiting',
              dataIndex: 'storeSaleWaiting',
              key: 'storeSaleWaiting',
            },
          ]}
        />
      )}
    </Drawer>
  );
};

export default DrawerStoreSaleAsync2;
