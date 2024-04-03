import React from 'react';
// import QRCode from 'qrcode.react';
import { message } from 'antd';
import { CampaignApi } from 'api';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import JSZip from 'jszip';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import useCampaignContext from '../../../contexts/CampaignContext';
import QRElement from './QRElement/QRElement';

const ExportQR = () => {
  const { state: campaignState } = useCampaignContext();

  const { storeValid } = campaignState.campaignData;
  const params = useParams();
  const handleGetQrArray = async () => {
    const res = await CampaignApi.getQrCodeOfStore(params.id, [...storeValid]);
    if (res.status) {
      return res.data.qr;
    } else {
      message.error(res.message);
      return null;
    }
  };
  const qrQuery = useQuery({
    queryKey: ['qr', storeValid],
    queryFn: handleGetQrArray,
    enabled: Boolean(storeValid && storeValid.length > 0),
  });
  const createZipFile = async (dataUrls) => {
    // Tạo một đối tượng JSZip
    const zip = new JSZip();

    // Lặp qua mảng các data URL và thêm chúng vào tệp ZIP dưới dạng tệp hình ảnh
    dataUrls.forEach((itemData, index) => {
      const dataUrl = itemData.dataUrl;
      // Tạo một tên tệp duy nhất cho mỗi data URL
      const filename = `campaign_${params.id}_store_${itemData.storeCode}.png`;

      // Tách dữ liệu base64 từ data URL
      const base64Data = dataUrl.split(',')[1];

      // Chuyển base64 thành dãy byte
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Tạo tệp hình ảnh
      zip.file(filename, byteArray);
    });

    // Tạo tệp ZIP và lưu nó
    const zipBlob = await zip.generateAsync({ type: 'blob' });

    // Tạo một đối tượng URL để tải về tệp ZIP
    const downloadUrl = URL.createObjectURL(zipBlob);

    // Tạo một thẻ a để tải về
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `qrcodes_${params.id}.zip`;

    // Bấm vào thẻ a để tải về tệp ZIP
    a.click();

    // Thu hồi URL và giải phóng tài nguyên
    URL.revokeObjectURL(downloadUrl);
  };
  const handleGenerateImageDataUrl = (elm, storeCode) => {
    // Generate download with use canvas and stream
    const canvas = elm;
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    return pngUrl;
  };
  const renderQRCode = () => {
    const res = [];
    const keys = Object.keys(qrQuery.data || {}) || [];
    for (let i = 0; i < keys?.length; i++) {
      const qrData = qrQuery.data[keys[i]];
      res.push({
        elm: <QRElement size={1920} data={qrData} id={`qr-gen-${i}`} key={keys[i]} logoWidth={200} logoHeight={200} />,
        storeCode: keys[i],
      });
    }
    return res;
  };

  return (
    <>
      <BaseButton
        iconName="export"
        color="green"
        loading={qrQuery.isLoading}
        onClick={async () => {
          const base64s = [];
          for (let i in renderQRCode()) {
            let storeCode = renderQRCode()[i].storeCode;
            const canvas = document.getElementById(`qr-gen-${i}`);
            const base64 = handleGenerateImageDataUrl(canvas, storeCode);
            base64s.push({ dataUrl: base64, storeCode });
          }
          await createZipFile(base64s);
        }}
      >
        Export all QRs
        <div id="div" style={{ display: 'none' }}>
          {renderQRCode()?.map((item) => item.elm)}
        </div>
      </BaseButton>
    </>
  );
};

export default ExportQR;

