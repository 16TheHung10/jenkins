import { Col, Row, Select, Table, Tag } from 'antd';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import SectionWithTitle from 'components/common/section/SectionWithTitle';
import Image from 'components/common/Image/Image';
import { useAppContext, useCampaignContext } from 'contexts';
import moment from 'moment';
import React, { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CampaignTypeValue } from '../../../../data/render/campaign/table/TableCampaignManagementData';
import AwardItem from '../AwardItem';
import ExportQR from '../ExportQR';
import './stepFour.style.scss';
import StringHelper from '../../../../helpers/StringHelper';

const dayOfWeekObject = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  0: 'Sunday',
};
const StepFourConfirm = ({ campaignType, stores, imageProps }) => {
  const [qrStores, setQrStores] = useState([]);

  useEffect(() => {
    setQrStores(stores);
  }, [stores]);
  const { onSetSelectedStoreQR, onToggleModalQR, state: campaignState } = useCampaignContext();
  const { state: AppState } = useAppContext();
  const params = useParams();

  const handleToggleModalQR = (storeCode) => {
    onSetSelectedStoreQR(storeCode);
    onToggleModalQR();
  };

  return (
    <div id="step_four_wrapper">
      <h3>Preview</h3>
      <div className="mt-15">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Row gutter={[16, 16]} className="">
              <Col span={6}>
                <div className="fields-block">
                  <p className="m-0 fields-block-title">Campaign type: </p>
                  <p className="m-0 fields-block-value">{CampaignTypeValue[campaignState.campaignData?.campaignType]}</p>
                </div>
              </Col>
              <Col span={6}>
                <div className="fields-block">
                  <p className="m-0 fields-block-title">Campaign code: </p>
                  <p className="m-0 fields-block-value">{campaignState.campaignData?.campaignCode}</p>
                </div>
              </Col>
              <Col span={6}>
                <div className="fields-block">
                  <p className="m-0 fields-block-title">Campaign name: </p>
                  <p className="m-0 fields-block-value">{campaignState.campaignData?.campaignName}</p>
                </div>
              </Col>
              <Col span={6}>
                <div className="fields-block">
                  <p className="m-0 fields-block-title">Campaign title: </p>
                  <p className="m-0 fields-block-value">{campaignState.campaignData?.campaignTitle}</p>
                </div>
              </Col>
              {![5].includes(campaignType) && (
                <Col span={6}>
                  <div className="fields-block">
                    <p className="m-0 fields-block-title">Bill amount : </p>
                    <p className="m-0 fields-block-value">{campaignState.campaignData?.minValueValid}</p>
                  </div>
                </Col>
              )}

              {/* Time */}
              <Col span={6}>
                <div className="fields-block">
                  <p className="m-0 fields-block-title">Applied date: </p>
                  <p className="m-0 fields-block-value">
                    From {moment(campaignState.campaignData?.date?.[0]).format('DD/MM/YYYY')} to {moment(campaignState.campaignData?.date?.[1]).format('DD/MM/YYYY')}
                  </p>
                </div>
              </Col>

              {+campaignState.campaignData?.campaignType === 5 && (
                <Col span={6}>
                  <div className="fields-block">
                    <p className="m-0 fields-block-title">Start hours: </p>
                    <p className="m-0 fields-block-value">{moment(campaignState.campaignData?.timeFrameQR?.[0]).format('HH:mm')}</p>
                  </div>
                </Col>
              )}
              {+campaignState.campaignData?.campaignType === 5 && (
                <Col span={6}>
                  <div className="fields-block">
                    <p className="m-0 fields-block-title">End hour: </p>
                    <p className="m-0 fields-block-value">{moment(campaignState.campaignData?.timeFrameQR?.[1])?.format('HH:mm')}</p>
                  </div>
                </Col>
              )}
              {campaignState.campaignData?.dayOfWeek && campaignState.campaignData?.dayOfWeek.length > 0 && (
                <Col span={12}>
                  <div className="fields-block">
                    <p className="m-0 fields-block-title">Applied day of week: </p>
                    <div className="m-0 fields-block-value flex gap-10 wrap">
                      {campaignState.campaignData?.dayOfWeek?.map((item) => {
                        return <p className="m-0">{dayOfWeekObject[item]}</p>;
                      })}
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </Col>
          {imageProps.listImageUploaded && imageProps.listImageUploaded?.length > 0 && (
            <Col span={24}>
              <SectionWithTitle title="Campaign image">
                {imageProps.listImageUploaded?.map((image, index) => {
                  return <Image style={{ height: '100px' }} src={image.url.includes('gs25') ? image.url + `?random=${Date.now()}` : image.url} alt={image.url} key={image.url} />;
                })}
              </SectionWithTitle>
            </Col>
          )}

          {campaignState.campaignData?.storeValid?.length > 0 && (
            <Col span={24}>
              <SectionWithTitle title="Applied store">
                <div className="flex gap-10 wrap" style={{ maxHeight: '400px', overflow: 'auto' }}>
                  {campaignState.campaignData?.storeValid?.map((item) => {
                    return (
                      <Tag color="green" key={item}>
                        {item}
                      </Tag>
                    );
                  })}
                </div>
              </SectionWithTitle>
            </Col>
          )}

          {campaignState.campaignData?.items && campaignState.campaignData?.items?.length > 0 && (
            <Col span={24}>
              <SectionWithTitle title={`Items valid (Max qty: ${StringHelper.formatPrice(campaignState.campaignData.maxQty)})`}>
                <div className="flex gap-10 wrap" style={{ maxHeight: '300px', overflow: 'auto' }}>
                  {campaignState.campaignData?.items?.map((item) => {
                    return (
                      <div
                        key={item}
                        className=""
                        style={{
                          border: '1px solid #e4e4e4',
                          borderRadius: '10px',
                          padding: 5,
                        }}
                      >
                        <p className="m-0">{AppState.items?.[item]?.itemName}</p>
                        <span className="hint">{item}</span>
                      </div>
                    );
                  })}
                </div>
              </SectionWithTitle>
            </Col>
          )}

          {campaignState.itemValid?.length > 0 && (
            <Col span={24}>
              <SectionWithTitle title={`Items transfer`}>
                <Table
                  className="w-full mt-10"
                  dataSource={campaignState.itemValid || []}
                  pagination={false}
                  columns={[
                    {
                      title: 'Condition Item A',
                      dataIndex: 'itemsCodeA',
                      key: 'itemsCodeA',
                      render: (value, record) => {
                        return value ? (
                          <div>
                            <p className="m-0">{AppState.items?.[value]?.itemName}</p>
                            <span className="hint">{value}</span>
                          </div>
                        ) : (
                          '-'
                        );
                      },
                    },
                    {
                      title: 'Condition Item B',
                      dataIndex: 'itemsCodeB',
                      key: 'itemsCodeB',
                      render: (value, record) => {
                        return value ? (
                          <div>
                            <p className="m-0">{AppState.items?.[value]?.itemName}</p>
                            <span className="hint">{value}</span>
                          </div>
                        ) : (
                          '-'
                        );
                      },
                    },
                    {
                      title: 'Claim Item',
                      dataIndex: 'itemsCodeC',
                      key: 'itemsCodeC',
                      render: (value, record) => {
                        return value ? (
                          <div>
                            <p className="m-0">{AppState.items?.[value]?.itemName}</p>
                            <span className="hint">{value}</span>
                          </div>
                        ) : (
                          '-'
                        );
                      },
                    },
                  ]}
                />
              </SectionWithTitle>
            </Col>
          )}

          {campaignState.awardItems?.length > 0 && (
            <Col span={20}>
              <SectionWithTitle title="Award items">
                <AwardItem initialData={campaignState.awardItems} campaignType={campaignType} />
              </SectionWithTitle>
            </Col>
          )}

          {campaignState.billConditionPayments?.length > 0 && (
            <Col span={4}>
              <SectionWithTitle title="Payments">
                <Table
                  pagination={false}
                  className="w-fit"
                  dataSource={campaignState.billConditionPayments?.map((item) => ({
                    code: Object.keys(item)[0],
                    value: Object.values(item)[0],
                  }))}
                  columns={[
                    {
                      title: 'Payment code',
                      dataIndex: 'code',
                      key: 'code',
                      render: (value, record) => {
                        return value ? AppState.paymentmethods?.[value]?.methodName : '-';
                      },
                    },
                    {
                      title: 'Value',
                      dataIndex: 'value',
                      key: 'maxQtyvalue',
                    },
                  ]}
                />
              </SectionWithTitle>
            </Col>
          )}

          {params.id && campaignType === 5 && (
            <Col span={24}>
              <SectionWithTitle title="Store's QR">
                <div className="section-block w-full" style={{ maxHeight: '500px', overflow: 'auto' }}>
                  <Row gutter={[16, 16]}>
                    <Col span={6}>
                      <Select
                        placeholder="--Filter store--"
                        className="w-full mt-10"
                        options={stores?.map((item) => ({
                          value: item,
                          label: item,
                        }))}
                        allowClear
                        showSearch
                        filterOption={(input, option) => {
                          return (option?.label?.toString().toLowerCase() ?? '').includes(input.toString().trim().toLowerCase());
                        }}
                      />
                    </Col>
                    <Col span={6} style={{ alignSelf: 'end' }}>
                      <ExportQR />
                    </Col>
                  </Row>
                  <div className=" mt-15 flex gap-10 w-full wrap">
                    {qrStores?.map((item) => {
                      return (
                        <div
                          className="flex items-center gap-10"
                          style={{
                            padding: '10px',
                            border: '1px solid #eeebeb',
                            borderRadius: '10px',
                          }}
                          key={item}
                        >
                          <strong>{item} </strong>
                          <BaseButton iconName="qr" color="green" onClick={() => handleToggleModalQR(item)}></BaseButton>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </SectionWithTitle>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
};

export default memo(StepFourConfirm);
