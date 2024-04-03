import { Button, Col, Form, Input, Modal, Row, Select, Switch, message } from 'antd';
import BackAction from 'components/common/backAction/BackAction';
import { actionCreator, useAppContext, useGoldenTimeContext } from 'contexts';
import { StringHelper } from 'helpers';
import { useHeaderActions, usePageActions } from 'hooks';
import PromotionModel from 'models/PromotionModel';
import UploadMediaModel from 'models/UploadMediaModel';
import moment from 'moment';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import PrimeTimeCreateForm from './PrimeTimeCreateForm';
import PrimeTimeCreateTableForm from './PrimeTimeCreateTableForm';
import PrimeTimeCreateTabItems from './TabItems/PrimeTimeCreateTabItems';
const ActionHeader = ({ onSave, StatusComp, selectedPromotionType }) => {
  const handleSave = () => {
    if (!selectedPromotionType) {
      message.error('Please select promotion type before saving');
      return;
    }
    onSave();
  };
  const handleUpdateStatus = () => {};
  const Action = usePageActions(
    [
      {
        name: 'Save',
        actionType: 'info',
        action: handleSave,
      },
      {
        name: <StatusComp />,
        actionType: 'info',
        action: handleUpdateStatus,
      },
    ],
    []
  );
  return <Action />;
};

const PrimeTimeCreateMain = ({ detailData }) => {
  // HOOKS
  const [isPopupNoteOpen, setIsPopupNoteOpen] = useState(false);
  const formFields = useHeaderActions();
  const [statePrimeTime, dispatchPrimeTime] = useGoldenTimeContext();
  const { state, onGetStoreData } = useAppContext();
  useEffect(() => {
    onGetStoreData();
  }, []);
  const history = useHistory();
  const params = useParams();
  // END HOOKS
  const handleUploadImage = async (dataTable, promotionCode) => {
    const imageModel = new UploadMediaModel();
    // Upload Image
    await Promise.all(
      dataTable?.map(async (item) => {
        const payload = {
          promotionCode,
          itemCode: item.itemCode,
          image: item.image?.url ? StringHelper.base64Smooth(item.image?.url) : '',
        };

        if (!item.image?.isFromServer && item.image?.url) {
          const resImage = await imageModel.uploadPromotionImage(payload);
          if (!resImage.status) {
            throw new Error('Upload image failed at ' + item.itemCode);
          }
        }
      })
    );
  };
  // STATE
  const [selectedPromotionType, setSelectedPromotionType] = useState(
    params.id ? (params.id?.toString().startsWith('BG') ? '2' : '1') : null
  );
  const [isActive, setIsActive] = useState(detailData?.active === 0 ? false : true);
  // END STATE

  // FUNCTION
  const disableEdit = detailData ? moment(detailData?.fromDate)?.isBefore(moment()) : false;

  const handleSave = async () => {
    try {
      if (disableEdit) {
        message.error('Không thể edit khuyến mãi đang chạy hoặc đã hết hạn');
        return;
      }
      const { fieldsState } = formFields;
      if (formFields?.isValidField(['promotionName', 'startDate', 'endDate', 'goldenDays', 'docCode'])) {
        const model = new PromotionModel();
        let payload = {
          ...fieldsState,
          Type: 1,
          status: 1,
          startDate: moment(fieldsState?.startDate).format('YYYY-MM-DD'),
          endDate: moment(fieldsState?.endDate).format('YYYY-MM-DD'),
          storeCode: fieldsState.storeCode?.length > 0 ? fieldsState.storeCode : Object.keys(state.stores || {}),
          goldenDays: fieldsState?.goldenDays ? fieldsState?.goldenDays.join(',') : '0,1,2,3,4,5,6',
          goldenHours:
            fieldsState?.timePicker &&
            fieldsState?.timePicker?.length > 0 &&
            fieldsState?.timePicker.filter((el) => el.startTime !== null && el.endTime !== null)?.length > 0
              ? fieldsState?.timePicker
                  .filter((el) => el.startTime !== null)
                  ?.map((item) => {
                    return `${item.startTime}-${item.endTime}`;
                  })
                  ?.join(',')
              : '0:00-11:59,12:00-17:59,18:00-23:59',
        };

        if (selectedPromotionType === '2') {
          if (!statePrimeTime?.freeTableData || statePrimeTime?.freeTableData?.length === 0) {
            message.error('Please add item to promotion');
            return;
          }
          const tableData = (statePrimeTime?.freeTableData || [])?.map((item) => {
            return {
              ...item,
              type: '1',
            };
          });
          payload = {
            ...payload,
            promotionDetails: [...(statePrimeTime?.freeTableData || []), ...tableData],
          };
          if (detailData) {
            // Edit Free Table
            const res = await model.updatePrimeTimeBuyGiftPromotion(payload, params.id);
            if (res.status) {
              // Upload Image
              await handleUploadImage(statePrimeTime?.freeTableData, res.data.promotionCode);
              message.success('Update free gift promotion successfully !!!');
            } else {
              message.error(res.message);
            }
          } else {
            // Create Free Table
            const res = await model.createPrimeTimeBuyGiftPromotion(payload);
            if (res.status) {
              await handleUploadImage(statePrimeTime?.freeTableData, res.data.promotionCode);
              message.success('Create free gift promotion successfully !!!');
              history.replace('/promotion-prime-time');
            } else {
              message.error(res.message);
            }
          }
        } else {
          if (!statePrimeTime?.discountTableData || statePrimeTime?.discountTableData?.length === 0) {
            message.error('Please add item to promotion');
            return;
          }
          payload = {
            ...payload,
            promotionDetails: [...(statePrimeTime?.discountTableData || [])],
          };

          if (detailData) {
            // Edit Discount Table
            const res = await model.updatePrimeTimeDiscountGiftPromotion(payload, params.id);
            if (res.status) {
              await handleUploadImage(statePrimeTime?.discountTableData, res.data.promotionCode);
              message.success('Update discount gift promotion successfully !!!');
            } else {
              message.error(res.message);
            }
          } else {
            // Create Discount Table
            const res = await model.createPrimeTimeDiscountGiftPromotion(payload);
            if (res.status) {
              await handleUploadImage(statePrimeTime?.discountTableData, res.data.promotionCode);
              message.success('Create discount gift promotion successfully !!!');
              history.replace('/promotion-prime-time' + (statePrimeTime?.currentSearchParams || '/'));
            } else {
              message.error(res.message);
            }
          }
        }
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  // END FUNCTION

  const timePicker = useCallback(
    (detailData) => {
      const goldenHours = detailData?.goldenHours;
      if (goldenHours) {
        if (
          goldenHours.split('-')?.length === 2 &&
          goldenHours.split('-')[0] === '0:00' &&
          goldenHours.split('-')[1] === '23:59'
        ) {
          return [
            {
              index: '0',
              startTime: '0:00',
              endTime: '11:59',
            },
            {
              index: '1',
              startTime: '12:00',
              endTime: '17:59',
            },
            {
              index: '2',
              startTime: '18:00',
              endTime: '23:59',
            },
          ];
        } else {
          return goldenHours?.split(',')?.map((item, index) => ({
            index: item.split('-')?.[1].split(':')[0] <= 12 ? 0 : item.split('-')?.[1].split(':')[0] <= 18 ? 1 : 2,
            startTime: item.split('-')?.[0],
            endTime: item.split('-')?.[1],
          }));
        }
      }
      return [];
    },
    [detailData]
  );

  useEffect(() => {
    let detailDataClone = { ...detailData };
    if (detailDataClone && Object.keys(detailDataClone)?.length > 0) {
      formFields.handleSetState({
        ...detailDataClone,
        startDate: moment(detailDataClone?.fromDate),
        endDate: moment(detailDataClone?.toDate),
        goldenDays: detailDataClone?.goldenDays?.split(','),
        timePicker: timePicker(detailDataClone),
        status: detailDataClone.active,
      });
      if (detailDataClone?.promotionDetails?.[0]?.discountAmount) {
        dispatchPrimeTime(actionCreator('SET_DISCOUNT_TABLE_DATA', detailDataClone?.promotionDetails));
      } else if (detailDataClone?.promotionDetails?.[0]?.qty) {
        dispatchPrimeTime(
          actionCreator(
            'SET_FREE_TABLE_DATA',
            detailDataClone?.promotionDetails?.filter((el) => +el.type === 0)
          )
        );
      }
    } else {
      dispatchPrimeTime(actionCreator('SET_DISCOUNT_TABLE_DATA', null));
      dispatchPrimeTime(actionCreator('SET_FREE_TABLE_DATA', null));
    }
  }, [detailData]);

  const handleUpdateStatus = async (note) => {
    const model = new PromotionModel();
    if (detailData) {
      const { status } = detailData;
      const res = await model.updatePrimeTimeStatus({
        status: status === 1 ? false : true,
        promotionCode: detailData.promotionCode,
        typePromotion: params.id?.startsWith('BG') ? 'buyGift' : 'discountitem',
        note,
      });
      if (res.status) {
        message.success('Update status successfully !!!');
        setIsActive(status === 1 ? true : false);
      } else {
        message.error(res.message);
      }
    } else {
      message.error('Invalid promotion ID');
      return;
    }
  };

  const StatusComp = () => {
    return (
      <>
        {detailData ? (
          <Switch
            checkedChildren="Active"
            onChange={(checked) => {
              if (!detailData.active) {
                message.info('Can not active promotion');
                return;
              }
              setIsPopupNoteOpen(true);
            }}
            unCheckedChildren="Active"
            checked={isActive}
          />
        ) : null}
      </>
    );
  };
  const Notice = () => {
    return (
      <Col span={24}>
        <div className="cl-red bg-note">
          <strong>Lưu ý chức năng: </strong>
          <br />
          - Tên của khuyến mãi phải rõ ràng, chi tiết, thể hiện được mục đích của khuyến mãi.
          <br />
          - Vui lòng kiểm tra lại xem đúng loại khuyến mãi chưa trước khi tạo
          <br />
          - Không thể edit khuyến mãi đang chạy hoặc đã hết hạn
          <br />
          - Nếu không chọn khung giờ nào hết thì mặc định sẽ là từ 0h:00 đến 23h:59
          <br />
          - Mỗi sản phẩm chỉ được áp dụng một khuyến mãi duy nhất
          <br />
          - Giá giảm phải lớn hơn 1000 và không được vượt quá giá trị sản phẩm
          <br />- Dept. of I&T note: cập nhật thông tin đã đăng ký với cơ quan, tổ chức nhà nước.
        </div>
      </Col>
    );
  };

  const LastedUpdate = () => {
    return (
      <>
        {detailData && Object.keys(detailData).length > 0 ? (
          <div className="update_info">
            <h6 className="flex m-0">
              <span>Latest update :</span>
              <span className="color-primary font-bold">
                {detailData?.updatedDate
                  ? moment(new Date(detailData?.updatedDate)).format('DD-MM-YYYY - HH:mm:ss')
                  : null}
              </span>
              {detailData?.updateBy ? (
                <span className="ml-10">
                  {' '}
                  By - <span className="color-primary font-bold"> {detailData?.updateBy || ''}</span>
                </span>
              ) : null}
            </h6>
          </div>
        ) : null}
      </>
    );
  };
  return (
    <Fragment>
      {!disableEdit ? (
        <ActionHeader StatusComp={StatusComp} onSave={handleSave} selectedPromotionType={selectedPromotionType} />
      ) : null}

      <div className="box-shadow mb-0">
        <Row>
          <Col span={24} className="flex flex-col justify-content-between">
            <div className="flex items-center">
              <BackAction
                LastedUpdate={LastedUpdate}
                title={params.id ? '#' + params.id : 'New promotion'}
                createdDate={detailData?.createdDate}
              />
            </div>
          </Col>
          <Col span={8} className="mt-15">
            <div className="flex items-center w-full">
              <Select
                disabled={params.id ? true : false}
                allowClear
                options={[
                  {
                    value: '1',
                    label: 'Discount item',
                  },
                  {
                    value: '2',
                    label: 'Free item',
                  },
                ]}
                placeholder="Select promotion type"
                value={selectedPromotionType}
                onChange={(value) => {
                  setSelectedPromotionType(value);
                }}
                style={{ transition: 'all 0.4s' }}
                className={`${!selectedPromotionType ? 'center_position' : 'reset_position'} w-full`}
              ></Select>
            </div>
          </Col>
        </Row>
      </div>

      {selectedPromotionType ? (
        <>
          <PrimeTimeCreateForm Notice={Notice} formFields={formFields} disableEdit={disableEdit} />
          <PrimeTimeCreateTableForm
            TabItems={<PrimeTimeCreateTabItems selectedTab={selectedPromotionType} disabled={disableEdit} />}
          />
        </>
      ) : (
        <div className="w-full" style={{ marginTop: 20 }}></div>
      )}
      <Modal
        footer={false}
        open={isPopupNoteOpen}
        onCancel={() => {
          setIsPopupNoteOpen(false);
        }}
      >
        <Form
          onFinish={(value) => {
            handleUpdateStatus(value.note);
            setIsPopupNoteOpen(false);
          }}
          layout="vertical"
        >
          <Form.Item name="note" label="Reason" rules={[{ type: 'string', required: true, message: 'Missing reason' }]}>
            <Input.TextArea rows={10} placeholder="Input reason" maxLength={1000} showCount />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Inactive promotion
          </Button>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default PrimeTimeCreateMain;
