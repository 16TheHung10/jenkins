export const SearchComponent = `
import { Col, Row, message } from 'antd';
import { FcApi } from 'api';
import MainTable from 'components/common/Table/UI/MainTable';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import FieldList from 'components/common/fieldList/FieldList';
import { scrollToTop } from 'components/mainContent/MainContent';
import TableAutoGenCompManagementData from '../data/tableDataComp';
import { ObjectHelper, UrlHelper } from 'helpers';
import { useFormFields, usePagination } from 'hooks';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import ComponentNav from '../nav';
import FieldsComponentData from 'data/render/form';

const FCMaster = () => {
  const history = useHistory();
  const [totalFCData, setTotalFCData] = useState(0);
  const { Pagination, pageSize, pageNumber, setValues: onResetPagination } = usePagination({ total: totalFCData });
  const {
    formInputsWithSpan: fields,
    onSubmitHandler,
    reset,
    getValues,
  } = useFormFields({
    fieldInputs: FieldsComponentData.fieldsSearch(),
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
      onResetPagination({ pageSize: +currentParams.pageSize, pageNumber: +currentParams.pageNumber });
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
    <ComponentNav>
      <div id="fc-master-wrapper">
        <div className="section-block mt-15">
          <form onSubmit={onSubmitHandler}>
            <Row gutter={[16, 0]}>
              <Col span={24}>
                <Row gutter={[16, 0]}>
                  <FieldList fields={fields} />
                </Row>
              </Col>
            </Row>
            <div className="flex items-center gap-10">
              <BaseButton htmlType="submit" iconName="search">
                Search
              </BaseButton>
              <BaseButton color="green" iconName="plus" onClick={() => history.push('/fc-master/create')}>
                Create
              </BaseButton>
            </div>
          </form>
        </div>
        <div className="table section-block mt-15 w-fit">
          <div className=" w-fit table-inner">
            <MainTable
              loading={fcQuery.isLoading}
              className="w-fit"
              columns={TableAutoGenCompManagementData.columns()}
              dataSource={fcQuery?.data?.fcMasters}
            />
            <div className="w-full text-center paging">
              <Pagination showSizeChanger />
            </div>
          </div>
        </div>
      </div>
    </ComponentNav>
  );
};

export default FCMaster;


`;

export const FieldSearchAndCreate = (fieldSearch, fieldDetails) => {
  return `
    import * as yup from 'yup';

const FieldsComponentData = {
  fieldsSearch: () => {
return     ${JSON.stringify(fieldSearch)}
    ;
  },
  fieldsInputsDetails: ({ isEdit }) => {
    const fields = 
        ${JSON.stringify(fieldDetails)}
    ;

    return fields;
  },
};
export default FieldsComponentData;

`;
};
export const CreateComponent = `
import FcMasterDetailsComp from '../details';
import React, { useEffect } from 'react';
import { FcApi } from 'api';
import ComponentNav from '../nav';
import { useMutation, useQueryClient } from 'react-query';
import { StringHelper } from 'helpers';
import { message } from 'antd';
const FcMasterCreate = () => {
  const getLatestSearchParamsOfFCManagementPage = () => {
    const url = new URL('http://localhost:3000/fc-master?pageSize=30&pageNumber=1');
    const searchObject = StringHelper.convertSearchParamsToObject(url.search);
    return searchObject;
  };
  const queryClient = useQueryClient();

  const handleCreate = async (value) => {
    const res = await FcApi.createFC(value);
    if (res.status) {
      return value;
    } else {
      throw new Error(res.message);
    }
  };
  const muation = useMutation(handleCreate, {
    onSuccess: (data, context) => {
      message.success('Create FC successfully');
      const currentData = queryClient.getQueryData(['fc', { ...getLatestSearchParamsOfFCManagementPage() }]);
      if (currentData) {
        queryClient.setQueryData(['fc', { ...getLatestSearchParamsOfFCManagementPage() }], {
          ...currentData,
          fcMasters: [data, ...currentData.fcMasters],
        });
      }
    },
    onError: (error) => {
      message.error(error.message);
    },
  });
  return (
    <ComponentNav>
      <FcMasterDetailsComp onSubmit={muation.mutate} />
    </ComponentNav>
  );
};

export default FcMasterCreate;

`;
export const UpdateComponent = `
import React, { useState } from 'react';
import FcMasterDetailsComp from '../details';
import { useParams } from 'react-router-dom';
import { FcApi } from 'api';
import { message } from 'antd';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import SuspenLoading from 'components/common/loading/SuspenLoading';
import ComponentNav from '../nav';
import { StringHelper } from 'helpers';
import { useAppContext } from 'contexts';
const FcMasterDetails = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  const { state: AppState } = useAppContext();
  const getLatestSearchParamsOfFCManagementPage = () => {
    const latesttUrl = AppState.menuObject['/fc-master']?.url;
    const urlInstance = "https://portal.gs25.com.vn/" + latesttUrl;
    const url = new URL(urlInstance);
    const searchObject = StringHelper.convertSearchParamsToObject(url.search);
    return searchObject;
  };

  const handleGetFcDetails = async () => {
    const res = await FcApi.getFCDetails(params.id);
    if (res.status) {
      return res.data.fcMaster;
    } else {
      message.error(res.message);
      return null;
    }
  };

  
  const fcDetailsQuery = useQuery({
    queryKey: ['fcDetails', params.id],
    queryFn: handleGetFcDetails,
    enabled: Boolean(params.id),
  });

  const handleUpdate = async (value) => {
    const res = await FcApi.updateFCDetails(params.id, value);
    if (res.status) {
      return value;
    } else {
      throw new Error(res.message);
    }
  };




  const muation = useMutation(handleUpdate, {
    onSuccess: (data, context) => {
      message.success('Update FC successfully');
      const currentData = queryClient.getQueryData(['fc', { ...getLatestSearchParamsOfFCManagementPage() }]);
      console.log({ currentData });
      if (currentData.fcMasters) {
        const clone = JSON.parse(JSON.stringify(currentData.fcMasters));
        const editedFCIndex = clone.findIndex((el) => el.taxCode.toString() === params.id.toString());
        clone[editedFCIndex] = data;
        queryClient.setQueryData(['fc', { ...getLatestSearchParamsOfFCManagementPage() }], { ...currentData, fcMasters: [...clone] });
        queryClient.setQueryData(['fcDetails', params.id], data);
      }
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  if (fcDetailsQuery.isLoading) return <SuspenLoading />;
  return (
    <ComponentNav isDetails taxCode={params.id}>
      <FcMasterDetailsComp initialValue={fcDetailsQuery.data} onSubmit={muation.mutate} />
    </ComponentNav>
  );
};

export default FcMasterDetails;

`;
export const DetailsComponent = `import { Col, Row } from 'antd';
import SubmitBottomButton from 'components/common/buttons/submitBottomButton/SubmitBottomButton';
import FieldList from 'components/common/fieldList/FieldList';
import { FieldsComponentData } from 'data/render/form';
import { useFormFields } from 'hooks';
import React, { useEffect } from 'react';
import moment from 'moment';

const FcMasterDetailsComp = ({ initialValue, onSubmit }) => {
  const handleSubmit = (value) => {
    const clone = { ...value, companyRepresentativeBirthday: moment(value.companyRepresentativeBirthday).format('YYYY-MM-DD') };
    onSubmit(clone);
  };
  const {
    formInputsWithSpan: fields,
    onSubmitHandler,
    reset,
    getValues,
    setValue,
  } = useFormFields({
    fieldInputs: FieldsComponentData.fieldsInputsDetails({ isEdit: Boolean(initialValue) }),
    onSubmit: handleSubmit,
  });
  useEffect(() => {
    if (initialValue) {
      reset({ ...initialValue, companyRepresentativeBirthday: moment(initialValue.companyRepresentativeBirthday) });
    }
  }, [initialValue]);

  return (
    <div id="fc_master" className="section-block mt-15">
      <form onSubmit={onSubmitHandler}>
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Row gutter={[16, 0]}>
              <FieldList fields={fields} />
            </Row>
          </Col>
        </Row>
        <SubmitBottomButton title={initialValue ? 'Update' : 'Create'} />
      </form>
    </div>
  );
};

export default FcMasterDetailsComp;


`;
export const NavComp = `
import PageWithNav from 'components/layouts/pageWithNav/PageWithNav';
import { ComponentNavData } from 'data/layouts/nav';
import React, { useMemo } from 'react';

const ComponentNav = ({ children, isDetails, taxCode }) => {
  const actionLeft = useMemo(() => {
    return ComponentNavData.actiionLeft(isDetails, taxCode);
  }, []);
  return (
    <PageWithNav className="relative" actionLeft={actionLeft}>
      {children}
    </PageWithNav>
  );
};

export default ComponentNav;

`;
