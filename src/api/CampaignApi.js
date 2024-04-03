import { AuthApi } from './AuthApi';

const CampaignApi = {
  getCampaigns: (params) => {
    return AuthApi.get('/campaign', params);
  },
  getCampaignDetails: (campaignCode) => {
    return AuthApi.get(`/campaign/${campaignCode}`);
  },
  createCampaign: (requestPayload) => {
    return AuthApi.post('/campaign', requestPayload);
  },
  updateCampaign: (id, requestPayload) => {
    return AuthApi.put(`/campaign/${id}`, requestPayload);
  },
  updateCampaignStatus: (id, CampaignStatus) => {
    return AuthApi.put(`/campaign/${id}/status`, { CampaignStatus });
  },
  getQrCodeOfStore: (campaignCode, storeCode) => {
    return AuthApi.post(`/campaign/${campaignCode}/generateqr`, { storeCode });
  },
  getAwardItems: (campaignCode) => {
    return AuthApi.get(`/campaign/${campaignCode}/Award`);
  },
  createAwardItem: (campaignCode, requestPayload) => {
    return AuthApi.post(`/campaign/${campaignCode}/Award`, requestPayload);
  },
  updateAwardItemDetails: (campaignCode, itemCode, requestPayload) => {
    return AuthApi.put(
      `/campaign/${campaignCode}/Award/${itemCode}`,
      requestPayload
    );
  },
  deleteAwardItem: (campaignCode, itemCode) => {
    return AuthApi.delete(`/campaign/${campaignCode}/Award/${itemCode}`);
  },

  uploadCampaignImage: (campaignCode, url) => {
    return AuthApi.post(
      `/upload/campaign/${campaignCode}/banner?random=${Date.now()}`,
      { image: url },
      null,
      process.env.REACT_APP_API_EXT_MEDIA
    );
  },
};

export default CampaignApi;

