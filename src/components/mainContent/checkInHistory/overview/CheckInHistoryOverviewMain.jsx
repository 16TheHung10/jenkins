import { Col, Modal, Row, message } from 'antd';
import { LogApi, StaffApi } from 'api';
import MainTable from 'components/common/Table/UI/MainTable';
import FieldList from 'components/common/fieldList/FieldList';
import CONSTANT from 'constant';
import { useAppContext } from 'contexts';
import actionCreator from 'contexts/actionCreator';
import FormField from 'data/oldVersion/formFieldRender';
import { ArrayHelper, OptionsHelper, UrlHelper, DateHelper } from 'helpers';
import { useFormFields, useImportExcel, useShowFilter } from 'hooks';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import CheckInHistoryOverviewFieldsSearch from './CheckInHistoryOverviewFields';
import CheckInHistoryOverviewFieldsFilter from './CheckInHistoryOverviewFieldsFilter';
import './style.scss';

const CheckInHistoryOverviewMain = ({ ...props }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const storeCodeUrl = params.get('storecode');
  const storeNameUrl = params.get('storename');
  const role = params.get('role');

  const token = params.get('token');
  const refreshToken = params.get('refreshToken');

  useEffect(() => {
    if (token) {
      localStorage.setItem('accessToken', token);
    }
  }, [token]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }, [refreshToken]);

  const { ComponentExport } = useImportExcel();
  const { state: AppState, dispatch, onGetStoreData, onSetStoreData } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkInData, setCheckInData] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [constCheckInData, setConstCheckInData] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const { isVisible, TriggerComponent } = useShowFilter();
  const [isFetchDataLoading, setIsFetchDataLoading] = useState(false);
  const [isLoadingAddLog, setIsLoadingAddLog] = useState(false);

  const formatData = (data, shiftData) => {
    const shiftInDataClone = shiftData;
    if (!data) return [];
    // if (!shiftInDataClone) return [];
    let storeKeys = Object.keys(data);
    const res = [];
    for (let storeKey of storeKeys) {
      // Loop over store
      const store = data?.[storeKey]; // Get current looped store
      let emKeys = Object.keys(data?.[storeKey]); // Get all Employee keys in store (loop over employee in store)
      for (let emKey of emKeys) {
        // loop over employees
        const registedShiftOfEmployeeMock = shiftInDataClone ? shiftInDataClone[emKey] : null;
        // if (!registedShiftOfEmployeeMock) continue;
        const map = new Map(); // All checkin of employee by day
        const emArray = store?.[emKey];
        let emArrayWithDateKey = {};
        for (let item of Array.isArray(emArray) ? emArray : []) {
          const mapKey =
            item.workShift === 6 &&
            item.inOutMode === 2 &&
            [0, 1, 2, 3, 4, 5, 6, 7, 8].includes(+moment(item.time).hours())
              ? moment(item.time).subtract(1, 'day').format(CONSTANT.FORMAT_DATE_IN_USE)
              : moment(item.time).format(CONSTANT.FORMAT_DATE_IN_USE);
          if (map.has(mapKey)) {
            const currentValue = map.get(mapKey);
            const newValue = [...currentValue, item];
            map.set(mapKey, newValue);
          } else {
            map.set(mapKey, [item]);
          }
          const key = [moment(item.time).format(CONSTANT.FORMAT_DATE_IN_USE)];
          const value = { ...map };
          emArrayWithDateKey[key] = value;
        }
        const workingDays = [...map.keys()];

        const contractWorkingDay = registedShiftOfEmployeeMock;
        res.push({
          department: storeKey,
          employeeATID:
            emArray?.length > 0
              ? `${emKey} - ${emArray[0].lastName} ${emArray[0].midName}  ${emArray[0].fisrtName}`
              : '-',
          contractWorkingDay,
          workingDays,
          customID: Date.now(),
          ...Object.fromEntries(map),
        });
      }
    }
    return res;
  };
  const hanleFetchCheckinLog = async (payload) => {
    const res = await StaffApi.getCheckInHistoryOfStore({ ...payload });
    if (!res.status) {
      message.error({
        content: res.message,
        key: 'checkinHistory/fetchingData',
      });
      throw new Error(res.message);
    }
    return res;
  };
  const handleFetchStaffShift = async (payload) => {
    if (role === 'User') {
      return;
    }

    if (
      AppState?.stores?.[payload?.storeCode].isFranchise ||
      AppState?.stores?.[payload?.storeCode]?.shortName?.startsWith('F')
    ) {
      return;
    }

    const resShift = await StaffApi.getShiftOfEmployee(payload);
    if (resShift.status) {
      return resShift;
    } else {
      message.error({
        content: resShift.message,
        key: 'checkinHistory/fetchingShiftData',
      });
      // setCheckInData([]);
      return;
    }
  };

  const handleFetchData = async (params) => {
    const { date, ...rest } = params;
    setSelectedTimeRange([moment(date).startOf('month'), moment(date).endOf('month')]);
    const payload = {
      startDate: moment(date).startOf('month').format(CONSTANT.FORMAT_DATE_PAYLOAD),
      endDate: moment(date).endOf('month').format(CONSTANT.FORMAT_DATE_PAYLOAD),
    };

    return Promise.all([
      hanleFetchCheckinLog({ ...payload, ...rest }),
      handleFetchStaffShift({
        ...payload,
        storeCode: params.storeCode,
        staffCode: params.staffCode,
      }),
    ]);
  };

  const handleSubmit = async ({ date, ...rest }) => {
    setSelectedTimeRange(date);
    let diffDate = moment(date[1]).diff(moment(date[0]).endOf('day'), 'days');
    if (diffDate > 30) {
      message.error({
        content: 'Apply date must be in 31 days',
        key: 'checkinHistory/validate',
      });
      return;
    }
    setIsFetchDataLoading(true);
    try {
      const [res, resShift] = await handleFetchData({ date, ...rest });
      if (res.status) {
        const formatedData = formatData(res.data.history, resShift?.data?.shift);
        setCheckInData(formatedData);
        setConstCheckInData(formatedData);
      }
    } catch (err) {
      message.error({
        content: err.message,
        key: 'checkinHistory/fetchingShiftData',
      });
    } finally {
      setIsFetchDataLoading(false);
    }
  };

  const storeOptions = useMemo(() => {
    const array = Object.values(AppState?.stores || {});

    if (storeCodeUrl !== '' && storeCodeUrl !== null && storeNameUrl !== '' && storeNameUrl !== null) {
      const storeCode = storeCodeUrl;
      const storeName = storeNameUrl;

      const listStoreOpt = [
        {
          value: storeCode,
          label: `${storeCode} - ${storeName}`,
          key: `${storeCode}-0`,
        },
      ];

      return listStoreOpt;
    }

    if (Object.keys(array)?.length === 0) {
      const storeCode = JSON.parse(localStorage.getItem('profile'))?.storeCode;
      const storeName = storeCode + ' - ' + JSON.parse(localStorage.getItem('profile'))?.storeName;
      const listStoreOpt = [
        {
          value: storeCode,
          label: `${storeCode} - ${storeName}`,
          key: `${storeCode}-0`,
        },
      ];

      return listStoreOpt;
    }

    if (array) {
      const options = OptionsHelper.convertDataToOptions(array, 'storeCode', 'storeCode-storeName');
      return options;
    }

    return [];
  }, [AppState?.stores, storeCodeUrl, storeNameUrl]);

  const handleFilter = (value) => {
    if (!constCheckInData || constCheckInData.length === 0) {
      return;
    }

    const { log, ...filterObject } = value;
    let clone = JSON.parse(JSON.stringify(constCheckInData));
    for (let index = 0; index < clone.length; index++) {
      const { department, employeeATID, workingDays, contractWorkingDay, absentDays, customID, ...dateFields } =
        clone[index] || {};
      // const sortedValueByTime = Object.values(dateFields || {})?.sort((a, b) => a[0].time.localeCompare(b[0].time));
      let isAsent = false;
      let isMiss = false;
      let isFull = false;

      const historyLogOfUser = Object.values(dateFields || {})?.sort((a, b) => a[0].time.localeCompare(b[0].time));
      for (let item of historyLogOfUser) {
        const sortedValueByTime = item?.sort((a, b) => {
          return a.time.localeCompare(b.time);
        });
        const firstCheckin =
          sortedValueByTime?.find((el) => {
            return +el.inOutMode === 1;
          }) || null;
        const lastCheckout = sortedValueByTime?.findLast((el) => +el.inOutMode === 2) || null;
        const compareArr1 = contractWorkingDay?.map((item) =>
          moment(item.shiftDate).format(CONSTANT.FORMAT_DATE_IN_USE)
        );
        if (!isAsent) isAsent = !ArrayHelper.compareTwoArray(compareArr1, workingDays);
        if (!isMiss) isMiss = !firstCheckin || !lastCheckout;
        isFull = !isAsent && !isMiss;
      }
      if (log === 1 && !isFull) {
        clone.splice(index, 1);
        index--;
      }
      if (log === 0 && !isMiss) {
        clone.splice(index, 1);
        index--;
      }
      if (log === 2 && !isAsent) {
        clone.splice(index, 1);
        index--;
      } else {
        continue;
      }
    }

    setCheckInData(clone);
  };
  const handleUpdateOneLogAfterCallAPI = (dataToUpdate, seleselectedStaffInit) => {
    let cloneSelectedStaff = { ...seleselectedStaffInit };
    cloneSelectedStaff[cloneSelectedStaff.selectedDate].push(...dataToUpdate);
    const { index, selectedDate, typeLog, ...updateData } = cloneSelectedStaff;
    setCheckInData((prev) => {
      const clone = [...prev];
      clone.splice(seleselectedStaffInit.index, 1, updateData);
      return clone;
    });
    setConstCheckInData((prev) => {
      const clone = [...prev];
      clone.splice(seleselectedStaffInit.index, 1, updateData);
      return clone;
    });
  };
  const callApiAddSingleLog = (params, dataToUpdate) => {
    setIsLoadingAddLog(true);
    LogApi.addLog(params).then((res) => {
      if (res.status) {
        message.success('Add log successfully');
        handleUpdateOneLogAfterCallAPI(dataToUpdate, selectedStaff);
      } else {
        message.error(res.message);
      }
    });
    setIsLoadingAddLog(false);
  };
  const callApiAddFullLog = async (params1, params2, dataToUpdate, seleselectedStaffInit) => {
    setIsLoadingAddLog(true);
    const promise1 = LogApi.addLog(params1).then((res) => {
      if (res.status) {
        message.success('Add log successfully');
        return res;
      } else {
        message.error(res.message);
        throw new Error(res.message);
      }
    });
    const promise2 = LogApi.addLog(params2).then((res) => {
      if (res.status) {
        message.success('Add log successfully');
        return res;
      } else {
        throw new Error(res.message);
      }
    });
    try {
      const [res1, res2] = await Promise.all([promise1, promise2]);
      handleUpdateOneLogAfterCallAPI(dataToUpdate, seleselectedStaffInit);
    } catch (err) {
      message.error(err.message);
      console.error(err);
    }
    setIsLoadingAddLog(false);
  };

  const handleAddLog = async (value) => {
    const paramsCheckin = value.checkin
      ? {
          StoreCode: selectedStaff?.department,
          EmployeeATID: selectedStaff?.employeeATID.split('-')[0].trim(),
          FullName: selectedStaff?.employeeATID.split('-')[1].trim(),
          Time: selectedStaff.selectedDate.split('/').reverse().join('/') + ' ' + moment(value.checkin).format('HH:mm'),
          Workshift: 1,
          InOutMode: 1,
        }
      : null;
    const paramsCheckout = value.checkout
      ? {
          StoreCode: selectedStaff?.department,
          EmployeeATID: selectedStaff?.employeeATID.split('-')[0].trim(),
          FullName: selectedStaff?.employeeATID.split('-')[1].trim(),
          Time:
            selectedStaff.selectedDate.split('/').reverse().join('/') + ' ' + moment(value.checkout).format('HH:mm'),
          Workshift: 1,
          InOutMode: 2,
        }
      : null;

    let updatedSeledtedStaff = JSON.parse(JSON.stringify({ ...selectedStaff }));
    let dataToUpdate;

    if (selectedStaff.typeLog === 'fullLog') {
      dataToUpdate = [
        {
          department: selectedStaff.department,
          employeeATID: selectedStaff.employeeATID.split('-')[0].trim(),
          lastName: selectedStaff.employeeATID.split('-')[1].trim(),
          isAddLog: true,
          firstName: '',
          inOutMode: 1,
          time: selectedStaff.selectedDate.split('-').reverse().join('-') + ' ' + moment(value.checkin).format('HH:mm'),
          workShift: 1,
        },
        {
          department: selectedStaff.department,
          employeeATID: selectedStaff.employeeATID.split('-')[0].trim(),
          lastName: selectedStaff.employeeATID.split('-')[1].trim(),
          isAddLog: true,
          firstName: '',
          inOutMode: 2,
          time:
            selectedStaff.selectedDate.split('-').reverse().join('-') + ' ' + moment(value.checkout).format('HH:mm'),
          workShift: 1,
        },
      ];
    } else {
      dataToUpdate = [
        {
          department: selectedStaff.department,
          employeeATID: selectedStaff.employeeATID.split('-')[0].trim(),
          lastName: selectedStaff.employeeATID.split('-')[1].trim(),
          isAddLog: true,
          firstName: '',
          inOutMode: selectedStaff.typeLog === 'checkin' ? 1 : 2,
          time: moment(
            selectedStaff.selectedDate.split('-').reverse().join('-') +
              ' ' +
              moment(selectedStaff.typeLog === 'checkin' ? value.checkin : value.checkout).format('HH:mm')
          ).format(),
          workShift: 1,
        },
      ];
    }

    if (!updatedSeledtedStaff[updatedSeledtedStaff.selectedDate]) {
      updatedSeledtedStaff[updatedSeledtedStaff.selectedDate] = [];
    }
    if (paramsCheckin && paramsCheckout) {
      // Call api add full log
      callApiAddFullLog(paramsCheckin, paramsCheckout, dataToUpdate, updatedSeledtedStaff);
    } else {
      // Add single log
      if (paramsCheckin) callApiAddSingleLog(paramsCheckin, dataToUpdate);
      if (paramsCheckout) callApiAddSingleLog(paramsCheckout, dataToUpdate);
    }
  };

  const {
    formInputsWithSpan: formInputs,
    onSubmitHandler,
    reset,
    getValues,
    setValue,
  } = useFormFields({
    fieldInputs: FormField.CheckInOverview.fieldInputs({ storeOptions }),
    onSubmit: handleSubmit,
    watches: ['date'],
  });

  const {
    formInputsWithSpan: formInputsFilter,
    onSubmitHandler: onSubmitHandlerFilter,
    reset: resetFilter,
    getValues: getValuesFilter,
  } = useFormFields({
    fieldInputs: FormField.CheckInOverview.fieldInputsForFilter(),
    onSubmit: handleFilter,
    watches: ['log'],
  });

  const {
    formInputsWithSpan: formInputsAddLog,
    onSubmitHandler: onAddLog,
    reset: resetAddLog,
  } = useFormFields({
    fieldInputs: FormField.CheckInOverview.fieldInputsAddLog(selectedStaff?.typeLog),
    onSubmit: handleAddLog,
  });

  const formatExportData = (checkInData) => {
    const flatCheckInDataByWorkingDays = [];
    const allDaysInSelectedMonth = DateHelper.getALlDateInRange(selectedTimeRange?.[0], selectedTimeRange?.[1]);

    for (let i = 0; i < checkInData?.length || 0; i++) {
      const { contractWorkingDay, customID, department, employeeATID, workingDays, ...date } = checkInData[i];
      let allDaysInSelectedMonthObject = {};
      for (let i = 0; i < allDaysInSelectedMonth?.length; i++) {
        let dayString = moment(allDaysInSelectedMonth[i]).format('DD/MM/YYYY');
        allDaysInSelectedMonthObject = { ...allDaysInSelectedMonthObject, [dayString.toString()]: null };
      }
      for (let j in workingDays) {
        const workingDay = workingDays[j];
        const checkinDataInDay = checkInData[i][workingDay];
        const firstCheckIn = checkinDataInDay?.find((el) => +el.inOutMode === 1 && !el.isAddLog)
          ? moment(checkinDataInDay?.find((el) => +el.inOutMode === 1).time).format('HH:mm')
          : '-';
        const firstCheckInAddLog = checkinDataInDay?.find((el) => +el.inOutMode === 1 && el.isAddLog)
          ? moment(checkinDataInDay?.find((el) => +el.inOutMode === 1).time).format('HH:mm')
          : '-';
        const lastCheckOut = checkinDataInDay?.findLast((el) => +el.inOutMode === 2 && !el.isAddLog)
          ? moment(checkinDataInDay?.findLast((el) => +el.inOutMode === 2).time).format('HH:mm')
          : '-';
        const lastCheckOutAddLog = checkinDataInDay?.findLast((el) => +el.inOutMode === 2 && el.isAddLog)
          ? moment(checkinDataInDay?.findLast((el) => +el.inOutMode === 2).time).format('HH:mm')
          : '-';
        allDaysInSelectedMonthObject = {
          ...allDaysInSelectedMonthObject,
          [workingDay]: { firstCheckIn, lastCheckOut, firstCheckInAddLog, lastCheckOutAddLog },
        };
      }
      flatCheckInDataByWorkingDays.push({
        Employee: employeeATID,
        ...allDaysInSelectedMonthObject,
      });
    }
    let res = [];
    flatCheckInDataByWorkingDays.forEach((item) => {
      let item0 = {};
      let item1 = {};
      let item2 = {};
      let item3 = {};
      let item4 = {};
      for (let key of Object.keys(item)) {
        item0 = { ...item0, [key]: null, Employee: `${item.Employee}` };
        item1 = { ...item1, [key]: item[key]?.['firstCheckIn'] || '-', Employee: `Check in` };
        item2 = { ...item2, [key]: item[key]?.['lastCheckOut'] || '-', Employee: `Check out` };
        item3 = { ...item3, [key]: item[key]?.['firstCheckInAddLog'] || '-', Employee: `Check int additional` };
        item4 = { ...item4, [key]: item[key]?.['lastCheckOutAddLog'] || '-', Employee: `Check out additional` };
      }
      res.push(...[item0, item1, item2, item3, item4]);
    });

    return res;
  };

  useEffect(() => {
    const params = {
      log: getValuesFilter('log'),
    };
    handleFilter(params);
  }, [getValuesFilter('log')]);

  useEffect(() => {
    onGetStoreData();
  }, []);

  useEffect(() => {
    formatExportData(checkInData);
  }, [isFetchDataLoading]);

  const handleResetData = () => {
    const searchPramsObject = UrlHelper.getSearchParamsObject();

    const { startDate, endDate, ...rest } = searchPramsObject;
    let resetData = null;
    if (!searchPramsObject.startDate || !searchPramsObject.endDate) {
      resetData = { storeCode: searchPramsObject.storeCode, date: moment() };
    } else {
      resetData = {
        storeCode: searchPramsObject.storeCode,
        staffCode: searchPramsObject.staffCode,
        date: moment(searchPramsObject.startDate),
      };
    }
    reset(resetData);
    if (resetData.date && resetData.storeCode) {
      handleSubmit(resetData);
    }
  };
  useEffect(() => {
    if (AppState.stores && role !== 'User') {
      handleResetData();
    } else {
      reset({ date: moment() });
    }
  }, [AppState.stores, role]);
  useEffect(() => {
    if (role === 'User') {
      handleResetData();
    }
  }, [role]);

  useEffect(() => {
    dispatch(actionCreator('TOGGLE_MENU_COLLAPSE'));
  }, []);

  const onOpenModalAddLog = (selectedStaff, type) => {
    openModal();
    setSelectedStaff({ ...selectedStaff, typeLog: type });
  };
  const ExportButton = () => {
    return <ComponentExport title="Export" data={formatExportData(checkInData)} />;
  };

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    if (isLoadingAddLog) {
      message.info('Please wait...');
      return;
    }
    setIsModalOpen(false);
    resetAddLog(null);
  };
  return (
    <div id="check-in-overview">
      <Row className="section-block  mt-15">
        <Col span={15}>
          <CheckInHistoryOverviewFieldsSearch
            setValue={setValue}
            getValues={getValues}
            onSubmit={(e, value) => {
              resetFilter({});
              onSubmitHandler(e, '123');
            }}
            formInputs={formInputs}
            ShowFilterComponent={<TriggerComponent />}
            ExportButton={ExportButton}
            isLoading={isFetchDataLoading}
          />
        </Col>
        <Col offset={3} span={6}>
          <div className="cl-red bg-note">
            <strong className="required">Chú ý</strong>
            <br />- Ô có màu <strong>đỏ</strong> là ngày có trong hợp đồng làm việc nhưng nhân viên không đi làm hoặc
            không chấm công
            <br />- Ô có màu <strong>vàng</strong> là ngày nhân viên chấm thiếu log (checkin hoặc checkout)
            <br />- Mỗi ngày sẽ có 2 log (checkin và checkout) mỗi 1 log được tính là 0.5 unit
          </div>
        </Col>
      </Row>

      <CheckInHistoryOverviewFieldsFilter
        className={`mt-15 section-block transition_animate_5 h-full ${isVisible ? 'show' : 'hide mi-0'}`}
        onSubmit={onSubmitHandlerFilter}
        formInputs={formInputsFilter}
      />
      {/* {selectedTimeRange ? ( */}
      <div className="mb-15 mt-15 w-full" style={{ overflow: 'auto' }}>
        <MainTable
          loading={isFetchDataLoading}
          className="row_pointer w-fit"
          columns={FormField.CheckInOverview.columns({
            timeRange: selectedTimeRange || [],
            onOpenAddLog: onOpenModalAddLog,
          })}
          scroll={{ y: 'calc(100vh - 280px)' }}
          dataSource={checkInData || []}
        />
      </div>

      {/* ) : null} */}
      <Modal title="Add log" open={isModalOpen} onCancel={closeModal} footer={false}>
        <form onSubmit={onAddLog}>
          <div className="">
            <p>
              <b>Store</b>: {selectedStaff?.department}
            </p>
            <p>
              <b>Staff</b>: {selectedStaff?.employeeATID}
            </p>
          </div>
          <Row gutter={[16, 16]} className="items-center">
            <FieldList fields={formInputsAddLog} />
            <Col span={8}>
              <BaseButton loading={isLoadingAddLog} iconName="plus" htmlType="submit">
                Add log
              </BaseButton>
            </Col>
          </Row>
        </form>
      </Modal>
    </div>
  );
};

export default CheckInHistoryOverviewMain;
