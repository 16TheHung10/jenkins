import { Button, Col, Row, message } from 'antd';
import MainTable from 'components/common/Table/UI/MainTable';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import FieldList from 'components/common/fieldList/FieldList';
import FormField from 'data/oldVersion/formFieldRender';
import CommonModel from 'models/CommonModel';
import { ArrayHelper } from 'helpers';
import { useFormFields, useShowFilter } from 'hooks';
import LogginModel from 'models/LogginModel';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import './style.scss';
import DisableRangeDate from '../../../common/datePicker/rangePicker/DisableRangeDate';

const LoggingMainComponent = () => {
  const [loggingsData, setLoggingsData] = useState();
  const constData = useRef();
  const [startDate, setStartDate] = useState(null);
  const [searchOptions, setSearchOptions] = useState({
    userOptions: [],
    objectLogOptions: [],
  });

  const handleSubmit = async (value) => {
    if (!value.date || value.date.length === 0) {
      message.error('Please select date');
      return;
    }
    const model = new LogginModel();
    const { date, ...data } = value;
    const params = {
      ...data,
      startDate: value.date[0] ? moment(value.date[0]).format('YYYY-MM-DD') : null,
      endDate: value.date[1] ? moment(value.date[1]).format('YYYY-MM-DD') : null,
    };
    const res = await model.getAllLoggings(params);
    if (res.status) {
      setLoggingsData(res.data.logs);
      constData.current = res.data.logs;
      return res.data.logs;
    } else {
      message.error(res.message);
    }
  };

  const handleFilter = (value) => {
    const { date, ...filterObject } = value;
    let filteredData = ArrayHelper.multipleFilter(constData?.current, filterObject);
    if (!date) {
      setLoggingsData(filteredData);
      return;
    }
    filteredData = filteredData.filter((el) => {
      const eleDate = moment(new Date(el.date)).startOf('day');
      const filterDate = moment(new Date(value.date)).startOf('day');
      const diffDate = eleDate.isSame(filterDate);
      return diffDate;
    });
    setLoggingsData(filteredData);
  };

  // Search
  const {
    formInputsWithSpan: formInputs,
    onSubmitHandler: onGetLoggings,
    reset,
    getValues,
    setValue,
  } = useFormFields({
    fieldInputs: FormField.LogginOverview.fieldInputs({ ...searchOptions }),
    onSubmit: handleSubmit,
    watches: ['date'],
  });
  // Filter
  const { formInputsWithSpan: formInputsFilter, onSubmitHandler: onFilterLogs } = useFormFields({
    fieldInputs: FormField.LogginOverview.fieldInputsFilter(),
    onSubmit: handleFilter,
  });
  // Trigger show filter
  const { isVisible, TriggerComponent } = useShowFilter();

  const handleGetObject = async () => {
    const model = new CommonModel();
    const res = await model.getData('objectlog,user');
    if (res.status) {
      const objectLogOptions =
        res.data.objectlogs?.map((item) => {
          return {
            value: item.objectID,
            label: `${item.objectID} - ${item.objectName}`,
          };
        }) || [];

      const userOptions =
        res.data.users?.map((item) => {
          return {
            value: item.userID,
            label: `${item.userID} - ${item.userName}`,
          };
        }) || [];
      setSearchOptions((prev) => ({ objectLogOptions, userOptions }));
    } else {
      message.error(res.message);
    }
  };

  useEffect(() => {
    handleGetObject();
  }, []);

  return (
    <div id="loggings-overview">
      {/* Search */}
      <form onSubmit={onGetLoggings} className="section-block mt-15">
        <Row gutter={[16, 16]} className="items-center">
          <DisableRangeDate
            setValue={(value) => {
              setValue('date', value);
            }}
            format="DD/MM/YYYY"
            value={getValues('date') || null}
            lengthOfRangeToDisable={7}
          />
          <FieldList fields={formInputs} />

          <Col span={6} className="flex items-center gap-10">
            <div className="center_vertical gap-10">
              <BaseButton htmlType="submit" iconName="search">
                Search
              </BaseButton>
              {/* <TriggerComponent /> */}
            </div>
          </Col>
        </Row>
      </form>

      {/* Filter */}
      {/* <form onSubmit={onFilterLogs} className={`section-block mt-15 filter_block ${isVisible ? 'show' : ''}`}>
        <Row gutter={[16, 16]} className="items-center">
          <FieldList fields={formInputsFilter} />
          <Col span={6}>
            <Button htmlType="submit" className="btn-danger">
              Filter
            </Button>
          </Col>
        </Row>
      </form> */}
      <MainTable
        className=" w-fit mt-15"
        scroll={{
          y: 600,
        }}
        pagination={{
          total: loggingsData?.length || 0,
        }}
        columns={FormField.LogginOverview.columns()}
        dataSource={loggingsData}
      />
    </div>
  );
};

export default LoggingMainComponent;
