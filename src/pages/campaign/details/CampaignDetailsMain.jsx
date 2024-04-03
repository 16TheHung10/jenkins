import { Button, Empty, Modal, Popover, Spin, Steps, Switch, message } from 'antd';
import { CampaignApi } from 'api';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { useAppContext, useCampaignContext } from 'contexts';
import { FieldsCampaignData } from 'data/render/form';
import FileSaver from 'file-saver';
import { StringHelper } from 'helpers';
import { useFormFields, useUploadImage } from 'hooks';
import JSZip from 'jszip';
import moment from 'moment';
import QRCode from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import UrlHelper from '../../../helpers/UrlHelper';
import QRElement from './QRElement/QRElement';
import StepFourConfirm from './steps/StepFourConfirm';
import StepOneCampaignInfo from './steps/StepOneCampaignInfo';
import StepThreeBillCondition from './steps/StepThreeBillCondition';
import StepTwoCampaignType from './steps/StepTwoCampaignType';
import './style.scss';
import useCampaignOptions from './useCampaignOptions';
import Icons from 'images/icons';

const CampaignDetailsMain = ({ initialValue, onSubmit, query }) => {
  const { state: AppState } = useAppContext();
  const params = useParams();
  const queryClient = useQueryClient();
  const [itemSearch, setItemSearch] = useState('');
  const {
    onSetCampaignData,
    state: campaignState,
    onSetItemValid,
    onSetAwardItems,
    onSetSelectedStoreQR,
    onSetBillConditionPayments,
    onToggleModalQR,
  } = useCampaignContext();
  const { storeOptions, itemOptions, paymentOptions } = useCampaignOptions({ itemSearch });
  const [campaignType, setCampaignType] = useState(null);
  const [current, setCurrent] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [fieldsCampaignType, setFieldsCampaignType] = useState(null);
  const imageProps = useUploadImage();

  const handleUploadImage = async (campaignCode, listImage) => {
    if (listImage[0]) {
      let url = await StringHelper.base64Smooth(listImage[0]?.url);
      const imageData = await CampaignApi.uploadCampaignImage(campaignCode, url);
      if (imageData.status) {
        return imageData?.data?.path;
      }
      throw new Error(imageData.message);
    }
  };

  const handleSubmit = async () => {
    let payload = { ...campaignState };
    const itemValid = [];

    if (payload.itemValid) {
      for (let item of payload.itemValid) {
        const sourceItem = [
          {
            itemCode: item.itemsCodeA,
            itemName: AppState.items?.[item.itemsCodeA]?.itemName,
            qty: 1,
          },
        ];
        if (item.itemsCodeB)
          sourceItem.push({
            itemCode: item.itemsCodeB,
            itemName: AppState.items?.[item.itemsCodeB]?.itemName,
            qty: 1,
          });
        const targetItem = [
          {
            itemCode: item.itemsCodeC,
            itemName: AppState.items?.[item.itemsCodeC]?.itemName,
            qty: 1,
          },
        ];
        itemValid.push({ sourceItem, targetItem });
      }
    }
    const itemValidObj =
      campaignType === 4
        ? itemValid
        : {
            items: campaignState.campaignData?.items?.join(','),
            maxQty: payload.campaignData.maxQty,
          };
    payload = {
      ...payload,
      ...payload.campaignData,
      itemValid: itemValidObj ? JSON.stringify(itemValidObj) : null,
      campaignType: +campaignType,
      startDateValid: payload.campaignData?.date?.[0]
        ? moment(payload.campaignData?.date?.[0]).format('YYYY-MM-DD')
        : null,
      endDateValid: payload.campaignData?.date?.[1]
        ? moment(payload.campaignData?.date?.[1]).format('YYYY-MM-DD')
        : null,
      startHourValid: payload.campaignData?.timeFrameQR?.[0]
        ? moment(payload.campaignData?.timeFrameQR?.[0]).format('HH')
        : -1,
      endHourValid: payload.campaignData?.timeFrameQR?.[1]
        ? moment(payload.campaignData?.timeFrameQR?.[1]).format('HH')
        : -1,
      storeValid: payload.campaignData.storeValid
        ? payload.campaignData.storeValid.length !== storeOptions.length
          ? JSON.stringify(payload.campaignData.storeValid)
          : null
        : null,
      paymentValid: campaignState.billConditionPayments ? JSON.stringify(campaignState.billConditionPayments) : null,
      appliedStore: payload.campaignData.appliedStore ? JSON.stringify(payload.campaignData.appliedStore) : null,
      dayOfWeek: payload.campaignData.dayOfWeek ? payload.campaignData.dayOfWeek.join(',') : '',
      awardItems:
        payload.awardItems?.map((item) => {
          return { ...item, maxStockQty: item.stockQty };
        }) || [],
    };

    let { campaignData, date, billConditionPayments, maxQty, items, ...rest } = payload;
    onSubmit({ rest, imageProps, handleUploadImage });
  };
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const stepOneProps = useFormFields({
    fieldInputs: FieldsCampaignData.fieldsCampaignInfo({
      current,
      campaignType,
    }),
    onSubmit: (value) => {
      onSetCampaignData({ ...campaignState.campaignData, ...value });
      // if (imageProps.listImageUploaded?.length === 0) return message.error('Please upload at least one image');
      next();
    },
  });

  const stepTwoProps = useFormFields({
    fieldInputs: fieldsCampaignType,
    onSubmit: (value) => {
      onSetCampaignData({ ...campaignState.campaignData, ...value });
      if (campaignType === 4 && (!campaignState.itemValid || campaignState.itemValid?.length === 0))
        return message.error('Please add at least one item');
      if (campaignType === 5 && (!campaignState.awardItems || campaignState.awardItems?.length <= 0))
        return message.error('Please add at least one item');
      next();
    },
    watches: ['campaignType', 'itemCode'],
  });
  const stepThreeProps = useFormFields({
    fieldInputs: FieldsCampaignData.fieldsCampaignBillValid({
      storeOptions,
      itemOptions,
      paymentOptions,
      current,
      campaignType,
    }),
    onSubmit: (value) => {
      onSetCampaignData({ ...campaignState.campaignData, ...value });
      next();
    },
  });
  const handleGetQrData = async () => {
    const res = await CampaignApi.getQrCodeOfStore(params.id, [campaignState.selectedStoreQR]);
    if (res.status) {
      return res.data?.qr?.[campaignState.selectedStoreQR];
    } else {
      message.error(res.message);
      return null;
    }
  };
  const qrQuery = useQuery({
    queryKey: ['qr', campaignState.selectedStoreQR],
    queryFn: handleGetQrData,
    enabled: Boolean(campaignState.selectedStoreQR),
  });

  const handleDownloadQr = (elm) => {
    // Generate download with use canvas and stream
    const canvas = document.getElementById('qr-gen');
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    let downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `campaign_${params.id}_store_${campaignState.selectedStoreQR}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const generateQRCodeDataURL = (data) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      QRCode.toCanvas(canvas, data, () => {
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      });
    });
  };
  const handleExportAllQR = async () => {
    const data = ['Abc', '123'];
    const zip = new JSZip();

    for (let i = 0; i < data.length; i++) {
      const qrCodeDataUrl = await generateQRCodeDataURL(data[i]);
      const dataBlob = await (await fetch(qrCodeDataUrl)).blob();
      zip.file(`QRCode_${i + 1}.png`, dataBlob);
    }

    // Tạo tệp zip và tải về
    zip.generateAsync({ type: 'blob' }).then((content) => {
      FileSaver.saveAs(content, 'qrcodes.zip');
    });
  };
  const steps = [
    {
      title: 'Campaign type',
      content: (
        <StepTwoCampaignType
          stores={initialValue?.storeValid}
          formProps={stepTwoProps}
          current={current}
          onExportAllQR={handleExportAllQR}
          campaignOptions={{ storeOptions, itemOptions }}
          setItemSearch={setItemSearch}
        />
      ),
      onSubmit: stepTwoProps.onSubmitHandler,
    },
    {
      title: 'Campaign info',
      content: <StepOneCampaignInfo formProps={stepOneProps} imageProps={imageProps} />,
      onSubmit: stepOneProps.onSubmitHandler,
    },
    {
      title: 'Bill condition',
      content: (
        <StepThreeBillCondition
          formProps={stepThreeProps}
          campaignType={campaignType}
          current={current}
          campaignOptions={{ itemOptions, paymentOptions }}
        />
      ),
      onSubmit: stepThreeProps.onSubmitHandler,
    },
    {
      title: 'Finish',
      content: (
        <StepFourConfirm imageProps={imageProps} campaignType={campaignType} stores={initialValue?.storeValid} />
      ),
      onSubmit: handleSubmit,
    },
  ];

  const items = (campaignType !== 4 ? steps : steps.filter((el) => el.title !== 'Bill condition')).map((item) => ({
    ...item,
    key: item.title,
    title: item.title,
  }));

  const handleResetData = () => {
    const { campaignName, campaignTitle, date, dayOfWeek, storeValid, minValueValid, items, maxQty, timeFrameQR } =
      initialValue;
    if (initialValue) {
      stepTwoProps.reset(initialValue);
      stepOneProps.reset({
        campaignName,
        dayOfWeek,
        campaignTitle,
        date,
        timeFrameQR,
      });
      stepThreeProps.reset({ storeValid, minValueValid, items, maxQty });
      onSetCampaignData(initialValue);
      onSetBillConditionPayments(initialValue?.paymentValid || []);
      onSetItemValid(initialValue.itemValid);
    }
  };

  const hanleChangeCampaignStatus = async (value) => {
    const res = await CampaignApi.updateCampaignStatus(params.id, value);
    if (res.status) {
      message.success('Updated campaign status successfully');
      queryClient.setQueryData(['campaign/details', params.id], (oldData) => {
        return { ...oldData, active: value ? 1 : 0 };
      });
      queryClient.invalidateQueries(['campaign']);
    } else {
      message.error(res.message);
    }
  };

  /* The above code is using the useEffect hook in a React component. It has a dependency array with the
variable `initialValue`, which means the effect will run whenever `initialValue` changes. */
  useEffect(() => {
    if (initialValue) {
      handleResetData();
    } else {
      stepTwoProps.reset(null);
      stepOneProps.reset(null);
      stepThreeProps.reset(null);
      onSetCampaignData(null);
      onSetBillConditionPayments(null);
      onSetItemValid(null);
      onSetAwardItems([]);
    }
  }, [initialValue]);

  useEffect(() => {
    const { type } = UrlHelper.getSearchParamsObject();
    if (params.id !== 0 && !params.id && type && [3, 4, 5].includes(+type)) {
      stepTwoProps.reset({ campaignType: +type });
    }
  }, [isRunning]);

  useEffect(() => {
    setCampaignType(stepTwoProps.getValues('campaignType'));
  }, [stepTwoProps.getValues('campaignType')]);

  useEffect(() => {
    let clone =
      stepTwoProps.getValues('campaignType') === 1
        ? [
            ...FieldsCampaignData.fieldsCampaignType({ current, params }),
            ...FieldsCampaignData.fieldsCampaignVoucher({
              storeOptions,
              current,
              campaignType,
              itemOptions,
            }),
          ]
        : stepTwoProps.getValues('campaignType') === 5
        ? [
            ...FieldsCampaignData.fieldsCampaignType({ current, params }),
            ...FieldsCampaignData.fieldScanQR({
              storeOptions,
              current,
              campaignType,
              itemOptions,
            }),
          ]
        : FieldsCampaignData.fieldsCampaignType({ current, params });
    setFieldsCampaignType(clone);
  }, [stepTwoProps.getValues('campaignType'), storeOptions, current, campaignType, itemOptions]);
  useEffect(() => {
    if (initialValue) {
      const imageReset = [
        {
          url: (process.env.REACT_APP_API_EXT_MEDIA_GET || 'https://devapi.gs25.com.vn/ext/media') + initialValue.image,
          uid: Date.now(),
          name: 'campaign.png',
        },
      ];
      imageProps.handleSetListImage(imageReset);
    }
  }, [initialValue?.image]);

  useEffect(() => {
    if (initialValue) {
      const currentDate = moment();
      const { startDateValid, endDateValid } = initialValue;

      const isBetween = currentDate.isBetween(new Date(startDateValid), new Date(endDateValid), null, '[]');
      const isAfterStartDate = currentDate.isAfter(moment(startDateValid));
      setIsRunning(isBetween || isAfterStartDate);
    } else {
      setIsRunning(false);
    }
  }, [initialValue]);

  useEffect(() => {
    if (isRunning) {
      setCurrent(items.length - 1);
    }
  }, [isRunning, items]);

  if (params.id && !initialValue)
    return (
      <div className="w-full m-auto">
        <Empty />
      </div>
    );
  return (
    <div id="campaign_details_wrapper" className="mt-15 section-block">
      <div id="steps">
        <Popover
          placement="top"
          content={
            <div className="cl-red">
              -Tên của campaign phải rõ ràng, chi tiết, thể hiện được mục đích của campaign.
              <br />
              - Chương trình campaign sẽ được cập nhật qua ngày. <br />
              - Thời gian chương trình áp dụng phải sau ngày hiện tại. <br />
              - Chương trình campaign đang chạy sẽ không thể cập nhật thông tin. <br />
            </div>
          }
        >
          <div
            style={{
              textAlign: 'center',
              background: 'white',
              width: '99%',
              margin: 'auto',
              marginTop: '10px',
              borderRadius: '7px',
              height: '33px',
              lineHeight: '33px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              justifyContent: 'center',
            }}
          >
            <p className="cl-red m-0 uppercase">Lưu ý chức năng</p>
            <Icons.Question style={{ fontSize: '16px', color: 'var(--gray-color)' }} />
          </div>
        </Popover>
        <Steps direction="vertical" current={current} items={items} />
      </div>
      <div className="steps-content w-full ">
        <div className="flex items-center gap-10">
          {params.id && moment().isBefore(moment(initialValue?.endDateValid)) && (
            <>
              <Switch
                style={{ marginLeft: '10px' }}
                id="status"
                checkedChildren="Active"
                unCheckedChildren="Active"
                title="Status"
                onChange={(value) => hanleChangeCampaignStatus(value)}
                checked={campaignState.campaignData?.active}
              />
            </>
          )}
          {params.id && (
            <>
              <p className="m-0">
                Latest update: <strong className="color-primary">{initialValue.updatedBy}</strong>{' '}
                <span className="m-0 hint block">
                  at {moment(new Date(initialValue.updatedDate)).format('DD/MM/YYYY HH:mm')}
                </span>
              </p>
            </>
          )}
        </div>
        <div className="steps-content-main">{items[current]?.content}</div>
        {isRunning ? null : (
          <div className="steps-content-action mt-10">
            {current === items.length - 1 ? (
              <Button type="primary" onClick={items[current]?.onSubmit}>
                {params.id ? 'Update' : 'Done'}
              </Button>
            ) : (
              <Button type="primary" onClick={items[current]?.onSubmit}>
                Next
              </Button>
            )}
            {current > 0 && (
              <Button
                style={{
                  margin: '0 8px',
                }}
                onClick={() => prev()}
              >
                Previous
              </Button>
            )}
          </div>
        )}
      </div>

      <Modal
        open={campaignState.isOpenModalQR}
        onCancel={() => {
          onSetSelectedStoreQR(null);
          onToggleModalQR();
        }}
        footer={false}
      >
        <div className="flex items-center gap-10">
          {qrQuery.isLoading ? (
            <Spin />
          ) : (
            <div className=" flex flex-col items-center gap-10 w-full">
              <QRElement size={450} data={qrQuery.data || 'Empty data'} id="qr-gen" />
              <BaseButton loading={qrQuery.isLoading} onClick={handleDownloadQr}>
                Download QR
              </BaseButton>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CampaignDetailsMain;
