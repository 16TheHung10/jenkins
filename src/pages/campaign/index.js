import { Empty, Tabs, message } from 'antd';
import MainTable from 'components/common/Table/UI/MainTable';
import { useAppContext } from 'contexts';
import FormField from 'data/oldVersion/formFieldRender';
import { TableCampaignManagementData } from 'data/render/table';
import { ObjectHelper } from 'helpers';
import { useFormFields } from 'hooks';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import CampaignApi from '../../api/CampaignApi';
import CampaignFields from '../../components/mainContent/campaign/Fields/CampaignFields';
import UrlHelper from '../../helpers/UrlHelper';
import CampaignNav from './nav/CampaignNav';

const Campaign = () => {
  const { state: AppState, onGetPaymentMethods } = useAppContext();
  const [activeKey, setActiveKey] = useState('5');

  useEffect(() => {
    onGetPaymentMethods();
  }, []);
  const handleSubmit = async (value) => {
    const payload = {
      campaignCode: value.campaignCode,
      startDate: value.date?.[0]
        ? moment(value.date?.[0]).format('YYYY-MM-DD')
        : null,
      endDate: value.date?.[1]
        ? moment(value.date?.[1]).format('YYYY-MM-DD')
        : null,
    };
    const res = await CampaignApi.getCampaigns(payload);

    if (res.status) {
      return res.data.campaigns;
    } else {
      message.error(res.message);
      return null;
    }
  };

  const {
    formInputsWithSpan: formInputs,
    onSubmitHandler,
    getValues,
    reset,
  } = useFormFields({
    fieldInputs: FormField.CampaignOverview.fieldInputs(),
    onSubmit: (value) => {
      const payload = {
        campaignCode: value.campaignCode,
        startDate: value.date?.[0]
          ? moment(value.date?.[0]).format('YYYY-MM-DD')
          : null,
        endDate: value.date?.[1]
          ? moment(value.date?.[1]).format('YYYY-MM-DD')
          : null,
      };
      UrlHelper.setSearchParamsFromObject(payload);
    },
  });
  const { data, isLoading } = useQuery({
    queryKey: ['campaign', ObjectHelper.removeAllNullValue(getValues())],
    queryFn: () => handleSubmit(getValues()),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    // enabled: Boolean(getValues('date')),
  });

  const items = [
    // {
    //   key: '1',
    //   label: 'Mua bill được Voucher',
    //   children: (
    //       <div className="w-fit" style={{ padding: 0, maxHeight: 'calc(100vh - 300px)' }}>
    //         <MainTable
    //           loading={loading}
    //           className="w-fit"
    //           columns={TableCampaignManagementData.columns({ paymentmethods: AppState.paymentmethods })}
    //           dataSource={data?.filter((el) => el.campaignCode.startsWith('BV'))?.reverse()}
    //         />
    //       </div>
    //   ),
    // },
    // {
    //   key: '2',
    //   label: 'Game quay số trên app',
    //   children: (
    //       <div className="w-fit" style={{ padding: 0, maxHeight: 'calc(100vh - 300px)' }}>
    //         <MainTable
    //           loading={loading}
    //           className="w-fit"
    //           columns={TableCampaignManagementData.columns({ paymentmethods: AppState.paymentmethods })}
    //           dataSource={data?.filter((el) => el.campaignCode.startsWith('GA'))?.reverse()}
    //         />
    //       </div>
    //   ),
    // },
    {
      key: '3',
      label: 'Mua bill nhận mã dự thưởng',
      children: (
        <div
          className="w-fit"
          style={{ padding: 0, maxHeight: 'calc(100vh - 300px)' }}
        >
          <MainTable
            loading={isLoading}
            className="w-fit"
            locale={{
              emptyText: (
                <Empty description={false}>
                  <div className="flex items-center justify-content-center gap-10">
                    No data{' '}
                    <Link to="/campaigns/create?type=3">Create new one</Link>
                  </div>
                </Empty>
              ),
            }}
            columns={TableCampaignManagementData.columns({
              paymentmethods: AppState.paymentmethods,
              excluesField: ['appliedTotalBill'],
            })}
            dataSource={data
              ?.filter((el) => el.campaignCode.startsWith('BL'))
              ?.reverse()}
          />
        </div>
      ),
    },
    {
      key: '4',
      label: 'Claim quà (POS)',
      children: (
        <div
          className="w-fit"
          style={{ padding: 0, maxHeight: 'calc(100vh - 300px)' }}
        >
          <MainTable
            loading={isLoading}
            className="w-fit"
            locale={{
              emptyText: (
                <Empty description={false}>
                  <div className="flex items-center justify-content-center gap-10">
                    No data{' '}
                    <Link to="/campaigns/create?type=4">Create new one</Link>
                  </div>
                </Empty>
              ),
            }}
            columns={TableCampaignManagementData.columns({
              paymentmethods: AppState.paymentmethods,
              excluesField: ['minValueValid', 'appliedTotalBill'],
            })}
            dataSource={data
              ?.filter((el) => el.campaignCode.startsWith('CL'))
              ?.reverse()}
          />
        </div>
      ),
    },
    {
      key: '5',
      label: 'Scan QR',
      children: (
        <div
          className="w-fit"
          style={{ padding: 0, maxHeight: 'calc(100vh - 300px)' }}
        >
          <MainTable
            loading={isLoading}
            className="w-fit"
            locale={{
              emptyText: (
                <Empty description={false}>
                  <div className="flex items-center justify-content-center gap-10">
                    No data{' '}
                    <Link to="/campaigns/create?type=5">Create new one</Link>
                  </div>
                </Empty>
              ),
            }}
            columns={TableCampaignManagementData.columns({
              paymentmethods: AppState.paymentmethods,
              excluesField: ['minValueValid', 'appliedTotalBill'],
            })}
            dataSource={data
              ?.filter((el) => el.campaignCode.startsWith('QR'))
              ?.reverse()}
          />
        </div>
      ),
    },
  ];
  const handleChangeTab = (selectedTab) => {
    setActiveKey(selectedTab);
    const currentUrlParams = UrlHelper.getSearchParamsObject();
    UrlHelper.setSearchParamsFromObject({ ...currentUrlParams, selectedTab });
  };
  useEffect(() => {
    const currentUrlParams = UrlHelper.getSearchParamsObject();
    setActiveKey(currentUrlParams.selectedTab || '3');
    if (currentUrlParams) {
      const { campaignCode, startDate, endDate } = currentUrlParams;
      reset({
        campaignCode,
        date:
          startDate && endDate ? [moment(startDate), moment(startDate)] : null,
      });
    }
  }, []);
  return (
    <CampaignNav>
      {/* <QRCode value="hey" /> */}
      <CampaignFields onSubmit={onSubmitHandler} fields={formInputs} />
      <div className="section-block mt-15">
        <Tabs
          onChange={(value) => {
            handleChangeTab(value);
          }}
          activeKey={activeKey}
          items={items}
        />
      </div>
    </CampaignNav>
  );
};

export default Campaign;

