import { Col, Row, Table, Typography, message } from 'antd';
import { FcApi } from 'api';
import MainTable from 'components/common/Table/UI/MainTable';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import FieldList from 'components/common/fieldList/FieldList';
import { scrollToTop } from 'components/mainContent/MainContent';
import { ObjectHelper, UrlHelper } from 'helpers';
import { useAppContext } from 'contexts';
import { useFormFields, usePagination } from 'hooks';
import React, { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import FieldsFcMasterData from '../data/FieldsFcMasterData';
import FcMasterNav from '../fcMasterNav/FcMasterNav';
import './style.scss';
import { TableFcMasterManagementData } from '../../../data/render/table';
const { Text } = Typography;
const FCMaster = () => {
  const history = useHistory();
  const queryClient = useQueryClient();
  const [totalFCData, setTotalFCData] = useState(0);
  const { state: AppState, onGetModelTypes } = useAppContext();
  useEffect(() => {
    onGetModelTypes();
  }, []);
  const { Pagination, pageSize, pageNumber, setValues: onResetPagination } = usePagination({ total: totalFCData });
  const {
    formInputsWithSpan: fields,
    onSubmitHandler,
    reset,
    getValues,
  } = useFormFields({
    fieldInputs: FieldsFcMasterData.fieldsSearch({
      fcModelTypesOptions: AppState.fcModelTypes.map((item) => {
        return { value: item.typeID, label: item.typeName };
      }),
    }),
    onSubmit: () => {
      onResetPagination({ pageSize, pageNumber: 1 });
    },
  });

  const handleSetSearchParamsUrl = (params) => {
    const currentParams = UrlHelper.getSearchParamsObject();
    const newParams = { ...currentParams, ...params };
    UrlHelper.setSearchParamsFromObject(newParams);
  };

  const handleFetchFcData = async (value) => {
    const params = { ...value, pageSize, pageNumber };
    const res = await FcApi.getAllFC(params);
    if (res.status) {
      return res.data;
    }
    message.error(res.message);
    return null;
  };

  useEffect(() => {
    const currentParams = UrlHelper.getSearchParamsObject();
    const { pageNumber, pageSize, ...restSearch } = currentParams;
    reset({ ...restSearch });
    if (!Number.isNaN(+currentParams?.pageSize) || !Number.isNaN(+currentParams?.pageNumber)) {
      onResetPagination({
        pageSize: +currentParams.pageSize,
        pageNumber: +currentParams.pageNumber,
      });
    }
  }, []);

  const fcQuery = useQuery({
    queryKey: [
      'fc',
      {
        ...(ObjectHelper.removeAllNullValue(getValues()) || {}),
        pageSize: pageSize?.toString() || 30,
        pageNumber: pageNumber?.toString() || 1,
      },
    ],
    queryFn: () => handleFetchFcData(getValues()),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: Boolean(pageNumber) && Boolean(pageSize),
  });
  const formatedSummaryData = (data) => {
    if (!data) return [];
    let res = {};
    for (let item of data) {
      switch (item.type) {
        case 'Type S':
          res = { ...res, s: item.qty };
          break;
        case 'Type K':
          res = { ...res, k: item.qty };
          break;
        case 'Type G':
          res = { ...res, g: item.qty };
          break;
        case 'Type V':
          res = { ...res, v: item.qty };
          break;
        case 'Type GI':
          res = { ...res, gi: item.qty };
          break;
        default:
          return;
      }
    }
    return [res];
  };
  const handleGetSymmaryByType = async () => {
    const res = await FcApi.getSummaryByType();
    if (res.status) {
      return formatedSummaryData(res.data?.summary);
    } else {
      message.error(res.message);
      return null;
    }
  };
  const summaryByTypeQuery = useQuery({
    queryHash: ['summaryByTypeQuery'],
    queryFn: handleGetSymmaryByType,
    staleTime: 60 * 1000 * 1,
    cacheTime: 60 * 1000 * 10,
  });
  useEffect(() => {
    setTotalFCData(fcQuery.data?.total);
  }, [fcQuery.data?.total]);

  useEffect(() => {
    scrollToTop();
    handleSetSearchParamsUrl({
      ...getValues(),
      pageSize: pageSize?.toString() || 30,
      pageNumber: pageNumber?.toString() || 1,
    });
  }, [getValues('taxCode'), getValues('companyRepresentativeName'), getValues('modelFranchise'), pageSize, pageNumber]);

  return (
    <FcMasterNav>
      <div id="fc-master-wrapper">
        <div className="section-block mt-15">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <form onSubmit={onSubmitHandler}>
                <Row gutter={[16, 0]}>
                  <Col span={24}>
                    <Row gutter={[16, 0]}>
                      <FieldList fields={fields} />
                    </Row>
                  </Col>
                </Row>
                <div className="flex items-end gap-10">
                  <BaseButton htmlType="submit" iconName="search">
                    Search
                  </BaseButton>
                  <BaseButton color="green" iconName="plus" onClick={() => history.push('/fc-master/create')}>
                    Create
                  </BaseButton>
                </div>
              </form>
            </Col>
            {/* <Col span={4}>
              <MainTable
                dataSource={summaryByTypeQuery.data}
                loading={summaryByTypeQuery.isLoading}
                columns={[
                  {
                    title: 'Type',
                    children: [
                      { title: 'S', dataIndex: 's', key: 's' },
                      { title: 'K', dataIndex: 'k', key: 'K' },
                      { title: 'G', dataIndex: 'g', key: 'G' },
                      { title: 'V', dataIndex: 'v', key: 'V' },
                      { title: 'GI', dataIndex: 'gi', key: 'GI' },
                    ],
                  },
                ]}
              />
            </Col> */}
          </Row>
        </div>
        <div className="table section-block mt-15">
          <MainTable
            scroll={{
              x: 1500,
              y: 'calc(100vh - 415px)',
            }}
            loading={fcQuery.isLoading}
            className="th-center"
            columns={TableFcMasterManagementData.columnsSearch()}
            dataSource={fcQuery?.data?.fcMasters}
            summary={(currentData) => {
              console.log({ currentData });
              return (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell className="bg-primary" index={0}>
                      Total: {totalFCData}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell className="bg-primary" index={1}></Table.Summary.Cell>
                    <Table.Summary.Cell index={2}></Table.Summary.Cell>
                    <Table.Summary.Cell index={3}></Table.Summary.Cell>
                    <Table.Summary.Cell index={5}></Table.Summary.Cell>
                    <Table.Summary.Cell index={6}></Table.Summary.Cell>
                    <Table.Summary.Cell index={7}></Table.Summary.Cell>
                    <Table.Summary.Cell index={8}></Table.Summary.Cell>
                    <Table.Summary.Cell index={9}></Table.Summary.Cell>
                    <Table.Summary.Cell index={10}></Table.Summary.Cell>
                    <Table.Summary.Cell index={11}></Table.Summary.Cell>
                    <Table.Summary.Cell index={12}></Table.Summary.Cell>
                    <Table.Summary.Cell index={13}></Table.Summary.Cell>
                    <Table.Summary.Cell index={14}></Table.Summary.Cell>
                    <Table.Summary.Cell index={15}></Table.Summary.Cell>
                    <Table.Summary.Cell index={16}></Table.Summary.Cell>
                    <Table.Summary.Cell index={17}></Table.Summary.Cell>
                    <Table.Summary.Cell index={18}></Table.Summary.Cell>
                    <Table.Summary.Cell index={19}></Table.Summary.Cell>
                    <Table.Summary.Cell index={20}></Table.Summary.Cell>
                    <Table.Summary.Cell index={21}></Table.Summary.Cell>
                    <Table.Summary.Cell index={22}></Table.Summary.Cell>
                    <Table.Summary.Cell index={23}></Table.Summary.Cell>
                    <Table.Summary.Cell index={24}></Table.Summary.Cell>
                    <Table.Summary.Cell index={25}></Table.Summary.Cell>
                    <Table.Summary.Cell index={26}></Table.Summary.Cell>
                    <Table.Summary.Cell index={27}></Table.Summary.Cell>
                    <Table.Summary.Cell index={28}></Table.Summary.Cell>
                    <Table.Summary.Cell index={29}></Table.Summary.Cell>
                    <Table.Summary.Cell index={30}></Table.Summary.Cell>
                    <Table.Summary.Cell index={31}></Table.Summary.Cell>
                    <Table.Summary.Cell index={32}></Table.Summary.Cell>
                    <Table.Summary.Cell index={33}></Table.Summary.Cell>
                    <Table.Summary.Cell className="bg-primary" index={34}></Table.Summary.Cell>
                    <Table.Summary.Cell className="bg-primary" index={35}></Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              );
            }}
          />
          <div className="w-full text-center paging">
            <Pagination showSizeChanger />
          </div>
        </div>
      </div>
    </FcMasterNav>
  );
};

export default FCMaster;
