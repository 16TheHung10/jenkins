import { Button, Col, DatePicker, Row } from 'antd';
import FieldList from 'components/common/fieldList/FieldList';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
const CheckInHistoryOverviewFields = ({ buttonTitle = 'Search', formInputs, onSubmit, ShowFilterComponent, setValue, getValues, ExportButton, isLoading, ...props }) => {
  const [startDate, setStartDate] = useState(null);

  const handleChangeDate = (e) => {
    setValue('date', e);
  };

  return (
    <form {...props} onSubmit={onSubmit}>
      <Row gutter={[16, 0]} className="items-center">
        <Col span={8}>
          <label className="required">Apply date</label>
          <DatePicker
            className="w-full"
            defaultValue={moment()}
            onChange={handleChangeDate}
            allowEmpty={false}
            onCalendarChange={(value) => {
              if (!value) return;
              const [start, end] = value;
              setStartDate(start);
            }}
            picker="month"
            value={getValues ? getValues('date') : moment()}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setStartDate(null);
              }
            }}
            format={'MM/YYYY'}
            disabledDate={(current) => {
              if (!startDate) return current && current > moment().startOf('day');
              const diff = moment().diff(startDate, 'days');
              return current && current > moment(startDate).add(diff > 30 ? 30 : diff, 'days');
            }}
          />
          <p className="m-0" style={{ height: '17px' }}></p>
        </Col>
        <FieldList fields={formInputs} />
        <Col span={24} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BaseButton loading={isLoading} iconName="search" htmlType="submit">
            {buttonTitle}
          </BaseButton>

          <ExportButton />

          {ShowFilterComponent}
        </Col>
      </Row>
    </form>
  );
};

export default CheckInHistoryOverviewFields;

