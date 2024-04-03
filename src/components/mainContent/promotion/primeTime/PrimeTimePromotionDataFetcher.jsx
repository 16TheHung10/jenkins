import { Col, Row, message } from 'antd';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { actionCreator, useAppContext, useGoldenTimeContext } from 'contexts';
import { ObjectHelper, StringHelper } from 'helpers';
import PromotionModel from 'models/PromotionModel';
import moment from 'moment';
import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import ExportPromotionData from '../exportExcel/ExportPromotionData';
import { statusOptions } from './mockData/StatusOption';

const PrimeTimePromotionDataFetcher = ({ actions, data }) => {
  const [statePrimeTime, dispatchPrimeTime] = useGoldenTimeContext();
  const { state, dispatch, onGetStoreData } = useAppContext();
  useEffect(() => {
    onGetStoreData();
  }, []);
  const history = useHistory();
  const { renderInputField, renderSelectField, renderDatePickerField, handleSetState, fieldsState, handleSetStateAsync } = actions;
  const storeArray = useMemo(() => {
    if (state.stores) {
      return Object.keys(state.stores)?.map((item) => {
        return state.stores[item];
      });
    }
    return [];
  }, [state.stores]);

  // FUNCTIONS
  const handleGetData = (fieldsState) => {
    const startDate = fieldsState.startDate ? moment(fieldsState.startDate).format('YYYY-MM-DD') : null;
    const endDate = fieldsState.endDate ? moment(fieldsState.endDate).format('YYYY-MM-DD') : null;
    const searchParams = ObjectHelper.removeAllNullValue(
      StringHelper.convertObjectToSearchParams({
        ...fieldsState,
        startDate,
        endDate,
      })
    );

    dispatchPrimeTime(actionCreator('SET_CURRENT_SEARCH_PARAMS', searchParams));

    history.push(searchParams);
    if (!fieldsState?.startDate) {
      message.error('Please provide a start date');
      return;
    }
    if (!fieldsState?.endDate) {
      message.error('Please provide a end date');
      return;
    }
    const params = {
      ...fieldsState,
      startDate: moment(fieldsState?.startDate)?.format('YYYY-MM-DD'),
      endDate: moment(fieldsState?.endDate)?.format('YYYY-MM-DD'),
      store: fieldsState.storeCode,
      pageSize: 30,
      pageNumber: 1,
    };
    let model = new PromotionModel();
    model.getAllGoldenTimePromotion(params).then((res) => {
      if (res.status && res.data) {
        if (res.data.promotions) {
          dispatchPrimeTime(actionCreator('SET_TABLE_DATA', res.data.promotions));
        }
      } else {
        message.error(res.message);
      }
    });
  };
  const onSearch = () => {
    handleGetData(fieldsState);
  };
  const handleInitData = async () => {
    const field = StringHelper.convertSearchParamsToObject(history.location?.search);
    const startDate = field.startDate ? moment(field.startDate) : null;
    const endDate = field.endDate ? moment(field.endDate) : null;
    handleSetState({ ...field, startDate, endDate });
    if (field.startDate) {
      handleGetData(field);
    }
  };

  useEffect(() => {
    handleInitData();
  }, []);

  // END FUNCTIONS
  return (
    <Row gutter={[16, 0]} className="mb-15">
      <Col span={6}>
        {renderDatePickerField({
          disabledDate: () => false,
          label: <p className="required">Apply date</p>,
        })}
      </Col>
      <Col span={6}>
        {renderSelectField(storeArray, 'storeCode', 'storeCode-storeName', 'Store', {
          placeholder: '--ALL--',
        })}
      </Col>
      <Col span={6}>
        {renderInputField('name', 'Promotion Name', 'text', {
          placeholder: 'Enter promotion name',
        })}
      </Col>

      <Col span={6}>
        {renderSelectField(statusOptions, 'status', 'label', 'Status', {
          placeholder: '--ALL--',
        })}
      </Col>
      <Col span={24} className="mt-15">
        <div className="flex gap-10 w-full items-start">
          <BaseButton iconName="search" onClick={onSearch}>
            Search
          </BaseButton>
          {data ? <ExportPromotionData promotionType="primetime" params={fieldsState} /> : null}
        </div>
      </Col>
    </Row>
  );
};

export default PrimeTimePromotionDataFetcher;
