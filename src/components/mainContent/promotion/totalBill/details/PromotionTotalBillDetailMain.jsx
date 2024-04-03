import { Button, Form, Input, Modal, Switch, message } from 'antd';
import { actionCreator, useAppContext, useTotalBillContext } from 'contexts';
import { TotalBillActions } from 'contexts/actions';
import { StringHelper } from 'helpers';
import { useFormFields, usePageActions } from 'hooks';
import PromotionModel from 'models/PromotionModel';
import UploadMediaModel from 'models/UploadMediaModel';
import moment from 'moment';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import DataRenderFreeItem from './DataRenderFreeItem';
import PromotionTotalBillDetailFields from './PromotionTotalBillDetailFields';
import PromotionTotalBillDetailHeader from './PromotionTotalBillDetailHeader';
import PromotionTotalBillDiscountTable from './table/PromotionTotalBillDiscountTable';
import PromotionTotalBillFreeTable from './table/PromotionTotalBillFreeTable';

const ActionHeader = ({ onSave, StatusComp, promotionType }) => {
  const leftActions = [
    {
      name: 'Save',
      actionType: 'info',
      action: promotionType ? onSave : () => {},
    },
  ];
  if (StatusComp()) {
    leftActions.push({
      name: <StatusComp />,
      actionType: 'info',
      action: () => {},
    });
  }
  const Action = usePageActions(leftActions, []);
  return <Action />;
};

const PromotionTotalBillDetailMain = ({ initialData }) => {
  const { state: TotalBillStateContext, dispatch: TotalBillDispatchContext } = useTotalBillContext();
  const { state } = useAppContext();
  const [isPopupNoteOpen, setIsPopupNoteOpen] = useState(false);
  const params = useParams();
  const history = useHistory();
  const queryClient = useQueryClient();
  const [selectedPromotionType, setSelectedPromotionType] = useState(null);
  const [isActive, setIsActive] = useState(initialData?.active === 0 ? false : true);

  useEffect(() => {
    setIsActive(initialData?.active === 0 ? false : true);
  }, [initialData]);

  useEffect(() => {
    setSelectedPromotionType(
      initialData?.billPromotionType === 4 ? '2' : initialData?.billPromotionType === 1 ? '1' : null
    );
  }, [initialData]);
  const currentParams = useMemo(
    () => TotalBillStateContext.currentSearchParams,
    [TotalBillStateContext.currentSearchParams]
  );

  const handleUploadImage = async (listItem, promotionCode, payload) => {
    const uploadImageModel = new UploadMediaModel();
    await Promise.all(
      listItem?.map(async (item) => {
        if (item?.image && !item?.image?.isFromServer) {
          const payloadImage = {
            promotionCode,
            itemCode: item?.itemCode,
            image: StringHelper.base64Smooth(item?.image?.url),
          };
          const res = await uploadImageModel.uploadPromotionImage(payloadImage);
          if (res.status) {
            // If upload image success then set new data to new query + new image object
            const newItemData = {
              ...payload,
              promotionCode,
              active: 1,
              image: { url: item?.image?.url, isFromServer: true },
            };
            queryClient.setQueryData(['promotionDetails', promotionCode], newItemData);
          } else {
            // If upload image failed then set new data to new query without image object and throw error
            queryClient.setQueryData(['promotionDetails', promotionCode], {
              ...payload,
              promotionCode,
              active: 1,
            });
            throw new Error('Upload image failed at item' + item?.itemCode + res.message);
          }
        }
      })
    );
  };

  const handleSubmit = async (value) => {
    try {
      // Check at least one item in promotion
      if (
        selectedPromotionType === '1' &&
        (!TotalBillStateContext.discountTableData || TotalBillStateContext.discountTableData.length === 0)
      ) {
        throw new Error('Please add item to (discount)');
      } else if (
        selectedPromotionType === '2' &&
        (!TotalBillStateContext.freeTableData || TotalBillStateContext.freeTableData.length === 0)
      ) {
        throw new Error('Please add item (free)');
      }

      // Payload
      const payload = {
        ...value,
        startDate: moment(value.date?.[0])?.format('YYYY/MM/DD'),
        fromDate: moment(value.date?.[0])?.format('YYYY/MM/DD'),
        endDate: moment(value.date?.[1])?.format('YYYY/MM/DD'),
        toDate: moment(value.date?.[1])?.format('YYYY/MM/DD'),
        promotionDetails:
          selectedPromotionType === '1' ? TotalBillStateContext.discountTableData : TotalBillStateContext.freeTableData,
        billPromotionType: selectedPromotionType === '1' ? 1 : 4,
        storeCode: value.storeCode || [],
        status: value.active,
      };

      let listItem = [];
      if (selectedPromotionType === '1') {
        listItem = TotalBillStateContext.discountTableData;
      } else {
        listItem = TotalBillStateContext.freeTableData;
      }

      // Call API
      const model = new PromotionModel();
      // If params.id is exists => update it
      if (params.id) {
        const res = await model.updateTotalBillDiscountPromotion(payload, params.id);
        if (res.status) {
          queryClient.setQueryData(['promotionDetails', params.id], {
            ...payload,
            promotionCode: params.id,
          });
          await handleUploadImage(listItem, params.id, payload);
          message.success('Update new promotion successfully!!!');
        } else {
          throw new Error(res.message);
        }
      } else {
        //Else  => Create new one
        const res = await model.createTotalBillBuyGiftPromotion({
          ...payload,
          endDate: moment(value.date?.[1])?.format('YYYY/MM/DD' + ' 23:59'),
        });

        // If create success call api upload image
        if (res.status) {
          const promotionCode = res.data?.promotionCode;

          // Invalidate query to get new data
          queryClient.invalidateQueries(['TotalBillMain', currentParams]);

          // Call api upload image
          await handleUploadImage(listItem, promotionCode, payload);
          message.success('Create new promotion successfully!!!');

          // Reset date of table when create successfully
          if (selectedPromotionType === '1') {
            TotalBillDispatchContext(actionCreator(TotalBillActions.SET_DISCOUNT_TABLE_DATA, null));
          } else {
            TotalBillDispatchContext(actionCreator(TotalBillActions.SET_FREE_TABLE_DATA, null));
          }
        } else {
          throw new Error(res.message);
        }
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  const disableEdit = initialData ? moment(initialData?.fromDate)?.isBefore(moment()) : false;

  const formFields = useFormFields({
    fieldInputs: DataRenderFreeItem.fieldInputs(Object.values(state?.stores || {}), disableEdit),
    onSubmit: handleSubmit,
  });

  const handleChangePromotionType = useCallback((value) => {
    setSelectedPromotionType(value);
  }, []);

  useEffect(() => {
    const { reset } = formFields;
    if (initialData) {
      reset({ ...initialData });
    } else {
      reset({});
      TotalBillDispatchContext(actionCreator(TotalBillActions.SET_DISCOUNT_TABLE_DATA, null));
      TotalBillDispatchContext(actionCreator(TotalBillActions.SET_FREE_TABLE_DATA, null));
    }
  }, [initialData]);
  const messageCantEdit = () => {
    message.error('Không thể update những khuyễn mãi đang chạy');
  };
  console.log({ initialData });
  const handleUpdateStatus = async (note) => {
    const model = new PromotionModel();
    if (initialData) {
      const res = await model.updateTotalBillStatus({
        status: initialData.active === 1 ? false : true,
        promotionCode: initialData.promotionCode,
        note,
      });
      if (res.status) {
        message.success('Update status successfully !!!');
        queryClient.invalidateQueries(['promotionDetails', params.id]);
        queryClient.invalidateQueries(['TotalBillMain', currentParams]);

        setIsActive(initialData.active === 1 ? false : true);
      } else {
        message.error(res.statusCode + res.message);
      }
    } else {
      message.error('Invalid promotion ID');
      return;
    }
  };

  const StatusComp = () => {
    if (!initialData) return null;
    return (
      <Switch
        checkedChildren="Active"
        onChange={(checked) => {
          if (!initialData.active) {
            message.info('Can not active promotion');
            return;
          }
          setIsPopupNoteOpen(true);
        }}
        unCheckedChildren="Active"
        checked={isActive}
      />
    );
  };
  return (
    <Fragment>
      <ActionHeader
        StatusComp={StatusComp}
        onSave={disableEdit ? messageCantEdit : formFields.onSubmitHandler}
        promotionType={selectedPromotionType}
      />
      <div className="app-container">
        <PromotionTotalBillDetailHeader
          selectedPromotionType={selectedPromotionType}
          onChange={handleChangePromotionType}
          initialData={initialData}
        />
        {selectedPromotionType ? (
          <>
            <PromotionTotalBillDetailFields formFields={formFields} disableEdit={disableEdit} />

            {selectedPromotionType === '1' ? (
              <PromotionTotalBillDiscountTable disableEdit={disableEdit} />
            ) : (
              <PromotionTotalBillFreeTable disableEdit={disableEdit} />
            )}
          </>
        ) : null}
      </div>
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

export default PromotionTotalBillDetailMain;
