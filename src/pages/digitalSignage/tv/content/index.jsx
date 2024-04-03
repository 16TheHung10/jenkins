import { Col, Drawer, Form, Row, Spin, Tabs, message } from 'antd';
import { DigitalSignageTVApi } from 'api';
import MainTable from 'components/common/Table/UI/MainTable';
import { TableDigitalSignageTVData } from 'data/render/table';
import { ArrayHelper, MessageHubHelper, UrlHelper } from 'helpers';
import DigitalSignageTVFormDetails from 'pages/digitalSignage/tv/form/details';
import DigitalSignageTVFormGroupDetails from 'pages/digitalSignage/tv/form/groupDetails';
import DigitalSignageTVFormSearch from 'pages/digitalSignage/tv/form/search';
import useAddGroupTVMuation from 'pages/digitalSignage/tv/hooks/useAddGroupTVMuation';
import useDeleteTVMuation from 'pages/digitalSignage/tv/hooks/useDeleteTVMuation';
import useTVDetailsQuery from 'pages/digitalSignage/tv/hooks/useTVDetailsQuery';
import useTVMuation from 'pages/digitalSignage/tv/hooks/useTVMuation';
import useTVTypesQuery from 'pages/digitalSignage/tv/hooks/useTVTypesQuery';
import useTVsQuery from 'pages/digitalSignage/tv/hooks/useTVsQuery';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import DigitalSignageNav from '../../nav';
import useDailyLogQuery from 'pages/digitalSignage/tvLog/hooks/useDailyLogQuery';
import moment from 'moment';
import CONSTANT from 'constant';
const initialValue = {
  tvCode: '',
  tvName: '',
  tvType: '',
  tvSerial: '',
  tvModel: '',
  storeCode: '',
};
const DigitalSignageTVMainContent = ({
  hideNav = false,
  role = '',
  onSetTVs,
  selectedTvs,
  scrollY = 'calc(100vh - 340px)',
}) => {
  const [totalStoreAndTV, setTotalStoreAndTV] = useState({});
  const [filterFormValue, setFilterFormValue] = useState({});
  const socket = MessageHubHelper.getInstance().getSocket();
  const [isShowDrawerCreate, setIsShowDrawerCreate] = useState(false);
  const [searchFormValue, setSearchFormValue] = useState(null);
  const [selectedTV, setSelectedTV] = useState(null);
  const [tvsOnline, setTvsOnline] = useState([]);
  const [tvStatus, setTvStatus] = useState({});
  const [form] = Form.useForm();
  const [formGroup] = Form.useForm();
  const [formSearch] = Form.useForm();
  const tvQuery = useTVDetailsQuery({ tvCode: selectedTV?.tvCode });
  const addGroupMutation = useAddGroupTVMuation({ tvCode: selectedTV?.tvCode, storeCode: selectedTV?.storeCode });
  const deleteTVMutation = useDeleteTVMuation();
  const updateTVMutation = useTVMuation({ tvCode: selectedTV?.tvCode });
  const typeQuery = useTVTypesQuery();

  const lastDayReportQuery = useDailyLogQuery({
    searchFormValue: {
      date: [
        moment().subtract(1, 'day').format(CONSTANT.FORMAT_DATE_PAYLOAD),
        moment().subtract(1, 'day').format(CONSTANT.FORMAT_DATE_PAYLOAD),
      ],
      pageSize: 1000,
      pageNumber: 1,
    },
    role: 'admin',
  });

  const handleSetTotalValue = (value) => {
    setTotalStoreAndTV(value);
  };
  const tvsQuery = useTVsQuery({ searchFormValue, setTotalValue: handleSetTotalValue });

  const dataTable = useMemo(() => {
    const res = [];
    const tvData = JSON.parse(JSON.stringify({ ...(tvsQuery.data || {}) }));
    for (let storeKey of Object.keys(tvData || {})) {
      const store = tvData[storeKey];
      let index = 0;
      for (let tvKey of Object.keys(store || {})) {
        let tv = store[tvKey];
        tv.isReport = Boolean(lastDayReportQuery.data?.logs?.find((el) => el.tvCode === tv.tvCode));

        if (
          filterFormValue.reportType === null ||
          filterFormValue.reportType === undefined ||
          tv.isReport === filterFormValue.reportType
        ) {
          tv = tv;
        } else {
          tv = null;
        }
        if (tv) console.log({ [storeKey]: tv?.isReport });
        store[tvKey] = tv;
        index++;
      }
      tvData[storeKey] = store;
    }

    for (let store of Object.values(tvData || {})) {
      store = store.filter((el) => el);
      let index = 0;
      for (let tv of store?.sort((a, b) => b.active - a.active)) {
        tv = {
          ...tv,
          key: tv.tvCode,
        };
        if (index === 0) {
          res.push({
            ...tv,
            rowSelection: false,
            rowSpan: store?.length,
            colSpan: 1,
          });
        } else {
          res.push({ ...tv, rowSelection: false, rowSpan: 1, colSpan: 0 });
        }
        index++;
      }
    }
    return res;
  }, [tvsQuery.data, filterFormValue, lastDayReportQuery.data?.logs]);

  const toggleShowDrawerCreate = useCallback(
    (selectedTV) => {
      setSelectedTV(selectedTV.tvCode ? selectedTV : null);
      setIsShowDrawerCreate((prev) => !prev);
    },
    [isShowDrawerCreate]
  );

  const onSetSearchFormValue = useCallback(
    (value) => {
      setSearchFormValue(value);
    },
    [searchFormValue]
  );

  const tabItems = useMemo(() => {
    const tabs = [
      {
        key: '1',
        label: `TV's info`,
        children: <DigitalSignageTVFormDetails form={form} updateTVMutation={updateTVMutation} />,
      },
    ];
    if (selectedTV?.tvCode) {
      tabs.push({
        key: '2',
        label: `TV's group`,
        children: (
          <DigitalSignageTVFormGroupDetails
            form={formGroup}
            addGroupMutation={addGroupMutation}
            tvData={tvQuery.data}
          />
        ),
      });
    }
    return tabs;
  }, [selectedTV, addGroupMutation, updateTVMutation]);

  const handleResetField = (data) => {
    if (!data) {
      form.setFieldsValue({ ...initialValue });
      return;
    }
    const { tvCode, tvName, tvType, tvSerial, tvModel, storeCode } = data;
    form.setFieldsValue({
      tvCode,
      tvName,
      tvType,
      tvSerial,
      tvModel,
      storeCode,
      groupMedias: Object.keys(data.groupMedias || {})
        .sort((a, b) => a.mediaOrder - b.mediaOrder)
        ?.map((item) => ({ groupCode: item })),
      defaultMedia: data.mediaDefault?.mediaCode,
    });
    formGroup.setFieldsValue({
      groupMedias: Object.keys(data.groupMedias || {})
        ?.sort((a, b) => a.mediaOrder - b.mediaOrder)
        ?.map((item) => ({ groupCode: item })),
      defaultMedia: data.mediaDefault?.mediaCode,
    });
  };

  const handleGetCounterOnline = async () => {
    const res = await DigitalSignageTVApi.getTVsOnline();
    if (res.status) {
      const object = ArrayHelper.convertArrayToObject(res.data.online_usrs, 'userId');
      setTvsOnline(object);
    } else {
      message.error(res.message);
    }
    return res;
  };

  const handleListenSocket = () => {
    socket &&
      socket.on('new_feedback_tv', function (response) {
        if (response) {
          console.log({ response });
          let activities = response.feedback;
          let message = activities.comment;
          let tvCode = activities.recipient_id;

          setTvStatus((cloneTvStatus) => {
            if (cloneTvStatus[tvCode]) {
              const taskReceivedDate = message?.taskReceivedDate;
              const taskFinishDate = message?.taskFinishDate;
              const taskFeedback = message?.taskFeedback;
              cloneTvStatus[tvCode] = {
                ...cloneTvStatus[tvCode],
                [message?.taskReceivedDate]: { taskReceivedDate, taskFinishDate, taskFeedback },
              };
            } else {
              cloneTvStatus[tvCode] = {
                [message?.taskReceivedDate]: {
                  taskReceivedDate: message?.taskReceivedDate,
                  taskFinishDate: message?.taskFinishDate,
                  taskFeedback: message?.taskFeedback,
                },
              };
            }
            return { ...cloneTvStatus };
          });
        }
      });
  };

  useEffect(() => {
    handleListenSocket();
  }, []);

  useEffect(() => {
    handleGetCounterOnline();
  }, []);

  useEffect(() => {
    handleResetField(tvQuery.data);
  }, [tvQuery.data]);

  useEffect(() => {
    let resetValues = {};
    if (searchFormValue) {
      const { date, ...restParmas } = searchFormValue;
      resetValues = {
        ...restParmas,
      };
    }
    UrlHelper.setSearchParamsFromObject({ ...resetValues });
  }, [searchFormValue]);

  useEffect(() => {
    let currentUrlParams = UrlHelper.getSearchParamsObject() || {};
    currentUrlParams = {
      ...currentUrlParams,
    };
    const { startDate, endDate, pageSize, pageNumber, ...restParams } = currentUrlParams;
    formSearch.setFieldsValue({ ...restParams });
    setSearchFormValue((prev) => ({ ...(prev || {}), ...restParams }));
  }, []);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      onSetTVs(selectedRowKeys);
    },
    selectedRowKeys: selectedTvs,
    fixed: 'left',
  };
  const handleFilter = (value) => {
    setFilterFormValue(value);
  };
  return (
    <>
      {' '}
      <div className="section-block mt-15" id="tvSearchForm">
        <Row gutter={[16, 16]}>
          <Col span={16}>
            <DigitalSignageTVFormSearch
              onFilterReportType={handleFilter}
              form={formSearch}
              onOpenFormCreate={toggleShowDrawerCreate}
              onSetValue={onSetSearchFormValue}
              role={role}
            />
          </Col>
          <Col span={8} style={{ alignSelf: 'start' }}>
            <div
              className=" mt-10 flex items-center gap-10"
              style={{ fontSize: 16, fontWeight: 600, borderRadius: '40px' }}
            >
              <div className="flex flex-col  col-md-6 w-full  bg-block">
                <div className="flex items-end ">
                  <p className="m-0">{totalStoreAndTV?.totalStore?.split('/')[0] || '-'}</p> /{' '}
                  <p className="hint m-0">{totalStoreAndTV?.totalStore?.split('/')[1]}</p>
                </div>
                <p className=" m-0">Store</p>
              </div>
              <div className="flex flex-col  col-md-6 w-full  bg-block">
                <div className="flex items-end ">
                  {lastDayReportQuery.isLoading ? (
                    <Spin />
                  ) : (
                    <p className="m-0">{lastDayReportQuery.data?.logs?.length || '0'} </p>
                  )}
                  <p></p>
                </div>
                <p className=" m-0">Reported TVs</p>
              </div>
              <div className="flex flex-col  col-md-6 w-full  bg-block">
                <p className="w-full m-0 text-center gap-10">
                  <span>{totalStoreAndTV?.totalTV || '-'}</span>
                </p>
                <p className=" m-0">TV</p>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className="section-block mt-15 " id="tvSearchResult">
        <MainTable
          scroll={{
            x: true,
            y: scrollY,
          }}
          rowSelection={{
            ...rowSelection,
          }}
          className="w-full "
          loading={tvsQuery.isLoading}
          columns={TableDigitalSignageTVData.columns({
            onOpenFormUpdate: toggleShowDrawerCreate,
            onDeleteTV: deleteTVMutation.mutate,
            tvsOnline,
            typeQuery,
            tvStatus,
            role,
            lastDayLog: lastDayReportQuery.data?.logs,
          })}
          dataSource={dataTable}
        />
      </div>
      <Drawer width={500} open={isShowDrawerCreate} onClose={toggleShowDrawerCreate} footer={false}>
        {tvQuery.isLoading ? (
          <div className="w-full h-full center">
            <Spin />
          </div>
        ) : (
          <Tabs className="" defaultActiveKey="1" items={tabItems} />
          // <DigitalSignageTVFormDetails form={form} />
        )}
      </Drawer>
    </>
  );
};

export default React.memo(DigitalSignageTVMainContent);
