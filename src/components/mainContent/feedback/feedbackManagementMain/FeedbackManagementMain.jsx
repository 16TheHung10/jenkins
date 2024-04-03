import { Button, Col, Drawer, Input, Row, Space, Tooltip, message } from 'antd';
import FeedbackApi from 'api/FeedbackApi';
import Image from 'components/common/Image/Image';
import MainTable from 'components/common/Table/UI/MainTable';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import FieldList from 'components/common/fieldList/FieldList';
import CONSTANT from 'constant';
import { useAppContext } from 'contexts';
import FormField from 'data/oldVersion/formFieldRender';
import { DateHelper, OptionsHelper, StringHelper, UrlHelper } from 'helpers';
import { useFormFields, usePagination } from 'hooks';
import Icons from 'images/icons';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import * as yup from 'yup';

const FeedbackManagementMain = () => {
  const { state: AppState, onGetStoreData } = useAppContext();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const searchInput = useRef(null);

  const handleSearchTable = (selectedKeys, confirm, dataIndex) => {
    // confirm();
    console.log({ selectedKeys, confirm, dataIndex });
  };
  const handleReset = (clearFilters, dataIndex) => {
    clearFilters();
  };
  // Loading
  const [loadingFetchFeedback, setLoadingFetchFeedback] = useState(false);
  const handleCloseModal = () => {
    const currentParams = UrlHelper.getSearchParamsObject();
    let newPrams = null;
    if (currentParams.selectedFeedback) {
      const { selectedFeedback, ...rest } = currentParams;
      newPrams = rest;
      UrlHelper.setSearchParamsFromObject(newPrams);
    }
    setIsOpenModal(false);
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };
  const handleSearch = (value) => {};

  const handleSetListImage = (selectedFeedback) => {
    const currentSearchParams = UrlHelper.getSearchParamsObject();
    const newSearchParams = {
      ...currentSearchParams,
      selectedFeedback: selectedFeedback?.feedbackID || '',
    };
    UrlHelper.setSearchParamsFromObject(newSearchParams);
    setSelectedImages(selectedFeedback.image);
  };

  const renderCount = useRef(0);

  const showInitialListImage = (dataMap) => {
    if (dataMap) {
      const currentParams = UrlHelper.getSearchParamsObject();
      if (currentParams.selectedFeedback) {
        const selectedFeedback = dataMap.find((el) => el.feedbackID.toString() === currentParams.selectedFeedback);
        if (selectedFeedback) {
          setSelectedImages(selectedFeedback.image);
          handleOpenModal();
        }
      }
    }
  };

  const handleFetchFeedbacks = async (value) => {
    setLoadingFetchFeedback(true);
    const payload = {
      startDate: value.date?.[0] ? moment(value.date?.[0]).format(CONSTANT.FORMAT_DATE_PAYLOAD) : '',
      endDate: value.date?.[1] ? moment(value.date?.[1]).format(CONSTANT.FORMAT_DATE_PAYLOAD) : '',
      storeCode: value.storeCode,
      type: value.type,
      pageSize: value.pageSize || pageSize,
      pageNumber: value.pageNumber || pageNumber,
    };
    const res = await FeedbackApi.getAllFeedback(payload);
    const currentParams = UrlHelper.getSearchParamsObject();
    if (currentParams.selectedFeedback)
      UrlHelper.setSearchParamsFromObject({
        ...payload,
        selectedFeedback: currentParams.selectedFeedback,
      });
    else UrlHelper.setSearchParamsFromObject({ ...payload });

    renderCount.current = renderCount.current + 1;
    setLoadingFetchFeedback(false);
    if (res.status) {
      const sorted = res.data.feedback.sort((a, b) => b.createdDate.localeCompare(a.createdDate));
      setTotalFeedbacks(res.data.total);
      showInitialListImage(res.data.feedback);
      return sorted;
    } else {
      message.error(res.message);
      return null;
    }
  };
  const storeOptions = useMemo(() => {
    const array = Object.values(AppState?.stores || {});
    if (array) {
      const options = OptionsHelper.convertDataToOptions(array, 'storeCode', 'storeCode-storeName');
      return options;
    }
    return [];
  }, [AppState?.stores]);

  const { formInputsWithSpan, onSubmitHandler, reset, getValues, setValue } = useFormFields({
    fieldInputs: [
      {
        name: 'date',
        label: 'Apply date',
        labelClass: 'required',
        type: 'date-range',
        format: 'DD/MM/YYYY',
        disabledDate: (currentDate) => currentDate && currentDate > moment().endOf('day'),
        rules: yup.array().required('Please select apply date'),
        span: 6,
      },
      {
        name: 'storeCode',
        label: 'Store',
        type: 'select',
        placeholder: '--All stores--',
        options: storeOptions,
        span: 6,
      },
      {
        name: 'type',
        label: 'Type',
        type: 'select',
        placeholder: '--Software/Hardware--',
        options: [
          {
            value: 0,
            label: 'Software',
          },
          {
            value: 1,
            label: 'Hardware',
          },
        ],
        span: 6,
      },
    ],
    onSubmit: handleSearch,
  });
  const {
    Pagination,
    pageSize,
    pageNumber,
    reset: resetPagination,
    setValues: setPaginValue,
  } = usePagination({ total: totalFeedbacks });

  const feedBackQuery = useQuery({
    queryKey: ['feedbacks', getValues(), +pageSize, +pageNumber],
    queryFn: () => handleFetchFeedbacks(getValues()),
    enabled: Boolean(Object.values(getValues('date') || {}).length > 0),
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    const searchParamsObject = UrlHelper.getSearchParamsObject();
    if (!searchParamsObject.startDate || !searchParamsObject.endDate) {
      return;
    }
    const startDate = moment(searchParamsObject.startDate);
    const endDate = moment(searchParamsObject.endDate);
    const date = [startDate, endDate];
    if (!DateHelper.isValidDate(startDate || !DateHelper.isValidDate(endDate))) {
      message.error('Invalid search params');
      return;
    }
    reset({
      date,
      storeCode: searchParamsObject?.storeCode,
      type: searchParamsObject.type,
    });
  }, []);

  useEffect(() => {
    const searchParamsObject = UrlHelper.getSearchParamsObject();
    if (searchParamsObject.pageNumber && searchParamsObject.pageSize)
      setPaginValue({
        pageNumber: searchParamsObject.pageNumber,
        pageSize: searchParamsObject.pageSize,
      });
  }, []);

  useEffect(() => {
    onGetStoreData();
  }, []);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${StringHelper.camelCaseToString(dataIndex)}`}
          value={`${selectedKeys[0] || ''}`}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearchTable(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <BaseButton onClick={() => handleSearchTable(selectedKeys, confirm, dataIndex)} icon={<Icons.Search />}>
            Search
          </BaseButton>
          <BaseButton onClick={() => clearFilters && handleReset(clearFilters, dataIndex)}>Reset</BaseButton>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <Icons.Search
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  return (
    <div className="app_container">
      <form onSubmit={onSubmitHandler} className="section-block mt-15">
        <Row gutter={[16, 16]} className="items-center">
          <FieldList fields={formInputsWithSpan} />
          <Col span={6}>
            <BaseButton iconName="search" htmlType="submit" className="btn-danger">
              Search
            </BaseButton>
          </Col>
        </Row>
      </form>

      <div className="section-block mt-15">
        <MainTable
          loading={feedBackQuery.isLoading}
          className="mt-15 w-full"
          columns={FormField.FeedBackOverview.columns({
            isOpenModal,
            onOpenModal: handleOpenModal,
            onCloseModal: handleCloseModal,
            onClickImage: handleSetListImage,
            stores: AppState?.stores,
            getColumnSearchProps,
          })}
          scroll={{
            y: 'calc(100vh - 305px)',
          }}
          dataSource={feedBackQuery?.data}
        />
        {feedBackQuery.data?.length > 0 ? (
          <div className="mt-15 mb-10 flex justify-center">
            <Pagination showSizeChanger />
          </div>
        ) : null}
      </div>

      <Drawer
        className="drawer_list_feedback_iamge"
        placement="right"
        onClose={handleCloseModal}
        open={isOpenModal}
        title="Feedback images"
      >
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            textAlign: 'center',
            display: 'flex',
            gap: 10,
            alignItems: 'center',
          }}
        >
          {selectedImages?.map((item, index) => {
            return (
              <li
                className="mb-10"
                key={item + index}
                style={{
                  height: '100px',
                  width: '200px',
                  background: '#8080801c',
                }}
              >
                <Tooltip title="Click to view full">
                  <a href={item} target="_blank">
                    <Image
                      style={{
                        height: '100px',
                      }}
                      alt={item}
                      key={item}
                      src={item + `?random=${Date.now()}&h=100&w=100`}
                    />
                  </a>
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </Drawer>
    </div>
  );
};

export default FeedbackManagementMain;
