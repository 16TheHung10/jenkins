import { Col, Popconfirm, Row, Select, Table, message } from 'antd';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import FieldList from 'components/common/fieldList/FieldList';
import SectionWithTitle from 'components/common/section/SectionWithTitle';
import { useAppContext, useCampaignContext } from 'contexts';
import { FieldsCampaignData } from 'data/render/form';
import { useFormFields } from 'hooks';
import Icons from 'images/icons';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import AwardItem from '../AwardItem';
import ExportQR from '../ExportQR';

const StepTwoCampaignType = ({ formProps, stores, current, campaignOptions, setItemSearch }) => {
  const params = useParams();
  const { state: AppState } = useAppContext();
  const { onSetAwardItems, onSetItemValid, onSetSelectedStoreQR, onToggleModalQR, state: campaignState } = useCampaignContext();
  const { storeOptions, itemOptions } = campaignOptions;
  const { formInputsWithSpan, getValues } = formProps;
  const [fields, setFields] = useState(null);
  const [qrStores, setQrStores] = useState([]);
  useEffect(() => {
    setQrStores(stores);
  }, [stores]);
  const campaignType = useMemo(() => {
    return getValues('campaignType');
  }, [getValues('campaignType')]);

  const handleAddAwardItem = async (value) => {
    onSetAwardItems([value, ...campaignState.awardItems]);
  };
  const handleUpdateAwardItemsAfterDeleteLocal = (data) => {
    let clone = campaignState?.awardItems ? JSON.parse(JSON.stringify(campaignState?.awardItems)) : [];
    let res = clone.filter((el) => el.itemCode !== data.itemCode);
    onSetAwardItems(res);
  };
  const campaignTypeFormProps = useFormFields({
    fieldInputs: fields,
    onSubmit: async (value) => {
      switch (campaignType) {
        case 2:
          value = { ...value, itemName: AppState.items?.[value.itemCode]?.itemName };

          if (campaignState.awardItems?.findIndex((el) => el.itemCode === value.itemCode) !== -1) {
            throw new Error('Item already exists');
          }
          if (campaignState.awardItems?.findIndex((el) => el.awardIndex === value.awardIndex) !== -1) {
            throw new Error('Award index already exists');
          }
          handleAddAwardItem({
            ...value,
          });
          break;
        case 5:
          value = { ...value, itemName: AppState.items?.[value.itemCode]?.itemName };
          console.log({ value: AppState.items });
          handleAddAwardItem({
            ...value,

            qty: 1,
          });
          break;
        case 4:
          const cloneItemValid = campaignState.itemValid ? JSON.parse(JSON.stringify([...campaignState.itemValid])) : [];
          cloneItemValid.push(value);
          onSetItemValid(cloneItemValid);
          campaignTypeFormProps.reset(null);
          break;
        default:
          break;
      }
    },
  });
  const handleToggleModalQR = (storeCode) => {
    onSetSelectedStoreQR(storeCode);
    onToggleModalQR();
  };

  useEffect(() => {
    switch (+campaignType) {
      case 2:
        setFields(
          FieldsCampaignData.fieldsCreateAward({
            storeOptions,
            current,
            campaignType,
            itemOptions,
            setItemSearch,
          })
        );
        break;
      case 5:
        setFields(
          FieldsCampaignData.fieldsCreateAward({
            storeOptions,
            current,
            campaignType,
            itemOptions,
            setItemSearch,
          })
        );
        break;
      case 4:
        setFields(
          FieldsCampaignData.fieldsTransferItem({
            storeOptions,
            current,
            campaignType,
            itemOptions,
            setItemSearch,
          })
        );
        break;
      default:
        setFields(null);
        break;
    }
  }, [campaignType, storeOptions, current, campaignType, itemOptions]);

  const onDeleteConfitionItem = (value) => {
    const clone = JSON.parse(JSON.stringify(campaignState.itemValid));
    clone.splice(value.index, 1);
    onSetItemValid(clone);
  };

  return (
    <>
      <div className="section-block mt-10">
        <Row gutter={[16, 0]} className="items-center">
          <FieldList fields={formInputsWithSpan} />
        </Row>
      </div>

      {/* QR details */}
      {params.id && campaignType === 5 && (
        <div className="section-block mt-15">
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Select
                placeholder="--Filter store--"
                className="w-full mt-10"
                options={stores?.map((item) => ({ value: item, label: item }))}
                allowClear
                showSearch
                filterOption={(input, option) => {
                  return (option?.label?.toString().toLowerCase() ?? '').includes(input.toString().trim().toLowerCase());
                }}
                onChange={(value) => {
                  setQrStores(stores.filter((store) => store.includes(value || '')));
                }}
              />
            </Col>
            <Col span={6} style={{ alignSelf: 'end' }}>
              <ExportQR />
            </Col>
          </Row>
          <div className=" mt-15 flex gap-10 wrap">
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
      )}

      {[2, 4, 5].includes(campaignType) && fields && (
        <div className="section-block mt-15">
          <SectionWithTitle title="">
            {[2, 5].includes(campaignType) ? (
              <>
                {((campaignType === 5 && (campaignState.awardItems?.length || 0) < 1) || campaignType === 2) && (
                  <Row gutter={[16, 0]}>
                    <FieldList fields={campaignTypeFormProps.formInputsWithSpan} />
                    <Col span={6} style={{ alignSelf: 'center' }}>
                      <BaseButton
                        color="green"
                        iconName="send"
                        onClick={async () => {
                          try {
                            await campaignTypeFormProps.onSubmitHandler();
                            campaignTypeFormProps.reset();
                          } catch (err) {
                            console.log({ err });
                            message.error(err.message);
                          }
                        }}
                      >
                        Add
                      </BaseButton>
                    </Col>
                  </Row>
                )}
                <Row gutter={[16, 0]} className="mt-10">
                  <Col span={24}>
                    <AwardItem initialData={campaignState.awardItems} onDelete={handleUpdateAwardItemsAfterDeleteLocal} campaignType={campaignType} />
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Row gutter={[16, 16]} style={{ alignItems: 'center' }}>
                  <FieldList fields={campaignTypeFormProps?.formInputsWithSpan.slice(0, 1)} />
                  <Col span={1} style={{ alignSelf: 'center', textAlign: 'center' }}>
                    <Icons.Plus size={23} />
                  </Col>
                  <FieldList fields={campaignTypeFormProps?.formInputsWithSpan.slice(1, 2)} />
                  <Col span={1} style={{ alignSelf: 'center', textAlign: 'center' }}>
                    <Icons.ArrowLeft size={23} style={{ rotate: '180deg' }} />
                  </Col>
                  <FieldList fields={campaignTypeFormProps?.formInputsWithSpan.slice(2, 3)} />
                  <Col span={4} style={{ alignSelf: 'center' }}>
                    <BaseButton iconName="plus" onClick={campaignTypeFormProps?.onSubmitHandler}>
                      Add gift
                    </BaseButton>
                  </Col>
                </Row>
                <Row>
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
                      {
                        title: 'Actions',
                        dataIndex: 'actions',
                        key: 'actions',
                        render: (value, record, index) => {
                          return (
                            <div className="flex gap-10">
                              {/* <BaseButton iconName="edit" color="green" onClick={() => onClickUpdate({ ...record, index })} /> */}
                              <Popconfirm onConfirm={() => onDeleteConfitionItem({ ...record, index })}>
                                <BaseButton iconName="delete" color="error" />
                              </Popconfirm>
                            </div>
                          );
                        },
                      },
                    ]}
                  />
                </Row>
              </>
            )}
          </SectionWithTitle>
        </div>
      )}
    </>
  );
};

export default StepTwoCampaignType;
